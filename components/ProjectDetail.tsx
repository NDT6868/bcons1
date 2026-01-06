
import React, { useState, useEffect, useCallback } from 'react';
import { Project } from '../types';
import { useProjects } from '../contexts/ProjectContext';
import { analyzeProjectVideo } from '../services/geminiService';

interface ProjectDetailProps {
  project: Project;
  onBack: () => void;
  onContact: () => void;
}

// Helper to optimize image URLs (specifically for Unsplash)
const getOptimizedImageUrl = (url: string, width = 1200) => {
  if (!url) return '';
  try {
    if (url.includes('images.unsplash.com')) {
      const urlObj = new URL(url);
      urlObj.searchParams.set('auto', 'format');
      urlObj.searchParams.set('fit', 'crop');
      urlObj.searchParams.set('q', '80'); // Quality 80%
      urlObj.searchParams.set('w', width.toString());
      return urlObj.toString();
    }
  } catch (e) {
    // Fail silently and return original URL if parsing fails
  }
  return url;
};

const getAmenityIcon = (text: string) => {
  const lower = text.toLowerCase();
  if (lower.includes('hồ bơi')) return '🏊‍♂️';
  if (lower.includes('công viên') || lower.includes('xanh')) return '🌳';
  if (lower.includes('trường') || lower.includes('giáo dục') || lower.includes('học')) return '🏫';
  if (lower.includes('thương mại') || lower.includes('mall') || lower.includes('mua sắm') || lower.includes('chợ')) return '🛍️';
  if (lower.includes('gym') || lower.includes('yoga') || lower.includes('thể thao')) return '💪';
  if (lower.includes('trẻ em') || lower.includes('nhà trẻ')) return '🧸';
  if (lower.includes('bệnh viện') || lower.includes('thuốc') || lower.includes('y tế')) return '🏥';
  if (lower.includes('xe') || lower.includes('metro') || lower.includes('ga') || lower.includes('đường')) return '🚉';
  if (lower.includes('an ninh') || lower.includes('bảo vệ')) return '🛡️';
  if (lower.includes('bbq')) return '🍖';
  return '✨';
};

interface GalleryCarouselProps {
  images: string[];
  className?: string;
  imageFit?: 'cover' | 'contain';
  showOverlay?: boolean;
}

const GalleryCarousel: React.FC<GalleryCarouselProps> = ({ 
  images, 
  className = "relative rounded-[32px] md:rounded-[40px] overflow-hidden shadow-2xl h-[300px] sm:h-[400px] md:h-[600px] group bg-slate-100",
  imageFit = 'cover',
  showOverlay = true
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const handleNext = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [isTransitioning, images.length]);

  const handlePrev = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [isTransitioning, images.length]);

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const onTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > 50) handleNext();
    if (distance < -50) handlePrev();
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsTransitioning(false), 500);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  if (!images || images.length === 0) return null;

  return (
    <div 
      className={className}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className="flex transition-transform duration-500 ease-out h-full" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {images.map((img, idx) => (
          <div key={idx} className="min-w-full h-full relative">
            <img 
              src={getOptimizedImageUrl(img)} 
              alt={`Gallery ${idx + 1}`} 
              className={`w-full h-full ${imageFit === 'contain' ? 'object-contain' : 'object-cover'} select-none`} 
              loading={idx === 0 ? "eager" : "lazy"}
              decoding="async"
            />
          </div>
        ))}
      </div>
      {images.length > 1 && (
        <>
          <button onClick={handlePrev} className={`absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 ${showOverlay ? 'bg-white/20 text-white hover:bg-white/40' : 'bg-slate-200/80 text-slate-900 hover:bg-slate-300'} backdrop-blur-md rounded-full flex items-center justify-center transition-all opacity-100 lg:opacity-0 lg:group-hover:opacity-100 z-20`}>
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button onClick={handleNext} className={`absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 ${showOverlay ? 'bg-white/20 text-white hover:bg-white/40' : 'bg-slate-200/80 text-slate-900 hover:bg-slate-300'} backdrop-blur-md rounded-full flex items-center justify-center transition-all opacity-100 lg:opacity-0 lg:group-hover:opacity-100 z-20`}>
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
          </button>
        </>
      )}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
        {images.map((_, idx) => (
          <button key={idx} onClick={() => setCurrentIndex(idx)} className={`h-2 rounded-full transition-all ${currentIndex === idx ? 'w-8 bg-emerald-500' : `w-2 ${showOverlay ? 'bg-white/50' : 'bg-slate-300'}`}`} />
        ))}
      </div>
      {showOverlay && <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none z-10" />}
    </div>
  );
};

const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, onBack, onContact }) => {
  const { projects } = useProjects(); // Lấy projects mới nhất từ Context
  const allImages = [project.image, ...project.gallery].filter(img => !!img);
  const [sidebarData, setSidebarData] = useState({ name: '', phone: '', email: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Video insight state
  const [videoInsight, setVideoInsight] = useState<string | null>(null);
  const [analyzingVideo, setAnalyzingVideo] = useState(false);

  const handleVideoAnalysis = async () => {
    if (!project.videoUrl) return;
    setAnalyzingVideo(true);
    // Use type casting to handle environment-provided globals safely and avoid definition conflicts
    const hasKey = await (window as any).aistudio.hasSelectedApiKey();
    if (!hasKey) {
      // Trigger dialog and assume success as per race condition guidelines
      await (window as any).aistudio.openSelectKey();
    }
    
    try {
      const result = await analyzeProjectVideo(project.videoUrl, project.name);
      setVideoInsight(result);
    } catch (e: any) {
      // If the request fails with missing entity, reset the key selection state
      if (e?.message?.includes("Requested entity was not found")) {
        await (window as any).aistudio.openSelectKey();
      }
      setVideoInsight("Không thể phân tích video lúc này. Vui lòng liên hệ hotline 0984.293.633.");
    } finally {
      setAnalyzingVideo(false);
    }
  };

  const handleSidebarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSubmitSuccess(true);
    setIsSubmitting(false);
  };

  const hasLegalInfo = project.legal && (project.legal.constructionPermit || project.legal.handoverDecision || project.legal.pinkBook);

  return (
    <div className="pt-24 min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between border-b border-slate-50 mb-8">
        <nav className="flex text-sm text-slate-500 font-medium items-center">
          <button onClick={onBack} className="hover:text-emerald-600">Trang chủ</button>
          <svg className="w-4 h-4 mx-2 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
          <span className="text-emerald-600 font-bold">{project.name}</span>
        </nav>
        <button onClick={onBack} className="flex items-center text-slate-900 font-bold hover:text-emerald-600 transition-all">
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          Trở lại
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 relative">
        <GalleryCarousel images={allImages} />
        <div className="absolute bottom-16 md:bottom-20 left-8 md:left-24 z-20 pointer-events-none">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-emerald-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">{project.status}</span>
            <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">Sổ hồng riêng</span>
          </div>
          <h1 className="text-3xl md:text-6xl font-black text-white mb-4 drop-shadow-2xl">{project.name}</h1>
          <p className="text-white/90 text-sm md:text-lg max-w-2xl flex items-center">
            <svg className="w-5 h-5 mr-2 text-emerald-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
            {project.location}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-3 gap-12 pb-24">
        <div className="lg:col-span-2 space-y-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Giá dự kiến', value: project.price, icon: '💰' },
              { label: 'Quy mô', value: project.area, icon: '📐' },
              { label: 'Bàn giao', value: project.handover, icon: '🔑' },
              { label: 'Căn hộ', value: project.units, icon: '🏠' },
            ].map((item, i) => (
              <div key={i} className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col items-center text-center group hover:bg-white hover:shadow-xl transition-all">
                <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">{item.icon}</span>
                <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">{item.label}</p>
                <p className="text-sm font-black text-slate-900">{item.value}</p>
              </div>
            ))}
          </div>

          <section>
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-slate-900 flex items-center">
                <span className="w-1.5 h-6 bg-emerald-500 rounded-full mr-3"></span> Tổng Quan
              </h3>
              {project.videoUrl && (
                <button 
                  onClick={handleVideoAnalysis}
                  disabled={analyzingVideo}
                  className="bg-slate-900 text-white text-[10px] font-black px-6 py-2.5 rounded-full hover:bg-emerald-600 transition-all flex items-center uppercase tracking-widest disabled:opacity-50"
                >
                  {analyzingVideo ? 'Đang phân tích...' : 'AI Phân tích Video'}
                </button>
              )}
            </div>

            {videoInsight && (
              <div className="mb-8 p-6 bg-emerald-50 rounded-[32px] border-2 border-emerald-100 animate-fadeIn">
                <div className="flex items-center mb-4 text-emerald-700 font-bold text-xs tracking-widest">
                  <span className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center mr-3">✨</span>
                  AI INSIGHT: ĐIỂM NHẤN DỰ ÁN
                </div>
                <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{videoInsight}</div>
              </div>
            )}

            <p className="text-slate-600 leading-loose text-lg">{project.description}</p>
          </section>

          {/* Amenities Section */}
          <section className="py-8 border-t border-slate-100 mt-8">
            <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center">
              <span className="w-1.5 h-6 bg-emerald-500 rounded-full mr-3"></span> Tiện Ích Đẳng Cấp
            </h3>
            
            <div className="grid gap-10">
              {project.amenities && project.amenities.length > 0 && (
                <div>
                  <h4 className="text-xs font-black text-emerald-600 uppercase tracking-widest mb-5 flex items-center">
                    <span className="w-6 h-[1px] bg-emerald-200 mr-2"></span>
                    Tiện ích nội khu
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {project.amenities.map((item, idx) => (
                      <div key={idx} className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 flex items-center space-x-4 hover:shadow-lg transition-all hover:bg-white hover:border-emerald-200 hover:-translate-y-1 duration-300">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl shadow-sm border border-emerald-50">
                          {getAmenityIcon(item)}
                        </div>
                        <span className="font-bold text-slate-700 text-sm leading-tight">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {project.externalAmenities && project.externalAmenities.length > 0 && (
                <div>
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-5 flex items-center">
                    <span className="w-6 h-[1px] bg-slate-200 mr-2"></span>
                    Liên kết vùng & Ngoại khu
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {project.externalAmenities.map((item, idx) => (
                      <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center space-x-4 hover:shadow-lg transition-all hover:bg-white hover:-translate-y-1 duration-300">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl shadow-sm grayscale opacity-70">
                          {getAmenityIcon(item)}
                        </div>
                        <span className="font-bold text-slate-600 text-sm leading-tight">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Floor Plans Section */}
          {project.floorPlans && project.floorPlans.length > 0 && (
            <section className="py-8 border-t border-slate-100">
              <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center">
                <span className="w-1.5 h-6 bg-emerald-500 rounded-full mr-3"></span> Mặt Bằng Tầng Điển Hình
              </h3>
              <GalleryCarousel 
                images={project.floorPlans} 
                className="relative rounded-[32px] md:rounded-[40px] overflow-hidden shadow-sm border border-slate-200 h-[400px] md:h-[500px] group bg-white"
                imageFit="contain"
                showOverlay={false}
              />
            </section>
          )}

          <section>
            <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center">
              <span className="w-1.5 h-6 bg-emerald-500 rounded-full mr-3"></span> Vị Trí & Bản Đồ
            </h3>
            <div className="rounded-[40px] overflow-hidden border border-slate-100 shadow-2xl h-[450px]">
              <iframe src={project.mapUrl} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"></iframe>
            </div>
          </section>

          <section>
            <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center">
              <span className="w-1.5 h-6 bg-emerald-500 rounded-full mr-3"></span> Tiến Độ Hiện Tại
            </h3>
            <div className="bg-slate-900 p-12 rounded-[48px] text-white flex items-center justify-between shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] group-hover:bg-emerald-500/20 transition-all"></div>
              <div className="relative z-10">
                <p className="text-emerald-400 font-black text-xs uppercase tracking-[4px] mb-4">Trạng thái công trường</p>
                <p className="text-3xl font-bold leading-tight max-w-md">{project.progress}</p>
              </div>
              <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center text-5xl relative z-10">🏗️</div>
            </div>
          </section>

          {/* Legal Section */}
          {hasLegalInfo && (
            <section>
               <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center">
                <span className="w-1.5 h-6 bg-emerald-500 rounded-full mr-3"></span> Pháp Lý Dự Án
              </h3>
              <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm grid gap-6">
                {project.legal?.constructionPermit && (
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center text-2xl flex-shrink-0">📜</div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Giấy phép xây dựng</p>
                      <p className="text-slate-900 font-bold">{project.legal.constructionPermit}</p>
                    </div>
                  </div>
                )}
                {project.legal?.handoverDecision && (
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-2xl flex-shrink-0">🔑</div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Quyết định bàn giao</p>
                      <p className="text-slate-900 font-bold">{project.legal.handoverDecision}</p>
                    </div>
                  </div>
                )}
                {project.legal?.pinkBook && (
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center text-2xl flex-shrink-0">📕</div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Sổ hồng (Quyền sở hữu)</p>
                      <p className="text-slate-900 font-bold">{project.legal.pinkBook}</p>
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-32 space-y-8">
            <div className="bg-white rounded-[40px] p-10 shadow-2xl border border-slate-100 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-emerald-600"></div>
              <h4 className="text-2xl font-bold text-slate-900 mb-2">Đăng Ký Tham Quan</h4>
              <p className="text-slate-500 text-sm mb-10">Nhận vé mời và bảng giá chi tiết qua Zalo trong 5 phút.</p>
              
              {submitSuccess ? (
                <div className="py-12 text-center animate-scaleIn">
                  <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">✓</div>
                  <p className="font-black text-slate-900 text-xl">GỬI THÀNH CÔNG!</p>
                  <p className="text-slate-500 mt-2">Chúng tôi sẽ gọi lại ngay.</p>
                </div>
              ) : (
                <form onSubmit={handleSidebarSubmit} className="space-y-6">
                  <input required placeholder="Họ và tên *" className="w-full bg-slate-50 border-none rounded-2xl p-5 outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-inner" />
                  <input required placeholder="Số điện thoại *" className="w-full bg-slate-50 border-none rounded-2xl p-5 outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-inner" />
                  <button type="submit" className="w-full bg-emerald-600 text-white font-black py-5 rounded-2xl hover:bg-emerald-700 transition-all uppercase tracking-widest text-sm shadow-xl shadow-emerald-200">NHẬN BÁO GIÁ</button>
                </form>
              )}
              
              <div className="mt-12 pt-8 border-t border-slate-50 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-[2px] mb-1">Hotline tư vấn</p>
                  <a href="tel:0984293633" className="text-2xl font-black text-emerald-600 hover:text-emerald-700 transition-colors">0984.293.633</a>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 rounded-[40px] p-10 text-white shadow-2xl">
              <h4 className="text-lg font-bold mb-8 flex items-center"><span className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></span> Dự án cùng phân khúc</h4>
              <div className="space-y-8">
                {projects.filter(p => p.id !== project.id).slice(0, 2).map(p => (
                  <div key={p.id} className="group cursor-pointer flex items-center space-x-5" onClick={onBack}>
                    <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 shadow-lg">
                      <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div>
                      <p className="font-bold text-sm group-hover:text-emerald-400 transition-colors mb-1">{p.name}</p>
                      <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">{p.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
