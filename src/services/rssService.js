export const CATEGORIES = [
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

// URLs for specific homepage sections
export const HOME_SECTIONS = [
    { id: 'focus', title: 'Tiêu điểm', url: 'https://baotintuc.vn/tin-moi-nhat.rss' }, // Use latest as focus
    { id: 'thoi-su', title: 'Thời sự', url: 'https://baotintuc.vn/thoi-su.rss' },
    { id: 'the-gioi', title: 'Thế giới', url: 'https://baotintuc.vn/the-gioi.rss' },
    { id: 'kinh-te', title: 'Kinh tế', url: 'https://baotintuc.vn/kinh-te.rss' },
    { id: 'xa-hoi', title: 'Xã hội', url: 'https://baotintuc.vn/xa-hoi.rss' },
    { id: 'phap-luat', title: 'Pháp luật', url: 'https://baotintuc.vn/phap-luat.rss' }
];

export const fetchFeed = async (rssUrl) => {
    // Sử dụng rss2json để chuyển đổi RSS sang JSON
    const apiKey = 'https://api.rss2json.com/v1/api.json?rss_url=';
    const url = apiKey + encodeURIComponent(rssUrl);

    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.log("Lỗi khi lấy dữ liệu:", error);
        return { items: [] };
    }
};

export const fetchAllSections = async () => {
    // Fetch all home sections in parallel
    const promises = HOME_SECTIONS.map(async (section) => {
        try {
            const data = await fetchFeed(section.url);
            return {
                ...section,
                items: data.items || [],
                error: null
            };
        } catch (e) {
            console.error(`Failed to load section ${section.title}`, e);
            return {
                ...section,
                items: [],
                error: e.message
            };
        }
    });

    return Promise.all(promises);
};
