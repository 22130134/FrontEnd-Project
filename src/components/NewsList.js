import React from 'react';
import './css/NewsList.css';

const NewsCard = ({ item, onClick, showRemove = false, onRemove }) => {
    // Attempt to parse image from description if RSS doesn't have it directly
    let image = item.thumbnail || item.enclosure?.link;
    if (!image) {
        const imgMatch = item.description?.match(/src="([^"]+)"/);
        image = imgMatch ? imgMatch[1] : 'https://placehold.co/600x400?text=News';
    }
    const cleanDesc = item.description?.replace(/<[^>]+>/g, '').trim();

    const handleRemoveClick = (e) => {
        e.stopPropagation();
        if (onRemove) onRemove(item);
    };

    return (
        <div onClick={() => onClick(item)} className="news-card" role="button" tabIndex={0}>
            <div className="news-card-inner fade-in">
                <div className="news-card-img-wrapper">
                    <img
                        src={image}
                        alt={item.title}
                        className="news-card-img"
                    />
                </div>

                <div className="news-card-content">
                    <div className="news-card-title-row">
                        <h3 className="news-card-title">
                            {item.title}
                        </h3>

                        {showRemove && (
                            <button
                                type="button"
                                className="bookmark-remove-btn"
                                onClick={handleRemoveClick}
                                title="Bỏ lưu bài viết"
                                aria-label="Bỏ lưu bài viết"
                            >
                                🗑
                            </button>
                        )}
                    </div>

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

const NewsList = ({ items, onArticleClick, showRemove = false, onRemove }) => {
    if (!items || items.length === 0) return null;

    return (
        <div className="news-list-container">
            {items.map((item, index) => (
                <NewsCard
                    key={item.link || index}
                    item={item}
                    onClick={onArticleClick}
                    showRemove={showRemove}
                    onRemove={onRemove}
                />
            ))}
        </div>
    );
};

export default NewsList;
