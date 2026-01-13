export interface NewsItem {
    title: string;
    link: string;
    guid?: string;
    pubDate: string;
    description: string;
    content?: string;
    enclosure?: { link: string };
    thumbnail?: string;
    author?: string;
}

export interface Category {
    name: string;
    url: string;
    id: string;
}

export const CATEGORIES: Category[] = [
    { name: "Trang chủ", url: "https://baotintuc.vn/tin-moi-nhat.rss", id: "home" },
    { name: "Thời sự", url: "https://baotintuc.vn/thoi-su.rss", id: "thoi-su" },
    { name: "Thế giới", url: "https://baotintuc.vn/the-gioi.rss", id: "the-gioi" },
    { name: "Kinh tế", url: "https://baotintuc.vn/kinh-te.rss", id: "kinh-te" },
    { name: "Xã hội", url: "https://baotintuc.vn/xa-hoi.rss", id: "xa-hoi" },
    { name: "Pháp luật", url: "https://baotintuc.vn/phap-luat.rss", id: "phap-luat" },
    { name: "Văn hóa", url: "https://baotintuc.vn/van-hoa.rss", id: "van-hoa" },
    { name: "Giáo dục", url: "https://baotintuc.vn/giao-duc.rss", id: "giao-duc" },
    { name: "Thể thao", url: "https://baotintuc.vn/the-thao.rss", id: "the-thao" }
];

export interface HomeSection {
    id: string;
    title: string;
    url: string;
}

export const HOME_SECTIONS: HomeSection[] = [
    { id: 'focus', title: 'Tiêu điểm', url: 'https://baotintuc.vn/tin-moi-nhat.rss' },
    { id: 'thoi-su', title: 'Thời sự', url: 'https://baotintuc.vn/thoi-su.rss' },
    { id: 'the-gioi', title: 'Thế giới', url: 'https://baotintuc.vn/the-gioi.rss' },
    { id: 'kinh-te', title: 'Kinh tế', url: 'https://baotintuc.vn/kinh-te.rss' },
    { id: 'xa-hoi', title: 'Xã hội', url: 'https://baotintuc.vn/xa-hoi.rss' },
    { id: 'phap-luat', title: 'Pháp luật', url: 'https://baotintuc.vn/phap-luat.rss' },
    { id: 'van-hoa', title: 'Văn hóa', url: 'https://baotintuc.vn/van-hoa.rss' },
    { id: 'giao-duc', title: 'Giáo dục', url: 'https://baotintuc.vn/giao-duc.rss' },
    { id: 'the-thao', title: 'Thể thao', url: 'https://baotintuc.vn/the-thao.rss' },
    { id: 'y-te', title: 'Y tế', url: 'https://baotintuc.vn/y-te.rss' },
    { id: 'quan-su', title: 'Quân sự', url: 'https://baotintuc.vn/quan-su.rss' },
    { id: 'khoa-hoc', title: 'Khoa học', url: 'https://baotintuc.vn/khoa-hoc-cong-nghe.rss' }
];

// Special Sections for Multimedia strip
export const MULTIMEDIA_SECTIONS: HomeSection[] = [
    { id: 'tin-tuc-tv', title: 'TIN TỨC TV', url: '#' },
    { id: 'video', title: 'VIDEO', url: 'https://baotintuc.vn/video.rss' },
    { id: 'anh', title: 'ẢNH', url: 'https://baotintuc.vn/anh.rss' },
    { id: 'infographic', title: 'INFOGRAPHIC', url: 'https://baotintuc.vn/infographics.rss' },
    { id: 'megastory', title: 'MEGASTORY', url: '#' },
    { id: 'anh-360', title: 'ẢNH 360', url: '#' },
    { id: 'talk-show', title: 'TALK SHOW', url: '#' },
    { id: 'podcast', title: 'PODCAST', url: '#' },
];

interface RSSSectionResult extends HomeSection {
    items: NewsItem[];
    error: string | null;
}

export const fetchFeed = async (rssUrl: string): Promise<{ items: NewsItem[] }> => {
    // Sử dụng rss2json để chuyển đổi RSS sang JSON
    const apiKey = 'https://api.rss2json.com/v1/api.json?rss_url=';
    const url = apiKey + encodeURIComponent(rssUrl);

    try {
        const response = await fetch(url);
        const data = await response.json();
        return data as { items: NewsItem[] };
    } catch (error) {
        console.log("Lỗi khi lấy dữ liệu:", error);
        return { items: [] };
    }
};

export const fetchSections = async (sections: HomeSection[]): Promise<RSSSectionResult[]> => {
    const promises = sections.map(async (section) => {
        try {
            // Handle placeholder URLs
            if (section.url === '#') {
                return { ...section, items: [], error: null };
            }
            const data = await fetchFeed(section.url);
            return {
                ...section,
                items: data.items || [],
                error: null
            };
        } catch (e: any) {
            console.error(`Failed to load section ${section.title}`, e);
            return {
                ...section,
                items: [],
                error: e.message || 'Unknown error'
            };
        }
    });
    return Promise.all(promises);
};

export const fetchAllSections = async (): Promise<RSSSectionResult[]> => {
    return fetchSections(HOME_SECTIONS);
};
