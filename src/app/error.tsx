'use client';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-white px-4">
      <div className="flex flex-col items-center gap-1">
        <span className="text-[18px] font-semibold leading-normal tracking-[-0.025em] text-[#474C52]">
          문제가 발생했어요
        </span>
        <span className="text-[14px] font-medium leading-normal tracking-[-0.025em] text-[#9FA4A8]">
          잠시 후 다시 시도해주세요
        </span>
      </div>
      <button
        type="button"
        onClick={reset}
        className="cursor-pointer rounded-[12px] bg-[#13278a] px-6 py-3 text-[16px] font-semibold tracking-[-0.025em] text-white"
      >
        다시 시도
      </button>
    </div>
  );
}
