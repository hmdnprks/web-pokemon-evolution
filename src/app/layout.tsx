import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import ReactQueryContextProvider from '@component/contexts/reactQueryContext';

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']
});

export const metadata: Metadata = {
  title: 'Pokemon Evolution App',
  description: 'A simple app to search for Pokemon and see their evolutions',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <ReactQueryContextProvider>
          {children}
        </ReactQueryContextProvider>
      </body>
    </html>
  );
}
