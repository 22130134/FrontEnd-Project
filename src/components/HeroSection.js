import React from 'react';
import './css/HeroSection.css';

const HeroItem = ({ item, isMain, onClick }) => {
    if (!item) return null;

    let image = item.thumbnail || item.enclosure?.link;
    if (!image) {
        const imgMatch = item.description?.match(/src="([^"]+)"/);
        image = imgMatch ? imgMatch[1] : 'https://placehold.co/800x600?text=News';
    }

    const cleanDesc = item.description?.replace(/<[^>]+>/g, '').trim();

    return (
        <div className="hero-item" onClick={() => onClick(item)}>
            <div className="hero-image-wrapper">
                <img
                    src={image}
                    alt={item.title}
                    className="hero-img"
                />
                <div className={`hero-overlay ${isMain ? 'main' : ''}`}>
                    <h2 className={`hero-title ${isMain ? 'main' : ''}`}>
                        {item.title}
                    </h2>
                    {isMain && (
                        <p className="hero-desc">
                            {cleanDesc}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

const HeroSection = ({ items, onArticleClick }) => {
    if (!items || items.length === 0) return null;

    const mainItem = items[0];
    const subItems = items.slice(1, 3);

    return (
        <div className="container hero-container">
            <div className="hero-grid">
                {/* Main Hero */}
                <div className="hero-main-col">
                    <HeroItem item={mainItem} isMain={true} onClick={onArticleClick} />
                </div>

                {/* Sub Hero */}
                <div className="hero-sub-col">
                    {subItems.map((item, index) => (
                        <div key={index} style={{ flex: 1 }}>
                            <HeroItem item={item} isMain={false} onClick={onArticleClick} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HeroSection;
