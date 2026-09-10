import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Hamza Köybaşı — Full Stack Developer',
  description:
    'Modern web ve mobil uygulamalar, e-ticaret & B2B platformları, yapay zekâ ve artırılmış gerçeklik projeleri geliştiren Full Stack Developer.',
  icons: {
    icon: '/assets/logo-icon-64.png',
    apple: '/assets/logo-icon.png'
  },
  openGraph: {
    title: 'Hamza Köybaşı — Full Stack Developer',
    description: 'Modern web ve mobil uygulamalar, e-ticaret platformları, yapay zekâ ve AR sistemleri geliştiren Full Stack Developer.',
    url: 'https://hamzakoybasi.com',
    siteName: 'Hamza Köybaşı Portfolyo',
    locale: 'tr_TR',
    type: 'website'
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" data-theme="paper">
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://cdn.fontshare.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&display=swap"
        />
        <link rel="stylesheet" href="/assets/fonts/fonts.css" />
      </head>
      <body>
        <div className="grain" aria-hidden="true"></div>
        {children}
      </body>
    </html>
  );
}
