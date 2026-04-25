export default function RetroEmpty() {
  return (
    <div className="flex h-90 w-89.5 items-center justify-center rounded-[12px] bg-[#F7F8FA] p-2.5">
      <div className="flex flex-col items-center">
        <p className="text-[18px] font-semibold leading-normal tracking-[-0.45px] text-[#474C52]">
          지출 기록이 아직 없어요
        </p>
        <p className="text-[14px] font-medium leading-normal tracking-[-0.35px] text-[#9FA4A8]">
          오늘의 소비를 기록하고 하루를 돌아보세요
        </p>
      </div>
    </div>
  );
}
