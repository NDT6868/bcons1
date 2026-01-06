
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Footer from '@/components/layout/Footer';
import AIAssistant from '@/components/AIAssistant';
import Analytics from '@/components/Analytics';
import { ProjectProvider } from '@/contexts/ProjectContext';
import { AuthProvider } from '@/contexts/AuthContext';
import './globals.css';

const inter = Inter({ subsets: ['latin', 'vietnamese'] });
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || "";

export const metadata: Metadata = {
  title: {
    template: '%s | Bcons Chung Cư',
    default: 'Bcons Chung Cư - Hệ thống Phân phối Bất động sản Bcons Chính Hãng',
  },
  description: 'Website phân phối chính thức các dự án căn hộ Bcons: Bcons City, Bcons Plaza, Bcons Green View. Cập nhật bảng giá, pháp lý và tiến độ mới nhất.',
  keywords: ['bcons', 'căn hộ bcons', 'bcons city', 'chung cư bình dương', 'bcons plaza'],
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: 'https://bconschungcu.com',
    siteName: 'Bcons Real Estate',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="scroll-smooth">
      <body className={`${inter.className} bg-slate-50 text-slate-900`}>
        {/* GTM NoScript (Must be in body) */}
        {GTM_ID && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}
        
        <Analytics />
        
        <AuthProvider>
          <ProjectProvider>
            <Navbar />
            <main className="min-h-screen">
              {children}
            </main>
            <Footer />
            <AIAssistant />
          </ProjectProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
