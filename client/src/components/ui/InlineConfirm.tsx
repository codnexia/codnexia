interface InlineConfirmProps {
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export function InlineConfirm({ message, onCancel, onConfirm }: InlineConfirmProps) {
  return (
    <div className="px-5 py-3 bg-error/5 border-b border-error/15 flex items-center justify-between">
      <span className="text-xs text-error">{message}</span>
      <div className="flex gap-2">
        <button
          onClick={onCancel}
          className="py-1.25 px-3 rounded-md bg-surface border border-border text-muted text-[11px] cursor-pointer font-sans"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="py-1.25 px-3 rounded-md bg-error/15 border border-error/30 text-error text-[11px] font-semibold cursor-pointer font-sans"
        >
          Confirm
        </button>
      </div>
    </div>
  );
}
