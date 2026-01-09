import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import HeroSection from "./HeroSection";
import NewsList from "./NewsList";
import Sidebar from "./Sidebar";
import CategoryBlock from "./CategoryBlock"; // New component
import StateView from "./StateView";
import { fetchFeed, fetchAllSections, CATEGORIES } from "../services/rssService";

function NewsFeed() {
    const { categoryId } = useParams();
    const navigate = useNavigate();

    const activeCategory = categoryId || 'home';

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

        loadNews();
    }, [activeCategory, retryKey]);

    // Chuyển sang trang chi tiết khi click vào bài viết
    const handleArticleClick = (item) => {
        navigate(`/news/detail`, { state: { item } });
    };

    // Data partitioning
    const heroItems = news.slice(0, 4);
    const mainFeedItems = news.slice(4, 20); // For regular category view

    // Sidebar always shows some latest news. 
    // On homepage, we can use the 'news' (focus items) as latest, or slice from end.
    // Let's use a slice of current news for simplicity.
    const sidebarItems = news.slice(0, 15);

    const showEmpty = !loading && news.length === 0 && sections.length === 0;

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
        <main className="home-content" style={{ minHeight: '60vh', paddingBottom: '40px' }}>
            <div className="content_wrapper w1040">

                {/* Hero Section - Full Width (Home Only) */}
                {activeCategory === 'home' && (
                    <HeroSection items={heroItems} onArticleClick={handleArticleClick} />
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
