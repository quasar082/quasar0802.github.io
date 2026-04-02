'use client';

import {type ComponentProps, type MouseEvent} from 'react';
import {Link} from '@/lib/i18n/navigation';
import {useTransition} from './transition-provider';

type TransitionLinkProps = ComponentProps<typeof Link>;

export function TransitionLink({
  href,
  onClick,
  children,
  ...props
}: TransitionLinkProps) {
  const {startTransition} = useTransition();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    const hrefStr = typeof href === 'string' ? href : (href.pathname ?? '');

    // Pass through hash links and external links without transition
    if (
      hrefStr.startsWith('#') ||
      hrefStr.startsWith('http') ||
      hrefStr.includes('#')
    ) {
      onClick?.(e);
      return;
    }

    // Intercept route navigation for transition
    e.preventDefault();
    onClick?.(e);
    startTransition(hrefStr);
  };

  return (
    <Link href={href} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}
