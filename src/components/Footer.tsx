
import React from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIES } from '../services/rssService';

const Footer: React.FC = () => {
    return (
        <footer className="footer">
            <div className="w1040">
                {/* Footer Nav (similar to Top Nav but simpler) */}
                <div className="navbar">
                    <div className="navbar_wrapper">
                        <Link to="/" className="iconhome" style={{ marginRight: '10px' }}>🏠</Link>
                        <ul className="list-navbar">
                            {CATEGORIES.slice(0, 6).map(cat => (
                                <li className="nav-item" key={cat.id}>
                                    <Link to={`/category/${cat.id}`}>{cat.name}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Main Footer Info */}
                <div className="footer-info">
                    <div className="info_wrapper">
                        <div className="info-logo">
                            <Link to="/" className="logo-footer" style={{ backgroundImage: 'url(https://cdnmedia.baotintuc.vn/Upload/QKrAM3u3JmfSk084HTqfEg/files/Quangcao/docbaogiay-TT.jpg)', width: '100%', height: 'auto', minHeight: '80px', backgroundSize: 'contain', backgroundRepeat: 'no-repeat' }}></Link>
                            <div className="editor-txt">
                                <b>Tổng biên tập:</b> Nguyễn Thị Sự <br />
                                <b>Phó Tổng biên tập:</b> Lê Duy Truyền, Vũ Việt Trang
                            </div>
                            <span>© THÔNG TẤN XÃ VIỆT NAM</span>
                        </div>

                        <div className="info-place">
                            <p><b>Giấy phép xuất bản số:</b> 173/GP-BTTTT cấp ngày 04/04/2022</p>
                            <p>© Bản quyền thuộc về Báo Tin tức - TTXVN</p>
                            <p><b>Tòa soạn:</b> Số 5 Lý Thường Kiệt, Hoàn Kiếm, Hà Nội</p>
                            <p><b>Điện thoại:</b> (024) 3941.1349 - (024) 3941.1348 | <b>Fax:</b> (024) 3941.1348</p>
                            <p><b>Email:</b> baotintuc@vnanet.vn | thuky@baotintuc.vn</p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
