export const CATEGORIES = [
  { name: 'Trang chủ', url: 'https://baotintuc.vn/tin-moi-nhat.rss', id: 'home' },
  { name: 'Thời sự', url: 'https://baotintuc.vn/thoi-su.rss', id: 'thoi-su' },
  { name: 'Thế giới', url: 'https://baotintuc.vn/the-gioi.rss', id: 'the-gioi' },
  { name: 'Kinh tế', url: 'https://baotintuc.vn/kinh-te.rss', id: 'kinh-te' },
  { name: 'Xã hội', url: 'https://baotintuc.vn/xa-hoi.rss', id: 'xa-hoi' },
  { name: 'Pháp luật', url: 'https://baotintuc.vn/phap-luat.rss', id: 'phap-luat' },
  { name: 'Văn hóa', url: 'https://baotintuc.vn/van-hoa.rss', id: 'van-hoa' },
  { name: 'Giáo dục', url: 'https://baotintuc.vn/giao-duc.rss', id: 'giao-duc' },
  { name: 'Thể thao', url: 'https://baotintuc.vn/the-thao.rss', id: 'the-thao' },
  { name: 'Giải trí', url: 'https://baotintuc.vn/giai-tri.rss', id: 'giai-tri' },
];

export const fetchFeed = async (rssUrl) => {
  try {
    const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`);
    const data = await response.json();
    if (data.status === 'ok') {
      return data;
    } else {
      throw new Error('Failed to fetch feed');
    }
  } catch (error) {
    console.error('Error fetching RSS feed:', error);
    return null;
  }
};
