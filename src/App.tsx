import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import Header from "./styles/Header";
import Footer from "./styles/Footer";
import NewsDetail from "./components/NewsDetail";
import NewsFeed from "./components/NewsFeed";
// @ts-ignore
import EventBar from "./components/EventBar";
// @ts-ignore
import BookmarksPage from "./components/BookmarksPage";

import "./components/css/global.css";
// Import styles from kiet branch
import "./components/css/baotintuc.css";
import "./components/css/swiper.css";

// Hide ads globally (from kiet branch)
const globalStyles = `
  #zone-483788, #adnzone_483787, .box40nam, #placment-l9f4wxy1, #divpopup01, #divpopup02, #divwebrightfix, #divwebleffix {
    display: none !important;
  }
`;

// Layout Component implementing Nested Routes & Outlet
const MainLayout = () => {
    return (
        <div className="app">
            <style>{globalStyles}</style>
            <Header />
            <EventBar />
            <Outlet />
            <Footer />
        </div>
    );
};

function App() {
    return (
        <Routes>
            <Route path="/" element={<MainLayout />}>
                <Route index element={<NewsFeed />} />
                <Route path="category/:categoryId" element={<NewsFeed />} />
                <Route path="news/detail" element={<NewsDetail />} />
                <Route path="bookmarks" element={<BookmarksPage />} />
            </Route>
        </Routes>
    );
};

export default App;
