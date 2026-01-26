import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ConfigProvider } from 'antd';
import Providers from './query-providers';
import 'antd/dist/reset.css';

import { AuthProvider } from '@/lib/auth/context/AuthContext';
import { antdTheme } from '@/lib/theme/antd.theme';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Rent-O-Infra',
  description: 'Rent-O-Infra Researcher Portal',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`${inter.className} antialiased`}>
        <ConfigProvider theme={antdTheme}>
          <Providers>
            <AuthProvider>{children}</AuthProvider>
          </Providers>
        </ConfigProvider>
      </body>
    </html>
  );
}
