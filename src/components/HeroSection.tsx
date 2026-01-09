import React from 'react';
import { Link } from 'react-router-dom';
import { NewsItem } from '../services/rssService';
// import './css/HeroSection.css'; // kiet uses inline styles, maybe keep or unused? Keeping for safety if overrides needed

interface HeroSectionProps {
    items: NewsItem[];
}

const HeroSection: React.FC<HeroSectionProps> = ({ items }) => {
    if (!items || items.length === 0) return null;

    const mainItem = items[0];
    const subItems = items.slice(1, 4);

    // Helpers to get images
    const getImage = (item: NewsItem) => {
        let image = item.thumbnail || item.enclosure?.link;
        if (!image) {
            const imgMatch = item.description?.match(/src="([^"]+)"/);
            image = imgMatch ? imgMatch[1] : 'https://placehold.co/800x600?text=No+Image';
        }
        return image;
    };

    const cleanTitle = (t: string) => t?.replace(/<[^>]+>/g, '').trim();
    const cleanDesc = (t: string) => t?.replace(/<[^>]+>/g, '').trim();

    return (
        <div className="hero-wrapper" style={{ marginBottom: '30px', fontFamily: 'Roboto, sans-serif' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '20px' }} className="hero-grid-layout">

                {/* Main Hero Article */}
                <div className="hero-main" style={{ position: 'relative' }}>
                    <Link
                        to="/news/detail"
                        state={{ item: mainItem }}
                        className="main-thumb"
                        style={{ cursor: 'pointer', overflow: 'hidden', borderRadius: '4px', display: 'block' }}
                    >
                        <img
                            src={getImage(mainItem)}
                            alt={mainItem.title}
                            style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover', aspectRatio: '16/9' }}
                        />
                    </Link>
                    <div className="main-info" style={{ marginTop: '10px' }}>
                        <Link
                            to="/news/detail"
                            state={{ item: mainItem }}
                            style={{ textDecoration: 'none' }}
                        >
                            <h2
                                style={{
                                    fontSize: '24px',
                                    fontWeight: 'bold',
                                    margin: '0 0 10px 0',
                                    color: '#b5272d', /* Red like sample */
                                    cursor: 'pointer',
                                    lineHeight: '1.3'
                                }}
                            >
                                {cleanTitle(mainItem.title)}
                            </h2>
                        </Link>
                        <p style={{ color: '#555', fontSize: '14px', lineHeight: '1.5' }}>
                            {cleanDesc(mainItem.description || '').substring(0, 150)}...
                        </p>
                    </div>
                </div>

                {/* Sub Articles List */}
                <div className="hero-sub">
                    <div style={{ borderBottom: '2px solid #b5272d', marginBottom: '15px' }}>
                        <span style={{ backgroundColor: '#b5272d', color: '#fff', padding: '4px 10px', fontSize: '13px', textTransform: 'uppercase', fontWeight: 'bold' }}>
                            Tin Nổi Bật
                        </span>
                    </div>

                    <div className="sub-list" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {subItems.map((item, idx) => (
                            <div key={idx} className="sub-item" style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                                <Link
                                    to="/news/detail"
                                    state={{ item: item }}
                                    className="sub-thumb"
                                    style={{ flex: '0 0 120px', cursor: 'pointer', display: 'block' }}
                                >
                                    <img
                                        src={getImage(item)}
                                        alt={item.title}
                                        style={{ width: '100%', borderRadius: '3px', aspectRatio: '4/3', objectFit: 'cover' }}
                                    />
                                </Link>
                                <div className="sub-info">
                                    <Link
                                        to="/news/detail"
                                        state={{ item: item }}
                                        style={{ textDecoration: 'none' }}
                                    >
                                        <h3
                                            style={{
                                                fontSize: '15px',
                                                fontWeight: 'bold',
                                                margin: '0',
                                                color: '#333',
                                                cursor: 'pointer',
                                                lineHeight: '1.4'
                                            }}
                                            className="hover-red"
                                        >
                                            {cleanTitle(item.title)}
                                        </h3>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
                .hero-grid-layout {
                    display: grid;
                    grid-template-columns: 1.8fr 1.2fr;
                    gap: 20px;
                }
                @media (max-width: 768px) {
                    .hero-grid-layout {
                        grid-template-columns: 1fr;
                    }
                }
                .hover-red:hover {
                    color: #b5272d !important;
                }
            `}</style>
        </div>
    );
};

export default HeroSection;
