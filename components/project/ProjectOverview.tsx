
import React from 'react';
import { Project } from '@/types/project';

const StatItem = ({ icon, label, value }: { icon: string, label: string, value: string }) => (
  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-center hover:bg-white hover:shadow-lg transition-all">
    <div className="text-3xl mb-3">{icon}</div>
    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">{label}</p>
    <p className="font-bold text-slate-900">{value}</p>
  </div>
);

const ProjectOverview: React.FC<{ project: Project }> = ({ project }) => {
  return (
    <section className="py-8">
      <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center">
        <span className="w-2 h-8 bg-emerald-600 mr-3 rounded-full"></span>
        Tổng Quan Dự Án
      </h2>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatItem icon="📐" label="Quy mô" value={project.area} />
        <StatItem icon="🏢" label="Số Block" value={project.blocks} />
        <StatItem icon="🏠" label="Số căn hộ" value={project.units} />
        <StatItem icon="🔑" label="Bàn giao" value={project.handover} />
      </div>

      <div className="prose prose-lg prose-slate max-w-none text-slate-600 leading-loose">
        <p>{project.description}</p>
      </div>
    </section>
  );
};

export default ProjectOverview;
