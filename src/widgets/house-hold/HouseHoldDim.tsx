"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { TextBallon } from "@/shared/ui/TextBallon";

/**
 * Renders a step-based fullscreen instructional dim overlay and navigation controls for the household onboarding flow.
 *
 * The overlay blocks page interaction, synchronizes external box visibility and scroll position with the current step, and provides skip/previous/next/complete actions to advance or exit the flow.
 *
 * @param isRendered - Whether the overlay should be rendered; when false nothing is rendered
 * @param changeFalse - Callback invoked to end the dim flow (used by Skip and Complete actions)
 * @param boxOn - Callback to enable the primary target box when entering the corresponding step
 * @param boxOff - Callback to disable the primary target box
 * @param secondBoxOn - Callback to enable the secondary target box when entering the corresponding step
 * @param secondBoxOff - Callback to disable the secondary target box
 * @returns The fullscreen dim overlay with step-specific content and navigation buttons, or `null` when `isRendered` is false
 */
export function HouseHoldDim({ isRendered, changeFalse, boxOn, boxOff, secondBoxOn, secondBoxOff } : { isRendered: boolean, changeFalse: () => void, boxOn: () => void, boxOff: () => void, secondBoxOn: () => void, secondBoxOff: () => void }) {
    const [currentIndex, setCurrentIndex] = useState<number | null>(0);
    const htmlElement = document.documentElement;

    useEffect(() => {

        htmlElement.classList.add('hiddens');

        return () => {
            htmlElement.classList.remove('hiddens');
        }
    },[])

    useEffect(() => {
        if(currentIndex === 1) {
            boxOn();
            secondBoxOff();
            window.scrollTo(0, 80);
        } 
        else if (currentIndex === 2) {
            boxOff();
            secondBoxOn();
            window.scrollTo(0, 200)
        } 
        else {
            secondBoxOff();
            boxOff();
            window.scrollTo(0,0)
        }
    },[currentIndex])

    if(!isRendered) return null;

    return (
        <>
            <div className="fixed max-w-md inset-0 mx-auto bg-black z-[100] opacity-45"></div>
            <div className="dim__info fixed z-[120] max-w-md inset-0 mx-auto flex flex-col absolute h-screen max-w-md">
                <button onClick={() => {changeFalse(); htmlElement.classList.remove('hiddens'); boxOff(); secondBoxOff(); }} className={`text-white cursor-pointer absolute z-[120] self-end mr-4 top-[101.52px]`}>건너뛰기</button>
                {
                    currentIndex === 0 &&
                    <>
                        <div role="button__dimmed" className="w-[60px] h-[60px] bg-[#13278a] rounded-full absolute z-[120] bottom-[61px] left-0 right-0 mx-auto bottom-[61px] flex justify-center items-center border border-dashed border-white">
                            <Image src={"/svg/icon_plus.svg"} alt="plus" width={30} height={30} />
                        </div>
                        <TextBallon text={"오늘의 지출을 기록해보세요"} type={"BOTTOM"} place={142} width={188} />  
                    </>
                }
                {
                    currentIndex === 1 &&
                    <TextBallon text={"일간, 주간, 월간 지출을 확인할 수 있어요"} type={"TOP"} place={150} width={253} />
                }
                {
                    currentIndex === 2 &&
                    <TextBallon text={"회고를 통해 오늘의 소비를 되돌아보세요"} type={"BOTTOM"} place={290} width={253} />
                }
                {
                currentIndex! > 0 && typeof(currentIndex) === 'number' &&
                    <button onClick={() => setCurrentIndex((prev) => prev! - 1)} className="absolute z-[120] text-white flex gap-3 items-center flex-row-reverse left-4 bottom-[37px]">
                        <span>이전</span>
                        <Image src={"/svg/right.svg"} alt="left" className="rotate-180" width={8} height={8} />
                    </button>
                }
                {
                currentIndex! < 2 && typeof(currentIndex) === 'number' &&
                    <button onClick={() => setCurrentIndex((prev) => prev! + 1)} className="absolute z-[120] text-white flex gap-3 items-center right-4 bottom-[37px]">
                        <span>다음</span>
                        <Image src={"/svg/right.svg"} alt="left" width={8} height={8} />
                    </button>
                }
                {
                    currentIndex === 2 && typeof(currentIndex) === 'number' &&
                    <button onClick={() => {changeFalse(); htmlElement.classList.remove('hiddens'); boxOff(); secondBoxOff(); }} className="absolute z-[120] text-white flex gap-3 items-center right-4 bottom-[37px]">
                        <span>완료</span>
                        <Image src={"/svg/right.svg"} alt="left" width={8} height={8} />
                    </button>
                }
            </div>
        </>
    )
}