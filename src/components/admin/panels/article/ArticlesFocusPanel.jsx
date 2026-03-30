export default function ArticlesFocusPanel({
  focus,
  setFocus,
  editArticle,
  setMod,
}) {
  function formatTimestamp(ts) {
    if (!ts) return "—";
    const date = new Date(ts * 1000);
    return date.toLocaleDateString("zh-TW", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  }

  function getContentBlocks() {
    if (!focus.content) return [];
    try {
      const parsed = JSON.parse(focus.content);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  const blockTypeLabel = {
    heading: "🔤",
    text: "📄",
    emphasis: "💬",
    image: "🖼",
  };

  function renderBlockPreview(blocks) {
    if (blocks.length === 0) {
      return <p className="text-xs text-admin-text-muted italic">無內文區塊</p>;
    }
    return blocks.map((block, i) => {
      if (block.type === "heading") {
        return (
          <p key={i} className="text-xs font-semibold text-admin-text">
            {blockTypeLabel.heading} {block.value}
          </p>
        );
      }
      if (block.type === "text") {
        return (
          <p key={i} className="text-xs text-admin-text whitespace-pre-wrap">
            {blockTypeLabel.text} {block.value}
          </p>
        );
      }
      if (block.type === "emphasis") {
        return (
          <p
            key={i}
            className="text-xs italic text-admin-primary whitespace-pre-wrap"
          >
            {blockTypeLabel.emphasis} 「{block.value}」
          </p>
        );
      }
      if (block.type === "image") {
        return (
          <div key={i} className="flex flex-col gap-1">
            <p className="text-xs text-admin-text-muted">
              {blockTypeLabel.image} 圖片
              {block.caption ? `：${block.caption}` : ""}
            </p>
            {block.url && (
              <div className="w-full h-[70px] bg-slate-100 overflow-hidden rounded">
                <img
                  src={block.url}
                  alt={block.caption?.trim() ? block.caption : "文章內文圖片"}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        );
      }
      return null;
    });
  }

  const contentBlocks = getContentBlocks();

  return (
    <div className="h-full flex justify-center items-center">
      {!focus.id ? (
        <div className="h-fit xl:h-screen w-[400px] flex-col-center gap-2 overflow-x-auto p-4 bg-admin-card-focus tablet:rounded-md">
          <p className="text-center text-sm text-slate-600">
            點擊「操作」按鈕，可查看或編輯文章詳細資訊
            <br />
            點擊「新增文章」按鈕，可新增文章
          </p>
        </div>
      ) : (
        <div className="h-fit xl:h-screen w-[600px] xl:w-[400px] flex-col-between gap-2 p-4 overflow-x-auto bg-admin-card-focus tablet:rounded-md">
          {/* 固定資訊區（不滾動） */}
          <div className="w-full flex flex-col gap-3 py-2 shrink-0">
            {/* 封面圖片 */}
            {focus.image && (
              <div className="w-full h-[120px] bg-slate-200 overflow-hidden rounded">
                <img
                  src={focus.image}
                  alt={focus.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* 狀態列 */}
            <div className="flex items-center gap-2 text-xs">
              <span
                className={`px-2 py-0.5 rounded font-semibold ${focus.isPublic ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}
              >
                {focus.isPublic ? "公開" : "未公開"}
              </span>
              <span className="text-admin-text-muted">
                {formatTimestamp(focus.create_at)}
              </span>
              <span className="text-admin-text-muted">
                作者：{focus.author}
              </span>
            </div>

            {/* 標題 & 摘要 */}
            <div className="space-y-1">
              <h3 className="text-admin-text text-base font-semibold">
                {focus.title}
              </h3>
              <p className="text-xs text-admin-text-muted">
                {focus.description}
              </p>
            </div>

            {/* 標籤 */}
            {Array.isArray(focus.tag) && focus.tag.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {focus.tag.map((t, i) => (
                  <span
                    key={i}
                    className="text-xs px-1.5 py-0.5 rounded bg-admin-card-50 text-admin-text"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 內文 Block 預覽（桌機版在此滾動，手機版隨面板展開） */}
          <div className="flex-1 overflow-y-auto flex flex-col p-2 rounded shadow-inner bg-admin-card-50 gap-1.5 min-h-[80px] xl:min-h-0">
            {renderBlockPreview(contentBlocks)}
          </div>

          <div className="flex justify-between pt-2 shrink-0">
            <button
              type="button"
              className="admin-btn-muted"
              onClick={() => {
                setMod("update");
                editArticle(focus);
              }}
            >
              編輯
            </button>
            <button
              type="button"
              className="admin-btn-primary"
              onClick={() => setFocus({})}
            >
              關閉
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
