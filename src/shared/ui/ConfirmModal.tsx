interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDangerous?: boolean;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = '확인',
  cancelText = '취소',
  onConfirm,
  onCancel,
  isDangerous = false,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed left-0 right-0 max-w-md mx-auto inset-0 z-50 bg-black opacity-50 animate-fade-in" />
      <div className="box__container w-70 h-auto rounded-[10px] bg-white pt-8 pb-5 px-6 fixed z-60 left-0 right-0 top-1/2 -translate-y-1/2 mx-auto">
        <span className="block text-center font-bold text-[16px] text-[#030303]">
          {title}
        </span>
        {message && (
          <p className="block text-center text-[14px] text-[#73787e] mt-2.5">
            {message}
          </p>
        )}
        <div className="flex gap-2.5 mt-8">
          <button
            className="flex-1 text-[14px] bg-[#e5e5e5] py-2.5 rounded-[8px] text-[#474c52] font-medium transition-colors hover:bg-[#d9d9d9]"
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button
            className={`flex-1 text-[14px] py-2.5 rounded-[8px] text-white font-medium transition-colors ${
              isDangerous
                ? 'bg-[#eb1c1c] hover:bg-[#d41a1a]'
                : 'bg-[#13278a] hover:bg-[#0f1f66]'
            }`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </>
  );
}
