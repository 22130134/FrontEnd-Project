
import React from 'react';
import { Link } from 'react-router-dom';
import { NewsItem } from '../services/rssService';

interface TopNewsProps {
    items: NewsItem[];
}

const TopNews: React.FC<TopNewsProps> = ({ items }) => {
    if (!items || items.length === 0) return null;

    const featuredItem = items[0];
    const leftItems = items.slice(1, 6);

    const getImage = (item: NewsItem) => {
        let image = item.thumbnail || item.enclosure?.link;
        if (!image) {
            const imgMatch = item.description?.match(/src="([^"]+)"/);
            image = imgMatch ? imgMatch[1] : 'https://placehold.co/600x400?text=No+Image';
        }
        return image;
    };

    const cleanTitle = (t: string) => t?.replace(/<[^>]+>/g, '').trim();
    const cleanDesc = (t: string) => t?.replace(/<[^>]+>/g, '').trim();

    return (
        <div className="top-news">
            <div className="top-news_wrapper w1040">
                {/* LEFT: List of small news */}
                <div className="tn-left">
                    <ul className="list-box">
                        {leftItems.map((item, index) => (
                            <li key={index}>
                                <Link to="/news/detail" state={{ item }}>
                                    <span className="thumb">
                                        <img src={getImage(item)} alt={cleanTitle(item.title)} />
                                    </span>
                                    <span className="title">{cleanTitle(item.title)}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* CENTER: Featured News */}
                <div className="tn-newsest">
                    <Link to="/news/detail" state={{ item: featuredItem }} className="thumb">
                        <img src={getImage(featuredItem)} alt={cleanTitle(featuredItem.title)} />
                    </Link>
                    <Link to="/news/detail" state={{ item: featuredItem }} className="title">
                        {cleanTitle(featuredItem.title)}
                    </Link>
                    <p>{cleanDesc(featuredItem.description).substring(0, 150)}...</p>
                </div>

                {/* RIGHT: Ads */}
                <div className="tn-right">
                    <a href="#"><img src="https://cdnmedia.baotintuc.vn/Upload/QKrAM3u3JmfSk084HTqfEg/files/Quangcao/docbaogiay-TT.jpg" alt="Ad" style={{ marginBottom: '10px' }} /></a>
                    <a href="#"><img src="https://cdnmedia.baotintuc.vn/Upload/QKrAM3u3JmfSk084HTqfEg/files/Quangcao/docbaogiay-DTMN.jpg" alt="Ad" /></a>
                </div>
            </div>
        </div>
    );
};

export default TopNews;
