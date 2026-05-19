'use client';

import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';

const MAX_FONT = 16;
const MIN_FONT = 10;

interface AutoFitTextProps {
  children: ReactNode;
  className?: string;
  deps?: unknown[];
}

export default function AutoFitText({ children, className, deps = [] }: AutoFitTextProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [fontSize, setFontSize] = useState(MAX_FONT);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    let size = MAX_FONT;
    el.style.fontSize = `${size}px`;

    while (el.scrollWidth > el.clientWidth && size > MIN_FONT) {
      size -= 0.5;
      el.style.fontSize = `${size}px`;
    }

    setFontSize(size);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return (
    <p ref={ref} style={{ fontSize: `${fontSize}px` }} className={className}>
      {children}
    </p>
  );
}
