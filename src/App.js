import React from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Header from "./styles/Header.js";
import Footer from "./styles/Footer.js";
import EventBar from "./components/EventBar"; // Import EventBar
import NewsDetail from "./components/NewsDetail";
import NewsFeed from "./components/NewsFeed";
// import "./styles/global.css";
import "./styles/baotintuc.css";
import "./styles/swiper.css";
import BookmarksPage from "./components/BookmarksPage";
// News data is loaded from RSS feeds and may not be real-time
// Main application entry with routing configuration
// Main application entry with routing configuration
// Hide ads globally
const globalStyles = `
  #zone-483788, #adnzone_483787, .box40nam, #placment-l9f4wxy1, #divpopup01, #divpopup02, #divwebrightfix, #divwebleffix {
    display: none !important;
  }
`;

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
            <style>{globalStyles}</style>
            <Header
                currentCategory={getCategoryId()}
                onCategoryChange={handleCategoryChange}
            />
            <EventBar /> {/* Add EventBar here */}

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
