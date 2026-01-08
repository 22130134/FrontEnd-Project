import React from 'react';
import './css/Sidebar.css';

const Sidebar = ({ latestItems, onArticleClick }) => {
    return (
        <div className="sidebar" style={{
            fontFamily: 'Roboto, sans-serif'
        }}>
            {/* Boxed Header "TIN MỚI NHẬN" */}
            <div className="sidebar-header" style={{
                backgroundColor: '#f5f5f5',
                border: '1px solid #e5e5e5',
                padding: '15px',
                marginBottom: '20px'
            }}>
                <h3 style={{
                    color: '#b5272d',
                    textTransform: 'uppercase',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    margin: 0,
                    borderBottom: '2px solid #b5272d',
                    display: 'inline-block',
                    paddingBottom: '5px'
                }}>
                    Tin mới nhận
                </h3>
            </div>

            <div className="sidebar-list">
                {latestItems.map((item, index) => (
                    <div
                        key={index}
                        onClick={() => onArticleClick(item)}
                        className="sidebar-item-link"
                        style={{
                            marginBottom: '15px',
                            paddingBottom: '15px',
                            borderBottom: '1px solid #eee',
                            cursor: 'pointer'
                        }}
                    >
                        <div className="sidebar-item">
                            <h4 className="sidebar-item-title" style={{
                                fontSize: '15px',
                                fontWeight: 'bold',
                                lineHeight: '1.4',
                                margin: '0 0 5px 0',
                                color: '#333'
                            }}>
                                {item.title}
                            </h4>
                            <div className="meta-info" style={{ fontSize: '12px', color: '#888' }}>
                                {/* Extract text from description if needed, or just date */}
                                {item.description?.replace(/<[^>]+>/g, '').substring(0, 80)}...
                                <br />
                                <span style={{ color: '#999', fontSize: '11px', marginTop: '4px', display: 'inline-block' }}>
                                    {new Date(item.pubDate).toLocaleDateString()} {new Date(item.pubDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <style>{`
                .sidebar-item-link:hover .sidebar-item-title {
                    color: #b5272d !important;
                }
                .sidebar-item-link:last-child {
                    border-bottom: none !important;
                }
            `}</style>
        </div>
    );
};

export default Sidebar;
