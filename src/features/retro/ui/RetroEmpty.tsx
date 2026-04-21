export default function RetroEmpty() {
  return (
    <div className="flex w-89.5 h-90 items-center justify-center rounded-[10px] bg-[#F7F8FA] p-2.5">
      <div className="flex flex-col items-center gap-2">
        <p className="text-[16px] font-semibold text-[#1C1D1F]">
          오늘의 소비가 아직 없어요
        </p>
        <p className="text-[13px] font-medium text-[#AEAEAE]">
          소비를 기록하면 오늘을 돌아볼 수 있어요
        </p>
      </div>
    </div>
  );
}
