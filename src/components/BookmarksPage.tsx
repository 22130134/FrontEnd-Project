import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StateView from "./StateView";
import NewsList from "./NewsList";
import { getBookmarks, removeBookmark, clearBookmarks } from "../services/bookmarkService";
import { NewsItem } from "../services/rssService";

export default function BookmarksPage() {
    const navigate = useNavigate();
    const [items, setItems] = useState<NewsItem[]>([]);

    useEffect(() => {
        const data = getBookmarks();
        setItems(data);
    }, []);

    const handleRemove = (link: string) => {
        const next = removeBookmark(link);
        setItems(next);
    };

    // ✅ Confirm trước khi xóa tất cả
    const handleClear = () => {
        const ok = window.confirm(
            "Bạn có chắc chắn muốn xóa TẤT CẢ bài viết đã lưu không?\nHành động này không thể hoàn tác."
        );
        if (!ok) return;

        clearBookmarks();
        setItems([]);
    };

    if (!items || items.length === 0) {
        return (
            <div className="container" style={{ padding: "40px 0", minHeight: "50vh" }}>
                <StateView
                    state="empty"
                    title="Chưa có bài viết đã lưu"
                    message="Bạn hãy bấm 📑/🔖 ở trang chi tiết để lưu bài."
                    retryText="Về trang chủ"
                    onRetry={() => navigate("/")}
                />
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: "24px 0", minHeight: "60vh" }}>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 12,
                }}
            >
                <h2 style={{ margin: 0 }}>Bài viết đã lưu</h2>

                <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => navigate("/")} style={{ padding: "8px 12px", cursor: "pointer" }}>
                        Trang chủ
                    </button>
                    <button onClick={handleClear} style={{ padding: "8px 12px", cursor: "pointer" }}>
                        Xóa tất cả
                    </button>
                </div>
            </div>

            <NewsList
                items={items}
                showRemove={true}
                onRemove={(it) => handleRemove(it.link)}
            />
        </div>
    );
}
