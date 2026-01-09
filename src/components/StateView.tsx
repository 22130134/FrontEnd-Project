// UI state handling for loading, empty and error cases
import React from "react";

interface StateViewProps {
    state: "loading" | "empty" | "error" | null;
    title?: string;
    message?: string;
    onRetry?: () => void;
    retryText?: string;
    linkHref?: string;
    linkText?: string;
    className?: string;
    // compact prop used in NewsDetail but not in original signature explicitly
    compact?: boolean;
}

export default function StateView({
    state,
    title,
    message,
    onRetry,
    retryText = "Thử lại",
    linkHref,
    linkText = "Mở bài gốc",
    className = "",
    compact = false
}: StateViewProps) {
    if (!state) return null;

    const isLoading = state === "loading";
    const isEmpty = state === "empty";
    const isError = state === "error";

    const defaultTitle = isLoading
        ? "Đang tải nội dung đầy đủ..."
        : isEmpty
            ? "Không có dữ liệu"
            : "Nguồn đang hạn chế truy cập bài viết đầy đủ";

    const defaultMessage = isLoading
        ? "Vui lòng chờ một chút."
        : isEmpty
            ? "Hiện chưa có nội dung để hiển thị."
            : "Đang hiển thị nội dung tóm tắt từ RSS.";

    const t = title ?? defaultTitle;
    const m = message ?? defaultMessage;

    return (
        <div
            className={`svlite ${className} ${compact ? 'compact' : ''}`}
            role={isError ? "alert" : "status"}
            aria-busy={isLoading ? "true" : "false"}
        >
            <div className="svlite__title">
                {isLoading ? <span className="svlite__spinner" aria-hidden="true" /> : null}
                <span>{t}</span>
            </div>

            {m ? <div className="svlite__message">{m}</div> : null}

            {(isError || isEmpty) && (onRetry || linkHref) ? (
                <div className="svlite__actions">
                    {typeof onRetry === "function" ? (
                        <button className="svlite__btn" onClick={onRetry} type="button">
                            {retryText}
                        </button>
                    ) : null}

                    {linkHref ? (
                        <a className="svlite__link" href={linkHref} target="_blank" rel="noreferrer">
                            {linkText}
                        </a>
                    ) : null}
                </div>
            ) : null}

            <style>{`
        .svlite{
          width: 100%;
          text-align: center;
          padding: 18px 10px;
          font-family: inherit;
<<<<<<< HEAD:src/components/StateView.tsx
        }
        .svlite.compact {
           padding: 10px 0;
           text-align: left;
=======
>>>>>>> kiet:src/components/StateView.jsx
        }

        .svlite__title{
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-size: 15px;
          font-weight: 700;
<<<<<<< HEAD:src/components/StateView.tsx
          color: #222;
=======
          color: #222; 
>>>>>>> kiet:src/components/StateView.jsx
        }

        .svlite__message{
          margin-top: 6px;
          font-size: 13.5px;
          color: #666;
          line-height: 1.5;
        }

        .svlite__actions{
          margin-top: 10px;
          display: inline-flex;
          gap: 14px;
          align-items: center;
          justify-content: center;
        }
        .svlite.compact .svlite__actions {
            justify-content: flex-start;
        }

        .svlite__btn{
          border: none;
          background: none;
          padding: 0;
          color: var(--brand-color, #b0003a);
          font-weight: 700;
          cursor: pointer;
        }
        .svlite__btn:hover{ text-decoration: underline; }

        .svlite__link{
          color: #444;
          text-decoration: none;
          font-weight: 600;
        }
        .svlite__link:hover{ text-decoration: underline; }

        .svlite__spinner{
          width: 14px;
          height: 14px;
          border-radius: 50%;
          border: 2px solid #d9d9d9;
          border-top-color: var(--brand-color, #b0003a);
          animation: svlite-spin 0.9s linear infinite;
        }

        @keyframes svlite-spin {
          to { transform: rotate(360deg); }
        }

        @media (prefers-reduced-motion: reduce){
          .svlite__spinner{ animation: none; }
        }
      `}</style>
        </div>
    );
}
