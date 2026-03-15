/**
 * Shared SEO metadata helpers.
 *
 * Provides site-wide constants (URL, name), canonical URL builders,
 * alternate-language link generators, and a default OG image definition.
 */

export const SITE_URL = 'https://rayquasar18.github.io';

export const SITE_NAME = 'Ha Minh Quan | AI Engineer';

/** Default Open Graph image used when pages do not specify their own. */
export const defaultOgImage = [
  {
    url: '/og-image.png',
    width: 1200,
    height: 630,
    alt: 'Ha Minh Quan - AI Engineer',
  },
];

/**
 * Build an absolute canonical URL for the given locale and optional path.
 *
 * @example buildCanonical('en', 'blog/my-post') => 'https://rayquasar18.github.io/en/blog/my-post/'
 * @example buildCanonical('en')                 => 'https://rayquasar18.github.io/en/'
 */
export function buildCanonical(lang: string, path?: string): string {
  return `${SITE_URL}/${lang}${path ? `/${path}` : ''}/`;
}

/**
 * Build alternate-language links and a canonical URL for metadata.
 *
 * @param path - Optional subpath (e.g. 'blog', 'projects/my-project').
 *               Omit for the homepage.
 */
export function buildAlternates(path?: string) {
  return {
    canonical: buildCanonical('en', path),
    languages: {
      en: buildCanonical('en', path),
      vi: buildCanonical('vi', path),
    },
  };
}
