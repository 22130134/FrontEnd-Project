import React, {useState, useEffect} from "react";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import NewsList from "./components/NewsList";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import NewsDetail from "./components/NewsDetail";
import StateView from "./components/StateView";
import {fetchFeed, CATEGORIES} from "./services/rssService";
import "./styles/global.css";

function App() {
    const [currentCategory, setCurrentCategory] = useState(CATEGORIES[0].id);
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [selectedArticle, setSelectedArticle] = useState(null);
    const [retryKey, setRetryKey] = useState(0);

    //NEW: thời điểm cập nhật dữ liệu
    const [lastUpdated, setLastUpdated] = useState(null);

    useEffect(() => {
        let mounted = true;

        const loadNews = async () => {
            setLoading(true);
            setError(null);

            setSelectedArticle(null);
            window.scrollTo(0, 0);

            try {
                const category = CATEGORIES.find((c) => c.id === currentCategory);
                if (!category) throw new Error("Category not found");

                const data = await fetchFeed(category.url);
                const items = data?.items || [];

                if (!mounted) return;

                setNews(items);

                //LƯU THỜI ĐIỂM FETCH XONG
                setLastUpdated(new Date());
            } catch (err) {
                if (!mounted) return;
                console.error(err);
                setNews([]);
                setError(
                    err instanceof Error
                        ? err.message
                        : "Failed to load news. Please try again later."
                );
            } finally {
                if (mounted) setLoading(false);
            }
        };

        loadNews();

        return () => {
            mounted = false;
        };
    }, [currentCategory, retryKey]);

    const handleArticleClick = (item) => {
        setSelectedArticle(item);
        window.scrollTo(0, 0);
    };

    const handleBackToHome = () => {
        setSelectedArticle(null);
        window.scrollTo(0, 0);
    };

    const heroItems = news.slice(0, 3);
    const mainFeedItems = news.slice(3, 10);
    const sidebarItems = news.slice(10, 20);

    const showEmpty = !loading && !error && (!news || news.length === 0);

    return (
        <div className="app">
            {/*truyền lastUpdated xuống Header */}
            <Header
                currentCategory={currentCategory}
                onCategoryChange={setCurrentCategory}
                lastUpdated={lastUpdated}
            />

            {loading ? (
                <div className="container" style={{ padding: "40px 0" }}>
                    <StateView
                        state="loading"
                        title="Đang tải tin tức..."
                        message="Vui lòng chờ một chút."
                    />
                </div>
            ) : error ? (
                <div className="container" style={{padding: "40px 0"}}>
                    <StateView
                        state="error"
                        title="Không tải được tin tức"
                        message="Vui lòng thử lại. Nếu vẫn lỗi, có thể dịch vụ RSS đang quá tải."
                        retryText="Thử lại"
                        onRetry={() => setRetryKey((k) => k + 1)}
                    />
                </div>
            ) : showEmpty ? (
                <div className="container" style={{ padding: "40px 0" }}>
                    <StateView
                        state="empty"
                        title="Chưa có tin"
                        message="Danh mục này hiện chưa có bài viết để hiển thị."
                    />
                </div>
            ) : (
                <>
                    {selectedArticle ? (
                        <NewsDetail item={selectedArticle} onBack={handleBackToHome}/>
                    ) : (
                        <>
                            <HeroSection
                                items={heroItems}
                                onArticleClick={handleArticleClick}
                            />

                            <div className="container">
                                <div
                                    className="main-layout"
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns: "repeat(12, 1fr)",
                                        gap: "40px",
                                    }}
                                >
                                    <div style={{gridColumn: "span 8"}} className="content-col">
                                        <h3 className="section-title">Tin nổi bật</h3>
                                        <NewsList
                                            items={mainFeedItems}
                                            onArticleClick={handleArticleClick}
                                        />
                                    </div>

                                    <div style={{ gridColumn: "span 4" }} className="sidebar-col">
                                        <Sidebar
                                            latestItems={sidebarItems}
                                            onArticleClick={handleArticleClick}
                                        />
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </>
            )}

            <Footer onCategoryChange={setCurrentCategory}/>

            <style>{`
        @media (max-width: 900px) {
          .content-col { grid-column: span 12 !important; }
          .sidebar-col { grid-column: span 12 !important; margin-top: 2rem; }
        }
      `}</style>
        </div>
    );
}

export default App;
