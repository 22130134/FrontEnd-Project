import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { fetchFullArticle, parseArticleContent } from '../services/scraperService';
import StateView from './StateView';
import { CATEGORIES, NewsItem } from '../services/rssService';
import { isBookmarked, toggleBookmark } from '../services/bookmarkService';
import type { RootState } from '../store';
import './css/NewsDetail.css';

const MAX_RETRY = 3;

const getThumb = (item: NewsItem): string | undefined => {
    let thumb = item.thumbnail || item.enclosure?.link;
    if (!thumb && item.description) {
        const imgMatch = item.description.match(/src="([^"]+)"/);
        thumb = imgMatch ? imgMatch[1] : undefined;
    }
    return thumb;
};
const normalizeParagraphWeight = (html: string) => {
    if (!html) return html;

    let out = html;

    // 1) <p><strong>...</strong></p> hoặc <p><b>...</b></p> -> bỏ strong/b (giữ nội dung)
    out = out.replace(
        /<p([^>]*)>\s*<(strong|b)[^>]*>([\s\S]*?)<\/\2>\s*<\/p>/gi,
        '<p$1>$3</p>'
    );

    // 2) XÓA font-weight trong MỌI style="..." (không chỉ riêng thẻ p)
    out = out.replace(
        /<([a-z0-9]+)([^>]*?)\sstyle="([^"]*?)"([^>]*)>/gi,
        (_m, tag, a, style, c) => {
            const cleaned = style
                .replace(/font-weight\s*:\s*(bold|bolder|lighter|[1-9]00)\s*;?/gi, '')
                .replace(/\s{2,}/g, ' ')
                .trim();

            if (!cleaned) return `<${tag}${a}${c}>`;
            return `<${tag}${a} style="${cleaned}"${c}>`;
        }
    );

    // 3) Bỏ strong/b còn sót lại (giữ text)
    out = out.replace(/<\/?(strong|b)[^>]*>/gi, '');

    return out;
};


// Loại ảnh <img ...> đầu tiên trong HTML (RSS hay chèn thumbnail vào đầu)
const stripFirstImage = (html: string) => {
    if (!html) return html;

    let out = html.replace(/^\s*<p>\s*<img[^>]*>\s*<\/p>\s*/i, '');
    out = out.replace(/^\s*<div[^>]*>\s*<img[^>]*>\s*<\/div>\s*/i, '');
    out = out.replace(/^\s*<img[^>]*>\s*/i, '');

    return out;
};

//helper shuffle
const shuffle = <T,>(arr: T[]) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
};

//Comment type
type LocalComment = {
    id: string;
    name: string;
    text: string;
    createdAt: number;
    email?: string;
};

const makeCommentKey = (link?: string) => `news_comments__${(link || '').trim()}`;

const NewsDetail: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Redux store
    const { items: storeItems, currentCategory } = useSelector((s: RootState) => s.news);

    const categoryName = useMemo(() => {
        const found = CATEGORIES.find(c => c.id === currentCategory);
        return found?.name || 'Tin tức';
    }, [currentCategory]);

    // Item từ router state (mất khi reload)
    const state = location.state as { item: NewsItem } | null;
    const itemFromState = state?.item || null;

    //Persist item để reload vẫn có dữ liệu
    const storageKey = 'news_detail_item';

    const [persistedItem, setPersistedItem] = useState<NewsItem | null>(() => {
        try {
            const raw = sessionStorage.getItem(storageKey);
            return raw ? (JSON.parse(raw) as NewsItem) : null;
        } catch {
            return null;
        }
    });

    const activeItem = itemFromState || persistedItem;

    useEffect(() => {
        if (itemFromState) {
            try {
                sessionStorage.setItem(storageKey, JSON.stringify(itemFromState));
                setPersistedItem(itemFromState);
            } catch {
                // ignore
            }
        }
    }, [itemFromState]);

    //States
    const [fullContent, setFullContent] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<any>(null);
    const [retryCount, setRetryCount] = useState(0);
    const [retryKey, setRetryKey] = useState(0);

    // Bookmark state
    const [saved, setSaved] = useState(false);

    // Reset + check bookmark khi đổi bài
    useEffect(() => {
        if (activeItem?.link) setSaved(isBookmarked(activeItem.link));
        setRetryCount(0);
        setRetryKey(0);
        setFullContent(null);
    }, [activeItem?.link]);

    // Load full article
    useEffect(() => {
        const loadContent = async () => {
            if (!activeItem?.link) {
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);
            try {
                const html = await fetchFullArticle(item.link);
                const parsed = parseArticleContent(html);
                setFullContent(parsed);
            } catch (e) {
                console.error('Lỗi tải bài viết:', e);
                setError(e);
            } finally {
                setLoading(false);
            }
        };

        loadContent();
    }, [activeItem?.link, retryKey]);

    const handleToggleSave = () => {
        if (!activeItem) return;
        const { saved: nextSaved } = toggleBookmark(activeItem);
        setSaved(nextSaved);
    };

    const handleRetry = () => {
        if (retryCount < MAX_RETRY) {
            setRetryCount(c => c + 1);
            setRetryKey(k => k + 1);
        }
    };

    //RENDER LOGIC
    if (!activeItem) {
        return (
            <div className="container news-detail-container">
                <StateView
                    state="error"
                    title="Không tìm thấy bài viết"
                    message="Vui lòng quay lại trang chủ."
                    retryText="Về trang chủ"
                    onRetry={() => navigate('/')}
                />
            </div>
        );
    }

    // Nội dung hiển thị: ưu tiên fullContent -> content -> description
    const fallbackContent = activeItem.content || activeItem.description || '';
    const rawDisplayContent = fullContent || fallbackContent;

    // Nếu chưa có fullContent (đang dùng RSS) thì strip ảnh đầu để tránh trùng/ảnh rác
    const cleanedContent = useMemo(() => {
        if (fullContent) return fullContent;
        return stripFirstImage(rawDisplayContent);
    }, [fullContent, rawDisplayContent]);
    // ===== TÁCH SAPO / TIÊU ĐIỂM (đoạn <p> đầu tiên) =====
    const sapo = useMemo(() => {
        if (!cleanedContent) return null;

        // lấy <p> đầu tiên làm sapo
        const match = cleanedContent.match(/<p[^>]*>(.*?)<\/p>/i);
        return match ? match[0] : null;
    }, [cleanedContent]);

    const bodyWithoutSapo = useMemo(() => {
        if (!cleanedContent || !sapo) return cleanedContent;
        return cleanedContent.replace(sapo, '');
    }, [cleanedContent, sapo]);
    const bodyFinal = useMemo(() => {
        let html = normalizeParagraphWeight(bodyWithoutSapo);

        // Nếu dòng đầu là <h2> thì đổi thành <p>
        html = html.replace(
            /^\s*<h2[^>]*>([\s\S]*?)<\/h2>/i,
            '<p>$1</p>'
        );

        return html;
    }, [bodyWithoutSapo]);

    const showEmpty = !loading && !error && (!cleanedContent || cleanedContent.trim().length === 0);
    const canRetry = retryCount < MAX_RETRY;

    //Sidebar data (frontend-only)
    const normalizedLink = (l?: string) => (l || '').trim();

    const baseCandidates = useMemo(() => {
        const currentLink = normalizedLink(activeItem.link);
        return (storeItems || [])
            .filter(x => normalizedLink(x.link))
            .filter(x => normalizedLink(x.link) !== currentLink);
    }, [storeItems, activeItem.link]);

    // Tự động giảm số lượng theo dữ liệu có (đỡ bị trống)
    const perBlock = useMemo(() => {
        const n = baseCandidates.length;
        if (n >= 18) return 6;
        if (n >= 12) return 4;
        if (n >= 6) return 3;
        return 2;
    }, [baseCandidates.length]);

    // 1) Tin mới nhất
    const latestItems = useMemo(() => {
        return [...baseCandidates]
            .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
            .slice(0, perBlock);
    }, [baseCandidates, perBlock]);

    // 2) Tin nổi bật: ưu tiên có ảnh + title dài, tránh trùng latest
    const featuredItems = useMemo(() => {
        const latestLinks = new Set(latestItems.map(x => normalizedLink(x.link)));

        const scored = baseCandidates
            .filter(x => !latestLinks.has(normalizedLink(x.link)))
            .map(x => {
                const hasThumb = !!getThumb(x);
                const titleLen = (x.title || '').trim().length;
                const score = (hasThumb ? 1000 : 0) + Math.min(titleLen, 120);
                return { x, score };
            })
            .sort((a, b) => b.score - a.score)
            .map(s => s.x);

        const out = scored.slice(0, perBlock);
        if (out.length >= perBlock) return out;

        return baseCandidates
            .filter(x => !latestLinks.has(normalizedLink(x.link)))
            .slice(0, perBlock);
    }, [baseCandidates, latestItems, perBlock]);

    // 3) Có thể bạn quan tâm: lấy random phần còn lại, nếu thiếu thì random toàn bộ
    const suggestedItems = useMemo(() => {
        if (baseCandidates.length === 0) return [];

        const used = new Set<string>([
            ...latestItems.map(x => normalizedLink(x.link)),
            ...featuredItems.map(x => normalizedLink(x.link))
        ]);

        const remain = baseCandidates.filter(x => !used.has(normalizedLink(x.link)));

        if (remain.length >= perBlock) return shuffle(remain).slice(0, perBlock);

        return shuffle(baseCandidates).slice(0, perBlock);
    }, [baseCandidates, latestItems, featuredItems, perBlock]);

    //Tin liên quan
    const relatedItemsTop = useMemo(() => {
        const picked: NewsItem[] = [];
        const seen = new Set<string>();

        const pushUnique = (arr: NewsItem[]) => {
            for (const it of arr) {
                const key = normalizedLink(it.link);
                if (!key || seen.has(key)) continue;
                seen.add(key);
                picked.push(it);
                if (picked.length >= 4) break;
            }
        };

        pushUnique(featuredItems);
        if (picked.length < 4) pushUnique(suggestedItems);
        if (picked.length < 4) pushUnique(latestItems);

        return picked.slice(0, 4);
    }, [featuredItems, suggestedItems, latestItems]);

    // ===== Comments (localStorage per article) =====
    const commentKey = useMemo(() => makeCommentKey(activeItem?.link), [activeItem?.link]);

    const [comments, setComments] = useState<LocalComment[]>([]);
    const [cName, setCName] = useState('');
    const [cText, setCText] = useState('');
    const [cEmail, setCEmail] = useState('');

    useEffect(() => {
        try {
            const raw = localStorage.getItem(commentKey);
            const parsed = raw ? (JSON.parse(raw) as LocalComment[]) : [];
            setComments(Array.isArray(parsed) ? parsed : []);
        } catch {
            setComments([]);
        }
        setCName('');
        setCText('');
        setCEmail('');
    }, [commentKey]);

    const persistComments = (next: LocalComment[]) => {
        setComments(next);
        try {
            localStorage.setItem(commentKey, JSON.stringify(next));
        } catch {
            // ignore
        }
    };

    const handleSubmitComment = (e: React.FormEvent) => {
        e.preventDefault();

        const name = cName.trim();
        const email = cEmail.trim();
        const text = cText.trim();

        if (!name || !text) return;

        const next: LocalComment = {
            id: `${Date.now()}_${Math.random().toString(16).slice(2)}`,
            name,
            email: email || undefined,
            text,
            createdAt: Date.now()
        };

        persistComments([next, ...comments]);
        setCText('');
    };


    const handleDeleteComment = (id: string) => {
        persistComments(comments.filter(c => c.id !== id));
    };

    // Render 1 item sidebar
    const renderSidebarItem = (x: NewsItem, idx: number) => {
        const thumb = getThumb(x);
        return (
            <div
                key={`${x.link || idx}-${idx}`}
                className="mostread-item"
                onClick={() => navigate('/news/detail', { state: { item: x } })}
            >
                {thumb && (
                    <div className="mostread-thumb">
                        <img src={thumb} alt={x.title} />
                    </div>
                )}
                <div className="mostread-title">{x.title}</div>
            </div>
        );
    };

    return (
        <div className="detail-page fade-in">
            <div className="detail-content w1040">
                <div className="detail-content_wrapper">
                    {/* LEFT */}
                    <div className="detail-left">
                        {/* Floating share bar */}
                        <div className="detail-float-actions" aria-label="Chia sẻ">
                            <button className="fab fab-home" onClick={() => navigate('/')} title="Trang chủ" type="button">
                                🏠
                            </button>

                            <a
                                className="fab fab-fb"
                                title="Chia sẻ Facebook"
                                target="_blank"
                                rel="noreferrer"
                                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(activeItem.link)}`}
                            >
                                f
                            </a>

                            <a
                                className="fab fab-zalo"
                                title="Chia sẻ Zalo"
                                target="_blank"
                                rel="noreferrer"
                                href={`https://button-share.zalo.me/share_external?d=${encodeURIComponent(activeItem.link)}`}
                            >
                                Z
                            </a>

                            <a
                                className="fab fab-mail"
                                title="Gửi mail"
                                href={`mailto:?subject=${encodeURIComponent(activeItem.title)}&body=${encodeURIComponent(activeItem.link)}`}
                            >
                                ✉️
                            </a>
                        </div>

                        {/* Breadcrumb */}
                        <div className="breadcrumb">
                            <span onClick={() => navigate('/')}>Trang chủ</span>
                            <span>/</span>
                            <span onClick={() => navigate(-1)}>{categoryName}</span>
                        </div>

                        {/* Title */}
                        <h1 className="detail-title baotintuc-title">{activeItem.title}</h1>
                        {/* SAPO / TIÊU ĐIỂM */}
                        {sapo && (
                            <div
                                className="article-sapo"
                                dangerouslySetInnerHTML={{ __html: sapo }}
                            />
                        )}

                        {/* Date + Category + Bookmark */}
                        <div className="detail-topbar">
                            <div className="detail-date">
                                <time>
                                    {new Date(activeItem.pubDate).toLocaleDateString('vi-VN', {
                                        weekday: 'long',
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </time>
                                <span className="sep">|</span>
                                <strong className="detail-cate">{categoryName}</strong>
                            </div>

                            <button className={`bookmark-btn ${saved ? 'saved' : ''}`} onClick={handleToggleSave} type="button">
                                <span className="icon">{saved ? '🔖' : '📑'}</span>
                                <span>{saved ? 'Đã lưu' : 'Lưu bài'}</span>
                            </button>
                        </div>

                        {/*TIN LIÊN QUAN */}
                        {relatedItemsTop.length > 0 && (
                            <section className="related-box related-box--top" aria-label="Tin liên quan">
                                <ul className="related-list">
                                    {relatedItemsTop.map((x, idx) => (
                                        <li key={`${x.link || idx}-${idx}`} className="related-item">
                                            <button
                                                type="button"
                                                className="related-link"
                                                onClick={() => navigate('/news/detail', { state: { item: x } })}
                                                title={x.title}
                                            >
                                                {x.title}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        {/* MAIN CONTENT */}
                        <div className="detail-body-wrapper">
                            {showEmpty ? (
                                <StateView state="empty" title="Nội dung trống" message="Bài viết này không có nội dung text." />
                            ) : (
                                <article
                                    className="article-body news-content-wrapper"
                                    dangerouslySetInnerHTML={{ __html: bodyFinal }}
                                />
                            )}
                        </div>

                        {/* Loading / Error States */}
                        {loading && (
                            <div className="status-area">
                                <StateView state="loading" compact title="Đang tải toàn bộ nội dung..." />
                            </div>
                        )}

                        {!loading && error && (
                            <div className={`status-area ${(!loading && !error) ? 'status-placeholder' : ''}`}>
                                {loading ? (
                                    <StateView state="loading" compact title="Đang tải toàn bộ nội dung..." />
                                ) : error ? (
                                    <StateView
                                        state="error"
                                        compact
                                        title="Không tải được nội dung gốc"
                                        message={canRetry ? 'Đang hiển thị bản tóm tắt RSS.' : 'Vui lòng mở link gốc.'}
                                        retryText={canRetry ? 'Thử lại tải về' : 'Mở link gốc'}
                                        onRetry={canRetry ? handleRetry : undefined}
                                        linkHref={!canRetry ? activeItem.link : undefined}
                                    />
                                ) : (
                                    <div className="status-spacer" />
                                )}
                            </div>
                        )}

                        {/* COMMENTS */}
                        <section className="comment-section" aria-label="Bình luận bài viết">
                            <div className="comment-header">
                                <div className="comment-title">Ý kiến bạn đọc</div>
                                <div className="comment-count">{comments.length} bình luận</div>
                            </div>

                            <form className="comment-form" onSubmit={handleSubmitComment}>
                                <div className="comment-row comment-row--inline">
                                    <input
                                        className="comment-input"
                                        value={cName}
                                        onChange={(e) => setCName(e.target.value)}
                                        placeholder="Họ và tên"
                                        maxLength={40}
                                    />

                                    <input
                                        className="comment-input"
                                        value={cEmail}
                                        onChange={(e) => setCEmail(e.target.value)}
                                        placeholder="Email (không bắt buộc)"
                                        type="email"
                                        maxLength={60}
                                    />
                                </div>


                                <div className="comment-row">
                  <textarea
                      className="comment-textarea"
                      value={cText}
                      onChange={(e) => setCText(e.target.value)}
                      placeholder="Ý kiến của bạn là..."
                      maxLength={800}
                  />
                                </div>

                                <div className="comment-actions">
                                    <button
                                        type="submit"
                                        className="comment-submit"
                                        disabled={!cName.trim() || !cText.trim()}
                                        title="Gửi bình luận"
                                    >
                                        Gửi
                                    </button>
                                    <div className="comment-hint">* Lưu trên máy (localStorage) – demo frontend</div>
                                </div>
                            </form>

                            {comments.length === 0 ? (
                                <div className="comment-empty">Chưa có bình luận nào. Hãy là người đầu tiên nhé.</div>
                            ) : (
                                <div className="comment-list">
                                    {comments.map((c) => (
                                        <div key={c.id} className="comment-item">
                                            <div className="comment-meta">
                                                <div className="comment-name">
                                                    {c.name}
                                                    {c.email && <span className="comment-email">({c.email})</span>}
                                                </div>
                                                <div className="comment-time">
                                                    {new Date(c.createdAt).toLocaleString('vi-VN', {
                                                        day: '2-digit',
                                                        month: '2-digit',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </div>

                                                <button
                                                    type="button"
                                                    className="comment-del"
                                                    onClick={() => handleDeleteComment(c.id)}
                                                    title="Xóa"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                            <div className="comment-text">{c.text}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    </div>

                    {/* RIGHT */}
                    <aside className="right-bar">
                        {/* TIN MỚI NHẤT */}
                        <div className="mostread sidebar-block">
                            <div className="mostread-header alt">Tin mới nhất</div>
                            <div className="mostread-list">
                                {latestItems.length === 0 ? (
                                    <div className="mostread-empty">Chưa có dữ liệu để hiển thị.</div>
                                ) : (
                                    latestItems.map(renderSidebarItem)
                                )}
                            </div>
                        </div>

                        {/* TIN NỔI BẬT */}
                        <div className="mostread sidebar-block">
                            <div className="mostread-header">Tin nổi bật</div>
                            <div className="mostread-list">
                                {featuredItems.length === 0 ? (
                                    <div className="mostread-empty">Chưa có dữ liệu để hiển thị.</div>
                                ) : (
                                    featuredItems.map(renderSidebarItem)
                                )}
                            </div>
                        </div>

                        {/* CÓ THỂ BẠN QUAN TÂM */}
                        <div className="mostread sidebar-block">
                            <div className="mostread-header alt2">Có thể bạn quan tâm</div>
                            <div className="mostread-list">
                                {suggestedItems.length === 0 ? (
                                    <div className="mostread-empty">Chưa có dữ liệu để hiển thị.</div>
                                ) : (
                                    suggestedItems.map(renderSidebarItem)
                                )}
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default NewsDetail;
