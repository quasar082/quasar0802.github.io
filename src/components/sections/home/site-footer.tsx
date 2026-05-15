"use client";

import { useLayoutEffect, useRef, useState } from "react";

function FitText({ text }: { text: string }) {
  const parentRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLParagraphElement | null>(null);
  const [fontSize, setFontSize] = useState(420);
  const [ready, setReady] = useState(false);

  useLayoutEffect(() => {
    const parent = parentRef.current;
    const el = textRef.current;

    if (!parent || !el) return;

    const fit = () => {
      const parentWidth = parent.clientWidth;
      if (!parentWidth) return;

      let low = 16;
      let high = 420;
      let best = 16;

      for (let i = 0; i < 24; i += 1) {
        const mid = (low + high) / 2;
        el.style.fontSize = `${mid}px`;

        if (el.scrollWidth <= parentWidth) {
          best = mid;
          low = mid;
        } else {
          high = mid;
        }
      }

      setFontSize(best);
      setReady(true);
    };

    const observer = new ResizeObserver(fit);
    observer.observe(parent);

    document.fonts?.ready.then(fit).catch(fit);
    fit();

    return () => observer.disconnect();
  }, [text]);

  return (
    <div ref={parentRef} className="w-full overflow-hidden">
      <p
        ref={textRef}
        className="m-0 block w-fit whitespace-nowrap font-medium leading-[0.8] tracking-[-0.03em] text-black"
        style={{ fontSize, visibility: ready ? "visible" : "hidden" }}
      >
        {text}
      </p>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer aria-label="Site footer">
      <FitText text="QUASAR" />
      {/* <div className="mt-3 border-t border-black/35 pt-3">
        <p className="m-0 text-sm tracking-wide text-black/65">© 2026 Quasar. All rights reserved.</p>
      </div> */}
    </footer>
  );
}
