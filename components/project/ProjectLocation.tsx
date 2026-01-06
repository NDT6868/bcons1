
import React from 'react';
import { Project } from '@/types/project';

const ProjectLocation: React.FC<{ project: Project }> = ({ project }) => {
  return (
    <section className="py-8 border-t border-slate-100">
      <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center">
        <span className="w-2 h-8 bg-emerald-600 mr-3 rounded-full"></span>
        Vị Trí Chiến Lược
      </h2>
      <div className="rounded-[32px] overflow-hidden shadow-lg border border-slate-200 h-[400px]">
        <iframe 
          src={project.mapUrl} 
          width="100%" 
          height="100%" 
          style={{ border: 0 }} 
          allowFullScreen 
          loading="lazy"
          title={`Bản đồ ${project.name}`}
        ></iframe>
      </div>
    </section>
  );
};

export default ProjectLocation;
