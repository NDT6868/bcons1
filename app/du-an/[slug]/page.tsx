
import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getProjectBySlug, getProjects } from '@/services/project.service';
import ProjectHero from '@/components/project/ProjectHero';
import ProjectOverview from '@/components/project/ProjectOverview';
import ProjectAmenities from '@/components/project/ProjectAmenities';
import ProjectLocation from '@/components/project/ProjectLocation';
import LeadForm from '@/components/lead/LeadForm';

interface Props {
  params: { slug: string };
}

// SSG: Tạo static pages cho các dự án để load siêu nhanh
export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await getProjectBySlug(params.slug);
  if (!project) return { title: 'Dự án không tồn tại' };

  return {
    title: `${project.name} - Giá CĐT ${project.price}`,
    description: `Thông tin chính thức ${project.name} tại ${project.location}. Quy mô ${project.area}, ${project.units} căn hộ. Bàn giao ${project.handover}.`,
    openGraph: {
      images: [project.image],
    },
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const project = await getProjectBySlug(params.slug);

  if (!project) {
    notFound();
  }

  return (
    <article className="min-h-screen bg-white">
      <ProjectHero project={project} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content Column */}
          <div className="lg:col-span-2">
            <ProjectOverview project={project} />
            <ProjectAmenities project={project} />
            <ProjectLocation project={project} />
          </div>

          {/* Sidebar Column (Lead Form) */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white rounded-[32px] shadow-2xl border border-slate-100 overflow-hidden">
                <div className="bg-slate-900 p-6 text-white text-center">
                  <p className="text-sm opacity-80 uppercase tracking-widest mb-1">Đăng ký tham quan</p>
                  <h3 className="text-xl font-black">{project.name}</h3>
                </div>
                <LeadForm 
                  projectSlug={project.slug} 
                  projectName={project.name}
                  className="!shadow-none !border-0 !rounded-t-none" 
                />
              </div>
              
              <div className="mt-8 bg-emerald-50 p-6 rounded-2xl border border-emerald-100 text-center">
                <p className="text-xs font-bold text-slate-500 uppercase">Hotline PKD Chủ Đầu Tư</p>
                <a href="tel:0984293633" className="text-2xl font-black text-emerald-600 block mt-1 hover:scale-105 transition-transform">
                  0984.293.633
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
