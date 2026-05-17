export function TextBallon({ text, type, place, width} : { text: string; type: "TOP" | "BOTTOM"; place: number; width: number }) {
    return (
        <div className="text__ballon bg-[#ecf2fb] absolute z-[120] left-0 right-0 mx-auto text-center rounded-full text-[14px] font-semibold text-[#13278a] py-2" style={{ width: `${width}px`, top: type === "TOP" ? `${place}px` : 'auto', bottom: type === "BOTTOM" ? `${place}px` : `auto`  }}>
            <span>{text}</span>
            <div className="triangle translate-y-[5px] w-[14px] h-[12px] bg-[#ecf2fb] absolute left-0 right-0 mx-auto" style={{ clipPath: 'polygon(0% 0%,100% 0%, 50% 100%)'}}></div>
        </div>
    )
}