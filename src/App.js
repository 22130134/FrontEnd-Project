import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import NewsList from './components/NewsList';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import NewsDetail from './components/NewsDetail';
import { fetchFeed, CATEGORIES } from './services/rssService';
import './styles/global.css';

function App() {
    const [currentCategory, setCurrentCategory] = useState(CATEGORIES[0].id);
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // New state for Detail View
    const [selectedArticle, setSelectedArticle] = useState(null);

    useEffect(() => {
        const loadNews = async () => {
            setLoading(true);
            setError(null);

            // If we change category, reset detail view
            setSelectedArticle(null);
            window.scrollTo(0, 0);

            try {
                const category = CATEGORIES.find(c => c.id === currentCategory);
                if (category) {
                    const data = await fetchFeed(category.url);
                    if (data && data.items) {
                        setNews(data.items);
                    } else {
                        throw new Error('No data received');
                    }
                }
            } catch (err) {
                console.error(err);
                setError('Failed to load news. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        loadNews();
    }, [currentCategory]);

    const handleArticleClick = (item) => {
        setSelectedArticle(item);
        window.scrollTo(0, 0);
    };

    const handleBackToHome = () => {
        setSelectedArticle(null);
        window.scrollTo(0, 0);
    };

    // Logic: 
    const heroItems = news.slice(0, 3);
    const mainFeedItems = news.slice(3, 10);
    const sidebarItems = news.slice(10, 20);

    return (
        <div className="app">
            <Header
                currentCategory={currentCategory}
                onCategoryChange={setCurrentCategory}
            />

            {error && (
                <div className="container" style={{ textAlign: 'center', padding: '4rem', color: 'red' }}>
                    <h2>Oops!</h2>
                    <p>{error}</p>
                </div>
            )}

            {loading ? (
                <div className="container" style={{ textAlign: 'center', padding: '100px 0' }}>
                    <div className="spinner"></div>
                    <style>{`.spinner { border: 4px solid #f3f3f3; border-top: 4px solid var(--brand-color); border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 0 auto; } @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                </div>
            ) : (
                <>
                    {selectedArticle ? (
                        <NewsDetail item={selectedArticle} onBack={handleBackToHome} />
                    ) : (
                        <>
                            <HeroSection items={heroItems} onArticleClick={handleArticleClick} />

                            <div className="container">
                                <div className="main-layout" style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '40px' }}>
                                    {/* Main Content Column */}
                                    <div style={{ gridColumn: 'span 8' }} className="content-col">
                                        <h3 className="section-title">Tin nổi bật</h3>
                                        <NewsList items={mainFeedItems} onArticleClick={handleArticleClick} />
                                    </div>

                                    {/* Sidebar Column */}
                                    <div style={{ gridColumn: 'span 4' }} className="sidebar-col">
                                        <Sidebar latestItems={sidebarItems} onArticleClick={handleArticleClick} />
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </>
            )}

            <Footer onCategoryChange={setCurrentCategory} />

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
