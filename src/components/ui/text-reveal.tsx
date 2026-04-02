'use client';

import {useRef} from 'react';
import {gsap, SplitText, useGSAP} from '@/lib/animations/gsap';
import {usePreloaderDone} from '@/lib/hooks/use-preloader-done';

interface TextRevealProps {
  children: React.ReactNode;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
  type?: 'chars' | 'words' | 'lines';
  stagger?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function TextReveal({
  children,
  as: Tag = 'div',
  type = 'words',
  stagger = 0.03,
  className,
  style,
}: TextRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const preloaderDone = usePreloaderDone();

  useGSAP(
    () => {
      if (!ref.current || !preloaderDone) return;

      const split = SplitText.create(ref.current, {
        type,
        ...(type === 'lines' ? {linesClass: 'overflow-hidden'} : {}),
      });

      const targets =
        type === 'chars'
          ? split.chars
          : type === 'words'
            ? split.words
            : split.lines;

      gsap.from(targets, {
        y: '100%',
        clipPath: 'inset(100% 0 0 0)',
        opacity: 0,
        duration: 0.8,
        stagger,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });
    },
    {scope: ref, dependencies: [preloaderDone]},
  );

  // Convert \n in string children to <br /> elements
  const rendered =
    typeof children === 'string' && children.includes('\n')
      ? children.split('\n').map((line, i, arr) => (
          <span key={i}>
            {line}
            {i < arr.length - 1 && <br />}
          </span>
        ))
      : children;

  return (
    <Tag ref={ref as React.Ref<never>} className={className} style={style}>
      {rendered}
    </Tag>
  );
}
