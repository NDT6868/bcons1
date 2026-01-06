
import React from 'react';
import { Project } from '@/types/project';

const ProjectAmenities: React.FC<{ project: Project }> = ({ project }) => {
  return (
    <section className="py-8 border-t border-slate-100">
      <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center">
        <span className="w-2 h-8 bg-emerald-600 mr-3 rounded-full"></span>
        Hệ Thống Tiện Ích
      </h2>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div>
           <h3 className="font-bold text-emerald-700 uppercase text-xs tracking-widest mb-4">Tiện ích nội khu</h3>
           <ul className="grid grid-cols-1 gap-3">
             {project.amenities.map((item, idx) => (
               <li key={idx} className="flex items-center bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                 <span className="w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-xs mr-3">✓</span>
                 <span className="text-sm font-medium text-slate-700">{item}</span>
               </li>
             ))}
           </ul>
        </div>
        
        <div>
           <h3 className="font-bold text-slate-500 uppercase text-xs tracking-widest mb-4">Liên kết vùng</h3>
           <ul className="grid grid-cols-1 gap-3">
             {project.externalAmenities.map((item, idx) => (
               <li key={idx} className="flex items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                 <span className="w-6 h-6 bg-slate-200 text-slate-500 rounded-full flex items-center justify-center text-xs mr-3">↗</span>
                 <span className="text-sm font-medium text-slate-600">{item}</span>
               </li>
             ))}
           </ul>
        </div>
      </div>
    </section>
  );
};

export default ProjectAmenities;
