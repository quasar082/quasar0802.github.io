import type {MDXComponents} from 'mdx/types';

export const mdxComponents: MDXComponents = {
  h2: (props) => (
    <h2
      className="mt-12 mb-4 font-display text-display-sm font-[var(--font-weight-display)] text-text-primary"
      {...props}
    />
  ),
  h3: (props) => (
    <h3
      className="mt-8 mb-3 font-display text-2xl font-[var(--font-weight-display)] text-text-primary"
      {...props}
    />
  ),
  h4: (props) => (
    <h4
      className="mt-6 mb-2 font-display text-xl text-text-primary"
      {...props}
    />
  ),
  p: (props) => (
    <p
      className="mb-4 text-lg leading-relaxed text-text-secondary"
      {...props}
    />
  ),
  pre: (props) => (
    <pre
      className="my-6 overflow-x-auto rounded-lg border border-border bg-surface-elevated p-4 font-mono text-sm"
      {...props}
    />
  ),
  code: (props) => (
    <code
      className="rounded bg-surface-elevated px-1.5 py-0.5 font-mono text-sm text-text-accent"
      {...props}
    />
  ),
  a: (props) => (
    <a
      className="text-text-accent underline underline-offset-4 transition-colors hover:text-accent-hover"
      {...props}
    />
  ),
  img: (props) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className="my-6 w-full rounded-lg"
      alt={props.alt ?? ''}
      {...props}
    />
  ),
  blockquote: (props) => (
    <blockquote
      className="my-6 border-l-2 border-accent pl-6 text-text-muted italic"
      {...props}
    />
  ),
  ul: (props) => (
    <ul
      className="mb-4 ml-6 list-disc space-y-1 text-lg text-text-secondary"
      {...props}
    />
  ),
  ol: (props) => (
    <ol
      className="mb-4 ml-6 list-decimal space-y-1 text-lg text-text-secondary"
      {...props}
    />
  ),
  table: (props) => (
    <div className="my-6 overflow-x-auto">
      <table className="w-full text-left text-sm" {...props} />
    </div>
  ),
  th: (props) => (
    <th
      className="border-b border-border px-4 py-2 font-medium text-text-primary"
      {...props}
    />
  ),
  td: (props) => (
    <td
      className="border-b border-border px-4 py-2 text-text-secondary"
      {...props}
    />
  ),
};
