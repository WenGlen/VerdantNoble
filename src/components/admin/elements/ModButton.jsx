import viewIcon from '../../../img/view.png';
import updateIcon from '../../../img/update.png';
import deleteIcon from '../../../img/delete.png';

export default function ModButton({
    type,
    mod,
    action,
    id,
    targetId,
    onCancel,
    onConfirmDelete,
    deleteing
}) {
    const typeText = {
        view: "查看",
        update: "修改",
        delete: "刪除",
        add: "新增產品",
        get: "重新取得產品列表",
    };

    const typeImage = {
        view: viewIcon,
        update: updateIcon,
        delete: deleteIcon,
    };

    function buttonContent() {
        if (type === "get" && mod === "get") {
            return "產品列表更新時中...";
        } else if (type === "get" && (mod === "add" || mod === "update" || mod === "delete")) {
            return "目前無法更新產品列表";
        } else if (type === "add" && mod === "add") {
            return "新增產品中...";
        } else if (typeImage[type]) {
            return <img src={typeImage[type]} alt={typeText[type]} className="w-4 h-4 align-middle" />;
        } else {
            return typeText[type];
        }
    }

    const isDisabled = mod !== "view";
    const btnLight = "mx-1 rounded px-2 py-1 font-semibold cursor-pointer bg-slate-200 text-slate-800 border-none hover:bg-sky-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:font-normal disabled:hover:bg-slate-200";
    const btnPrimary = "rounded px-2 py-1 cursor-pointer bg-sky-700 text-slate-100 border-none hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed";
    const btnWarning = "rounded px-2 py-1 cursor-pointer bg-orange-700 text-white border-none hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed";

    return (
        <div className="relative">
            <button
                type="button"
                className={`${btnLight} ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={() => { if (mod === "view") action(); }}
            >
                {buttonContent()}
            </button>

            {type === "delete" && mod === "delete" && id === targetId && (
                <div className="absolute top-0 left-5 z-50 -translate-x-1/2 w-[120px] h-8 flex justify-center items-center gap-2 bg-white">
                    <button
                        type="button"
                        className={`${btnPrimary} ${deleteing ? "opacity-50 cursor-not-allowed" : ""}`}
                        onClick={onCancel}
                    >
                        返回
                    </button>
                    <button
                        type="button"
                        className={`${btnWarning} ${deleteing ? "opacity-50 cursor-not-allowed" : ""}`}
                        onClick={() => onConfirmDelete(id)}
                    >
                        {deleteing ? "刪除中..." : "確認刪除"}
                    </button>
                </div>
            )}
        </div>
    );
}
