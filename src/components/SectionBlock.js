import React from 'react';
import './css/SectionBlock.css';

const SectionBlock = ({ title, items, layout = 'grid', onArticleClick }) => {
    if (!items || items.length === 0) return null;

    // Helper to extract image
    const getItemImage = (item) => {
        let image = item.thumbnail || item.enclosure?.link;
        if (!image) {
            const imgMatch = item.description?.match(/src="([^"]+)"/);
            image = imgMatch ? imgMatch[1] : 'https://placehold.co/400x300?text=News';
        }
        return image;
    };

    const cleanDesc = (desc) => desc?.replace(/<[^>]+>/g, '').trim() || "";

    if (layout === 'hero') {
        // Focus Section: 1 Large Left, 2-3 Small Right
        const mainItem = items[0];
        const subItems = items.slice(1, 4);

        return (
            <section className="section-block focus-section">
                <div className="section-content focus-grid">
                    <div className="focus-main" onClick={() => onArticleClick(mainItem)}>
                        <div className="focus-img-wrapper">
                            <img src={getItemImage(mainItem)} alt={mainItem.title} />
                        </div>
                        <div className="focus-info">
                            <h2>{mainItem.title}</h2>
                            <p>{cleanDesc(mainItem.description)}</p>
                        </div>
                    </div>
                    <div className="focus-sub-list">
                        {subItems.map((item, idx) => (
                            <div key={idx} className="focus-sub-item" onClick={() => onArticleClick(item)}>
                                <h4>{item.title}</h4>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    // Default Grid Layout for Categories (e.g. World, Economy)
    const displayItems = items.slice(0, 4);

    return (
        <section className="section-block icon-header">
            <h3 className="section-heading">
                <span className="section-title-text">{title}</span>
            </h3>
            <div className="section-grid-4">
                {displayItems.map((item, idx) => (
                    <div key={idx} className="grid-item" onClick={() => onArticleClick(item)}>
                        <div className="grid-img-wrapper">
                            <img src={getItemImage(item)} alt={item.title} />
                        </div>
                        <h4 className="grid-title">{item.title}</h4>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default SectionBlock;
