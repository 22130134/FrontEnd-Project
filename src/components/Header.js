import React, { useState } from 'react';
import { CATEGORIES } from '../services/rssService';
import './Header.css';

const Header = ({ currentCategory, onCategoryChange }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="header-main">
            <div className="top-bar">
                <div className="container top-bar-content">
                    <span>{new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    <span>Hợp tác cùng Baotintuc.vn</span>
                </div>
            </div>

            <header className="container">
                <div className="header-content">
                    <div
                        className="logo"
                        onClick={() => onCategoryChange(CATEGORIES[0].id)}
                    >
                        <h1>
                            The News<span className="logo-suffix">Daily</span>
                        </h1>
                    </div>

                    {/* Mobile Menu Icon */}
                    <button
                        className="mobile-menu-btn"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        ☰
                    </button>
                </div>

                {/* Navigation */}
                <nav className="desktop-nav">
                    <ul className="nav-list">
                        {CATEGORIES.map((cat) => (
                            <li key={cat.id}>
                                <button
                                    onClick={() => onCategoryChange(cat.id)}
                                    className={`nav-item-btn ${currentCategory === cat.id ? 'active' : ''}`}
                                >
                                    {cat.name}
                                    {currentCategory === cat.id && <div className="nav-indicator" />}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            </header>

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
