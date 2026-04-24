'use client';

import Link from 'next/link';

type BlogMenuItem = {
  label: string;
  href: string;
};

type BlogMenuOverlayProps = {
  isOpen: boolean;
  onClose: () => void;
  items: BlogMenuItem[];
};

export function BlogMenuOverlay({ isOpen, onClose, items }: BlogMenuOverlayProps) {
  return (
    <div
      aria-hidden={!isOpen}
      className={`fixed inset-0 z-40 bg-black transition-opacity duration-300 ${isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}
    >
      <nav aria-label="Blog navigation" className="container mx-auto h-full px-4 pb-8 pt-28 sm:px-6 lg:px-8">
        <ul className="m-0 grid list-none gap-5 p-0 md:gap-6">
          {items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onClose}
                className="group grid gap-4 text-white no-underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                <span className="inline-flex min-h-8 items-center gap-3 text-sm font-semibold uppercase tracking-[0.04em] md:text-base">
                  <span className="relative after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-white after:transition-transform group-hover:after:scale-x-100 group-focus-visible:after:scale-x-100">
                    {item.label}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
