export function SiteFooter() {
  return (
    <footer className="-translate-y-2" aria-label="Site footer">
      <p className="m-0 w-full whitespace-nowrap text-[clamp(2rem,22vw,24rem)] lg:text-[clamp(8rem,24vw,25rem)] font-medium leading-[0.8] tracking-[-0.03em] text-black">
        QUASAR
      </p>
      <div className="mt-3 border-t border-black/35 pt-3">
        <p className="m-0 text-sm tracking-wide text-black/65">© 2026 Quasar. All rights reserved.</p>
      </div>
    </footer>
  );
}
