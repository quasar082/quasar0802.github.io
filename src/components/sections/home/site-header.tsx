import Link from 'next/link';

type SiteHeaderProps = {
  isMenuOpen: boolean;
  isPastHero: boolean;
  onOpenMenu?: () => void;
  sticky?: boolean;
  homeHref?: string;
  isVisible?: boolean;
};

export function SiteHeader({ isMenuOpen, isPastHero, onOpenMenu, sticky = false, homeHref = '#home', isVisible = true }: SiteHeaderProps) {
  const hasMenuToggle = typeof onOpenMenu === 'function';
  const toneClass = isPastHero && !isMenuOpen ? 'text-black' : 'text-white';
  const barClass = isPastHero && !isMenuOpen ? 'bg-black' : 'bg-white';

  return (
    <header
      className={`${sticky ? 'fixed inset-x-0 top-0 z-50 px-4 py-4 sm:px-6 lg:px-8 transition-transform duration-300 ease-out motion-reduce:transition-none' : 'relative z-10'} ${toneClass} ${
        sticky && !isVisible && !isMenuOpen ? '-translate-y-full' : 'translate-y-0'
      }`}
    >
      <div className="container mx-auto flex items-center justify-between">
        <Link
          href={homeHref}
          className="inline-flex min-h-11 items-center gap-2.5 text-3xl font-semibold leading-none no-underline transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current md:text-4xl"
          aria-label="Quasar home"
        >
          <span className="relative inline-block h-5 w-8" aria-hidden="true">
            <span className={`absolute inset-y-0 left-0 w-[42%] transition-colors ${barClass}`} />
            <span className={`absolute left-[38%] top-0 h-[42%] w-[62%] transition-colors ${barClass}`} />
          </span>
          <span>Quasar</span>
        </Link>

        {hasMenuToggle ? (
          <button
            type="button"
            className="inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center bg-transparent p-0 transition active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current motion-reduce:transition-none motion-reduce:transform-none"
            aria-expanded={isMenuOpen}
            aria-controls="hero-menu-overlay"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            onClick={onOpenMenu}
          >
            <span className="relative h-4 w-7" aria-hidden="true">
              <span
                className={`absolute left-0 top-0.5 h-0.5 w-7 origin-center rounded-full transition-[transform,background-color,top,width,right] duration-300 ease-out motion-reduce:transition-none ${barClass} ${
                  isMenuOpen ? 'top-1/2 rotate-45' : ''
                }`}
              />
              <span
                className={`absolute right-0 top-[calc(100%-3px)] h-0.5 w-[75%] origin-center rounded-full transition-[transform,background-color,top,width,right] duration-300 ease-out motion-reduce:transition-none ${barClass} ${
                  isMenuOpen ? 'top-1/2 right-1/2 w-7 translate-x-1/2 -rotate-45' : ''
                }`}
              />
            </span>
          </button>
        ) : null}
      </div>
    </header>
  );
}
