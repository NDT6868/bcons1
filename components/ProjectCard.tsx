
import React from 'react';
import Link from 'next/link';
import { Project } from '@/types/project';

interface ProjectCardProps {
  project: Project;
  onClick?: (project: Project) => void; // Optional now
  onContact?: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <div className="group relative bg-white rounded-[32px] overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-slate-100 flex flex-col h-full">
      <Link href={`/du-an/${project.slug}`} className="block relative h-72 overflow-hidden">
        <img 
          src={project.image} 
          alt={project.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
        <div className="absolute top-6 left-6 flex flex-col gap-2 items-start">
          <span className={`text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-lg ${
            project.status === 'Đang mở bán' ? 'bg-emerald-500 text-white' : 
            project.status === 'Sắp ra mắt' ? 'bg-blue-500 text-white' : 'bg-slate-500 text-white'
          }`}>
            {project.status}
          </span>
        </div>
      </Link>
      
      <div className="p-8 flex flex-col flex-1">
        <h3 className="text-2xl font-black text-slate-900 mb-2">
          <Link href={`/du-an/${project.slug}`} className="hover:text-emerald-600 transition-colors">
            {project.name}
          </Link>
        </h3>
        <p className="text-slate-400 text-xs mb-6 flex items-start">
          <span className="mr-1.5 text-emerald-500">📍</span>
          <span className="line-clamp-2">{project.location}</span>
        </p>
        
        <div className="mt-auto">
          <div className="flex justify-between items-center mb-6 pb-6 border-b border-slate-50">
            <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">Giá tham chiếu</span>
            <span className="text-xl font-black text-emerald-600 italic">
               {project.price.includes(' ') ? project.price.split(' ').slice(1).join(' ') : project.price}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 relative z-20">
            <Link href={`/du-an/${project.slug}`} className="bg-slate-50 text-slate-900 border border-slate-200 font-bold py-3.5 rounded-xl hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all uppercase tracking-wider text-[10px] text-center">
              Xem Chi Tiết
            </Link>
            <Link href={`/du-an/${project.slug}`} className="bg-emerald-600 text-white font-bold py-3.5 rounded-xl hover:bg-emerald-700 transition-all uppercase tracking-wider text-[10px] shadow-lg shadow-emerald-200 text-center">
              Bảng Giá
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
