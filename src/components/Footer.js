import React from 'react';
import { CATEGORIES } from '../services/rssService';
import './css/Footer.css';

const Footer = ({ onCategoryChange }) => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <span className="footer-logo">BAOTINTUC<span style={{ fontSize: '0.6em' }}>.VN</span></span>
                        <div className="footer-info-text">
                            <p><strong>© 2024 Thông tấn xã Việt Nam.</strong></p>
                            <p>Tổng biên tập: Nguyễn Thị Sự</p>
                            <p>Số giấy phép: 173/GP-BTTTT cấp ngày 04/04/2022</p>
                            <p>Tòa soạn: 5 Lý Thường Kiệt, Hà Nội</p>
                            <p>Điện thoại: (024) 38254231 - Fax: (024) 39330669</p>
                            <p>Email: baotintuc@vnanet.vn</p>
                        </div>
                    </div>

                    <div className="footer-links-area">
                        {/* Simulate columns of categories */}
                        <div className="footer-col">
                            <h4>Thời sự</h4>
                            <ul className="footer-links">
                                <li className="footer-link-item"><button className="footer-link-btn" onClick={() => onCategoryChange('thoi-su')}>Chính trị</button></li>
                                <li className="footer-link-item"><button className="footer-link-btn" onClick={() => onCategoryChange('xa-hoi')}>Xã hội</button></li>
                            </ul>
                        </div>
                        <div className="footer-col">
                            <h4>Kinh tế</h4>
                            <ul className="footer-links">
                                <li className="footer-link-item"><button className="footer-link-btn" onClick={() => onCategoryChange('kinh-te')}>Thị trường</button></li>
                                <li className="footer-link-item"><button className="footer-link-btn" onClick={() => onCategoryChange('kinh-te')}>Doanh nghiệp</button></li>
                            </ul>
                        </div>
                        <div className="footer-col">
                            <h4>Pháp luật</h4>
                            <ul className="footer-links">
                                <li className="footer-link-item"><button className="footer-link-btn" onClick={() => onCategoryChange('phap-luat')}>Vụ án</button></li>
                                <li className="footer-link-item"><button className="footer-link-btn" onClick={() => onCategoryChange('phap-luat')}>Văn bản</button></li>
                            </ul>
                        </div>
                        <div className="footer-col">
                            <h4>Liên hệ</h4>
                            <ul className="footer-links">
                                <li className="footer-link-item"><button className="footer-link-btn">Quảng cáo</button></li>
                                <li className="footer-link-item"><button className="footer-link-btn">Góp ý</button></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>Bản quyền thuộc về Báo Tin tức - TTXVN. Cấm sao chép dưới mọi hình thức nếu không có sự chấp thuận bằng văn bản.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
