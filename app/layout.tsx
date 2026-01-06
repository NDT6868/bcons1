
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AIAssistant from '@/components/AIAssistant';
import { ProjectProvider } from '@/contexts/ProjectContext'; // Nếu vẫn dùng context cho Admin/State toàn cục
import './globals.css'; // Đảm bảo bạn đã có file này hoặc import tailwind CDN trong head nếu chưa setup CSS local

const inter = Inter({ subsets: ['latin', 'vietnamese'] });

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
      <head>
         <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body className={`${inter.className} bg-slate-50 text-slate-900`}>
        <ProjectProvider>
          <Header />
          <main className="min-h-screen pt-20">
            {children}
          </main>
          <Footer />
          <AIAssistant />
        </ProjectProvider>
      </body>
    </html>
  );
}
