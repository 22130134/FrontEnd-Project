import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { fetchNewsByCategory, clearNews } from "../store/newsSlice";
import HeroSection from "./HeroSection";
import NewsList from "./NewsList";
import Sidebar from "./Sidebar";
import StateView from "./StateView";
import { CATEGORIES } from "../services/rssService";

function NewsFeed() {
    const { categoryId } = useParams();
    const dispatch = useDispatch<AppDispatch>();

    const activeCategory = categoryId || 'home';

    // Redux State
    const { items: news, loading, error } = useSelector((state: RootState) => state.news);
    const [retryKey, setRetryKey] = useState(0);

    useEffect(() => {
        // Find category info
        const category = CATEGORIES.find((c) => c.id === activeCategory);
        if (category) {
            dispatch(fetchNewsByCategory({ url: category.url, categoryId: activeCategory }));
        } else {
            // Invalid category handled by error state or redirect? 
            // For now just clear news
            dispatch(clearNews());
        }
    }, [activeCategory, retryKey, dispatch]);



    const heroItems = news.slice(0, 3);
    const mainFeedItems = news.slice(3, 15);
    const sidebarItems = news.slice(15, 30);

    const showEmpty = !loading && news.length === 0;

    if (loading && news.length === 0) {
        // Only show full loading if we have no items. 
        // If we had items (re-fetching), maybe show loading indicator overlay?
        // For simplistic approach, show loading screen.
        return (
            <div className="container" style={{ padding: "40px 0", minHeight: "50vh" }}>
                <StateView state="loading" title="Đang tải tin tức..." message="Vui lòng chờ một chút." />
            </div>
        );
    }

    if (error && news.length === 0) {
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
                <HeroSection items={heroItems} />
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
                        <NewsList items={activeCategory === 'home' ? mainFeedItems : news} />
                    </div>

                    <div className="sidebar-col">
                        <Sidebar latestItems={sidebarItems} />
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
