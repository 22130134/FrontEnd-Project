import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { CATEGORIES } from '../services/rssService.js';
import { getBookmarks } from "../services/bookmarkService";
import '../components/css/Header.css';

const Header = ({ currentCategory, onCategoryChange }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [bookmarkCount, setBookmarkCount] = useState(0);

    useEffect(() => {
        const update = () => setBookmarkCount(getBookmarks().length);

        update(); // load lần đầu
        window.addEventListener("bookmarks:changed", update);

        return () => window.removeEventListener("bookmarks:changed", update);
    }, []);

    return (
        <div className="header-main">
            {/* Top Bar */}
            <div className="top-bar">
                <div className="top-bar-content">
                    <span className="date-time">
                        {new Date().toLocaleDateString('vi-VN', {
                            weekday: 'long',
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                        })}
                    </span>

                    <div className="top-right-links">
                        <Link to="/bookmarks" className="bookmark-link">
                            Đã lưu {bookmarkCount > 0 ? <span className="bookmark-badge">{bookmarkCount}</span> : null}
                        </Link>
                        <a href="#">RSS</a>
                        <a href="#">Liên hệ</a>
                    </div>
                </div>
            </div>

            {/* Main Header with Logo and Search */}
            <header className="container">
                <div className="header-content">
                    <div
                        className="logo"
                        onClick={() => onCategoryChange(CATEGORIES[0].id)}
                        style={{ cursor: 'pointer' }}
                    >
                        <span className="logo-text">
                            BAOTINTUC
                            <span
                                style={{
                                    color: '#666',
                                    fontSize: '0.5em',
                                    display: 'block',
                                    letterSpacing: '2px',
                                    marginTop: '-5px'
                                }}
                            >
                                TTXVN
                            </span>
                        </span>
                    </div>

                    <div className="header-search">
                        <input type="text" placeholder="Tìm kiếm..." className="search-input" />
                        <button className="search-btn">🔍</button>
                    </div>

                    {/* Mobile Menu Icon */}
                    <button
                        className="mobile-menu-btn"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        ☰
                    </button>
                </div>
            </header>

            {/* Red Navigation Bar */}
            <nav className="desktop-nav">
                <ul className="nav-list">
                    {CATEGORIES.map((cat) => (
                        <li key={cat.id}>
                            <button
                                onClick={() => onCategoryChange(cat.id)}
                                className={`nav-item-btn ${currentCategory === cat.id ? 'active' : ''}`}
                            >
                                {cat.name}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Mobile Nav Dropdown */}
            {isMenuOpen && (
                <div className="mobile-dropdown">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => {
                                onCategoryChange(cat.id);
                                setIsMenuOpen(false);
                            }}
                            className={`mobile-nav-btn ${currentCategory === cat.id ? 'active' : ''}`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Header;
