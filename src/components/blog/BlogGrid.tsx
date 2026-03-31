'use client';

import {useState, useMemo, useRef} from 'react';
import {useTranslations} from 'next-intl';
import {gsap, ScrollTrigger, useGSAP} from '@/lib/gsap';
import {BlogCard} from './BlogCard';
import {Pagination} from './Pagination';
import {TextReveal} from '@/components/animations/TextReveal';
import {usePreloaderDone} from '@/hooks/usePreloaderDone';
import type {PostMeta} from '@/lib/blog';

const POSTS_PER_PAGE = 8;

interface BlogGridProps {
  posts: PostMeta[];
  locale: string;
}

export function BlogGrid({posts, locale}: BlogGridProps) {
  const t = useTranslations('Blog');
  const [query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const gridRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const preloaderDone = usePreloaderDone();

  // Filter posts by search query
  const filteredPosts = useMemo(() => {
    if (!query.trim()) return posts;
    const q = query.toLowerCase();
    return posts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q)
    );
  }, [posts, query]);

  // Paginate
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  // Reset page when search query changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to grid section top
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({behavior: 'smooth', block: 'start'});
    }
  };

  // Scroll reveal animation for grid cards
  useGSAP(() => {
    if (!gridRef.current || !preloaderDone) return;

    const cards = gridRef.current.querySelectorAll('.blog-grid-item');
    if (cards.length === 0) return;

    gsap.from(cards, {
      y: 60,
      clipPath: 'inset(100% 0 0 0)',
      opacity: 0,
      filter: 'blur(6px)',
      duration: 0.8,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: gridRef.current,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });
  }, {scope: sectionRef, dependencies: [preloaderDone, currentPage, query]});

  return (
    <section ref={sectionRef} className="pt-12">
      {/* Section heading */}
      <TextReveal
        as="h2"
        type="words"
        className="font-display"
        style={{
          fontSize: 'var(--text-display-sm)',
          fontWeight: 'var(--font-weight-display)',
          color: 'var(--greige-900)',
        }}
      >
        {t('allPosts')}
      </TextReveal>

      {/* Search input */}
      <div className="mt-8">
        <input
          type="text"
          placeholder={t('searchPlaceholder')}
          value={query}
          onChange={handleSearchChange}
          className="w-full max-w-sm rounded-full border bg-transparent px-5 py-2.5 text-sm font-body text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-greige-900"
          style={{borderColor: 'rgba(136, 133, 128, 0.15)'}}
        />
      </div>

      {/* Grid */}
      {paginatedPosts.length > 0 ? (
        <>
          <div
            ref={gridRef}
            className="mt-10"
            style={{
              columns: 1,
              columnGap: '32px',
            }}
          >
            {/* Responsive: 2 columns on md+ */}
            <style>{`
              @media (min-width: 768px) {
                .blog-masonry-grid { columns: 2 !important; }
              }
            `}</style>
            <div className="blog-masonry-grid" style={{columns: 'inherit', columnGap: 'inherit'}}>
              {paginatedPosts.map((post, i) => (
                <div
                  key={post.slug}
                  className="blog-grid-item break-inside-avoid"
                  style={{marginBottom: '48px'}}
                >
                  <BlogCard post={post} locale={locale} index={i} />
                </div>
              ))}
            </div>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      ) : (
        <div className="mt-16 text-center">
          {query.trim() ? (
            <p className="text-sm font-body" style={{color: 'var(--greige-500)'}}>
              {t('noSearchResults')}
            </p>
          ) : (
            <>
              <p
                className="font-display text-xl"
                style={{
                  fontWeight: 'var(--font-weight-display)',
                  color: 'var(--greige-900)',
                }}
              >
                {t('emptyHeading')}
              </p>
              <p
                className="mt-2 text-sm font-body"
                style={{color: 'var(--greige-500)'}}
              >
                {t('emptyBody')}
              </p>
            </>
          )}
        </div>
      )}
    </section>
  );
}
