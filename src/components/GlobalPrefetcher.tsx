import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { fetchFullArticle } from '../services/scraperService';
import { NewsItem } from '../services/rssService';

const GlobalPrefetcher = () => {
    const items = useSelector((state: RootState) => state.news.items);
    const processedRef = useRef<Set<string>>(new Set());

    useEffect(() => {
        if (!items || items.length === 0) return;

        // Use requestIdleCallback if available, otherwise setTimeout
        const schedule = (cb: () => void) => {
            if ('requestIdleCallback' in window) {
                // @ts-ignore
                window.requestIdleCallback(cb, { timeout: 2000 });
            } else {
                setTimeout(cb, 100);
            }
        };

        const fetchQueue = items.filter(item => {
            if (!item.link) return false;
            // Only fetch if we haven't processed this link in this session
            if (processedRef.current.has(item.link)) return false;
            return true;
        });

        if (fetchQueue.length === 0) return;

        // Mark as processed immediately to avoid double queueing
        fetchQueue.forEach(item => {
            if (item.link) processedRef.current.add(item.link);
        });

        // Background fetch one by one with delays to avoid network congestion
        const processNext = (queue: NewsItem[]) => {
            if (queue.length === 0) return;

            const [next, ...rest] = queue;

            schedule(async () => {
                if (next.link) {
                    try {
                        // console.log('Prefetching:', next.title);
                        await fetchFullArticle(next.link);
                    } catch (e) {
                        // ignore prefetch errors
                    }
                }
                processNext(rest);
            });
        };

        processNext(fetchQueue);

    }, [items]);

    return null; // Invisible component
};

export default GlobalPrefetcher;
