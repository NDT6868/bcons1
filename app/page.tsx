
import React from 'react';
import Link from 'next/link';
import { getFeaturedProjects } from '@/services/project.service';
import ProjectCard from '@/components/ProjectCard';
import LeadForm from '@/components/lead/LeadForm';

export const metadata = {
  title: 'Trang Chủ | Bcons Real Estate',
};

export default async function HomePage() {
  const featuredProjects = await getFeaturedProjects();

  return (
    <div className="flex flex-col gap-24 pb-24">
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 md:pt-32 md:pb-24 bg-slate-50 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-emerald-600/5 -skew-x-12 transform translate-x-20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-black tracking-widest mb-8 border border-emerald-200">
               <span className="relative flex h-3 w-3">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
               </span>
               <span>HỆ THỐNG CĂN HỘ BCONS 2025</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1] mb-8 tracking-tight">
               An Cư <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Thịnh Vượng</span><br/>
               Đầu Tư Vững Bền
            </h1>
            <p className="text-xl text-slate-500 mb-10 max-w-xl leading-relaxed">
               Phân phối chính thức các dự án Bcons tại khu Đông TP.HCM & Bình Dương. Pháp lý chuẩn - Giá trị thực.
            </p>
            <div className="flex gap-4">
              <Link href="#projects" className="bg-emerald-600 text-white px-8 py-4 rounded-xl font-bold uppercase tracking-wider hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200">
                Xem Dự Án
              </Link>
              <Link href="#contact" className="bg-white text-slate-900 px-8 py-4 rounded-xl font-bold uppercase tracking-wider hover:bg-slate-50 transition-all border border-slate-200">
                Tư Vấn Ngay
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section id="projects" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-black text-slate-900 mb-2">Dự Án Tâm Điểm</h2>
            <div className="w-24 h-1.5 bg-emerald-500 rounded-full"></div>
          </div>
          <Link href="/du-an" className="hidden md:block text-emerald-600 font-bold hover:underline">
            Xem tất cả dự án &rarr;
          </Link>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProjects.map((project) => (
             // ProjectCard needs a slight refactor to use Link inside or accept an href
             // For now we assume ProjectCard is dumb and we wrap it or it handles routing internally
             // Here we wrap a div to suppress hydration mismatch if ProjectCard uses onClick
             <div key={project.id}>
                {/* Note: ProjectCard needs update to use next/link instead of onClick handlers for best SEO */}
                {/* Temporary workaround: Pass a dummy handler or Refactor ProjectCard in next step */}
                <ProjectCard 
                  project={project}
                  onClick={() => {}} 
                  onContact={() => {}}
                />
                 {/* Overlay Link for SEO */}
                <Link href={`/du-an/${project.slug}`} className="absolute inset-0 z-10" aria-label={`Xem chi tiết ${project.name}`}>
                  <span className="sr-only">Xem chi tiết</span>
                </Link>
             </div>
          ))}
        </div>
      </section>

      {/* Lead Form Section */}
      <section id="lead-form" className="max-w-3xl mx-auto px-4 w-full">
        <div className="bg-slate-900 rounded-[48px] p-8 md:p-16 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-full bg-emerald-600/10 blur-3xl"></div>
          <div className="relative z-10">
            <h2 className="text-3xl font-black text-white mb-4">Đăng Ký Tư Vấn Miễn Phí</h2>
            <p className="text-slate-400 mb-8">Để lại thông tin, chuyên viên sẽ liên hệ gửi bảng giá và ưu đãi mới nhất.</p>
            <div className="bg-white rounded-3xl p-2">
              <LeadForm projectSlug="general-home" projectName="Trang Chủ" className="!shadow-none !border-0" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
