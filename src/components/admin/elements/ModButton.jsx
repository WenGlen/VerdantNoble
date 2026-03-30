import viewIcon from "../../../img/view.png";
import updateIcon from "../../../img/update.png";
import deleteIcon from "../../../img/delete.png";

export default function ModButton({
  type,
  mod,
  action,
  id,
  targetId,
  onCancel,
  onConfirmDelete,
  deleteing,
  label,
  loadingLabel,
}) {
  const typeText = {
    view: "查看",
    update: "修改",
    delete: "刪除",
    add: label || "新增產品",
    get: label || "重新取得產品列表",
  };

  const typeImage = {
    view: viewIcon,
    update: updateIcon,
    delete: deleteIcon,
  };

  function buttonContent() {
    if (type === "get" && mod === "get") {
      return loadingLabel || "列表更新中...";
    } else if (
      type === "get" &&
      (mod === "add" || mod === "update" || mod === "delete")
    ) {
      return "目前無法更新列表";
    } else if (type === "add" && mod === "add") {
      return loadingLabel || "新增中...";
    } else if (typeImage[type]) {
      return (
        <img
          src={typeImage[type]}
          alt={typeText[type]}
          className="w-4 h-4 align-middle"
        />
      );
    } else {
      return typeText[type];
    }
  }

  const isDisabled = mod !== "view";

  return (
    <div className="relative">
      <button
        type="button"
        className={
          type === "view" || type === "delete" || type === "update"
            ? "btn-icon"
            : "admin-btn-muted "
        }
        disabled={isDisabled}
        onClick={() => {
          if (mod === "view") action();
        }}
      >
        {buttonContent()}
      </button>

      {type === "delete" && mod === "delete" && id === targetId && (
        <div className="absolute top-0 left-1/2 z-50 -translate-x-1/2 w-[130px] h-8 flex justify-center items-center gap-2 bg-white">
          <button
            type="button"
            className="admin-btn-muted text-xs px-2 py-1"
            disabled={deleteing}
            onClick={onCancel}
          >
            返回
          </button>
          <button
            type="button"
            className="admin-btn-warning text-xs px-2 py-1"
            disabled={deleteing}
            onClick={() => onConfirmDelete(id)}
          >
            {deleteing ? "刪除中..." : "確認刪除"}
          </button>
        </div>
      )}
    </div>
  );
}
