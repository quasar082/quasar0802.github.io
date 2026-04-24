import Image from 'next/image';
import { MDXRemote } from 'next-mdx-remote/rsc';

type BlogMdxProps = {
  source: string;
};

const components = {
  p: (props: React.ComponentProps<'p'>) => <p {...props} className="m-0 mb-6 text-lg leading-8 text-black/78 last:mb-0" />,
  h2: (props: React.ComponentProps<'h2'>) => <h2 {...props} className="mb-4 mt-12 text-3xl tracking-tight" />,
  h3: (props: React.ComponentProps<'h3'>) => <h3 {...props} className="mb-3 mt-10 text-2xl tracking-tight" />,
  ul: (props: React.ComponentProps<'ul'>) => <ul {...props} className="mb-6 mt-0 pl-6 text-lg leading-8 text-black/78" />,
  ol: (props: React.ComponentProps<'ol'>) => <ol {...props} className="mb-6 mt-0 pl-6 text-lg leading-8 text-black/78" />,
  li: (props: React.ComponentProps<'li'>) => <li {...props} className="mb-2" />,
  blockquote: (props: React.ComponentProps<'blockquote'>) => <blockquote {...props} className="my-8 border-l-2 border-black/20 pl-5 text-xl tracking-tight text-black/70" />,
  img: ({ alt = '', src = '', className }: React.ComponentProps<'img'>) => {
    const resolvedSrc = typeof src === 'string' ? src : '';

    return <Image src={resolvedSrc} alt={alt} width={1600} height={900} className={`my-8 h-auto w-full rounded-[1.5rem] ${className ?? ''}`} />;
  },
};

export function BlogMdx({ source }: BlogMdxProps) {
  return <MDXRemote source={source} components={components} />;
}
