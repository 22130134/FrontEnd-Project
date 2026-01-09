import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { CATEGORIES } from '../services/rssService.js';
import { getBookmarks } from "../services/bookmarkService";
import homeIcon from '../assets/home.svg';
import logoNew from '../assets/logo_new.png'; // Updated Logo


// We rely on baotintuc.css imported in App.js

const Header = ({ currentCategory, onCategoryChange }) => {
    const [bookmarkCount, setBookmarkCount] = useState(0);

    useEffect(() => {
        const update = () => setBookmarkCount(getBookmarks().length);
        update();
        window.addEventListener("bookmarks:changed", update);
        return () => window.removeEventListener("bookmarks:changed", update);
    }, []);

    // Helper to handle clicks and prevent default link behavior if needed
    const handleNavClick = (e, id) => {
        e.preventDefault();
        onCategoryChange(id);
    };

    return (
        <div className="header">
            <div className="header_wrapper">
                {/* TOOLBAR */}
                <div className="toolbar">
                    <div className="toolbar_wrapper w1040">
                        <ul>
                            <li>
                                <span className="icon">📞</span>
                                <span className="txt">0914.914.999</span>
                            </li>
                            <li>
                                <span className="icon">✉️</span>
                                <span className="txt">Email: thuky@baotintuc.vn</span>
                            </li>
                            <li>
                                <Link to="/bookmarks" className="actionlink">
                                    <span className="icon">🔖</span>
                                    <span className="txt">
                                        Đã lưu ({bookmarkCount})
                                    </span>
                                </Link>
                            </li>
                        </ul>
                        <div className="input-search">
                            <input type="text" className="input-info" placeholder="Từ khóa tìm kiếm" />
                            <a href="#" className="icon-search">🔍</a>
                        </div>
                    </div>
                </div>

                {/* LOGO AREA */}
                <div className="headerlogo">
                    <div className="headerlogo_wrapper w1040">
                        {/* New Logo */}
                        <a
                            href="/"
                            className="logo"
                            onClick={(e) => handleNavClick(e, 'home')}
                        >
                            <img src={logoNew} alt="Bao Tin Tuc" />
                        </a>

                        {/* Slogan */}
                        <div className="header-slogan">
                            TRƯỜNG ĐẠI HỌC NÔNG LÂM TP. HỒ CHÍ MINH
                        </div>
                    </div>
                </div>

                {/* NAVBAR */}
                <div className="navbar" id="menu">
                    <div className="navbar_wrapper w1040">
                        <a
                            href="/"
                            className="iconhome"
                            onClick={(e) => handleNavClick(e, 'home')}
                        >
                            <img src={homeIcon} alt="Home" />
                        </a>
                        <ul className="list-navbar">
                            {CATEGORIES.map((cat) => (
                                <li className="nav-item" key={cat.id}>
                                    <a
                                        href={`/category/${cat.id}`}
                                        title={cat.name}
                                        id={`menu_${cat.id}`}
                                        className={currentCategory === cat.id ? 'active' : ''}
                                        onClick={(e) => handleNavClick(e, cat.id)}
                                    >
                                        {cat.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
