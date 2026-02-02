import type { Metadata } from 'next';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';
import Box from '@mui/material/Box';
import './globals.css';
import { Providers } from '@/components/providers';
import { Header, Footer } from '@/components/layout';

export const metadata: Metadata = {
  title: '매거진 웹앱',
  description: '사용자가 직접 페이지(메뉴)를 구성하는 데모용 매거진 웹앱',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <Providers>
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <Header />
              <Box component="main" sx={{ flex: 1 }}>
                {children}
              </Box>
              <Footer />
            </Box>
          </Providers>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
