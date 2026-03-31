'use client';

import Link from 'next/link';
import Image from 'next/image';
import {useRef} from 'react';
import {gsap, useGSAP} from '@/lib/gsap';
import type {PostMeta} from '@/lib/blog';

interface BlogCardProps {
  post: PostMeta;
  locale: string;
  index?: number;
}

export function BlogCard({post, locale, index = 0}: BlogCardProps) {
  const cardRef = useRef<HTMLAnchorElement>(null);

  const formattedDate = new Date(post.date).toLocaleDateString(
    locale === 'vi' ? 'vi-VN' : 'en-US',
    {year: 'numeric', month: 'short', day: 'numeric'}
  );

  // Category labels: first 2 tags joined with " · "
  const categoryLabel = post.tags.slice(0, 2).join(' \u00B7 ');

  // Reading time display
  const readingTimeText = post.readingTime
    ? locale === 'vi'
      ? `${post.readingTime} phút đọc`
      : `${post.readingTime} min read`
    : '';

  // Meta line: date · reading time
  const metaLine = [formattedDate, readingTimeText].filter(Boolean).join(' \u00B7 ');

  return (
    <Link
      ref={cardRef}
      href={`/${locale}/blog/${post.slug}/`}
      className="group block break-inside-avoid"
    >
      {/* Category label */}
      {categoryLabel && (
        <span
          className="text-sm font-body font-medium uppercase tracking-[0.08em]"
          style={{color: 'var(--greige-500)'}}
        >
          {categoryLabel}
        </span>
      )}

      {/* Title */}
      <h3
        className="mt-2 font-display transition-colors duration-300 ease-in-out group-hover:text-[var(--greige-600)]"
        style={{
          fontSize: 'var(--text-lg)',
          fontWeight: 'var(--font-weight-display)',
          lineHeight: 1.3,
          color: 'var(--greige-900)',
        }}
      >
        {post.title}
      </h3>

      {/* Meta line */}
      <p
        className="mt-2 text-sm font-body font-medium"
        style={{color: 'var(--greige-500)'}}
      >
        {metaLine}
      </p>

      {/* Divider + Image (only if coverImage exists) */}
      {post.coverImage && (
        <>
          <div
            className="mt-4 mb-4"
            style={{
              height: '1px',
              backgroundColor: 'rgba(136, 133, 128, 0.15)',
            }}
          />
          <div className="overflow-hidden rounded-lg">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-auto transition-transform duration-500 group-hover:scale-[1.03]"
              style={{
                transitionTimingFunction: 'cubic-bezier(0.33, 1, 0.68, 1)',
              }}
              loading="lazy"
            />
          </div>
        </>
      )}

      {/* Optional bottom text */}
      {post.bottomText && (
        <p
          className="mt-3 text-sm font-body font-medium"
          style={{color: 'var(--greige-700)'}}
        >
          {post.bottomText}
        </p>
      )}
    </Link>
  );
}
