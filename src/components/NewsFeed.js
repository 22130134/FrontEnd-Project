import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import HeroSection from "./HeroSection";
import NewsList from "./NewsList";
import Sidebar from "./Sidebar";
import StateView from "./StateView";
import { fetchFeed, CATEGORIES } from "../services/rssService";

function NewsFeed() {
    const { categoryId } = useParams();
    const navigate = useNavigate();

    // Default to 'home' if no categoryId provided (though Route should handle this)
    const activeCategory = categoryId || 'home';

    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [retryKey, setRetryKey] = useState(0);

    // Hàm load tin tức mỗi khi category thay đổi
    useEffect(() => {
        const loadNews = async () => {
            setLoading(true);
            try {
                // Tìm category hiện tại trong danh sách
                const category = CATEGORIES.find((c) => c.id === activeCategory);
                if (category) {
                    const data = await fetchFeed(category.url);
                    setNews(data.items || []);
                }
            } catch (err) {
                console.log(err);
                setError(true);
            }
            setLoading(false);
        };

        loadNews();
    }, [activeCategory, retryKey]);

    // Chuyển sang trang chi tiết khi click vào bài viết
    const handleArticleClick = (item) => {
        navigate(`/news/detail`, { state: { item } });
    };

    const heroItems = news.slice(0, 3);
    const mainFeedItems = news.slice(3, 15);
    const sidebarItems = news.slice(15, 30);

    const showEmpty = !loading && news.length === 0;

    if (loading) {
        return (
            <div className="container" style={{ padding: "40px 0", minHeight: "50vh" }}>
                <StateView state="loading" title="Đang tải tin tức..." message="Vui lòng chờ một chút." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="container" style={{ padding: "40px 0", minHeight: "50vh" }}>
                <StateView
                    state="error"
                    title="Không tải được tin tức"
                    message="Vui lòng thử lại. Nếu vẫn lỗi, có thể dịch vụ RSS đang gặp sự cố."
                    retryText="Thử lại"
                    onRetry={() => setRetryKey((k) => k + 1)}
                />
            </div>
        );
    }

    if (showEmpty) {
        return (
            <div className="container" style={{ padding: "40px 0", minHeight: "50vh" }}>
                <StateView state="empty" title="Chưa có tin" message="Danh mục này hiện chưa có bài viết để hiển thị." />
            </div>
        );
    }

    return (
        <main style={{ minHeight: '60vh', paddingBottom: '40px' }}>
            {activeCategory === 'home' && (
                <HeroSection items={heroItems} onArticleClick={handleArticleClick} />
            )}

            {activeCategory !== 'home' && (
                <div className="container">
                    <h2 className="page-title" style={{
                        margin: '20px 0',
                        color: 'var(--primary-color)',
                        borderBottom: '1px solid #ddd',
                        paddingBottom: '10px',
                        textTransform: 'uppercase'
                    }}>
                        {CATEGORIES.find(c => c.id === activeCategory)?.name}
                    </h2>
                </div>
            )}

            <div className="container">
                <div
                    className="main-layout"
                    style={{
                        display: "grid",
                        gridTemplateColumns: "2fr 1fr",
                        gap: "30px",
                    }}
                >
                    <div className="content-col">
                        <NewsList items={activeCategory === 'home' ? mainFeedItems : news} onArticleClick={handleArticleClick} />
                    </div>

                    <div className="sidebar-col">
                        <Sidebar latestItems={sidebarItems} onArticleClick={handleArticleClick} />
                    </div>
                </div>
            </div>

            <style>{`
                @media (max-width: 900px) {
                  .main-layout { grid-template-columns: 1fr !important; }
                  .sidebar-col { margin-top: 2rem; }
                }
            `}</style>
        </main>
    );
}

export default NewsFeed;
