import {NextIntlClientProvider, hasLocale} from 'next-intl';
import {getMessages, setRequestLocale, getTranslations} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import {marlinGeo, saprona, geistMono} from '@/lib/fonts';
import {Header} from '@/components/Header';
import {ChatBar} from '@/components/chat/ChatBar';
import {Footer} from '@/components/footer/Footer';
import {CustomCursor} from '@/components/animations/CustomCursor';
import {SmoothScrollProvider} from '@/components/providers/SmoothScrollProvider';
import {TransitionProvider} from '@/components/transitions/TransitionProvider';
import Preloader from '@/components/preloader/Preloader';
import {SITE_URL, SITE_NAME, defaultOgImage} from '@/lib/metadata';
import type {Metadata} from 'next';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({lang: locale}));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{lang: string}>;
}): Promise<Metadata> {
  const {lang} = await params;
  const t = await getTranslations({locale: lang, namespace: 'Metadata'});

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      template: '%s | Ha Minh Quan',
      default: t('title'),
    },
    description: t('description'),
    openGraph: {
      siteName: SITE_NAME,
      locale: lang === 'vi' ? 'vi_VN' : 'en_US',
      type: 'website',
      images: defaultOgImage,
    },
    twitter: {
      card: 'summary_large_image',
    },
    alternates: {
      languages: {
        en: '/en/',
        vi: '/vi/',
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{lang: string}>;
}) {
  const {lang} = await params;

  if (!hasLocale(routing.locales, lang)) {
    notFound();
  }

  setRequestLocale(lang);
  const messages = await getMessages();

  return (
    <html lang={lang}>
      <body
        className={`${marlinGeo.variable} ${saprona.variable} ${geistMono.variable} antialiased preloader-pending`}
      >
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var p=window.location.pathname;var isHome=(p==='/'||p==='/en'||p==='/en/'||p==='/vi'||p==='/vi/');if(!isHome||sessionStorage.getItem('rq-preloader-seen')==='true'){document.body.classList.remove('preloader-pending');var el=document.querySelector('[data-preloader]');if(el)el.style.display='none'}}catch(e){document.body.classList.remove('preloader-pending')}})();`,
          }}
        />
        <NextIntlClientProvider locale={lang} messages={messages}>
          <SmoothScrollProvider>
            <Preloader />
            <Header />
            <TransitionProvider>
              <main className="pt-16">
                {children}
              </main>
            </TransitionProvider>
            <Footer />
            <ChatBar />
            <CustomCursor />
          </SmoothScrollProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
