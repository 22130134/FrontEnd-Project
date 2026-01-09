import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { fetchNewsByCategory, clearNews } from "../store/newsSlice";
import HeroSection from "./HeroSection";
import NewsList from "./NewsList";
import Sidebar from "./Sidebar";
import StateView from "./StateView";
import { CATEGORIES, fetchAllSections, NewsItem, HomeSection } from "../services/rssService";
import CategoryBlock from "./CategoryBlock";

// Define locally since it might not be exported
interface SectionData extends HomeSection {
    items: NewsItem[];
    error: string | null;
}

function NewsFeed() {
    const { categoryId } = useParams();
    const dispatch = useDispatch<AppDispatch>();

    const activeCategory = categoryId || 'home';

    // Redux State
    const { items: news, loading, error } = useSelector((state: RootState) => state.news);
    const [retryKey, setRetryKey] = useState(0);

    // Local State for Home Sections
    const [homeSections, setHomeSections] = useState<SectionData[]>([]);

    useEffect(() => {
        // Redux fetch for main list / hero
        const category = CATEGORIES.find((c) => c.id === activeCategory);
        if (category) {
            dispatch(fetchNewsByCategory({ url: category.url, categoryId: activeCategory }));
        } else {
            dispatch(clearNews());
        }

        // Local fetch for Home Sections (only on Home)
        if (activeCategory === 'home') {
            fetchAllSections().then(data => {
                // Filter out 'focus' as it's typically shown in Hero
                const others = data.filter(s => s.id !== 'focus');
                setHomeSections(others);
            });
        } else {
            setHomeSections([]);
        }

    }, [activeCategory, retryKey, dispatch]);

    // Data partitioning for "Focus" / Category Items
    const heroItems = news.slice(0, 4);
    const mainFeedItems = news.slice(4, 20); // Used for Category pages or fallback
    const sidebarItems = news.slice(0, 15);

    const showLoading = loading && news.length === 0;

    if (showLoading) {
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

    // Render Logic
    return (
        <main className="home-content" style={{ minHeight: '60vh', paddingBottom: '40px' }}>
            <div className="content_wrapper w1040">

                {/* 1. Hero Section (Home Only) */}
                {activeCategory === 'home' && (
                    <HeroSection items={heroItems} />
                )}

                {/* 2. Category Header (Sub-pages Only) */}
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

                {/* 3. Main Content Columns */}
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
                            {activeCategory === 'home' ? (
                                // --- HOME VIEW: Sections ---
                                <div>
                                    {homeSections.map(section => (
                                        <CategoryBlock
                                            key={section.id}
                                            title={section.title}
                                            link={`/category/${section.id}`}
                                            items={section.items}
                                        />
                                    ))}
                                    {homeSections.length === 0 && !loading && (
                                        // Fallback if sections haven't loaded but hero has?
                                        <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
                                            Đang tải các chuyên mục...
                                        </div>
                                    )}
                                </div>
                            ) : (
                                // --- CATEGORY VIEW: List ---
                                <NewsList items={mainFeedItems} />
                            )}
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
