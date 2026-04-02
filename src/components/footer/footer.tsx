import {getTranslations} from 'next-intl/server';
import {Github, Mail} from 'lucide-react';
import {TextReveal} from '@/components/ui/text-reveal';

const socialLinks = [
  {icon: Github, href: 'https://github.com/rayquasar18', label: 'GitHub'},
  {icon: Mail, href: 'mailto:contact@example.com', label: 'Email'},
];

export async function Footer() {
  const t = await getTranslations('Footer');

  return (
    <footer id="contact" className="px-6 py-section md:px-8">
      <div className="mx-auto max-w-screen-2xl">
        <TextReveal
          as="h2"
          type="chars"
          className="font-display text-text-primary"
          style={{
            fontSize: 'var(--text-display-lg)',
            fontWeight: 'var(--font-weight-display)',
          }}
        >
          {t('cta')}
        </TextReveal>
        <div className="mt-12 flex items-center gap-6">
          {socialLinks.map(({icon: Icon, href, label}) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="slide-underline text-text-muted transition-colors hover:text-text-primary"
            >
              <Icon className="size-6" />
            </a>
          ))}
        </div>
        <p className="mt-8 text-sm text-text-muted">
          &copy; {new Date().getFullYear()} {t('copyright')}
        </p>
      </div>
    </footer>
  );
}
