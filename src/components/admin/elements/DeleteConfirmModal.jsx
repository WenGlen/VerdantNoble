export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "確認刪除",
  message = "確定要刪除此項目嗎？此操作無法復原。",
  confirmText = "確認刪除",
  cancelText = "取消",
  isLoading = false,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* modal */}
      <div className="relative rounded-lg bg-white p-6 shadow-xl max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold text-slate-800 mb-2">{title}</h3>
        <p className="text-sm text-slate-600 mb-6">{message}</p>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded px-3 py-1.5 bg-slate-200 text-slate-800 font-semibold hover:bg-sky-200 border-none cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="rounded px-3 py-1.5 bg-orange-700 text-white border-none cursor-pointer hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "刪除中..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
