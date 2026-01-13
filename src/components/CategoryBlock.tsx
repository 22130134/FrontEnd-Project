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
        const isValidImage = (url: string) => /\.(jpg|jpeg|png|gif|webp)$/i.test(url);

        if (!image || !isValidImage(image)) {
            const pattern = /src=["']([^"']+)["']/;
            const match = item.description?.match(pattern) || item.content?.match(pattern);
            const potential = match ? match[1] : '';

            if (potential && isValidImage(potential)) {
                image = potential;
            } else if (potential && (potential.includes('youtube.com') || potential.includes('youtu.be'))) {
                const ytMatch = potential.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/);
                if (ytMatch) {
                    image = `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`;
                }
            }
        }

        return image || 'https://placehold.co/400x250/e0e0e0/999999?text=NO+IMAGE';
    };

    const cleanTitle = (t: string) => t?.replace(/<[^>]+>/g, '').trim();

    return (
        <div className="ccr-group">
            <div className="ccr_threadbar">
                <Link to={link || '#'} className="threadbar_topic" title={title}>
                    {title}
                </Link>
                {/* Optional: Add show-more-pc or sub-categories here if available */}
            </div>

            <div className="ccr-box">
                {/* Main Article */}
                <div className="box_news">
                    <Link to="/news/detail" state={{ item: mainItem }} className="news_img" title={cleanTitle(mainItem.title)}>
                        <img src={getImage(mainItem)} alt={cleanTitle(mainItem.title)} />
                    </Link>
                    <div className="news_info">
                        <Link to="/news/detail" state={{ item: mainItem }} className="news_title" title={cleanTitle(mainItem.title)}>
                            <h3>{cleanTitle(mainItem.title)}</h3>
                        </Link>
                        <p className="news_des">
                            {mainItem.description?.replace(/<[^>]+>/g, '').substring(0, 120)}...
                        </p>
                    </div>
                </div>

                {/* Sub Articles List */}
                <ul className="ccr-list">
                    {subItems.map((item, idx) => (
                        <li className="ccr-item" key={idx}>
                            <h4>
                                <Link to="/news/detail" state={{ item }} title={cleanTitle(item.title)}>
                                    {cleanTitle(item.title)}
                                </Link>
                            </h4>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default CategoryBlock;
