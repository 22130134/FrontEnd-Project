import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { fetchNewsByCategory, clearNews } from "../store/newsSlice";
import HeroSection from "./HeroSection";
import NewsList from "./NewsList";
import Sidebar from "./Sidebar";
import CategoryBlock from "./CategoryBlock"; // New component
import StateView from "./StateView";
<<<<<<< HEAD:src/components/NewsFeed.tsx
import { CATEGORIES } from "../services/rssService";
=======
import { fetchFeed, fetchAllSections, CATEGORIES } from "../services/rssService";
>>>>>>> kiet:src/components/NewsFeed.js

function NewsFeed() {
    const { categoryId } = useParams();
    const dispatch = useDispatch<AppDispatch>();

    const activeCategory = categoryId || 'home';

<<<<<<< HEAD:src/components/NewsFeed.tsx
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
=======
    const [news, setNews] = useState([]); // For single category or 'focus' items on home
    const [sections, setSections] = useState([]); // For homepage multiple sections
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [retryKey, setRetryKey] = useState(0);

    useEffect(() => {
        const loadNews = async () => {
            setLoading(true);
            try {
                if (activeCategory === 'home') {
                    // Fetch all sections for homepage
                    const allData = await fetchAllSections();

                    // The first section is 'Focus' (latest) used for Hero
                    const focusSection = allData.find(s => s.id === 'focus');
                    const otherSections = allData.filter(s => s.id !== 'focus');

                    setNews(focusSection?.items || []);
                    setSections(otherSections);
                } else {
                    // Fetch single category
                    const category = CATEGORIES.find((c) => c.id === activeCategory);
                    if (category) {
                        const data = await fetchFeed(category.url);
                        setNews(data.items || []);
                        setSections([]); // Clear sections
                    }
                }
            } catch (err) {
                console.log(err);
                setError(true);
            }
            setLoading(false);
        };
>>>>>>> kiet:src/components/NewsFeed.js



    // Data partitioning
    const heroItems = news.slice(0, 4);
    const mainFeedItems = news.slice(4, 20); // For regular category view

    // Sidebar always shows some latest news. 
    // On homepage, we can use the 'news' (focus items) as latest, or slice from end.
    // Let's use a slice of current news for simplicity.
    const sidebarItems = news.slice(0, 15);

    const showEmpty = !loading && news.length === 0 && sections.length === 0;

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
<<<<<<< HEAD:src/components/NewsFeed.tsx
        <main style={{ minHeight: '60vh', paddingBottom: '40px' }}>
            {activeCategory === 'home' && (
                <HeroSection items={heroItems} />
            )}
=======
        <main className="home-content" style={{ minHeight: '60vh', paddingBottom: '40px' }}>
            <div className="content_wrapper w1040">
>>>>>>> kiet:src/components/NewsFeed.js

                {/* Hero Section - Full Width (Home Only) */}
                {activeCategory === 'home' && (
                    <HeroSection items={heroItems} onArticleClick={handleArticleClick} />
                )}

<<<<<<< HEAD:src/components/NewsFeed.tsx
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
=======
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
>>>>>>> kiet:src/components/NewsFeed.js
                    </div>
                )}

<<<<<<< HEAD:src/components/NewsFeed.tsx
                    <div className="sidebar-col">
                        <Sidebar latestItems={sidebarItems} />
=======
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
                            {/* HOMEPAGE: Render Category Blocks */}
                            {activeCategory === 'home' ? (
                                <div className="home-sections">
                                    {sections.map(section => (
                                        <CategoryBlock
                                            key={section.id}
                                            title={section.title}
                                            link={`/category/${section.id}`}
                                            items={section.items}
                                            onArticleClick={handleArticleClick}
                                        />
                                    ))}
                                </div>
                            ) : (
                                /* SUB-PAGE: Render Standard List */
                                <NewsList items={mainFeedItems} onArticleClick={handleArticleClick} />
                            )}
                        </div>

                        <div className="sidebar-col">
                            <Sidebar latestItems={sidebarItems} onArticleClick={handleArticleClick} />
                        </div>
>>>>>>> kiet:src/components/NewsFeed.js
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
