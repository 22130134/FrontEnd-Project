
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CATEGORIES } from '../services/rssService';
// We assume CSS is loaded globally via App.tsx or we import it here if scoped (but main.css is global)

const Header: React.FC = () => {
    const location = useLocation();

    // Determine active category for styling
    const getCategoryId = () => {
        const path = location.pathname;
        if (path === '/') return 'home';
        if (path.startsWith('/category/')) {
            return path.split('/')[2];
        }
        return '';
    };
    const currentCategory = getCategoryId();

    // Helper to format date like "Thứ Ba, 14/01/2026 10:20"
    const [currentDate, setCurrentDate] = useState('');
    useEffect(() => {
        const now = new Date();
        const options: Intl.DateTimeFormatOptions = {
            weekday: 'long',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        };
        // Vietnamese locale
        setCurrentDate(now.toLocaleDateString('vi-VN', options));
    }, []);

    return (
        <header className="header">
            <div className="header_wrapper">
                {/* TOOLBAR */}
                <div className="toolbar">
                    <div className="toolbar_wrapper w1040">
                        <ul>
                            <li>
                                <span className="icon" style={{ backgroundPosition: '-110px -4px', width: '12px', height: '12px', backgroundImage: 'url(/web_images/sprite.png)' }}></span>
                                {/* Note: Icons in ref checks sprites. Since we don't have sprite.png, we might leave empty or use text emojis for now as per previous Header */}
                                <span className="txt">0914.914.999</span>
                            </li>
                            <li>
                                <span className="txt">Email: thuky@baotintuc.vn</span>
                            </li>
                            <li>
                                <a href="#" className="actionlink">
                                    <span className="icon"></span>
                                    <span className="txt">RSS</span>
                                </a>
                            </li>
                        </ul>
                        <div className="input-search">
                            <input type="text" placeholder="Tìm kiếm..." />
                            <a href="#" className="icon-search" style={{ display: 'block', width: '30px', background: 'red' }}>🔍</a>
                        </div>
                    </div>
                </div>

                {/* LOGO */}
                <div className="headerlogo">
                    <div className="headerlogo_wrapper w1040">
                        <Link to="/" className="logo" style={{ backgroundImage: 'url(/web_images/baotintuc-logo.png)' }}>
                        </Link>
                        <div className="bannertop" style={{ display: 'flex', gap: '10px' }}>
                            {/* Requested banners: 1 and 2 */}
                            <a href="#">
                                <img src="https://cdnmedia.baotintuc.vn/Upload/QKrAM3u3JmfSk084HTqfEg/files/Quangcao/docbaogiay-TT.jpg" alt="Doc Bao Giay TT" style={{ maxHeight: '90px' }} />
                            </a>
                            <a href="#">
                                <img src="https://cdnmedia.baotintuc.vn/Upload/QKrAM3u3JmfSk084HTqfEg/files/2025/11/Doji-29112025-3thang.jpg" alt="Doc Bao Giay DTMN" style={{ maxHeight: '90px' }} />
                            </a>
                        </div>
                    </div>
                </div>

                {/* NAVBAR */}
                <div className="navbar" id="menu">
                    <div className="navbar_wrapper w1040">
                        <Link to="/" className="iconhome" style={{ color: 'white', padding: '0 10px', display: 'flex', alignItems: 'center' }}>
                            🏠
                        </Link>
                        <ul className="list-navbar">
                            {/* Static "Home" removed as we have iconhome */}
                            {/* Render Visible Items (up to 'Video') */}
                            {(() => {
                                const videoIndex = CATEGORIES.findIndex(c => c.id === 'video');
                                const splitIndex = videoIndex !== -1 ? videoIndex + 1 : CATEGORIES.length;
                                const visibleCats = CATEGORIES.slice(0, splitIndex);
                                const hiddenCats = CATEGORIES.slice(splitIndex);

                                return (
                                    <>
                                        {visibleCats.map(cat => (
                                            <li className="nav-item" key={cat.id}>
                                                <Link
                                                    to={cat.id === 'home' ? '/' : `/category/${cat.id}`}
                                                    className={currentCategory === cat.id ? 'active' : ''}
                                                >
                                                    {cat.name}
                                                </Link>
                                            </li>
                                        ))}

                                        {/* Dropdown for remaining items */}
                                        {hiddenCats.length > 0 && (
                                            <li className="nav-item has-sub" style={{ position: 'relative' }}>
                                                <a href="#" className="more-icon" style={{ cursor: 'pointer', fontSize: '20px', lineHeight: '0.8' }}>
                                                    ...
                                                </a>
                                                <ul className="droplist-info" style={{
                                                    display: 'none', // CSS hover should handle this, verifying main.css or adding inline style fallback
                                                    position: 'absolute',
                                                    top: '100%',
                                                    right: 0,
                                                    background: '#fff',
                                                    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                                                    padding: '10px',
                                                    minWidth: '200px',
                                                    zIndex: 1000
                                                }}>
                                                    {hiddenCats.map(cat => (
                                                        <li key={cat.id} style={{ borderBottom: '1px dashed #eee', margin: 0 }}>
                                                            <Link
                                                                to={`/category/${cat.id}`}
                                                                style={{
                                                                    display: 'block',
                                                                    padding: '8px 0',
                                                                    color: '#333',
                                                                    textTransform: 'uppercase',
                                                                    fontWeight: 'bold',
                                                                    fontSize: '13px'
                                                                }}
                                                            >
                                                                {cat.name}
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                                <style>{`
                                                    .nav-item.has-sub:hover .droplist-info {
                                                        display: block !important;
                                                    }
                                                `}</style>
                                            </li>
                                        )}
                                    </>
                                );
                            })()}
                        </ul>
                    </div>
                </div>

                {/* THREADBAR (Scroll text) */}

            </div>
        </header>
    );
};

export default Header;
