'use client';

interface RetroDeleteModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export default function RetroDeleteModal({ isOpen, onConfirm, onClose }: RetroDeleteModalProps) {
  return (
    <>
      <div
        className={`fixed inset-0 right-0 left-0 z-50 mx-auto max-w-md bg-black transition-opacity duration-200 ${
          isOpen ? 'opacity-30 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"
        onClick={onClose}
      />
      <div
        className={`fixed top-1/2 right-0 left-0 z-60 mx-auto flex h-[180px] w-[300px] -translate-y-1/2 flex-col items-center justify-between rounded-[10px] bg-white px-4 py-[30px] transition-opacity duration-200 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col items-center gap-[3px]">
          <h2 className="text-[18px] font-semibold leading-normal tracking-[-0.025em] text-black">
            삭제하시겠어요?
          </h2>
          <p className="text-[14px] font-medium leading-normal tracking-[-0.025em] text-[#474C52]">
            삭제 후 복구할 수 없어요
          </p>
        </div>
        <button
          type="button"
          onClick={onConfirm}
          className="flex h-[44px] w-[260px] cursor-pointer items-center justify-center rounded-[10px] bg-[#13278A]"
        >
          <span className="text-[18px] font-semibold leading-normal tracking-[-0.025em] text-white">
            확인
          </span>
        </button>
      </div>
    </>
  );
}
