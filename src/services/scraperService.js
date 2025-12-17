// Simple in-memory cache to store fetched articles
const articleCache = new Map();

export const fetchFullArticle = async (url) => {
    if (!url) throw new Error("Missing article url");

    // Check cache first
    if (articleCache.has(url)) {
        console.log("Serving article from cache:", url);
        return articleCache.get(url);
    }


        // Use allorigins.win (or similar) as a proxy to fetch raw HTML
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;

        const response = await fetch(proxyUrl);
        if (!response.ok) throw new Error('Network response was not ok');


    const html = await response.text();

    // Save to cache
    articleCache.set(url, html);

    return html;
};

export const parseArticleContent = (html) => {
    try {
        if (!html) return null;

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");


        // STRICT selection as requested: only look for main content containers
        const contentSelectors = [
            '.detail-content', // Primary for Baotintuc
            '.content',        // Requested specific class
            '#content',        // ID fallback
            '.contents'        // Variation
        ];

        let contentElement = null;
        for (const selector of contentSelectors) {
            contentElement = doc.querySelector(selector);
            if (contentElement) break;
        }

        if (contentElement) {
            // Even inside ".content", valid news sites inject Ads/Related News.
            // We must filter these out to get "Just the content".
            const unwantedSelectors = [
                '.relate-news', '.tin-lien-quan', '.box-tin-lien-quan', '.bv-lienquan', // Related news
                '.ads', '#inpage-ads', '.video-ads', 'div[id^="zone"]', // Ads
                'script', 'style', 'iframe', // Technical
                '.box-responsive', '.box-link-news', // Embeds
                '.social-box', '.box-social', '.sharing', '.tool-box', // Social
                '.tag', '.tag-box', '.keyword-news', // Tags
                '.box-comment', '.author-info', '.avatar-content', // Meta
                '.source', '.related-container', // Misc
                '.simple-share', '.box-lz', // More social/layout noise
                '.boxdata', // Specific user request
                '.right-bar', // Sidebar removal
                '.content_bottom', '.content-bottom', '.bottom-content', // Bottom content removal
                '#plhMain_NewsDetail1_divSharelink',
                '#plhMain_NewsDetail1_divRelation',
                '.action-link',
                '.detail-main-img-wrapper',
                '.article-body',
                '.lc-bar',
                '.detail-title'
            ];

            const unwanted = contentElement.querySelectorAll(unwantedSelectors.join(', '));
            unwanted.forEach(el => el.remove());

            // Text-based filtering for un-classed noise (e.g. "Từ khóa:", "Chia sẻ:")
            const textNodes = contentElement.querySelectorAll('p, div, h4, h5, li');
            textNodes.forEach(el => {
                const text = el.textContent.trim().toLowerCase();
                if (text.startsWith('chia sẻ:') || text.startsWith('từ khóa:')) {
                    el.remove();
                }
                // Remove headers that are just "Video" or "Ảnh" standing alone
                if (text === 'video' || text === 'ảnh') {
                    el.remove();
                }
            });

            // Clean up empty tags left behind
            const paragraphs = contentElement.querySelectorAll('p, div');
            paragraphs.forEach(p => {
                if (p.textContent.trim().length === 0 && p.querySelectorAll('img').length === 0) {
                    p.remove();
                }
            });

            // Standardize Images
            const images = contentElement.querySelectorAll('img');
            images.forEach(img => {
                const src = img.getAttribute('src');
                if (src && src.startsWith('/')) {
                    img.src = `https://baotintuc.vn${src}`;
                }

                img.removeAttribute('width');
                img.removeAttribute('height');
                img.removeAttribute('style'); // Clear inline styles

                img.style.maxWidth = '100%';
                img.style.height = 'auto';
                img.style.display = 'block';
                img.style.margin = '20px auto';
                img.style.borderRadius = '8px';
            });

            // Clear all inline styles from container to let our CSS wrap text properly
            const allElements = contentElement.querySelectorAll('*');
            allElements.forEach(el => {
                if (el.tagName !== 'IMG') { // Preserve our img styles above
                    el.removeAttribute('style');
                }
            });


            return contentElement.innerHTML;
        }

        return null;
    } catch (e) {
        console.error("Error parsing HTML:", e);
        return null;
    }
};
