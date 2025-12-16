// Simple in-memory cache to store fetched articles
const articleCache = new Map();

// --- Constants ---

const CONTENT_SELECTORS = [
    '.detail-content', // Primary for Baotintuc
    '.content',        // Requested specific class
    '#content',        // ID fallback
    '.contents'        // Variation
];

const UNWANTED_SELECTORS = {
    RELATED_NEWS: [
        '.relate-news', '.tin-lien-quan', '.box-tin-lien-quan', '.bv-lienquan',
        '.related-container', '#plhMain_NewsDetail1_divRelation'
    ],
    ADS: [
        '.ads', '#inpage-ads', '.video-ads', 'div[id^="zone"]',
        '.box-responsive', '.box-link-news' // Often contain ads/embeds
    ],
    TECHNICAL: [
        'script', 'style', 'iframe'
    ],
    SOCIAL: [
        '.social-box', '.box-social', '.sharing', '.tool-box',
        '.simple-share', '#plhMain_NewsDetail1_divSharelink', '.box-lz'
    ],
    TAGS: [
        '.tag', '.tag-box', '.keyword-news'
    ],
    META: [
        '.box-comment', '.author-info', '.avatar-content',
        '.source', '.detail-title', '.detail-main-img-wrapper', '.article-body', '.lc-bar'
    ],
    LAYOUT: [
        '.right-bar',
        '.content_bottom', '.content-bottom', '.bottom-content',
        '.action-link', '.boxdata'
    ]
};

// Flatten all unwanted selectors into a single list for easy querySelectorAll
const ALL_UNWANTED_SELECTORS = Object.values(UNWANTED_SELECTORS).flat();

const TEXT_NOISE_PREFIXES = ['chia sẻ:', 'từ khóa:'];
const TEXT_NOISE_EXACT = ['video', 'ảnh'];

// --- Main Service Functions ---

export const fetchFullArticle = async (url) => {
    if (!url) throw new Error("Missing article url");

    // Check cache first
    if (articleCache.has(url)) {
        console.log("Serving article from cache:", url);
        return articleCache.get(url);
    }


        // Use local Vite proxy in development for the target domain
        const targetDomain = 'baotintuc.vn'; // Match domain part only
        let fetchUrl;

        // Check if URL contains the target domain (handles https://, http://, www., etc)
        if (import.meta.env.DEV && url.includes(targetDomain)) {
            // Extract path relative to domain
            const urlObj = new URL(url);
            const path = urlObj.pathname + urlObj.search;
            fetchUrl = `/api/baotintuc${path}`;
        } else {
            // Use allorigins.win as fallback for other domains or production
            fetchUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
        }

        const response = await fetch(fetchUrl);
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


        const contentElement = findContentElement(doc);

        if (contentElement) {
            // Processing Pipeline
            removeUnwantedElements(contentElement);
            cleanTextNoise(contentElement);
            cleanupEmptyTags(contentElement);
            standardizeImages(contentElement);
            removeAllInlineStyles(contentElement);


            return contentElement.innerHTML;
        }

        return null;
    } catch (e) {
        console.error("Error parsing HTML:", e);
        return null;
    }
};

// --- Helper Functions ---

const findContentElement = (doc) => {
    for (const selector of CONTENT_SELECTORS) {
        const element = doc.querySelector(selector);
        if (element) return element;
    }
    return null;
};

const removeUnwantedElements = (root) => {
    const unwanted = root.querySelectorAll(ALL_UNWANTED_SELECTORS.join(', '));
    unwanted.forEach(el => el.remove());
};

const cleanTextNoise = (root) => {
    // Text-based filtering for un-classed noise
    const textNodes = root.querySelectorAll('p, div, h4, h5, li');
    textNodes.forEach(el => {
        const text = el.textContent.trim().toLowerCase();

        const hasNoisePrefix = TEXT_NOISE_PREFIXES.some(prefix => text.startsWith(prefix));
        const isExactNoise = TEXT_NOISE_EXACT.includes(text);

        if (hasNoisePrefix || isExactNoise) {
            el.remove();
        }
    });
};

const cleanupEmptyTags = (root) => {
    // Clean up empty paragraphs/divs that don't contain images
    const paragraphs = root.querySelectorAll('p, div');
    paragraphs.forEach(p => {
        if (p.textContent.trim().length === 0 && p.querySelectorAll('img').length === 0) {
            p.remove();
        }
    });
};

const standardizeImages = (root) => {
    const images = root.querySelectorAll('img');
    images.forEach(img => {
        const src = img.getAttribute('src');
        if (src && src.startsWith('/')) {
            img.src = `https://baotintuc.vn${src}`;
        }

        // Clean attributes
        ['width', 'height', 'style'].forEach(attr => img.removeAttribute(attr));

        // Apply standard styling
        Object.assign(img.style, {
            maxWidth: '100%',
            height: 'auto',
            display: 'block',
            margin: '20px auto',
            borderRadius: '8px'
        });
    });
};

const removeAllInlineStyles = (root) => {
    // Clear all inline styles from container to let our CSS wrap text properly
    // Exception: Don't remove styles from IMGs we just styled
    const allElements = root.querySelectorAll('*');
    allElements.forEach(el => {
        if (el.tagName !== 'IMG') {
            el.removeAttribute('style');
        }
    });
};
