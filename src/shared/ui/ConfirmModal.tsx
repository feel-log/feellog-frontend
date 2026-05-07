interface ConfirmModalProps {
  type?: string
  isOpen: boolean;
  title: string;
  secondary?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  noCancel?: boolean;
  onConfirm: () => void;
  onCancel?: () => void;
  isDangerous?: boolean;
}

export default function ConfirmModal({
  type,
  isOpen,
  title,
  secondary,
  message,
  confirmText = '확인',
  cancelText = '취소',
  noCancel = false,
  onConfirm,
  onCancel,
  isDangerous = false,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <>
      <div className="animate-fade-in fixed inset-0 right-0 left-0 z-50 mx-auto max-w-md bg-black opacity-50" />
      {type === 'loginCheck' || type === 'logoutCheck' ? (
        <div
          className={
            'box__container__2 fixed top-1/2 right-0 left-0 z-60 mx-auto h-auto w-70.75 -translate-y-1/2 rounded-[10px] bg-white px-5.25 pt-12.25 pb-5'
          }
        >
          <span className={'mb-1 block text-center text-[14px] font-bold'}>{title}</span>
          <span className={'text-ray-600 mb-8 block text-center text-[14px]'}>{secondary}</span>
          <div className={'button__wrapper flex flex-col gap-2'}>
            <button className={'rounded-[8px] bg-[#13278a] py-2 text-[14px] text-white'} onClick={onConfirm}>
              {confirmText}
            </button>
            <button className={'text-[14px] py-2 text-black rounded-[8px]'} onClick={onCancel}>
              {cancelText}
            </button>
          </div>
        </div>
      ) : (
        <div className="box__container fixed top-1/2 right-0 left-0 z-60 mx-auto h-auto w-70 -translate-y-1/2 rounded-[10px] bg-white px-6 pt-8 pb-5">
          <span className="block text-center text-[16px] font-bold text-[#030303]">
            {title.includes('|')
              ? title.split('|').map((item) => (
                  <span key={item} className={'block text-center'}>
                    {item}
                  </span>
                ))
              : title}
          </span>
          {message && (
            <p className="mt-2.5 block text-center text-[14px] text-[#73787e]">{message}</p>
          )}
          <div className="mt-8 flex gap-2.5">
            {!noCancel && (
              <button
                className="flex-1 rounded-[8px] bg-[#e5e5e5] py-2.5 text-[14px] font-medium text-[#474c52] transition-colors hover:bg-[#d9d9d9]"
                onClick={onCancel}
              >
                {cancelText}
              </button>
            )}
            <button
              className={`flex-1 rounded-[8px] py-2.5 text-[14px] font-medium text-white transition-colors ${
                isDangerous ? 'bg-[#eb1c1c] hover:bg-[#d41a1a]' : 'bg-[#13278a] hover:bg-[#0f1f66]'
              }`}
              onClick={onConfirm}
            >
              {confirmText}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
