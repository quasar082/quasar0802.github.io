import {NextIntlClientProvider, hasLocale} from 'next-intl';
import {getMessages, setRequestLocale, getTranslations} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {routing} from '@/lib/i18n/routing';
import {satoshi} from '@/lib/fonts';
import {Header} from '@/components/header/header';
import {ChatBar} from '@/components/chat/chat-bar';
import {Footer} from '@/components/footer/footer';
import {CustomCursor} from '@/components/cursor/custom-cursor';
import {SmoothScrollProvider} from '@/components/providers/smooth-scroll-provider';
import {TransitionProvider} from '@/components/providers/transition-provider';
import Preloader from '@/components/preloader/preloader';
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
        className={`${satoshi.variable} antialiased`}
      >
        {/* Preloader curtain — pure HTML outside React Suspense to avoid hidden="" wrapper.
            Renders on first paint as solid black overlay. Inline script removes it
            synchronously for non-homepage / returning visitors. React Preloader component
            animates and removes it on first homepage visit. */}
        <div
          id="preloader-curtain"
          style={{position:'fixed',inset:0,zIndex:60,pointerEvents:'none'}}
        >
          <svg
            style={{position:'absolute',width:'100%',height:'100%'}}
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <clipPath id="curtain-clip-top" clipPathUnits="objectBoundingBox">
                <path d="M 0,0 L 1,0 L 1,0.501 Q 0.5,0.501 0,0.501 Z" />
              </clipPath>
              <clipPath id="curtain-clip-bottom" clipPathUnits="objectBoundingBox">
                <path d="M 0,0.499 Q 0.5,0.499 1,0.499 L 1,1 L 0,1 Z" />
              </clipPath>
            </defs>
            <rect id="curtain-top" x="0" y="0" width="100" height="100" fill="#000" clipPath="url(#curtain-clip-top)" />
            <rect id="curtain-bottom" x="0" y="0" width="100" height="100" fill="#000" clipPath="url(#curtain-clip-bottom)" />
          </svg>
        </div>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var p=window.location.pathname;var h=['/','/en','/en/','/vi','/vi/'];var c=document.getElementById('preloader-curtain');if(!c)return;if(h.indexOf(p)===-1){c.remove();return}if(sessionStorage.getItem('rq-preloader-seen')==='true'){c.remove();return}}catch(e){var c=document.getElementById('preloader-curtain');if(c)c.remove()}})();`,
          }}
        />
        <NextIntlClientProvider locale={lang} messages={messages}>
          <SmoothScrollProvider>
            <Preloader />
            <Header />
            <TransitionProvider>
              <main className="pt-20">
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
