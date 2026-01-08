const KEY = "fe_bookmarks_v1";

function safeParse(json, fallback) {
    try {
        const v = JSON.parse(json);
        return Array.isArray(v) ? v : fallback;
    } catch {
        return fallback;
    }
}
function notifyChanged() {
    window.dispatchEvent(new Event("bookmarks:changed"));
}

export function getBookmarks() {
    return safeParse(localStorage.getItem(KEY), []);
}


export function isBookmarked(link) {
    if (!link) return false;
    return getBookmarks().some((x) => x.link === link);
}

export function toggleBookmark(item) {
    if (!item?.link) return {saved: false, bookmarks: getBookmarks()};

    const bookmarks = getBookmarks();
    const exists = bookmarks.some((x) => x.link === item.link);

    const normalized = {
        title: item.title,
        link: item.link,
        pubDate: item.pubDate,
        description: item.description,
        thumbnail: item.thumbnail,
        enclosure: item.enclosure,
    };

    const next = exists
        ? bookmarks.filter((x) => x.link !== item.link)
        : [normalized, ...bookmarks];

    localStorage.setItem(KEY, JSON.stringify(next));
    return {saved: !exists, bookmarks: next};
}

export function removeBookmark(link) {
    const next = getBookmarks().filter((x) => x.link !== link);
    localStorage.setItem(KEY, JSON.stringify(next));
    return next;
}

export function clearBookmarks() {
    localStorage.removeItem(KEY);
}
