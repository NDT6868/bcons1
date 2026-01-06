
"use client";

import React, { useState, useMemo, useEffect, useTransition } from 'react';
import { Project } from '@/types/project';
import ProjectCard from '@/components/ProjectCard';
import { ProjectCardSkeleton } from '@/components/ui/Skeleton';

interface ProjectListingProps {
  initialProjects: Project[];
}

const ProjectListing: React.FC<ProjectListingProps> = ({ initialProjects }) => {
  // --- STATES ---
  const [isPending, startTransition] = useTransition(); // React 18 Concurrent features for smooth UI
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [loading, setLoading] = useState(true); // Initial mount loading
  
  // Filter States
  const [status, setStatus] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<{min: string, max: string}>({ min: '', max: '' });
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  // Simulate hydration loading to show Skeleton initially
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // --- DERIVED DATA ---
  const allAmenities = useMemo(() => {
    const amenities = new Set<string>();
    initialProjects.forEach(p => {
      p.amenities?.forEach(a => amenities.add(a));
    });
    return Array.from(amenities).sort();
  }, [initialProjects]);

  const allLocations = useMemo(() => {
    const locs = new Set<string>();
    initialProjects.forEach(p => {
      if (p.location.includes('Dĩ An')) locs.add('Dĩ An');
      else if (p.location.includes('Thủ Đức')) locs.add('Thủ Đức');
      else if (p.location.includes('Bình Thạnh')) locs.add('Bình Thạnh');
      else if (p.location.includes('Bình Dương')) locs.add('Bình Dương');
      else locs.add('TP.HCM');
    });
    return Array.from(locs).sort();
  }, [initialProjects]);

  // --- FILTERING LOGIC ---
  const filteredProjects = useMemo(() => {
    return initialProjects.filter(project => {
      const matchesSearch = 
        searchTerm === '' ||
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        project.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = status === 'all' || project.status === status;
      
      const price = project.priceNumeric || 0;
      const matchesMinPrice = priceRange.min === '' || price >= parseFloat(priceRange.min);
      const matchesMaxPrice = priceRange.max === '' || price <= parseFloat(priceRange.max);

      const matchesLocation = selectedLocations.length === 0 || selectedLocations.some(loc => project.location.includes(loc));

      const matchesAmenities = selectedAmenities.length === 0 || selectedAmenities.every(amenity => project.amenities?.includes(amenity));

      return matchesSearch && matchesStatus && matchesMinPrice && matchesMaxPrice && matchesLocation && matchesAmenities;
    });
  }, [initialProjects, searchTerm, status, priceRange, selectedLocations, selectedAmenities]);

  // --- WRAPPED HANDLERS FOR TRANSITION ---
  const handleSearchChange = (val: string) => {
    startTransition(() => setSearchTerm(val));
  };

  // ... (Keep existing toggle handlers)
  const toggleLocation = (loc: string) => {
    startTransition(() => setSelectedLocations(prev => 
      prev.includes(loc) ? prev.filter(i => i !== loc) : [...prev, loc]
    ));
  };

  const toggleAmenity = (amenity: string) => {
    startTransition(() => setSelectedAmenities(prev => 
      prev.includes(amenity) ? prev.filter(i => i !== amenity) : [...prev, amenity]
    ));
  };

  const clearFilters = () => {
    startTransition(() => {
      setSearchTerm('');
      setStatus('all');
      setPriceRange({ min: '', max: '' });
      setSelectedLocations([]);
      setSelectedAmenities([]);
    });
  };

  return (
    <div className="w-full">
      {/* --- TOOLBAR --- */}
      <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 mb-8 sticky top-24 z-30 transition-all overflow-hidden">
        <div className="p-6 flex flex-col xl:flex-row gap-4 justify-between items-start xl:items-center">
          {/* Search */}
          <div className="relative w-full xl:flex-1">
            <input 
              type="text" 
              placeholder="Tìm dự án (VD: Bcons City)..." 
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-bold text-slate-700 bg-slate-50 focus:bg-white transition-all"
              value={searchTerm}
              onChange={e => handleSearchChange(e.target.value)}
            />
            <svg className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            {isPending && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-3 w-full xl:w-auto">
            {/* ... Keep dropdowns the same ... */}
            <div className="relative">
              <select 
                className="w-full md:w-auto pl-4 pr-10 py-3.5 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-bold text-slate-700 bg-white cursor-pointer appearance-none"
                value={status}
                onChange={e => setStatus(e.target.value)}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="Đang mở bán">Đang mở bán</option>
                <option value="Sắp ra mắt">Sắp ra mắt</option>
                <option value="Đã bàn giao">Đã bàn giao</option>
              </select>
            </div>

            <button 
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={`px-5 py-3.5 rounded-2xl border font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                showAdvanced || selectedLocations.length > 0 || selectedAmenities.length > 0
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>Lọc nâng cao</span>
              {(selectedLocations.length > 0 || selectedAmenities.length > 0) && (
                <span className="bg-emerald-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full ml-1">
                  {selectedLocations.length + selectedAmenities.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* ... Keep Advanced Section (same as before) ... */}
        <div className={`border-t border-slate-100 bg-slate-50/50 transition-all duration-300 ease-in-out overflow-hidden ${showAdvanced ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="p-6 grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Khu vực</h4>
              <div className="flex flex-wrap gap-2">
                {allLocations.map(loc => (
                  <button key={loc} onClick={() => toggleLocation(loc)} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${selectedLocations.includes(loc) ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-600 border-slate-200'}`}>{loc}</button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Tiện ích</h4>
              <div className="flex flex-wrap gap-2 max-h-[120px] overflow-y-auto scrollbar-hide">
                {allAmenities.map(item => (
                  <button key={item} onClick={() => toggleAmenity(item)} className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all border flex items-center gap-2 ${selectedAmenities.includes(item) ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-white text-slate-500 border-slate-200'}`}>{item}</button>
                ))}
              </div>
            </div>
          </div>
          <div className="px-6 pb-6 flex justify-end">
             <button onClick={clearFilters} className="text-slate-400 hover:text-red-500 text-xs font-bold uppercase flex items-center gap-1">Xóa bộ lọc</button>
          </div>
        </div>
      </div>

      {/* --- RESULTS GRID --- */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map(i => <ProjectCardSkeleton key={i} />)}
        </div>
      ) : filteredProjects.length > 0 ? (
        <>
          <div className="flex items-center justify-between mb-6">
            <p className="text-slate-500 font-medium">Tìm thấy <strong className="text-slate-900 text-lg">{filteredProjects.length}</strong> dự án</p>
          </div>
          
          <div className={`grid md:grid-cols-2 lg:grid-cols-3 gap-8 transition-opacity duration-300 ${isPending ? 'opacity-50' : 'opacity-100'}`}>
            {filteredProjects.map((project, idx) => (
              <ProjectCard 
                key={project.id}
                project={project}
                priority={idx < 3} // LCP optimization: First 3 images load eagerly
              />
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-20 bg-white rounded-[32px] border border-slate-100 shadow-sm animate-fadeIn">
          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl grayscale opacity-50">🏢</div>
          <h3 className="text-2xl font-black text-slate-900 mb-2">Không có kết quả phù hợp</h3>
          <p className="text-slate-500 max-w-md mx-auto mb-8">Thử điều chỉnh lại khoảng giá hoặc bỏ bớt các tiêu chí tiện ích.</p>
          <button onClick={clearFilters} className="text-white font-bold bg-emerald-600 hover:bg-emerald-700 px-8 py-3 rounded-xl transition-all shadow-lg shadow-emerald-200">Xem tất cả dự án</button>
        </div>
      )}
    </div>
  );
};

export default ProjectListing;
