"use client";

import { useLayoutEffect, useRef, useState } from "react";

function FitText({ text }: { text: string }) {
  const parentRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLParagraphElement | null>(null);
  const [fontSize, setFontSize] = useState(16);
  const [scaleY, setScaleY] = useState(1);
  const [ready, setReady] = useState(false);

  useLayoutEffect(() => {
    const parent = parentRef.current;
    const el = textRef.current;

    if (!parent || !el) return;

    const fit = () => {
      const parentWidth = parent.clientWidth;
      const parentHeight = parent.clientHeight;
      if (!parentWidth || !parentHeight) return;

      let low = 16;
      let high = 520;
      let best = 16;

      for (let i = 0; i < 24; i += 1) {
        const mid = (low + high) / 2;
        el.style.fontSize = `${mid}px`;
        el.style.transform = "scaleY(1)";

        if (el.scrollWidth <= parentWidth) {
          best = mid;
          low = mid;
        } else {
          high = mid;
        }
      }

      el.style.fontSize = `${best}px`;
      const textHeight = el.scrollHeight;
      const nextScaleY = textHeight ? parentHeight / textHeight : 1;

      setFontSize(Math.floor(best * 100) / 100);
      setScaleY(Math.floor(nextScaleY * 1000) / 1000);
      setReady(true);
    };

    const observer = new ResizeObserver(fit);
    observer.observe(parent);

    document.fonts?.ready.then(fit).catch(fit);
    fit();

    return () => observer.disconnect();
  }, [text]);

  return (
    <div ref={parentRef} className="relative h-full w-full overflow-hidden">
      <p
        ref={textRef}
        className="absolute bottom-0 left-0 m-0 block max-w-full origin-bottom-left whitespace-nowrap font-medium leading-[0.8] tracking-[-0.03em] text-black"
        style={{
          fontSize,
          transform: `scaleY(${scaleY})`,
          visibility: ready ? "visible" : "hidden",
        }}
      >
        {text}
      </p>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer aria-label="Site footer" className="min-h-0 flex-1">
      <FitText text="QUASAR" />
      {/* <div className="mt-3 border-t border-black/35 pt-3">
        <p className="m-0 text-sm tracking-wide text-black/65">© 2026 Quasar. All rights reserved.</p>
      </div> */}
    </footer>
  );
}
