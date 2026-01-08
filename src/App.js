import React from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Header from "./styles/Header.js";
import Footer from "./styles/Footer.js";
import NewsDetail from "./components/NewsDetail";
import NewsFeed from "./components/NewsFeed";
import "./styles/global.css";
import BookmarksPage from "./components/BookmarksPage";
// News data is loaded from RSS feeds and may not be real-time
// Main application entry with routing configuration
function App() {
    const navigate = useNavigate();
    const location = useLocation();


    // Determine current category ID from path for Header active state
    // path: /category/:id or / -> home
    // Resolve category id from current URL path
    const getCategoryId = () => {
        const path = location.pathname;
        if (path === '/') return 'home';
        if (path.startsWith('/category/')) {
            return path.split('/')[2];
        }
        return '';
    };
// TODO: consider adding analytics tracking for category navigation
    const handleCategoryChange = (id) => {
        if (id === 'home') {
            navigate('/');
        } else {
            navigate(`/category/${id}`);
        }
    };

    return (
        <div className="app">
            <Header
                currentCategory={getCategoryId()}
                onCategoryChange={handleCategoryChange}
            />

            <Routes>
                <Route path="/bookmarks" element={<BookmarksPage />} />
                <Route path="/" element={<NewsFeed />} />
                <Route path="/category/:categoryId" element={<NewsFeed />} />
                <Route path="/news/detail" element={<NewsDetail />} />
            </Routes>

            <Footer onCategoryChange={handleCategoryChange} />
        </div>
    );
}

export default App;
