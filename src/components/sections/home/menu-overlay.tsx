import type { MenuItem } from '@/lib/content/home';

type MenuOverlayProps = {
  menuItems: MenuItem[];
  activeSection: string;
  isOpen: boolean;
  onClose: () => void;
};

const previewClassByHref: Record<string, string> = {
  '#home': 'from-[#222b27] via-[#8f9a94] to-[#d8d2c4]',
  '#about': 'from-white via-[#f1f1f1] to-[#d8d8d8]',
  '#projects': 'from-[#cfc7bb] via-[#a6b7a4] to-[#5c6c63]',
  '#achievements': 'from-[#f7f7f7] via-[#d9d9d9] to-[#b7b7b7]',
  '#contact': 'from-[#e9e9e9] via-[#cfcfcf] to-[#0d0d0d]',
};

export function MenuOverlay({ menuItems, activeSection, isOpen, onClose }: MenuOverlayProps) {
  return (
    <div
      id="hero-menu-overlay"
      aria-hidden={!isOpen}
      className={`fixed inset-0 z-40 bg-black transition-opacity duration-300 ease-out motion-reduce:transition-none ${
        isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
      }`}
      role={isOpen ? 'dialog' : undefined}
      aria-modal={isOpen ? 'true' : undefined}
      aria-label="Main menu"
    >
      <nav aria-label="Main navigation" className="container mx-auto h-full px-4 pb-8 pt-28 sm:px-6 lg:px-8">
        <ul className="m-0 grid h-full list-none gap-5 overflow-y-auto p-0 pr-1 md:gap-6">
          {menuItems.map((item) => {
            const isActive = item.href === activeSection;
            const previewClass = previewClassByHref[item.href] ?? 'from-white/15 via-white/10 to-white/5';

            return (
              <li key={item.label}>
                <a
                  href={item.href}
                  className="group grid gap-4 text-white no-underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                  onClick={onClose}
                >
                  <span className="inline-flex min-h-8 items-center gap-3 text-sm font-semibold uppercase tracking-[0.04em] md:text-base">
                    <span className="flex h-3 w-3 items-center justify-center" aria-hidden="true">
                      <span className={`h-2 w-2 rounded-full bg-[#a7d7ad] transition-opacity ${isActive ? 'opacity-100' : 'opacity-0'}`} />
                    </span>
                    <span className="relative after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-white after:transition-transform group-hover:after:scale-x-100 group-focus-visible:after:scale-x-100">
                      {item.label}
                    </span>
                  </span>
                  <span className={`block aspect-[16/8] w-full rounded-lg bg-gradient-to-br ${previewClass}`} aria-hidden="true" />
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
