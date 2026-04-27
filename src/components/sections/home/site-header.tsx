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
          className="inline-flex min-h-11 items-center gap-2.5 text-2xl xl:text-3xl font-semibold leading-none no-underline transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current md:text-4xl"
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
            className="inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center bg-transparent p-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current"
            aria-expanded={isMenuOpen}
            aria-controls="hero-menu-overlay"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            onClick={onOpenMenu}
          >
            <span className="relative xl:h-5 xl:w-8 h-4 w-7" aria-hidden="true">
              {isMenuOpen ? (
                <>
                  <span className={`absolute left-1/2 top-1/2 h-0.5 w-8 -translate-x-1/2 -translate-y-1/2 rotate-45 origin-center rounded-full ${barClass}`} />
                  <span className={`absolute left-1/2 top-1/2 h-0.5 w-8 -translate-x-1/2 -translate-y-1/2 -rotate-45 origin-center rounded-full ${barClass}`} />
                </>
              ) : (
                <>
                  <span className={`absolute left-1/2 top-0 h-0.5 w-6 -translate-x-1/2 rounded-full ${barClass}`} />
                  <span className={`absolute left-1/2 top-1/2 h-0.5 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full ${barClass}`} />
                  <span className={`absolute left-[58%] bottom-0 h-0.5 w-5 -translate-x-1/2 rounded-full ${barClass}`} />
                </>
              )}
            </span>
          </button>
        ) : null}
      </div>
    </header>
  );
}
