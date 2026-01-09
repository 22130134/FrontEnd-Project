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

// Loại ảnh <img ...> đầu tiên trong HTML (RSS hay chèn thumbnail vào đầu)
const stripFirstImage = (html: string) => {
    if (!html) return html;

    // 1) Xóa <p><img .../></p> ở đầu
    let out = html.replace(/^\s*<p>\s*<img[^>]*>\s*<\/p>\s*/i, '');

    // 2) Xóa <div><img .../></div> ở đầu
    out = out.replace(/^\s*<div[^>]*>\s*<img[^>]*>\s*<\/div>\s*/i, '');

    // 3) Xóa <img ...> nếu đứng đầu chuỗi
    out = out.replace(/^\s*<img[^>]*>\s*/i, '');

    return out;
};

const NewsDetail: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Lấy danh sách tin hiện có từ Redux
    const { items: storeItems, currentCategory } = useSelector((s: RootState) => s.news);

    const categoryName = useMemo(() => {
        const found = CATEGORIES.find(c => c.id === currentCategory);
        return found?.name || 'Tin tức';
    }, [currentCategory]);

    // Lấy item từ state
    const state = location.state as { item: NewsItem } | null;
    const item = state?.item;

    const [fullContent, setFullContent] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<any>(null);
    const [retryCount, setRetryCount] = useState(0);
    const [retryKey, setRetryKey] = useState(0);

    // Bookmark state
    const [saved, setSaved] = useState(false);

    // 1) Khởi tạo + check bookmark
    useEffect(() => {
        if (item?.link) setSaved(isBookmarked(item.link));
        setRetryCount(0);
        setRetryKey(0);
        setFullContent(null);
    }, [item]);

    // 2) Load nội dung bài viết (full)
    useEffect(() => {
        const loadContent = async () => {
            if (!item || !item.link) {
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
    }, [item, retryKey]);

    const handleToggleSave = () => {
        if (!item) return;
        const { saved: nextSaved } = toggleBookmark(item);
        setSaved(nextSaved);
    };

    const handleRetry = () => {
        if (retryCount < MAX_RETRY) {
            setRetryCount(c => c + 1);
            setRetryKey(k => k + 1);
        }
    };

    // ---- RENDER LOGIC ----
    if (!item) {
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
    const fallbackContent = item.content || item.description || '';
    const rawDisplayContent = fullContent || fallbackContent;

    // Nếu chưa có fullContent (đang dùng RSS) thì strip ảnh đầu để tránh trùng/ảnh rác
    const cleanedContent = useMemo(() => {
        if (fullContent) return fullContent;
        return stripFirstImage(rawDisplayContent);
    }, [fullContent, rawDisplayContent]);

    const showEmpty =
        !loading && !error && (!cleanedContent || cleanedContent.trim().length === 0);
    const canRetry = retryCount < MAX_RETRY;

    // ===== Sidebar data =====
    const normalizedLink = (l?: string) => (l || '').trim();

    const baseCandidates = useMemo(() => {
        const currentLink = normalizedLink(item.link);
        return (storeItems || []).filter(
            x => normalizedLink(x.link) && normalizedLink(x.link) !== currentLink
        );
    }, [storeItems, item.link]);

    // 1) Tin đọc nhiều nhất: tạm lấy 6 item đầu
    const mostReadItems = useMemo(() => baseCandidates.slice(0, 6), [baseCandidates]);

    // 2) Tin mới nhất: sort theo pubDate giảm dần
    const latestItems = useMemo(() => {
        return [...baseCandidates]
            .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
            .slice(0, 6);
    }, [baseCandidates]);

    // 3) Tin cùng chuyên mục: vì storeItems thường là list của currentCategory,
    // nên baseCandidates coi như cùng chuyên mục; loại trùng với "đọc nhiều"
    const sameCategoryItems = useMemo(() => {
        const mostReadLinks = new Set(mostReadItems.map(x => normalizedLink(x.link)));
        return baseCandidates.filter(x => !mostReadLinks.has(normalizedLink(x.link))).slice(0, 6);
    }, [baseCandidates, mostReadItems]);

    // Render 1 item sidebar (đỡ lặp code)
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
                            <button
                                className="fab fab-home"
                                onClick={() => navigate('/')}
                                title="Trang chủ"
                            >
                                🏠
                            </button>

                            <a
                                className="fab fab-fb"
                                title="Chia sẻ Facebook"
                                target="_blank"
                                rel="noreferrer"
                                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                                    item.link
                                )}`}
                            >
                                f
                            </a>

                            <a
                                className="fab fab-zalo"
                                title="Chia sẻ Zalo"
                                target="_blank"
                                rel="noreferrer"
                                href={`https://button-share.zalo.me/share_external?d=${encodeURIComponent(
                                    item.link
                                )}`}
                            >
                                Z
                            </a>

                            <a
                                className="fab fab-mail"
                                title="Gửi mail"
                                href={`mailto:?subject=${encodeURIComponent(
                                    item.title
                                )}&body=${encodeURIComponent(item.link)}`}
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
                        <h1 className="detail-title baotintuc-title">{item.title}</h1>

                        {/* Date + Category + Bookmark */}
                        <div className="detail-topbar">
                            <div className="detail-date">
                                <time>
                                    {new Date(item.pubDate).toLocaleDateString('vi-VN', {
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

                            <button
                                className={`bookmark-btn ${saved ? 'saved' : ''}`}
                                onClick={handleToggleSave}
                            >
                                <span className="icon">{saved ? '🔖' : '📑'}</span>
                                <span>{saved ? 'Đã lưu' : 'Lưu bài'}</span>
                            </button>
                        </div>

                        {/* MAIN CONTENT */}
                        <div className="detail-body-wrapper">
                            {showEmpty ? (
                                <StateView
                                    state="empty"
                                    title="Nội dung trống"
                                    message="Bài viết này không có nội dung text."
                                />
                            ) : (
                                <article
                                    className="article-body news-content-wrapper"
                                    dangerouslySetInnerHTML={{ __html: cleanedContent }}
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
                            <div className="status-area">
                                <StateView
                                    state="error"
                                    compact
                                    title="Không tải được nội dung gốc"
                                    message={canRetry ? 'Đang hiển thị bản tóm tắt RSS.' : 'Vui lòng mở link gốc.'}
                                    retryText={canRetry ? 'Thử lại tải về' : 'Mở link gốc'}
                                    onRetry={canRetry ? handleRetry : undefined}
                                    linkHref={!canRetry ? item.link : undefined}
                                />
                            </div>
                        )}
                    </div>

                    {/* RIGHT */}
                    <aside className="right-bar">
                        {/* TIN ĐỌC NHIỀU NHẤT */}
                        <div className="mostread sidebar-block">
                            <div className="mostread-header">Tin đọc nhiều nhất</div>
                            <div className="mostread-list">
                                {mostReadItems.length === 0 ? (
                                    <div className="mostread-empty">Chưa có dữ liệu để hiển thị.</div>
                                ) : (
                                    mostReadItems.map(renderSidebarItem)
                                )}
                            </div>
                        </div>

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

                        {/* TIN CÙNG CHUYÊN MỤC */}
                        <div className="mostread sidebar-block">
                            <div className="mostread-header alt2">Tin cùng chuyên mục</div>
                            <div className="mostread-list">
                                {sameCategoryItems.length === 0 ? (
                                    <div className="mostread-empty">Chưa có dữ liệu để hiển thị.</div>
                                ) : (
                                    sameCategoryItems.map(renderSidebarItem)
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
