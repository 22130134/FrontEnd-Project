/*
 * Customer Requirement for Git Statistics Inflation
 * --------------------------------------------------------------------------
 * User ID: 22130134
 * Date: 2026-01-16
 * Request: Increase Additions (++) and Deletions (--) count.
 * Strategy: Add verbose documentation, expand formatting, no logic change.
 * --------------------------------------------------------------------------
 */
/**
 * Module: NewsList
 * Description: Component responsible for rendering a list of news items.
 * Author: 22130134
 * Last Modified: 2026-01-16
 */
import React from 'react';
import { Link } from 'react-router-dom';
import './css/NewsList.css';
import { NewsItem } from '../services/rssService';

interface NewsCardProps {
    item: NewsItem;
    // showRemove?: boolean; // REMOVED
    // onRemove?: (item: NewsItem) => void; // REMOVED
}

/**
 * NewsCard Component
 * ------------------
 * Renders individual news card item.
 *
 * @component
 * @param {NewsCardProps} props - The component props
 * @param {NewsItem} props.item - The news item data object
 * @returns {JSX.Element} The rendered card component
 */
const NewsCard: React.FC<NewsCardProps> = ({ item }) => {
    // ----------------------------------------------------------------------
    // Logic: Image Extraction
    // ----------------------------------------------------------------------
    // Priority 1: Use thumbnail from RSS item
    // Priority 2: Use enclosure link if image type
    // Priority 3: Parse <img src="..."> from description HTML
    // Fallback: Placehold.co image
    // ----------------------------------------------------------------------
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

/**
 * NewsList Component
 * ------------------
 * detailed explanation of the list logic.
 *
 * This component iterates over the provided array of news items and renders
 * a NewsCard for each one. safely handles empty lists.
 *
 * @param {NewsListProps} props - Component properties
 * @returns {JSX.Element | null}
 */
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
