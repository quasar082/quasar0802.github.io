import localFont from 'next/font/local';

export const satoshi = localFont({
  src: [{path: '../app/fonts/Satoshi-Variable.woff2', style: 'normal'}],
  variable: '--font-satoshi',
  display: 'swap',
  weight: '300 900',
});
