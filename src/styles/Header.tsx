import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CATEGORIES } from '../services/rssService';
import { getBookmarks } from "../services/bookmarkService";
import homeIcon from '../assets/home.svg';
import logoNew from '../assets/logo_new.png'; // Updated Logo
import '../components/css/Header.css'; // Make sure this CSS exists or is merged

const Header: React.FC = () => {
    const location = useLocation();
    const [bookmarkCount, setBookmarkCount] = useState(0);

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

    useEffect(() => {
        const update = () => setBookmarkCount(getBookmarks().length);
        update();
        window.addEventListener("bookmarks:changed", update);
        return () => window.removeEventListener("bookmarks:changed", update);
    }, []);

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
                        <Link
                            to="/"
                            className="logo"
                        >
                            <img src={logoNew} alt="Bao Tin Tuc" />
                        </Link>

                        {/* Slogan */}
                        <div className="header-slogan">
                            TRƯỜNG ĐẠI HỌC NÔNG LÂM TP. HỒ CHÍ MINH
                        </div>
                    </div>
                </div>

                {/* NAVBAR */}
                <div className="navbar" id="menu">
                    <div className="navbar_wrapper w1040">
                        <Link
                            to="/"
                            className="iconhome"
                        >
                            <img src={homeIcon} alt="Home" />
                        </Link>
                        <ul className="list-navbar">
                            {CATEGORIES.map((cat) => (
                                <li className="nav-item" key={cat.id}>
                                    <Link
                                        to={`/category/${cat.id}`}
                                        title={cat.name}
                                        id={`menu_${cat.id}`}
                                        className={currentCategory === cat.id ? 'active' : ''}
                                    >
                                        {cat.name}
                                    </Link>
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
