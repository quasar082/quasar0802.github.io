'use client';

import {useState, useRef, useEffect} from 'react';
import {useTranslations} from 'next-intl';

interface Heading {
  level: number;
  text: string;
  id: string;
}

export function TableOfContents({headings}: {headings: Heading[]}) {
  const t = useTranslations('Blog');
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>('');
  const tocRef = useRef<HTMLDivElement>(null);

  // IntersectionObserver-based active heading tracking (async, off main scroll thread)
  useEffect(() => {
    if (headings.length === 0) return;

    const headingEls = document.querySelectorAll('h2[id], h3[id]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {rootMargin: '-20% 0px -70% 0px', threshold: 0},
    );

    headingEls.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  const indentClass = (level: number) => {
    if (level === 3) return 'pl-4';
    if (level >= 4) return 'pl-8';
    return '';
  };

  const list = (
    <ul className="space-y-2">
      {headings.map((h) => {
        const isActive = activeId === h.id;
        return (
          <li
            key={h.id}
            className={indentClass(h.level)}
            style={{
              borderLeft: isActive ? '2px solid var(--greige-900)' : '2px solid transparent',
              paddingLeft: indentClass(h.level) ? undefined : '12px',
              transition: 'border-color 200ms ease',
            }}
          >
            <a
              href={`#${h.id}`}
              className="text-sm transition-colors duration-200"
              style={{
                color: isActive ? 'var(--greige-900)' : 'var(--greige-500)',
                fontWeight: isActive ? 500 : 300,
                fontFamily: 'var(--font-marlin)',
              }}
            >
              {h.text}
            </a>
          </li>
        );
      })}
    </ul>
  );

  return (
    <div ref={tocRef}>
      {/* Mobile: collapsible inline block */}
      <nav
        className="mb-8 rounded-lg p-4 lg:hidden"
        style={{
          backgroundColor: 'var(--warm-white-elevated)',
          border: '1px solid rgba(136, 133, 128, 0.15)',
        }}
      >
        <button
          onClick={() => setOpen(!open)}
          className="flex w-full items-center justify-between text-sm font-medium"
          style={{color: 'var(--greige-900)'}}
        >
          {t('toc')}
          <span
            className="transition-transform duration-200"
            style={{transform: open ? 'rotate(180deg)' : 'rotate(0deg)'}}
          >
            &#9662;
          </span>
        </button>
        {open && <div className="mt-3">{list}</div>}
      </nav>

      {/* Desktop: sticky sidebar */}
      <nav className="hidden lg:sticky lg:top-24 lg:block">
        <h3
          className="mb-4 text-xs font-medium uppercase tracking-widest"
          style={{color: 'var(--greige-500)'}}
        >
          {t('toc')}
        </h3>
        {list}
      </nav>
    </div>
  );
}
