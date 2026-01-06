
import React from 'react';
import { Metadata } from 'next';
import { getProjects } from '@/services/project.service';
import ProjectListing from '@/components/project/ProjectListing';
import LeadForm from '@/components/lead/LeadForm';

// --- SEO METADATA ---
export const metadata: Metadata = {
  title: 'Danh Sách Dự Án Căn Hộ Bcons | Bảng Giá Gốc Chủ Đầu Tư 2025',
  description: 'Tổng hợp danh sách các dự án căn hộ Bcons tại Dĩ An, Bình Dương và TP.HCM. Cập nhật bảng giá, tiến độ, pháp lý Bcons City, Bcons Plaza, Bcons Polaris...',
  keywords: ['dự án bcons', 'căn hộ bcons', 'giá bán bcons', 'mua chung cư bcons', 'bcons bình dương'],
  openGraph: {
    title: 'Danh Sách Dự Án Căn Hộ Bcons Chính Hãng',
    description: 'Tìm kiếm căn hộ Bcons phù hợp với tài chính của bạn. Hỗ trợ trả góp 0% lãi suất.',
    images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'],
  },
};

// Server Component
export default async function ProjectsPage() {
  // Fetch dữ liệu từ Firestore ngay trên Server để tối ưu SEO & FCP
  const projects = await getProjects();

  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* --- HERO HEADER --- */}
      <div className="bg-slate-900 pt-32 pb-20 md:pt-40 md:pb-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-emerald-600/10 -skew-x-12 transform translate-x-1/4 blur-3xl"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-widest mb-4">
            Hệ Thống Phân Phối Chính Thức
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
            Danh Sách Dự Án <span className="text-emerald-500">Bcons</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Khám phá các dự án căn hộ chất lượng cao, pháp lý hoàn chỉnh tại vị trí đắc địa khu Đông Sài Gòn & Bình Dương.
          </p>
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 pb-24 relative z-20">
        
        {/* Project Listing (Client Component handles filtering) */}
        <ProjectListing initialProjects={projects} />

        {/* --- LEAD CTA SECTION --- */}
        <div className="mt-24 grid md:grid-cols-2 gap-8 items-center bg-white rounded-[48px] p-8 md:p-12 shadow-xl border border-slate-100 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 to-teal-400"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl font-black text-slate-900 mb-4">
              Chưa tìm thấy căn hộ ưng ý?
            </h2>
            <p className="text-slate-500 mb-8 leading-relaxed">
              Đừng lo lắng! Bcons Group liên tục ra mắt các dự án mới. 
              Hãy để lại thông tin nhu cầu (Tài chính, khu vực, số phòng ngủ), 
              chúng tôi sẽ thông báo ngay khi có sản phẩm phù hợp (Suất nội bộ).
            </p>
            <div className="flex flex-col gap-4">
              <div className="flex items-center space-x-4">
                 <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 text-xl">💎</div>
                 <div>
                    <p className="font-bold text-slate-900">Suất Ưu Đãi Nội Bộ</p>
                    <p className="text-xs text-slate-500">Chiết khấu cao hơn thị trường</p>
                 </div>
              </div>
              <div className="flex items-center space-x-4">
                 <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xl">🚀</div>
                 <div>
                    <p className="font-bold text-slate-900">Thông Tin Sớm Nhất</p>
                    <p className="text-xs text-slate-500">Nhận booking trước ngày mở bán</p>
                 </div>
              </div>
            </div>
          </div>

          <div className="relative z-10">
            <LeadForm 
              projectSlug="listing-page-request" 
              projectName="Yêu cầu từ trang Danh sách" 
              className="!shadow-none bg-slate-50 border-slate-200" 
            />
          </div>
        </div>

      </div>
    </div>
  );
}
    