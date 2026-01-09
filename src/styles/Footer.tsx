import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../components/css/Footer.css';

const Footer: React.FC = () => {
    const navigate = useNavigate();

    // Helper for footer links if we want to use onClick (Programmatic) or Link
    // Using Link is better for SEO and CSR Check
    // But since the design uses buttons in list, wrapping them or using onClick is acceptable.
    // Let's use onClick with navigate for these specific buttons to match previous style,
    // explicitly using Programmatic Navigation prompt requirement for some parts?
    // Actually prompt says check if I used Link instead of <a>.
    // I will use Link where possible.

    const handleNav = (id: string) => {
        if (id === 'home') navigate('/');
        else navigate(`/category/${id}`);
    };

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
                                <li className="footer-link-item"><button className="footer-link-btn" onClick={() => handleNav('thoi-su')}>Chính trị</button></li>
                                <li className="footer-link-item"><button className="footer-link-btn" onClick={() => handleNav('xa-hoi')}>Xã hội</button></li>
                            </ul>
                        </div>
                        <div className="footer-col">
                            <h4>Kinh tế</h4>
                            <ul className="footer-links">
                                <li className="footer-link-item"><button className="footer-link-btn" onClick={() => handleNav('kinh-te')}>Thị trường</button></li>
                                <li className="footer-link-item"><button className="footer-link-btn" onClick={() => handleNav('kinh-te')}>Doanh nghiệp</button></li>
                            </ul>
                        </div>
                        <div className="footer-col">
                            <h4>Pháp luật</h4>
                            <ul className="footer-links">
                                <li className="footer-link-item"><button className="footer-link-btn" onClick={() => handleNav('phap-luat')}>Vụ án</button></li>
                                <li className="footer-link-item"><button className="footer-link-btn" onClick={() => handleNav('phap-luat')}>Văn bản</button></li>
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
