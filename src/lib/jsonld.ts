import 'server-only';

/**
 * JSON-LD structured data builders for SEO.
 *
 * Generates Person (homepage) and Article (blog posts) schemas
 * following schema.org vocabulary.
 */

import type {Article, Person, WithContext} from 'schema-dts';
import {SITE_URL, SITE_NAME} from './metadata';

/**
 * Sanitise JSON-LD output to prevent XSS via embedded `</script>` in data.
 */
export function safeJsonLd(data: object): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

/**
 * Person schema for the homepage.
 */
export function personJsonLd(): WithContext<Person> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Ha Minh Quan',
    url: `${SITE_URL}/en/`,
    jobTitle: 'AI Engineer',
    knowsAbout: ['NLP', 'LLM', 'Multi-Agent Systems', 'RAG'],
    sameAs: ['https://github.com/rayquasar18'],
  };
}

/**
 * Article schema for individual blog posts.
 */
export function articleJsonLd(post: {
  title: string;
  date: string;
  excerpt: string;
  slug: string;
  lang: string;
  tags: string[];
}): WithContext<Article> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    datePublished: post.date,
    description: post.excerpt,
    author: {
      '@type': 'Person',
      name: 'Ha Minh Quan',
      url: `${SITE_URL}/en/`,
    },
    url: `${SITE_URL}/${post.lang}/blog/${post.slug}/`,
    keywords: post.tags,
    publisher: {
      '@type': 'Person',
      name: 'Ha Minh Quan',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/${post.lang}/blog/${post.slug}/`,
    },
    inLanguage: post.lang === 'vi' ? 'vi' : 'en',
  };
}
