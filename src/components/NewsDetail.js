import React, { useEffect, useState } from "react";
import StateView from "./StateView";
import { fetchFullArticle, parseArticleContent } from "../services/scraperService";
import "./NewsDetail.css";

const MAX_RETRY = 3;

const NewsDetail = ({ item, onBack }) => {
    const [fullContent, setFullContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [retryCount, setRetryCount] = useState(0);
    const [retryKey, setRetryKey] = useState(0);

    useEffect(() => {
        setRetryCount(0);
        setRetryKey(0);
    }, [item?.link]);

    useEffect(() => {
        let mounted = true;

        const loadContent = async () => {
            if (!item || !item.link) return;

            setLoading(true);
            setError(null);
            setFullContent(null);

            try {
                const html = await fetchFullArticle(item.link);
                const parsed = parseArticleContent(html);

                if (!mounted) return;

                if (parsed && parsed.trim().length > 0) setFullContent(parsed);
                else setFullContent(null);
            } catch (e) {
                if (!mounted) return;
                setError(e);
                setFullContent(null);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        loadContent();
        return () => {
            mounted = false;
        };
    }, [item, retryKey]);

    if (!item) return null;

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
            <button onClick={onBack} className="back-btn">
                ← Quay lại
            </button>

            <h1 className="detail-title">{item.title}</h1>

            <div className="detail-meta">
        <span>
          {new Date(item.pubDate).toLocaleDateString("vi-VN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
          })}
        </span>
                <span>Nguồn: Baotintuc.vn</span>
            </div>

            {image && (!fullContent || !fullContent.includes(image)) && (
                <div className="detail-main-img-wrapper">
                    <img src={image} alt={item.title} className="detail-main-img" />
                </div>
            )}

            {showEmpty ? (
                <StateView state="empty" title="Không có nội dung để hiển thị" message="Vui lòng chọn bài viết khác." />
            ) : (
                <div className="article-body" dangerouslySetInnerHTML={{ __html: displayContent }} />
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
