import { cn } from "@/shared/lib/utils";
import { AuthGuard } from "@/shared/ui/guard/AuthGuard";
import PageHeader from "@/shared/ui/PageHeader";
import Link from "next/link";

interface NotiMock {
    time: string;
    text: string;
    seeSight: boolean;
}


export default function NotiPage() {

    const noti_mocks: NotiMock[] = [
        {
            time: "5분 전",
            text: "오늘 하루, 어떤 감정으로 소비했는지 들어볼 시간이에요",
            seeSight: true
        },
        {
            time: "1시간 전",
            text: "오늘 쓴 돈보다 왜 썼는지 떠올려보는 시간이에요",
            seeSight: true
        },
        {
            time: "5.3",
            text: "오늘의 소비와 감정을 가볍게 기록해볼까요?",
            seeSight: false
        },
        {
            time: "어제",
            text: "하루를 마무리하며 오늘의 소비를 함께 회고해보세요",
            seeSight: false
        }
    ];

    return (
        <AuthGuard>
            <PageHeader title={"알림"} />
            <div className={"noti__content h-[calc(100vh-60px)] flex flex-col"}>
                {noti_mocks.length === 0 ? 
                (
                    <div className="not__noti h-full flex flex-col justify-center items-center">
                        <span className="text-[18px] font-semibold">알림이 없어요</span>
                        <span className="text-[12px] text-gray-400 font-medium">푸시 알림을 켜고 알림을 받아보세요</span>
                    </div>
                ) : 
                (
                    <>
                        <button className="text-gray-600 self-end text-[14px] mr-3 mb-3 mt-5">전체 삭제</button>
                        {
                        noti_mocks.map((noti: NotiMock, index: number) => 
                            <Link key={index} href="/" className={cn("w-full h-[87px] block px-4 py-4 border-b border-solid border-gray-300", noti.seeSight ? "bg-[#ecf2fb]" : "")}>
                                <span className="text-[14px] text-gray-500 block pb-[10px]">{noti.time}</span>
                                <div className="text-gray-800 text-[16px] font-semibold">{noti.text}</div>
                            </Link>
                        )
                        }
                    </>
                )}
            </div>
        </AuthGuard>
    )
}