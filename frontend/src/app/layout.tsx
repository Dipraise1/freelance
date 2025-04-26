import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Header from './components/Header';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'DecentWork Market - Decentralized Freelance Marketplace',
  description: 'A decentralized marketplace for Web3 freelancers with cross-chain payments and dispute resolution',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-gray-900`}>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
