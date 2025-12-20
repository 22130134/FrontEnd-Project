import React from 'react';
import './css/Sidebar.css';

const Sidebar = ({ latestItems, onArticleClick }) => {
    return (
        <div className="sidebar">
            <h3 className="section-title">Tin mới nhận</h3>
            <div className="sidebar-list">
                {latestItems.map((item, index) => (
                    <div
                        key={index}
                        onClick={() => onArticleClick(item)}
                        className="sidebar-item-link"
                    >
                        <div className="sidebar-item">
                            <h4 className="sidebar-item-title">
                                {item.title}
                            </h4>
                            <span className="meta-info">{new Date(item.pubDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Sidebar;
