'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useRef, useState } from 'react';
import type { BlogPost } from '@/lib/content/blog';

type BlogPageClientProps = {
  latestPosts: BlogPost[];
  posts: BlogPost[];
  categories: string[];
};

const POSTS_PER_PAGE = 8;

export function BlogPageClient({ latestPosts, posts, categories }: BlogPageClientProps) {
  const railRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [page, setPage] = useState(1);

  const filteredPosts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return posts.filter((post) => {
      const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
      const haystack = [post.title, post.summary, post.category, ...post.tags].join(' ').toLowerCase();
      const matchesQuery = normalizedQuery.length === 0 || haystack.includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });
  }, [posts, query, selectedCategory]);

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / POSTS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paginatedPosts = filteredPosts.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE);

  const scrollRail = (direction: 'prev' | 'next') => {
    const rail = railRef.current;

    if (!rail) {
      return;
    }

    const offset = rail.clientWidth * 0.82;
    rail.scrollBy({ left: direction === 'next' ? offset : -offset, behavior: 'smooth' });
  };

  const onCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setPage(1);
  };

  const onQueryChange = (value: string) => {
    setQuery(value);
    setPage(1);
  };

  return (
    <>
      <section className="px-4 pt-20 sm:px-6 lg:px-8 ">
        <div className="container mx-auto border-b border-black/10 pb-10">
          <p className="m-0 text-sm font-semibold uppercase tracking-[0.22em] text-black/55">Quasar Journal</p>
          <div className="mt-6">
            <div>
              <h1 className="mt-4 text-[clamp(3.4rem,10vw,7.5rem)] leading-[0.92] tracking-tight">
                <span className="block pl-[clamp(2.25rem,9vw,7.5rem)]">Thoughts on AI systems,</span>
                <span className="block">product surfaces, and motion — shaped as an evolving blog.</span>
              </h1>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="mb-5 flex items-center justify-between gap-4">
            <h2 className="m-0 text-6xl leading-tight tracking-tight md:text-7xl lg:text-8xl">Latest blog</h2>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/15 bg-white text-sm text-black transition hover:border-black/35"
                onClick={() => scrollRail('prev')}
                aria-label="Scroll latest blogs left"
              >
                &lt;
              </button>
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/15 bg-white text-sm text-black transition hover:border-black/35"
                onClick={() => scrollRail('next')}
                aria-label="Scroll latest blogs right"
              >
                &gt;
              </button>
            </div>
          </div>

          <div
            ref={railRef}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {latestPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group min-w-[18rem] snap-start overflow-hidden rounded-[1.75rem] bg-white text-inherit no-underline shadow-[0_1px_0_rgba(0,0,0,0.04)] transition-transform hover:-translate-y-0.5 md:min-w-[22rem] lg:min-w-[24rem]"
              >
                <div className="aspect-[4/3] w-full overflow-hidden bg-[#e8e8e1]">
                  <Image src={post.coverImage} alt="" width={960} height={720} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
                </div>
                <div className="p-5">
                  <p className="m-0 text-xs font-semibold uppercase tracking-[0.16em] text-black/45">{post.readTime}</p>
                  <h3 className="mb-0 mt-3 text-xl leading-tight tracking-tight md:text-2xl">{post.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="mb-6 border-b border-black/10 pb-5">
            <div className="flex flex-col gap-4">
              <div className="flex w-full flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <h2 className="m-0 text-6xl leading-tight tracking-tight md:text-7xl lg:text-8xl">All posts</h2>
                </div>
                <div className="w-full lg:max-w-sm">
                  <input
                    type="search"
                    value={query}
                    onChange={(event) => onQueryChange(event.target.value)}
                    placeholder="Search posts"
                    className="h-11 w-full rounded-full border border-black/12 bg-white px-4 text-sm text-black outline-none transition placeholder:text-black/35 focus:border-black/30"
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className={`inline-flex h-10 items-center rounded-full px-4 text-sm transition ${selectedCategory === 'All' ? 'bg-black text-white' : 'border border-black/12 bg-white text-black'}`}
                  onClick={() => onCategoryChange('All')}
                >
                  All
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    className={`inline-flex h-10 items-center rounded-full px-4 text-sm transition ${selectedCategory === category ? 'bg-black text-white' : 'border border-black/12 bg-white text-black'}`}
                    onClick={() => onCategoryChange(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {paginatedPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="overflow-hidden rounded-[1.5rem] bg-white text-inherit no-underline shadow-[0_1px_0_rgba(0,0,0,0.04)] transition-transform hover:-translate-y-0.5"
              >
                <div className="aspect-[16/10] overflow-hidden bg-[#ebebe4]">
                  <Image src={post.coverImage} alt="" width={1280} height={800} className="h-full w-full object-cover" />
                </div>
                <div className="p-5 md:p-6">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-black/45">
                    <span>{post.category}</span>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="mb-0 mt-3 text-2xl leading-tight tracking-tight">{post.title}</h3>
                  <p className="mb-0 mt-3 text-base leading-7 text-black/68">{post.summary}</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                className={`inline-flex h-10 min-w-10 items-center justify-center rounded-full px-3 text-sm transition ${pageNumber === currentPage ? 'bg-black text-white' : 'border border-black/12 bg-white text-black'}`}
                onClick={() => setPage(pageNumber)}
              >
                {pageNumber}
              </button>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
