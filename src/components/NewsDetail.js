
import React, { useEffect, useState } from 'react';
import { fetchFullArticle, parseArticleContent } from '../services/scraperService';
import StateView from './StateView';
import './css/NewsDetail.css';
import { useLocation, useNavigate } from 'react-router-dom';


const MAX_RETRY = 3;

const NewsDetail = ({ item: propItem, onBack }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const item = propItem || location.state?.item;

    const [fullContent, setFullContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [retryCount, setRetryCount] = useState(0);
    const [retryKey, setRetryKey] = useState(0);

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            navigate(-1);
        }
    };

    // Reset trang thái retry khi đổi bài viết
    useEffect(() => {
        setRetryCount(0);
        setRetryKey(0);
    }, [item]);

    // Load nội dung bài viết
    useEffect(() => {
        const loadContent = async () => {
            if (!item || !item.link) return;

            setLoading(true);
            try {
                // Lấy nội dung html từ link gốc
                const html = await fetchFullArticle(item.link);
                const parsed = parseArticleContent(html);
                setFullContent(parsed);
            } catch (e) {
                console.log(e);
                setError(e);
            }
            setLoading(false);
        };

        loadContent();
    }, [item, retryKey]);

    if (!item) {
        return (
            <div className="container" style={{ padding: "40px 0" }}>
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

    let image = item.thumbnail || item.enclosure?.link;
    if (!image) {
        const imgMatch = item.description?.match(/src="([^"]+)"/);
        image = imgMatch ? imgMatch[1] : null;
    }

    const fallbackContent = item.content || item.description || "";
    const displayContent = fullContent || fallbackContent;

    const showEmpty = !loading && !error && (!displayContent || displayContent.trim().length === 0);

    const canRetry = retryCount < MAX_RETRY;

    const handleRetry = () => {
        if (!canRetry) return;
        setRetryCount((c) => c + 1);
        setRetryKey((k) => k + 1);
    };

    const title = "Nguồn đang hạn chế truy cập bài viết đầy đủ";
    const message = canRetry
        ? "Đang hiển thị nội dung tóm tắt từ RSS. Bạn có thể thử lại hoặc mở bài gốc."
        : "Đang hiển thị nội dung tóm tắt từ RSS. Vui lòng thử lại sau hoặc mở bài gốc.";

    return (
        <div className="container news-detail-container fade-in">
            <div className="breadcrumb">
                <span onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>Trang chủ</span>
                <span> &gt; </span>
                <span onClick={handleBack} style={{ cursor: 'pointer' }}>Quay lại</span>
                <span> &gt; </span>
                <span>Chi tiết</span>
            </div>

            <h1 className="detail-title">{item.title}</h1>

            <div className="detail-meta">
                <span>
                    {new Date(item.pubDate).toLocaleDateString("vi-VN", {
                        weekday: "long",
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                    })}
                </span>
            </div>

            {image && (!fullContent || !fullContent.includes(image)) && (
                <div className="detail-main-img-wrapper">
                    <img src={image} alt={item.title} className="detail-main-img" />
                </div>
            )}

            {showEmpty ? (
                <StateView state="empty" title="Không có nội dung để hiển thị" message="Vui lòng chọn bài viết khác." />
            ) : (
                <div className="article-body">
                    {/* Render Sapo explicitly if we can identify it, or just rely on CSS first-child */}
                    <div dangerouslySetInnerHTML={{ __html: displayContent }} />
                </div>
            )}

            {loading && (
                <div style={{ marginTop: 12 }}>
                    <StateView state="loading" compact title="Đang tải nội dung đầy đủ..." message="Vui lòng chờ một chút." />
                </div>
            )}

            {!loading && error && (
                <div style={{ marginTop: 12 }}>
                    <StateView
                        state="error"
                        compact
                        title={title}
                        message={message}
                        retryText={canRetry ? "Thử lại" : "Đã thử nhiều lần"}
                        onRetry={canRetry ? handleRetry : undefined}
                        linkHref={item.link}
                        linkText="Mở trên Baotintuc.vn"
                    />
                </div>
            )}
        </div>
    );
};

export default NewsDetail;
