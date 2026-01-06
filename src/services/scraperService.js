// Simple in-memory cache to store fetched articles
const articleCache = new Map();

const PROXIES = [
    'https://api.allorigins.win/raw?url=',
    'https://corsproxy.io/?',
    'https://thingproxy.freeboard.io/fetch/'
];

export const fetchFullArticle = async (url) => {
    if (!url) throw new Error("Missing article url");

    // Check cache first
    if (articleCache.has(url)) {
        console.log("Serving article from cache:", url);
        return articleCache.get(url);
    }

    let lastError = null;

    for (const proxy of PROXIES) {
        try {
            const proxyUrl = `${proxy}${encodeURIComponent(url)}`;
            console.log(`Trying proxy: ${proxy}...`);

            const response = await fetch(proxyUrl);
            if (!response.ok) {
                console.warn(`Proxy ${proxy} failed with status: ${response.status}`);
                continue;
            }

            const html = await response.text();

            // Simple validation
            if (!html || html.trim().length < 50) {
                console.warn(`Proxy ${proxy} returned empty/invalid content`);
                continue;
            }

            // Save to cache
            articleCache.set(url, html);

            return html;
        } catch (e) {
            console.warn(`Proxy ${proxy} error:`, e);
            lastError = e;
        }
    }

    throw lastError || new Error("Failed to fetch article from all proxies");
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
            const REMOVE_SELECTORS = {
                related: [
                    '.relate-news', '.tin-lien-quan', '.box-tin-lien-quan', '.bv-lienquan',
                    '.related-container', '#plhMain_NewsDetail1_divRelation', '.box-link-news'
                ],
                ads: [
                    '.ads', '#inpage-ads', '.video-ads', 'div[id^="zone"]'
                ],
                social: [
                    '.social-box', '.box-social', '.sharing', '.tool-box',
                    '.simple-share', '.box-lz', '#plhMain_NewsDetail1_divSharelink'
                ],
                meta: [
                    '.tag', '.tag-box', '.keyword-news',
                    '.box-comment', // Keep author/source info
                    '.action-link', '.boxdata'
                ],
                layout: [
                    '.right-bar', '.content_bottom', '.content-bottom', '.bottom-content',
                    '.box-responsive', '.lc-bar'
                ],
                technical: [
                    'script', 'style', 'iframe'
                ],
                // Elements we render separately in NewsDetail, so remove from content to avoid duplication
                duplicates: [
                    '.detail-main-img-wrapper',
                    '.detail-title'
                    // Allow article-body/content to stay if it's the main wrapper
                ]
            };

            const unwantedSelectors = Object.values(REMOVE_SELECTORS).flat();

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
