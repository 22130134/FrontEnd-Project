import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import Header from "./styles/Header";
import Footer from "./styles/Footer";
import NewsDetail from "./components/NewsDetail";
import NewsFeed from "./components/NewsFeed";
import "./styles/global.css";

// Layout Component implementing Nested Routes & Outlet
const MainLayout = () => {
    return (
        <div className="app">
            <Header />
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
            </Route>
        </Routes>
    );
}

export default App;
