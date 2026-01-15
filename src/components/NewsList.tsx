import React from 'react';
import { Link } from 'react-router-dom';
import './css/NewsList.css';
import { NewsItem } from '../services/rssService';

interface NewsCardProps {
    item: NewsItem;
    // showRemove?: boolean; // REMOVED
    // onRemove?: (item: NewsItem) => void; // REMOVED
}

const NewsCard: React.FC<NewsCardProps> = ({ item }) => {
    // Attempt to parse image from description if RSS doesn't have it directly
    let image = item.thumbnail || item.enclosure?.link;
    if (!image) {
        const imgMatch = item.description?.match(/src="([^"]+)"/);
        image = imgMatch ? imgMatch[1] : 'https://placehold.co/600x400?text=News';
    }
    const cleanDesc = item.description?.replace(/<[^>]+>/g, '').trim();

    // handleRemoveClick REMOVED

    return (
        <Link
            to="/news/detail"
            state={{ item }}
            className="news-card"
            style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}
        >
            <div className="news-card-inner fade-in">
                <div className="news-card-img-wrapper">
                    <img
                        src={image}
                        alt={item.title}
                        className="news-card-img"
                    />
                </div>
                <div className="news-card-content">
                    <div className="news-card-title-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <h3 className="news-card-title" style={{ flex: 1 }}>
                            {item.title}
                        </h3>

                        {/* showRemove button REMOVED */}
                    </div>

                    <p className="news-card-desc">
                        {cleanDesc}
                    </p>
                    <div className="news-card-meta">
                        {new Date(item.pubDate).toLocaleDateString()}
                    </div>
                </div>
            </div>
        </Link>
    );
};

interface NewsListProps {
    items: NewsItem[];
    // Optional props for Bookmark functionality REMOVED
    // showRemove?: boolean;
    // onRemove?: (item: NewsItem) => void;
    // Fallback if Kiet's code passes onArticleClick (we ignore it for Link but keep interface compat if needed, simplified here)
}

const NewsList: React.FC<NewsListProps> = ({ items }) => {
    if (!items || items.length === 0) return null;

    return (
        <div className="news-list-container">
            {items.map((item, index) => (
                <NewsCard
                    key={index}
                    item={item}
                // showRemove={showRemove} // REMOVED
                // onRemove={onRemove} // REMOVED
                />
            ))}
        </div>
    );
};

export default NewsList;
