
import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
  return (
    <div className={`animate-pulse bg-slate-200 rounded-xl ${className}`} />
  );
};

export const ProjectCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-[32px] overflow-hidden border border-slate-100 flex flex-col h-full shadow-sm">
      {/* Image Placeholder */}
      <div className="relative h-72 bg-slate-200 animate-pulse w-full" />
      
      <div className="p-8 flex flex-col flex-1 space-y-4">
        {/* Title */}
        <div className="space-y-2">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        
        {/* Location */}
        <div className="flex items-center space-x-2">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-full" />
        </div>

        {/* Footer / Price */}
        <div className="mt-auto pt-6 border-t border-slate-50 flex justify-between items-center">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-6 w-32" />
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
};
