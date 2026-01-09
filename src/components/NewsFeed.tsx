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
import CategoryBlock from "./CategoryBlock"; // Keeping import if we want to expand later

function NewsFeed() {
    const { categoryId } = useParams();
    const dispatch = useDispatch<AppDispatch>();

    const activeCategory = categoryId || 'home';

    // Redux State - Huynh Architecture
    const { items: news, loading, error } = useSelector((state: RootState) => state.news);
    const [retryKey, setRetryKey] = useState(0);

    useEffect(() => {
        // Find category info
        const category = CATEGORIES.find((c) => c.id === activeCategory);
        if (category) {
            dispatch(fetchNewsByCategory({ url: category.url, categoryId: activeCategory }));
        } else {
            dispatch(clearNews());
        }
    }, [activeCategory, retryKey, dispatch]);

    // Data partitioning
    const heroItems = news.slice(0, 4);
    const mainFeedItems = news.slice(4, 20);
    const sidebarItems = news.slice(0, 15);

    const showEmpty = !loading && news.length === 0;

    if (loading && news.length === 0) {
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
        <main className="home-content" style={{ minHeight: '60vh', paddingBottom: '40px' }}>
            <div className="content_wrapper w1040">

                {/* Hero Section - Full Width (Home Only) */}
                {activeCategory === 'home' && (
                    <HeroSection items={heroItems} />
                )}

                {/* Category Header (Sub-pages Only) */}
                {activeCategory !== 'home' && (
                    <div className="category-header">
                        <h2 className="page-title" style={{
                            margin: '20px 0',
                            color: '#9f224e',
                            borderBottom: '1px solid #ddd',
                            paddingBottom: '10px',
                            textTransform: 'uppercase',
                            fontFamily: 'Merriweather, serif'
                        }}>
                            {CATEGORIES.find(c => c.id === activeCategory)?.name}
                        </h2>
                    </div>
                )}

                {/* Main Content Columns */}
                <div className="content_center">
                    <div
                        className="main-layout"
                        style={{
                            display: "grid",
                            gridTemplateColumns: "2fr 1fr",
                            gap: "30px",
                            marginTop: "20px",
                            width: "100%"
                        }}
                    >
                        <div className="content-col">
                            {/* 
                                For now, we reuse NewsList for both Home and Category pages
                                to conform to the existing Redux slice structure (single list).
                                Future upgrade: Use 'CategoryBlock' with 'sections' if we update Redux to fetchAllSections.
                            */}
                            <NewsList items={mainFeedItems} />
                        </div>

                        <div className="sidebar-col">
                            <Sidebar latestItems={sidebarItems} />
                        </div>
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
