'use client';

import {useTranslations} from 'next-intl';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({currentPage, totalPages, onPageChange}: PaginationProps) {
  const t = useTranslations('Blog');

  if (totalPages <= 1) return null;

  const pages = Array.from({length: totalPages}, (_, i) => i + 1);

  return (
    <nav
      className="mt-12 flex items-center justify-center gap-2"
      aria-label="Blog pagination"
    >
      {/* Previous button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="text-sm font-body font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        style={{color: 'var(--greige-500)'}}
      >
        {t('paginationPrev')}
      </button>

      {/* Page numbers */}
      <div className="flex items-center gap-2 mx-4">
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className="flex items-center justify-center text-sm font-body font-medium transition-all duration-200"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '9999px',
              backgroundColor: currentPage === page ? 'var(--greige-900)' : 'transparent',
              color: currentPage === page ? 'var(--warm-white)' : 'var(--greige-500)',
            }}
            aria-current={currentPage === page ? 'page' : undefined}
            aria-label={`Page ${page}`}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Next button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="text-sm font-body font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        style={{color: 'var(--greige-500)'}}
      >
        {t('paginationNext')}
      </button>
    </nav>
  );
}
