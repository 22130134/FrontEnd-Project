import React from 'react';
import { Link } from 'react-router-dom';
import { NewsItem } from '../services/rssService';

interface CategoryBlockProps {
    title: string;
    link: string;
    items: NewsItem[];
}

const CategoryBlock: React.FC<CategoryBlockProps> = ({ title, link, items }) => {
    if (!items || items.length === 0) return null;

    const mainItem = items[0];
    const subItems = items.slice(1, 4); // Take next 3 items

    // Helpers
    const getImage = (item: NewsItem) => {
        let image = item.thumbnail || item.enclosure?.link;
        if (!image) {
            const imgMatch = item.description?.match(/src="([^"]+)"/);
            image = imgMatch ? imgMatch[1] : 'https://placehold.co/400x300?text=No+Image';
        }
        return image;
    };
    const cleanTitle = (t: string) => t?.replace(/<[^>]+>/g, '').trim();

    return (
        <div className="category-block" style={{ marginBottom: '30px' }}>
            {/* Header with Red Border Left */}
            <div className="cat-header" style={{
                borderLeft: '5px solid #b5272d',
                paddingLeft: '10px',
                marginBottom: '15px',
                display: 'flex',
                alignItems: 'center'
            }}>
                <h3 style={{
                    margin: 0,
                    textTransform: 'uppercase',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: '#b5272d'
                }}>
                    <Link to={link || '#'} style={{ color: 'inherit', textDecoration: 'none' }}>
                        {title}
                    </Link>
                </h3>
            </div>

            <div className="cat-content" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {/* Main Article (Left) */}
                <div className="cat-main">
                    <Link
                        to="/news/detail"
                        state={{ item: mainItem }}
                        className="cat-thumb"
                        style={{ cursor: 'pointer', overflow: 'hidden', borderRadius: '4px', marginBottom: '10px', display: 'block' }}
                    >
                        <img
                            src={getImage(mainItem)}
                            alt={mainItem.title}
                            style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', display: 'block' }}
                        />
                    </Link>
                    <Link
                        to="/news/detail"
                        state={{ item: mainItem }}
                        style={{ textDecoration: 'none' }}
                    >
                        <h4
                            style={{
                                fontSize: '16px',
                                fontWeight: 'bold',
                                margin: '0 0 5px 0',
                                cursor: 'pointer',
                                lineHeight: '1.4',
                                color: '#000'
                            }}
                        >
                            {cleanTitle(mainItem.title)}
                        </h4>
                    </Link>
                    <p style={{ fontSize: '13px', color: '#666', lineHeight: '1.5', margin: 0 }}>
                        {mainItem.description?.replace(/<[^>]+>/g, '').substring(0, 100)}...
                    </p>
                </div>

                {/* Sub Articles (Right) */}
                <div className="cat-sub">
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {subItems.map((item, idx) => (
                            <li key={idx} style={{
                                marginBottom: '10px',
                                paddingBottom: '10px',
                                borderBottom: idx < subItems.length - 1 ? '1px dashed #eee' : 'none',
                                display: 'flex',
                                alignItems: 'flex-start'
                            }}>
                                <span style={{ color: '#b5272d', marginRight: '5px', fontSize: '10px' }}>●</span>
                                <Link
                                    to="/news/detail"
                                    state={{ item: item }}
                                    style={{
                                        fontSize: '14px',
                                        margin: 0,
                                        fontWeight: 'normal',
                                        cursor: 'pointer',
                                        lineHeight: '1.4',
                                        color: '#333',
                                        textDecoration: 'none'
                                    }}
                                    className="hover-red"
                                >
                                    {cleanTitle(item.title)}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <style>{`
                .hover-red:hover { color: #b5272d !important; }
                @media (max-width: 600px) {
                    .cat-content { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </div>
    );
};

export default CategoryBlock;
