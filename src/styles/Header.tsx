import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CATEGORIES } from '../services/rssService';
import '../components/css/Header.css';

const Header: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    // Determine current category ID from path
    const getCategoryId = () => {
        const path = location.pathname;
        if (path === '/') return 'home';
        if (path.startsWith('/category/')) {
            return path.split('/')[2];
        }
        return '';
    };

    const currentCategory = getCategoryId();

    // Helper for search (demo)
    const handleSearch = () => {
        alert("Tính năng tìm kiếm đang phát triển");
    };

    return (
        <div className="header-main">
            {/* Top Bar */}
            <div className="top-bar">
                <div className="top-bar-content">
                    <span className="date-time">
                        {new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })}
                    </span>
                    <div className="top-right-links">
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
                        onClick={() => navigate('/')}
                        style={{ cursor: 'pointer' }}
                    >
                        <span className="logo-text">BAOTINTUC<span style={{ color: '#666', fontSize: '0.5em', display: 'block', letterSpacing: '2px', marginTop: '-5px' }}>TTXVN</span></span>
                    </div>

                    <div className="header-search">
                        <input type="text" placeholder="Tìm kiếm..." className="search-input" />
                        <button className="search-btn" onClick={handleSearch}>🔍</button>
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
                            <Link
                                to={cat.id === 'home' ? '/' : `/category/${cat.id}`}
                                className={`nav-item-btn ${currentCategory === cat.id ? 'active' : ''}`}
                                style={{ display: 'inline-block', lineHeight: '45px', textDecoration: 'none' }}
                            >
                                {cat.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Mobile Nav Dropdown */}
            {isMenuOpen && (
                <div className="mobile-dropdown">
                    {CATEGORIES.map((cat) => (
                        <Link
                            key={cat.id}
                            to={cat.id === 'home' ? '/' : `/category/${cat.id}`}
                            onClick={() => setIsMenuOpen(false)}
                            className={`mobile-nav-btn ${currentCategory === cat.id ? 'active' : ''}`}
                            style={{ display: 'block', textDecoration: 'none' }}
                        >
                            {cat.name}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Header;
