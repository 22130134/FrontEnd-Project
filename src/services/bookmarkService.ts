import { NewsItem } from "./rssService";

const KEY = "fe_bookmarks_v1";

function safeParse(json: string | null, fallback: NewsItem[]): NewsItem[] {
    try {
        if (!json) return fallback;
        const v = JSON.parse(json);
        return Array.isArray(v) ? v : fallback;
    } catch {
        return fallback;
    }
}

// Custom event for reactive UI updates across components
function notifyChanged() {
    window.dispatchEvent(new Event("bookmarks:changed"));
}

export function getBookmarks(): NewsItem[] {
    return safeParse(localStorage.getItem(KEY), []);
}

export function isBookmarked(link?: string): boolean {
    if (!link) return false;
    return getBookmarks().some((x) => x.link === link);
}

export function toggleBookmark(item: NewsItem): { saved: boolean; bookmarks: NewsItem[] } {
    if (!item?.link) return { saved: false, bookmarks: getBookmarks() };

    const bookmarks = getBookmarks();
    const exists = bookmarks.some((x) => x.link === item.link);

    // Normalize to avoid storing massive objects if not needed, 
    // but here we just store the NewsItem fields we need.
    const normalized: NewsItem = {
        title: item.title,
        link: item.link,
        pubDate: item.pubDate,
        description: item.description,
        thumbnail: item.thumbnail,
        enclosure: item.enclosure,
        content: item.content, // Keep content if small enough? Maybe skip for bookmarks list optimization
        guid: item.guid // Keep guid if exists
    };

    const next = exists
        ? bookmarks.filter((x) => x.link !== item.link)
        : [normalized, ...bookmarks];

    localStorage.setItem(KEY, JSON.stringify(next));
    notifyChanged(); // Dispatch event
    return { saved: !exists, bookmarks: next };
}

export function removeBookmark(link: string): NewsItem[] {
    const next = getBookmarks().filter((x) => x.link !== link);
    localStorage.setItem(KEY, JSON.stringify(next));
    notifyChanged();
    return next;
}

export function clearBookmarks(): void {
    localStorage.removeItem(KEY);
    notifyChanged();
}
