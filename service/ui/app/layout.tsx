import './globals.css';
import 'tw-elements-react/dist/css/tw-elements-react.min.css';
import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import { ReactNode } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

const roboto = Roboto({ weight: '400', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Mystery UI',
  description: 'Mystery UI project',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='en'>
      <body className={roboto.className}>
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}
