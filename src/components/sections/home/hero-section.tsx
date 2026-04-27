import { CursorHoverImage } from '@/components/ui/cursor-hover-image';
import type { ContactSocial, ServiceItem } from '@/lib/content/home';

function GithubMark() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-[1em]" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.589 2 12.25c0 4.528 2.865 8.37 6.839 9.726.5.095.683-.223.683-.496 0-.245-.009-.894-.014-1.755-2.782.617-3.369-1.39-3.369-1.39-.455-1.183-1.11-1.498-1.11-1.498-.908-.638.069-.625.069-.625 1.004.072 1.532 1.055 1.532 1.055.892 1.568 2.341 1.115 2.91.853.091-.664.349-1.115.635-1.371-2.221-.259-4.556-1.14-4.556-5.074 0-1.121.391-2.038 1.03-2.756-.104-.26-.446-1.308.098-2.727 0 0 .84-.277 2.75 1.053A9.303 9.303 0 0 1 12 6.836c.85.004 1.705.118 2.504.347 1.909-1.33 2.748-1.053 2.748-1.053.546 1.419.203 2.467.1 2.727.641.718 1.028 1.635 1.028 2.756 0 3.944-2.338 4.812-4.566 5.066.359.318.679.945.679 1.904 0 1.374-.012 2.48-.012 2.817 0 .275.18.595.688.494C19.138 20.616 22 16.776 22 12.25 22 6.589 17.523 2 12 2Z" />
    </svg>
  );
}

type HeroSectionProps = {
  heroImagePath: string;
  services: ServiceItem[];
  contactSocials: ContactSocial[];
};

function FacebookMark() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-[1em]" aria-hidden="true">
      <path d="M13.5 22v-8h2.7l.4-3h-3.1V9.1c0-.87.26-1.46 1.56-1.46H16.7V5.02c-.3-.04-1.34-.12-2.55-.12-2.53 0-4.25 1.5-4.25 4.25V11H7.2v3h2.7v8h3.6Z" />
    </svg>
  );
}

function LinkedInMark() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-[1em]" aria-hidden="true">
      <path d="M6.94 8.5H3.56V20h3.38V8.5Zm.22-3.56c0 1.05-.8 1.9-1.92 1.9-1.1 0-1.9-.85-1.9-1.9 0-1.06.82-1.9 1.93-1.9s1.88.84 1.9 1.9ZM20.44 13.4V20h-3.37v-6.2c0-1.56-.56-2.62-1.96-2.62-1.07 0-1.7.72-1.98 1.42-.1.25-.13.6-.13.96V20h-3.38s.05-10.57 0-11.66H13v1.66c.45-.7 1.26-1.7 3.08-1.7 2.24 0 3.92 1.46 3.92 4.6Z" />
    </svg>
  );
}

const serviceHoverImageMap: Record<string, string> = {
  'Architect System': '/images/hero.jpg',
  'Harness AI': '/images/about.jpg',
  'Automate Pipeline': '/images/projects.jpg',
  'Agent Orchestration': '/images/contact.jpg',
};

function getSocialIcon(label: string) {
  if (label === 'Github') {
    return <GithubMark />;
  }

  if (label === 'Facebook') {
    return <FacebookMark />;
  }

  if (label === 'LinkedIn') {
    return <LinkedInMark />;
  }

  return null;
}

export function HeroSection({ heroImagePath, services, contactSocials }: HeroSectionProps) {
  return (
    <section
      id="home"
      className="relative h-dvh bg-cover bg-center px-4 pb-10 pt-24 text-white sm:px-6 sm:pb-10 lg:px-8 lg:pb-8"
      style={{ backgroundImage: `url('${heroImagePath}')` }}
      aria-label="Hero section"
    >
      <div className="absolute inset-0 bg-[rgba(34,43,39,0.42)]" />

      <div className="container relative z-10 mx-auto flex h-full flex-col">
        <div className="grid flex-1 grid-cols-1 items-end gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:grid-rows-[auto_1fr] lg:items-end lg:gap-x-8 lg:gap-y-3">
          <aside id="services" className="self-start lg:col-start-1 lg:row-start-1" aria-label="Core services">
            <ul className="m-0 grid list-none gap-1 p-0 md:gap-2">
              {services.map((service) => (
                <li key={service.label}>
                  <CursorHoverImage
                    src={serviceHoverImageMap[service.label] ?? '/images/hero.jpg'}
                    width={320}
                    height={210}
                    className="inline-flex min-h-11 items-center text-base leading-snug text-white/90 2xl:text-lg"
                  >
                    ↳ {service.label}
                  </CursorHoverImage>
                </li>
              ))}
            </ul>
          </aside>

          <div className="lg:col-start-1 lg:row-start-2">
            <h1 className="m-0 max-w-full leading-tight tracking-tight lg:max-w-[12ch] text-[clamp(2rem,10vmin,15rem)] xl:text-[clamp(2rem,12vmin,20rem)]">
              Build advanced AI apps with our expertise.
            </h1>
          </div>

          <nav
            className="w-full justify-self-start lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:w-auto lg:max-w-full lg:justify-self-end lg:self-center"
            aria-label="Social links"
          >
            <ul className="m-0 flex list-none flex-wrap gap-3 p-0 md:gap-4 lg:grid lg:justify-items-end lg:gap-4">
              {contactSocials
                .filter((social) => social.label === 'Github' || social.label === 'Facebook' || social.label === 'LinkedIn')
                .map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    className="group inline-flex min-h-11 max-w-full items-center gap-2 text-base text-white/95 no-underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white lg:text-xl lg:[text-orientation:mixed] lg:[writing-mode:vertical-rl]"
                    aria-label={social.label}
                  >
                    <span
                      aria-hidden="true"
                      className={`text-base font-semibold leading-none lg:text-3xl ${social.label === 'Github' ? 'lg:rotate-90' : ''}`}
                    >
                      {getSocialIcon(social.label)}
                    </span>
                    <span className="relative inline-block after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-white after:transition-transform group-hover:after:scale-x-100 group-focus-visible:after:scale-x-100 lg:after:-left-2 lg:after:top-0 lg:after:h-full lg:after:w-px lg:after:origin-top lg:after:scale-x-100 lg:after:scale-y-0 group-hover:lg:after:scale-y-100 group-focus-visible:lg:after:scale-y-100">
                      {social.label}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </section>
  );
}
