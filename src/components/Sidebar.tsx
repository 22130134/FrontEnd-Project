import React from 'react';
import { Link } from 'react-router-dom';
import './css/Sidebar.css';
import { NewsItem } from '../services/rssService';

interface SidebarProps {
    latestItems: NewsItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ latestItems }) => {
    return (
        <div className="sidebar">
            <h3 className="section-title">Tin mới nhận</h3>
            <div className="sidebar-list">
                {latestItems.map((item, index) => (
                    <Link
                        key={index}
                        to="/news/detail"
                        state={{ item }}
                        className="sidebar-item-link"
                        style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}
                    >
                        <div className="sidebar-item">
                            <h4 className="sidebar-item-title">
                                {item.title}
                            </h4>
                            <span className="meta-info">{new Date(item.pubDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Sidebar;
