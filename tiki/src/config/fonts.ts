import { DM_Sans, Inter } from 'next/font/google';

export const fontSans = Inter({
  variable: '--font-sans',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
});
export const fontMono = DM_Sans({
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-mono',
  subsets: ['latin'],
});
