'use client';

import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';

const MAX_FONT = 16;
const MIN_FONT = 10;

interface AutoFitTextProps {
  children: ReactNode;
  className?: string;
}

export default function AutoFitText({ children, className }: AutoFitTextProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [fontSize, setFontSize] = useState(MAX_FONT);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const recalc = () => {
      let size = MAX_FONT;
      el.style.fontSize = `${size}px`;
      while (el.scrollWidth > el.clientWidth && size > MIN_FONT) {
        size -= 0.5;
        el.style.fontSize = `${size}px`;
      }
      setFontSize(size);
    };

    recalc();

    const observer = new ResizeObserver(recalc);
    observer.observe(el);
    return () => observer.disconnect();
  }, [children]);

  return (
    <p ref={ref} style={{ fontSize: `${fontSize}px` }} className={className}>
      {children}
    </p>
  );
}
