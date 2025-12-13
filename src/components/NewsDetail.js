import React, { useEffect, useState } from 'react';
import { fetchFullArticle, parseArticleContent } from '../services/scraperService';
import './NewsDetail.css';

const NewsDetail = ({ item, onBack }) => {
    const [fullContent, setFullContent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        const loadContent = async () => {
            if (!item || !item.link) return;
            setLoading(true);
            // Reset full content when item changes to show summary first
            setFullContent(null);

            // 1. Try to fetch full content via proxy
            const html = await fetchFullArticle(item.link);
            const parsedContext = parseArticleContent(html);

            if (mounted) {
                if (parsedContext) {
                    setFullContent(parsedContext);
                }
                setLoading(false);
            }
        };

        loadContent();

        return () => { mounted = false; };
    }, [item]);

    if (!item) return null;

    // Fallback image
    let image = item.thumbnail || item.enclosure?.link;
    if (!image) {
        const imgMatch = item.description?.match(/src="([^"]+)"/);
        image = imgMatch ? imgMatch[1] : null;
    }

    // Use scraped content if available, otherwise RSS description as fallback
    const displayContent = fullContent || item.content || item.description;

    return (
        <div className="container news-detail-container fade-in">
            <button
                onClick={onBack}
                className="back-btn"
            >
                ← Quay lại
            </button>

            <h1 className="detail-title">
                {item.title}
            </h1>

            <div className="detail-meta">
                <span>{new Date(item.pubDate).toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                <span>Nguồn: Baotintuc.vn</span>
            </div>

            {/* Only show main image if it's NOT in the scraped content (heuristic) */}
            {image && (!fullContent || !fullContent.includes(image)) && (
                <div className="detail-main-img-wrapper">
                    <img
                        src={image}
                        alt={item.title}
                        className="detail-main-img"
                    />
                </div>
            )}

            {/* Article Body - Shows summary immediately, then swaps to full content */}
            <div
                className="article-body"
                dangerouslySetInnerHTML={{ __html: displayContent }}
            />

            {loading && (
                <div className="detail-loading-overlay">
                    <span>Đang tải nội dung đầy đủ...</span>
                    <div className="loading-dots"></div>
                </div>
            )}

            {!loading && !fullContent && (
                <div className="detail-notice">
                    * Hiển thị nội dung tóm tắt do không tải được bài viết gốc.
                </div>
            )}



            <style>{`
        .detail-loading-overlay {
            margin-top: 2rem;
            text-align: center;
            color: var(--brand-color);
            font-style: italic;
            font-size: 0.9rem;
            opacity: 0.8;
            padding: 1rem;
            background: #f9f9f9;
            border-radius: 4px;
        }
        .detail-notice {
            margin-top: 1rem;
            color: #666;
            font-style: italic;
            font-size: 0.9rem;
            text-align: center;
        }
        .loading-dots:after {
            content: ' .';
            animation: dots 1s steps(5, end) infinite;
        }
        @keyframes dots {
            0%, 20% { content: ' .'; }
            40% { content: ' ..'; }
            60% { content: ' ...'; }
            80%, 100% { content: ' ....'; }
        }
      `}</style>
        </div>
    );
};

export default NewsDetail;
