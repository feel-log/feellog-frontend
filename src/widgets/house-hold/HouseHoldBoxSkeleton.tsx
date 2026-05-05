"use client";

export default function HouseHoldBoxSkeleton() {
  return (
    <div className="house__hold__box__wrapper space-y-4">
      {/* First card skeleton */}
      <div className="flex items-center px-4 py-2 bg-[linear-gradient(93.67deg,#fff_0.95%,#eaf5ff_100%)] rounded-lg animate-pulse">
        <div className="flex flex-1 flex-col gap-0.5">
          <div className="h-5 w-32 bg-gray-300 rounded mb-2"></div>
          <div className="h-4 w-48 bg-gray-200 rounded"></div>
        </div>
        <div className="w-19 h-19 bg-gray-300 rounded-full shrink-0"></div>
      </div>

      {/* Second card skeleton */}
      <div className="rounded-[12px] bg-white px-4 pt-4 pb-5.5 shadow-[0px_0px_8px_0px_rgba(19,39,138,0.15)] animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col gap-2">
            <div className="h-4 w-24 bg-gray-300 rounded"></div>
            <div className="h-6 w-32 bg-gray-200 rounded"></div>
          </div>
          <div className="w-6 h-6 bg-gray-300 rounded"></div>
        </div>
        <div className="h-12 bg-gray-200 rounded"></div>
      </div>

      {/* Third card skeleton */}
      <div className="rounded-[12px] bg-white px-4 pt-4 pb-5.5 shadow-[0px_0px_8px_0px_rgba(19,39,138,0.15)] animate-pulse">
        <div className="mb-4">
          <div className="h-4 w-24 bg-gray-300 rounded mb-2"></div>
          <div className="h-6 w-32 bg-gray-200 rounded"></div>
        </div>
        <div className="space-y-3">
          <div className="h-8 bg-gray-200 rounded"></div>
          <div className="h-8 bg-gray-200 rounded"></div>
        </div>
      </div>

      {/* Fourth card skeleton */}
      <div className="mb-36 px-4 py-2 shadow-none rounded-lg bg-white animate-pulse">
        <div className="flex w-full items-center">
          <div className="flex flex-1 flex-col gap-0.5">
            <div className="h-5 w-32 bg-gray-300 rounded mb-2"></div>
            <div className="h-4 w-40 bg-gray-200 rounded"></div>
          </div>
          <div className="w-19 h-19 bg-gray-300 rounded-lg shrink-0"></div>
        </div>
      </div>
    </div>
  );
}
