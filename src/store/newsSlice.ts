import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchFeed, NewsItem } from '../services/rssService';

interface NewsState {
    items: NewsItem[];
    loading: boolean;
    error: string | null;
    currentCategory: string | null;
}

const initialState: NewsState = {
    items: [],
    loading: false,
    error: null,
    currentCategory: null,
};

// Async Thunk for fetching news
// Following Unidirectional Data Flow: UI -> Dispatch Action -> Thunk -> API -> Reducer -> Store -> UI
export const fetchNewsByCategory = createAsyncThunk(
    'news/fetchByCategory',
    async ({ url, categoryId }: { url: string; categoryId: string }) => {
        const data = await fetchFeed(url);
        return { items: data.items || [], categoryId };
    }
);

const newsSlice = createSlice({
    name: 'news',
    initialState,
    reducers: {
        clearNews: (state) => {
            state.items = [];
            state.loading = false;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNewsByCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchNewsByCategory.fulfilled, (state, action: PayloadAction<{ items: NewsItem[], categoryId: string }>) => {
                state.loading = false;
                // Immutability is handled by Immer inside Redux Toolkit
                state.items = action.payload.items;
                state.currentCategory = action.payload.categoryId;
            })
            .addCase(fetchNewsByCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch news';
            });
    },
});

export const { clearNews } = newsSlice.actions;
export default newsSlice.reducer;
