"use client";

import { useEffect, useState } from "react";

/**
 * Render a horizontally centered, pill-shaped speech balloon that displays text and is positioned from either the top or bottom.
 *
 * @param text - The string to display inside the balloon.
 * @param type - "TOP" to position the balloon using the `top` offset, "BOTTOM" to position it using the `bottom` offset.
 * @param place - The pixel offset from the chosen edge (used as the `top` or `bottom` CSS value).
 * @param width - The balloon width in pixels.
 * @returns A JSX element representing the positioned text balloon.
 */
export function TextBallon({ text, type, place, width} : { text: string; type: "TOP" | "BOTTOM"; place: number; width: number }) {
    const [displayWidth, setDisplayWidth] = useState(width);

    useEffect(() => {
        const updateWidth = () => {
            const mobileWidth = Math.min(width, window.innerWidth - 32);
            setDisplayWidth(mobileWidth);
        };
        updateWidth();
        window.addEventListener("resize", updateWidth);
        return () => window.removeEventListener("resize", updateWidth);
    }, [width]);

    return (
        <div className="text__ballon bg-[#ecf2fb] absolute z-[120] left-0 right-0 mx-auto text-center rounded-full text-[14px] font-semibold text-[#13278a] py-1.5 px-3" style={{ width: `${displayWidth}px`, maxWidth: `calc(100vw - 32px)`, top: type === "TOP" ? `${place}px` : 'auto', bottom: type === "BOTTOM" ? `${place}px` : `auto`  }}>
            <span>{text}</span>
            <div className="triangle translate-y-[5px] w-[20px] h-[12px] bg-[#ecf2fb] absolute left-0 right-0 mx-auto rounded" style={{ clipPath: 'polygon(15% 0%, 85% 0%, 60% 85%, 50% 100%, 40% 85%)'}}></div>
        </div>
    )
}