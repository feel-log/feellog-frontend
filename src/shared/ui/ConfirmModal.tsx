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
}: ConfirmModalProps) {
  const visibilityClass = isOpen
    ? 'opacity-100 pointer-events-auto'
    : 'opacity-0 pointer-events-none';

  return (
    <>
      <div
        className={`fixed inset-0 right-0 left-0 z-50 mx-auto max-w-md bg-black transition-opacity duration-200 ${
          isOpen ? 'opacity-30 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"
      />
      {type === 'deleteCheck' ? (
        <div
          className={`fixed top-1/2 right-0 left-0 z-60 mx-auto flex h-[222px] w-[283px] -translate-y-1/2 flex-col items-center rounded-[10px] bg-white px-[21px] pt-[49px] pb-5 transition-opacity duration-200 ${visibilityClass}`}
        >
          <div className="flex flex-col items-center gap-[5px]">
            <span className="text-center text-[16px] font-semibold leading-normal tracking-[-0.025em] text-black">
              {title}
            </span>
            {(secondary ?? message) && (
              <span className="text-center text-[14px] font-medium leading-normal tracking-[-0.025em] text-[#474C52]">
                {secondary ?? message}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onConfirm}
            className="mt-8 flex h-10 w-[241px] cursor-pointer items-center justify-center rounded-[8px] bg-[#13278A] text-[16px] font-medium leading-normal tracking-[-0.025em] text-white"
          >
            {confirmText}
          </button>
          {!noCancel && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="mt-[7px] cursor-pointer text-[16px] font-medium leading-normal tracking-[-0.025em] text-[#73787E]"
            >
              {cancelText}
            </button>
          )}
        </div>
      ) : type === 'logoutCheck' ? (
        <div
          className={`fixed top-1/2 right-0 left-0 z-60 mx-auto flex h-[202px] w-[283px] -translate-y-1/2 flex-col items-center rounded-[10px] bg-white px-[21px] pt-[44px] pb-5 transition-opacity duration-200 ${visibilityClass}`}
        >
          <span className="text-center text-[16px] font-semibold leading-normal tracking-[-0.025em] text-black">
            {title}
          </span>
          <button
            type="button"
            onClick={onConfirm}
            className="mt-[43px] flex h-10 w-[241px] cursor-pointer items-center justify-center rounded-[8px] bg-[#13278A] text-[16px] font-medium leading-normal tracking-[-0.025em] text-white"
          >
            {confirmText}
          </button>
          {!noCancel && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="mt-[7px] cursor-pointer text-[16px] font-medium leading-normal tracking-[-0.025em] text-[#73787E]"
            >
              {cancelText}
            </button>
          )}
        </div>
      ) : type === 'loginCheck' ? (
        <div
          className={`fixed top-1/2 right-0 left-0 z-60 mx-auto flex h-[222px] w-[283px] -translate-y-1/2 flex-col items-center rounded-[10px] bg-white px-[21px] pt-[49px] pb-5 transition-opacity duration-200 ${visibilityClass}`}
        >
          <div className="flex flex-col items-center gap-[5px]">
            <span className="text-center text-[16px] font-semibold leading-normal tracking-[-0.025em] text-black">
              {title}
            </span>
            {(secondary ?? message) && (
              <span className="text-center text-[14px] font-medium leading-normal tracking-[-0.025em] text-[#474C52]">
                {secondary ?? message}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onConfirm}
            className="mt-8 flex h-10 w-[241px] cursor-pointer items-center justify-center rounded-[8px] bg-[#13278A] text-[16px] font-medium leading-normal tracking-[-0.025em] text-white"
          >
            {confirmText}
          </button>
          {!noCancel && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="mt-[7px] cursor-pointer text-[16px] font-medium leading-normal tracking-[-0.025em] text-[#73787E]"
            >
              {cancelText}
            </button>
          )}
        </div>
      ) : (
        <div
          className={`box__container fixed top-1/2 right-0 left-0 z-60 mx-auto h-auto w-70 -translate-y-1/2 rounded-[10px] bg-white px-6 pt-8 pb-5 transition-opacity duration-200 ${visibilityClass}`}
        >
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
              className="flex-1 rounded-[8px] bg-[#13278a] py-2.5 text-[14px] font-medium text-white transition-colors hover:bg-[#0f1f66]"
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
