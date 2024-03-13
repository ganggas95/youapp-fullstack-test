import { Inter } from 'next/font/google';

import clsx from 'clsx';
import './globals.css';

import type { Metadata } from 'next';
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={clsx({
          [inter.className]: true,
          'flex justify-center antialiased overflow-hidden': true,
        })}
      >
        <main className="max-w-full md:max-w-sm min-h-screen md:min-h-[812px] relative overflow-hidden">
          {children}
        </main>
      </body>
    </html>
  );
}