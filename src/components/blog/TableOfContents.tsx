'use client';

import {useState} from 'react';
import {useTranslations} from 'next-intl';

interface Heading {
  level: number;
  text: string;
  id: string;
}

export function TableOfContents({headings}: {headings: Heading[]}) {
  const t = useTranslations('Blog');
  const [open, setOpen] = useState(false);

  if (headings.length === 0) return null;

  const indentClass = (level: number) => {
    if (level === 3) return 'pl-4';
    if (level >= 4) return 'pl-8';
    return '';
  };

  const list = (
    <ul className="space-y-2">
      {headings.map((h) => (
        <li key={h.id} className={indentClass(h.level)}>
          <a
            href={`#${h.id}`}
            className="text-sm text-text-muted transition-colors hover:text-text-primary"
          >
            {h.text}
          </a>
        </li>
      ))}
    </ul>
  );

  return (
    <>
      {/* Mobile: collapsible inline block */}
      <nav className="mb-8 rounded-lg border border-border bg-surface-elevated p-4 lg:hidden">
        <button
          onClick={() => setOpen(!open)}
          className="flex w-full items-center justify-between text-sm font-medium text-text-primary"
        >
          {t('toc')}
          <span
            className="transition-transform"
            style={{transform: open ? 'rotate(180deg)' : 'rotate(0deg)'}}
          >
            &#9662;
          </span>
        </button>
        {open && <div className="mt-3">{list}</div>}
      </nav>

      {/* Desktop: sticky sidebar */}
      <nav className="hidden lg:sticky lg:top-24 lg:block">
        <h3 className="mb-4 text-xs font-medium uppercase tracking-widest text-text-muted">
          {t('toc')}
        </h3>
        {list}
      </nav>
    </>
  );
}
