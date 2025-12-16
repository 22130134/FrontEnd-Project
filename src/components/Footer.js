import React from 'react';
import { CATEGORIES } from '../services/rssService';
import './Footer.css';

const Footer = ({ onCategoryChange }) => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <h3>NewsApp</h3>
                        <p className="footer-desc">
                            Trang tin tức tổng hợp nhanh chóng, chính xác và chuyên nghiệp nhất. Cập nhật liên tục 24/7.
                        </p>
                    </div>
                    <div>
                        <h4 className="footer-heading">Chuyên mục</h4>
                        <ul className="footer-links">
                            {CATEGORIES.slice(0, 6).map(cat => (
                                <li key={cat.id} className="footer-link-item">
                                    <button
                                        onClick={() => onCategoryChange(cat.id)}
                                        className="footer-link-btn"
                                    >
                                        {cat.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="footer-info">
                        <h4 className="footer-heading">Liên hệ</h4>
                        <p>Email: contact@newsapp.com</p>
                        <p>Phone: +84 123 456 789</p>
                    </div>
                </div>
                <div className="footer-copyright">
                    © 2024 NewsApp. All rights reserved. Design by AntiGravity.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
