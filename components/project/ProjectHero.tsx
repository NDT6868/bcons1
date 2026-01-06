
import React from 'react';
import { Project } from '@/types/project';

interface Props {
  project: Project;
}

const ProjectHero: React.FC<Props> = ({ project }) => {
  return (
    <section className="relative h-[50vh] md:h-[65vh] w-full overflow-hidden bg-slate-900">
      {/* LCP Optimization:
          - loading="eager" (default for img, but explicit here)
          - fetchPriority="high" tells browser to load this resource ASAP
          - decoding="async" prevents main thread blocking
      */}
      <img 
        src={project.image} 
        alt={`Dự án ${project.name}`} 
        className="w-full h-full object-cover opacity-90"
        fetchPriority="high" 
        loading="eager"
        decoding="async"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
      
      <div className="absolute bottom-0 left-0 w-full p-6 md:p-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-3 mb-4 animate-fadeIn">
            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
              project.status === 'Đang mở bán' ? 'bg-emerald-500 text-white' : 'bg-blue-500 text-white'
            }`}>
              {project.status}
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 drop-shadow-2xl tracking-tight leading-tight">
            {project.name}
          </h1>
          <p className="text-slate-200 text-lg md:text-xl flex items-center max-w-2xl font-light">
            <span className="mr-2 text-emerald-400">📍</span> {project.location}
          </p>
          <div className="mt-6 flex items-center space-x-4">
             <div className="text-3xl font-bold text-emerald-400">{project.price}</div>
             <span className="text-white/50 text-sm border-l border-white/20 pl-4">Thanh toán linh hoạt</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectHero;
