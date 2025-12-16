import React from 'react';
import './css/NewsList.css';

const NewsCard = ({ item, onClick }) => {
    // Attempt to parse image from description if RSS doesn't have it directly
    let image = item.thumbnail || item.enclosure?.link;
    if (!image) {
        const imgMatch = item.description?.match(/src="([^"]+)"/);
        image = imgMatch ? imgMatch[1] : 'https://placehold.co/600x400?text=News';
    }

    const cleanDesc = item.description?.replace(/<[^>]+>/g, '').substring(0, 150) + '...';

    return (
        <div onClick={() => onClick(item)} className="news-card">
            <div className="news-card-inner fade-in">
                <div className="news-card-img-wrapper">
                    <img
                        src={image}
                        alt={item.title}
                        className="news-card-img"
                    />
                </div>
                <div className="news-card-content">
                    <h3 className="news-card-title">
                        {item.title}
                    </h3>
                    <p className="news-card-desc">
                        {cleanDesc}
                    </p>
                    <div className="news-card-meta">
                        {new Date(item.pubDate).toLocaleDateString()}
                    </div>
                </div>
            </div>
        </div>
    );
};

const NewsList = ({ items, onArticleClick }) => {
    if (!items || items.length === 0) return null;

    return (
        <div className="news-list-container">
            {items.map((item, index) => (
                <NewsCard key={index} item={item} onClick={onArticleClick} />
            ))}
        </div>
    );
};

export default NewsList;
