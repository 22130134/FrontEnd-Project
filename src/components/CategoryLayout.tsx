import React, { useState } from 'react';
import { NewsItem } from '../services/rssService';

interface CategoryLayoutProps {
    title: string;
    items: NewsItem[];
}

const CategoryLayout: React.FC<CategoryLayoutProps> = ({ title, items }) => {
    const [isPlaying, setIsPlaying] = useState(false);

    // Helper to get image URL
    const getImage = (item: NewsItem) => {
        let imgSrc = '';
        if (item.enclosure && item.enclosure.link) {
            const ext = item.enclosure.link.split('.').pop()?.toLowerCase();
            if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) {
                imgSrc = item.enclosure.link;
            }
        }
        if (!imgSrc && item.thumbnail) imgSrc = item.thumbnail;
        if (!imgSrc) {
            const imgMatch = item.description?.match(/<img[^>]+src="([^">]+)"/);
            if (imgMatch) imgSrc = imgMatch[1];
        }

        // Fix for blocked video-api images using weserv.nl proxy
        if (imgSrc && imgSrc.includes('video-api.baotintuc.vn')) {
            return `https://images.weserv.nl/?url=${encodeURIComponent(imgSrc.replace('https://', ''))}`;
        }

        return imgSrc;
    };

    // Helper to check if item is video
    const isVideo = (item: NewsItem) => {
        const link = item.link || '';
        const encLink = item.enclosure?.link || '';
        const isVideoUrl = link.includes('/video/') || encLink.endsWith('.mp4');
        const imgSrc = getImage(item);
        const isVideoSource = imgSrc && (imgSrc.includes('video-api.baotintuc.vn') || imgSrc.includes('youtube.com'));
        return isVideoUrl || isVideoSource;
    };

    // Helper to get play-able video URL
    const getVideoUrl = (item: NewsItem) => {
        if (item.enclosure && item.enclosure.link && item.enclosure.link.endsWith('.mp4')) {
            return item.enclosure.link;
        }
        const imgSrc = getImage(item);

        // Only support YouTube or explicit MP4 enclosures for now.
        if (imgSrc && imgSrc.includes('img.youtube.com/vi/')) {
            const match = imgSrc.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/);
            if (match) return `https://www.youtube.com/embed/${match[1]}`;
        }
        return '';
    };

    // Clean description helper
    const cleanDescription = (html: string) => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || "";
    };

    const handlePlayClick = (e: React.MouseEvent) => {
        const videoUrl = getVideoUrl(featuredItem);
        if (videoUrl) {
            e.preventDefault();
            setIsPlaying(true);
        }
        // If no video URL (external source), let the link open normally
        // e.preventDefault() is NOT called, so <a> tag works.
    };

    if (!items || items.length === 0) return null;

    const featuredItem = items[0];
    const topItems = items.slice(1, 4);
    const mainItems = items.slice(4);

    return (
        <div className="category-layout">
            <div className="section-title">
                <h2>{title}</h2>
            </div>

            <div className="content-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '20px' }}>
                {/* Featured Column */}
                <div className="featured-col">
                    {featuredItem && (
                        <div className="featured-item" style={{ marginBottom: '30px' }}>
                            {isPlaying ? (
                                <div className="video-container" style={{ width: '100%', aspectRatio: '16/9', background: '#000' }}>
                                    {getVideoUrl(featuredItem).includes('youtube') ? (
                                        <iframe
                                            width="100%"
                                            height="100%"
                                            src={getVideoUrl(featuredItem) + '?autoplay=1'}
                                            title={featuredItem.title}
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        ></iframe>
                                    ) : (
                                        <video
                                            controls
                                            autoPlay
                                            style={{ width: '100%', height: '100%' }}
                                            src={getVideoUrl(featuredItem)}
                                            poster={getImage(featuredItem)}
                                        >
                                            Your browser does not support the video tag.
                                        </video>
                                    )}
                                </div>
                            ) : (
                                <a href={featuredItem.link} title={featuredItem.title} className="thumb" style={{ position: 'relative', display: 'block' }} onClick={(e) => isVideo(featuredItem) ? handlePlayClick(e) : null}>
                                    <img src={getImage(featuredItem)} alt={featuredItem.title} style={{ width: '100%', height: 'auto', display: 'block' }} onError={(e) => e.currentTarget.style.display = 'none'} />
                                    {isVideo(featuredItem) && (
                                        <div className="icon-play" style={{
                                            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                                            width: '60px', height: '60px', background: 'rgba(0,0,0,0.6)', borderRadius: '50%',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 2
                                        }}>
                                            <svg width="30" height="30" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z" /></svg>
                                        </div>
                                    )}
                                </a>
                            )}
                            <div className="item-info" style={{ marginTop: '15px' }}>
                                <a href={featuredItem.link} title={featuredItem.title} className="title" style={{ color: '#b90000', textDecoration: 'none' }}>
                                    <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>{featuredItem.title}</h2>
                                </a>
                                <p className="des" style={{ color: '#555', marginTop: '10px' }}>
                                    {cleanDescription(featuredItem.description).substring(0, 150)}...
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column (Top Items) */}
                <div className="sidebar-col">
                    <div className="top-list">
                        {topItems.map((item, index) => (
                            <div key={index} className="news-item small" style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                                <a href={item.link} className="thumb" style={{ width: '120px', flexShrink: 0, position: 'relative', display: 'block' }}>
                                    <img src={getImage(item)} alt={item.title} style={{ width: '100%', height: '80px', objectFit: 'cover' }} onError={(e) => e.currentTarget.style.display = 'none'} />
                                    {isVideo(item) && (
                                        <div className="icon-play" style={{
                                            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                                            width: '30px', height: '30px', background: 'rgba(0,0,0,0.6)', borderRadius: '50%',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}>
                                            <svg width="15" height="15" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z" /></svg>
                                        </div>
                                    )}
                                </a>
                                <div className="info">
                                    <a href={item.link} className="title" style={{ fontSize: '14px', fontWeight: 'bold', color: '#333', textDecoration: 'none' }}>
                                        {item.title}
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main List (Bottom) */}
            <div className="main-list" style={{ marginTop: '30px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
                <div className="list-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                    {mainItems.map((item, index) => (
                        <div key={index} className="news-item">
                            <a href={item.link} className="thumb" style={{ display: 'block', marginBottom: '10px', position: 'relative' }}>
                                <img src={getImage(item)} alt={item.title} style={{ width: '100%', height: '180px', objectFit: 'cover' }} onError={(e) => e.currentTarget.style.display = 'none'} />
                                {isVideo(item) && (
                                    <div className="icon-play" style={{
                                        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                                        width: '40px', height: '40px', background: 'rgba(0,0,0,0.6)', borderRadius: '50%',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z" /></svg>
                                    </div>
                                )}
                            </a>
                            <a href={item.link} className="title" style={{ fontSize: '16px', fontWeight: 'bold', color: '#333', textDecoration: 'none' }}>
                                {item.title}
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CategoryLayout;
