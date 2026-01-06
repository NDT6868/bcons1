
import React, { useState, useMemo, useEffect } from 'react';
import Navbar from './components/Navbar';
import AIAssistant from './components/AIAssistant';
import ProjectDetail from './components/ProjectDetail';
import AdminDashboard from './components/AdminDashboard';
import ProjectCard from './components/ProjectCard';
import { ProjectProvider, useProjects } from './contexts/ProjectContext';
import { Project } from './types';

// Component con để tách biệt logic sử dụng context
const MainContent: React.FC = () => {
  const { projects, isAdmin, login } = useProjects();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
  // Login UI State
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loginError, setLoginError] = useState(false);
  
  // Contact Form State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // Check URL for admin portal trigger
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('portal') === 'admin' && !isAdmin) {
      setShowLoginModal(true);
    }
  }, [isAdmin]);

  // Filter Logic
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            project.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || project.status === filterStatus;
      
      const price = project.priceNumeric || 0;
      const matchesMinPrice = minPrice === '' || price >= parseFloat(minPrice);
      const matchesMaxPrice = maxPrice === '' || price <= parseFloat(maxPrice);

      return matchesSearch && matchesStatus && matchesMinPrice && matchesMaxPrice;
    });
  }, [projects, searchTerm, filterStatus, minPrice, maxPrice]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(username, password)) {
      setShowLoginModal(false);
      setLoginError(false);
      setPassword('');
      setUsername('');
    } else {
      setLoginError(true);
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setSubmitSuccess(true);
    setTimeout(() => setSubmitSuccess(false), 5000);
  };

  // Render Admin Dashboard if logged in (via Context)
  if (isAdmin) {
    return <AdminDashboard />;
  }

  return (
    <div className="min-h-screen font-['Inter'] selection:bg-emerald-100 selection:text-emerald-900" id="top">
      <Navbar />

      {/* Floating Buttons */}
      <div className="fixed left-4 md:left-8 bottom-24 z-[90] flex flex-col space-y-4">
        <a href="tel:0984293633" className="relative group">
          <div className="absolute inset-0 bg-red-600 rounded-full animate-ping opacity-25"></div>
          <div className="w-14 h-14 bg-red-600 text-white rounded-full shadow-2xl flex items-center justify-center relative hover:scale-110 transition-transform">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
          </div>
        </a>
        <a href="https://zalo.me/0984293633" target="_blank" className="w-14 h-14 bg-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform relative group">
          <span className="font-bold text-xs uppercase">Zalo</span>
        </a>
      </div>

      {/* Admin Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md transition-opacity" onClick={() => setShowLoginModal(false)}>
             <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=80" className="w-full h-full object-cover opacity-20" alt="background" />
          </div>
          
          <div className="bg-white rounded-[32px] w-full max-w-lg relative z-10 shadow-3xl animate-scaleIn overflow-hidden flex flex-col md:flex-row">
            <div className="w-full p-10 md:p-12">
               <button 
                onClick={() => setShowLoginModal(false)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:bg-slate-200 transition-colors"
              >
                ✕
              </button>

              <div className="text-center mb-10">
                <div className="w-20 h-20 bg-emerald-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl shadow-xl shadow-emerald-200">
                  🛡️
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-2">Quản Trị Hệ Thống</h2>
                <p className="text-slate-500 text-sm font-medium">Đăng nhập để truy cập Bcons CMS</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                   <label className="text-xs font-bold text-slate-500 uppercase ml-1">Tài khoản</label>
                   <input 
                    type="text" 
                    placeholder="admin" 
                    className="w-full p-4 rounded-xl border border-slate-200 focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all bg-slate-50 focus:bg-white font-medium text-slate-900"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    autoFocus
                  />
                </div>
                
                <div className="space-y-2">
                   <label className="text-xs font-bold text-slate-500 uppercase ml-1">Mật khẩu</label>
                   <input 
                    type="password" 
                    placeholder="••••••••" 
                    className="w-full p-4 rounded-xl border border-slate-200 focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all bg-slate-50 focus:bg-white font-medium text-slate-900"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                </div>

                {loginError && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-bold flex items-center animate-pulse border border-red-100">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Sai tên tài khoản hoặc mật khẩu
                  </div>
                )}

                <button type="submit" className="w-full bg-emerald-600 text-white font-black py-4 rounded-xl hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-200 transition-all transform active:scale-95 uppercase tracking-widest text-sm mt-4">
                  Đăng Nhập
                </button>
                
                <div className="text-center mt-6">
                   <a href="#" className="text-xs font-bold text-slate-400 hover:text-emerald-600 transition-colors">Quên mật khẩu?</a>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {selectedProject ? (
        <ProjectDetail 
          project={selectedProject} 
          onBack={() => { setSelectedProject(null); window.scrollTo(0,0); }} 
          onContact={() => scrollToSection('contact')}
        />
      ) : (
        <>
          <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 bg-[#f8fafc] overflow-hidden">
            <div className="absolute top-0 right-0 w-1/3 h-full bg-emerald-600/5 -skew-x-12 transform translate-x-20"></div>
            <div className="absolute bottom-0 left-0 w-1/4 h-64 bg-slate-200/20 rounded-tr-[100px] z-0"></div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="grid md:grid-cols-2 gap-16 items-center">
                <div className="animate-fadeIn">
                  <div className="inline-flex items-center space-x-2 px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-black tracking-widest mb-8 border border-emerald-200">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </span>
                    <span>HỆ THỐNG CĂN HỘ BCONS 2025</span>
                  </div>
                  <h1 className="text-5xl md:text-8xl font-black text-slate-900 leading-[0.95] mb-8 tracking-tight">
                    An Cư <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500 italic">Thịnh Vượng</span>
                  </h1>
                  <p className="text-xl text-slate-500 mb-12 max-w-lg leading-relaxed">
                    Khám phá chuỗi dự án căn hộ Bcons tại khu Đông Sài Gòn & Bình Dương. <br/>
                    <span className="font-bold text-slate-900">Pháp lý chuẩn - Giá trị thực - Bàn giao đúng hẹn.</span>
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-5">
                    <button onClick={() => scrollToSection('projects')} className="bg-emerald-600 text-white px-10 py-5 rounded-2xl font-black hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200 uppercase tracking-widest text-xs flex items-center justify-center">
                      XEM DỰ ÁN
                      <svg className="w-4 h-4 ml-2 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                    </button>
                    <button onClick={() => scrollToSection('contact')} className="bg-white text-slate-900 border-2 border-slate-100 px-10 py-5 rounded-2xl font-black hover:bg-slate-50 transition-all uppercase tracking-widest text-xs">
                      TƯ VẤN NGAY
                    </button>
                  </div>
                </div>
                
                <div className="relative group">
                   <div className="absolute -inset-10 bg-emerald-600/5 rounded-[60px] blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-1000"></div>
                   <div className="relative bg-white p-4 rounded-[48px] shadow-2xl overflow-hidden border border-slate-100 transform group-hover:rotate-2 transition-transform duration-700">
                      <img src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80" alt="Bcons Center City" className="w-full h-auto rounded-[32px] grayscale-[30%] group-hover:grayscale-0 transition-all" />
                      
                      {/* Floating Badge */}
                      <div className="absolute bottom-8 right-8 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl animate-bounce">
                        <p className="text-[10px] font-black uppercase text-slate-400">Dự án hot nhất</p>
                        <p className="text-emerald-600 font-black text-lg">Bcons Center City</p>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </section>

          <section id="features" className="py-32 bg-white">
            <div className="max-w-7xl mx-auto px-4">
              <div className="text-center mb-20">
                <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6">Tại Sao Chọn Bcons?</h2>
                <p className="text-slate-400 max-w-2xl mx-auto">Chúng tôi mang lại giá trị thực với pháp lý chuẩn chỉnh và tiến độ vượt mong đợi.</p>
              </div>
              <div className="grid md:grid-cols-3 gap-12">
                {[
                  { title: 'Pháp Lý Vững Vàng', desc: '100% dự án bàn giao sổ hồng đúng hạn cam kết.', icon: '⚖️' },
                  { title: 'Giá Trị Thực', desc: 'Thiết kế tối ưu, mức giá cạnh tranh nhất phân khúc.', icon: '💎' },
                  { title: 'Tiến Độ Thần Tốc', desc: 'Xây dựng vượt kế hoạch, an tâm cho nhà đầu tư.', icon: '🏗️' }
                ].map((item, i) => (
                  <div key={i} className="group p-12 rounded-[48px] bg-slate-50 hover:bg-white hover:shadow-2xl transition-all duration-500 border border-slate-100">
                    <div className="text-6xl mb-8 transform group-hover:-translate-y-2 transition-transform">{item.icon}</div>
                    <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">{item.title}</h3>
                    <p className="text-slate-500 leading-relaxed text-lg">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="projects" className="py-32 bg-slate-50/50">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex flex-col lg:flex-row justify-between items-end mb-12 gap-6">
                <div>
                  <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-2">Dự Án Tâm Điểm</h2>
                  <div className="w-32 h-1.5 bg-emerald-500 rounded-full"></div>
                </div>
                
                {/* Search & Filter Toolbar */}
                <div className="flex flex-col md:flex-row gap-4 w-full lg:w-auto items-end md:items-center">
                  <div className="relative w-full md:w-auto">
                    <input 
                      type="text" 
                      placeholder="Tìm kiếm dự án..." 
                      className="w-full md:w-64 pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-bold text-slate-700 shadow-sm"
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                    />
                    <svg className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  </div>
                  
                  <select 
                    className="w-full md:w-auto pl-4 pr-8 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-bold text-slate-700 bg-white shadow-sm appearance-none cursor-pointer"
                    value={filterStatus}
                    onChange={e => setFilterStatus(e.target.value)}
                  >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="Đang mở bán">Đang mở bán</option>
                    <option value="Sắp ra mắt">Sắp ra mắt</option>
                    <option value="Đã bàn giao">Đã bàn giao</option>
                  </select>

                  <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm w-full md:w-auto">
                    <div className="relative flex-1">
                      <input 
                        type="number" 
                        placeholder="Min (Tỷ)" 
                        className="w-full md:w-20 px-2 py-1.5 text-sm font-bold text-slate-700 outline-none bg-transparent"
                        value={minPrice}
                        onChange={e => setMinPrice(e.target.value)}
                        min="0"
                        step="0.1"
                      />
                    </div>
                    <span className="text-slate-300">-</span>
                    <div className="relative flex-1">
                      <input 
                        type="number" 
                        placeholder="Max (Tỷ)" 
                        className="w-full md:w-20 px-2 py-1.5 text-sm font-bold text-slate-700 outline-none bg-transparent"
                        value={maxPrice}
                        onChange={e => setMaxPrice(e.target.value)}
                        min="0"
                        step="0.1"
                      />
                    </div>
                  </div>
                  
                  {(searchTerm || filterStatus !== 'all' || minPrice || maxPrice) && (
                     <button onClick={() => {setSearchTerm(''); setFilterStatus('all'); setMinPrice(''); setMaxPrice('');}} className="p-3 text-slate-400 hover:text-red-500 bg-white border border-slate-200 rounded-xl shadow-sm transition-colors" title="Xóa bộ lọc">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                     </button>
                  )}
                </div>
              </div>

              {filteredProjects.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredProjects.map((project) => (
                    <ProjectCard 
                      key={project.id}
                      project={project}
                      onClick={setSelectedProject}
                      onContact={() => scrollToSection('contact')}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-white rounded-[32px] border border-slate-100 shadow-sm">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-black text-slate-900 mb-2">Không tìm thấy dự án</h3>
                  <p className="text-slate-500">Thử thay đổi từ khóa hoặc bộ lọc tìm kiếm của bạn.</p>
                  <button onClick={() => {setSearchTerm(''); setFilterStatus('all'); setMinPrice(''); setMaxPrice('');}} className="mt-6 text-emerald-600 font-bold hover:underline">
                    Xóa bộ lọc
                  </button>
                </div>
              )}
            </div>
          </section>

          <section id="contact" className="py-32 bg-white">
            <div className="max-w-7xl mx-auto px-4">
               <div className="bg-slate-900 rounded-[64px] shadow-3xl overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-1/2 h-full bg-emerald-600/5 blur-[120px]"></div>
                  <div className="grid lg:grid-cols-2 relative z-10">
                     <div className="p-16 text-white lg:border-r border-white/5">
                        <h2 className="text-5xl font-black mb-8 leading-tight">Sở Hữu Căn Hộ <br /> Đầu Đời Tại Bcons</h2>
                        <p className="text-emerald-100/60 text-lg mb-12">Hỗ trợ trả góp 0% lãi suất. Vốn tự có chỉ từ 300 triệu đồng. Đăng ký ngay để nhận ưu đãi nội bộ.</p>
                        <div className="space-y-8">
                           <div className="flex items-center space-x-6 group">
                              <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center text-3xl group-hover:bg-emerald-500 transition-all">📞</div>
                              <div>
                                 <p className="text-[10px] text-emerald-400 font-black uppercase tracking-widest mb-1">Hotline 24/7</p>
                                 <p className="text-3xl font-black italic tracking-tight">0984.293.633</p>
                              </div>
                           </div>
                        </div>
                     </div>
                     <div className="p-16 bg-white/5 backdrop-blur-sm">
                        {submitSuccess ? (
                           <div className="h-full flex flex-col items-center justify-center text-center animate-scaleIn">
                              <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center text-3xl mb-6">✓</div>
                              <h3 className="text-2xl font-black text-white mb-2">Đăng Ký Thành Công!</h3>
                              <p className="text-emerald-200">Chúng tôi sẽ liên hệ lại sớm nhất.</p>
                           </div>
                        ) : (
                           <form onSubmit={handleContactSubmit} className="space-y-6">
                              <div className="grid md:grid-cols-2 gap-6">
                                 <input required type="text" className="w-full bg-white/10 border border-white/10 rounded-2xl p-5 outline-none focus:ring-2 focus:ring-emerald-500 text-white placeholder-white/50" placeholder="Họ và tên" />
                                 <input required type="tel" className="w-full bg-white/10 border border-white/10 rounded-2xl p-5 outline-none focus:ring-2 focus:ring-emerald-500 text-white placeholder-white/50" placeholder="Số điện thoại" />
                              </div>
                              <select className="w-full bg-white/10 border border-white/10 rounded-2xl p-5 outline-none focus:ring-2 focus:ring-emerald-500 text-white appearance-none [&>option]:text-slate-900">
                                 <option value="">Dự án quan tâm</option>
                                 {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                              </select>
                              <button type="submit" disabled={isSubmitting} className="w-full bg-emerald-600 text-white font-black py-6 rounded-2xl hover:bg-emerald-700 transition-all shadow-2xl shadow-emerald-500/20 uppercase tracking-[4px] text-sm disabled:opacity-70 disabled:cursor-not-allowed">
                                 {isSubmitting ? 'ĐANG GỬI...' : 'GỬI YÊU CẦU NGAY'}
                              </button>
                           </form>
                        )}
                     </div>
                  </div>
               </div>
            </div>
          </section>
        </>
      )}

      {/* Redesigned Footer */}
      <footer className="bg-slate-950 text-slate-500 pt-24 pb-8 border-t border-slate-800 relative font-sans">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-1">
            <a href="/" className="inline-block mb-6 group">
               <span className="text-white font-black text-3xl tracking-tighter group-hover:text-emerald-500 transition-colors">BCONS<span className="font-light italic text-emerald-500 group-hover:text-white">REAL</span></span>
            </a>
            <p className="text-sm leading-relaxed mb-6 text-slate-400">
               Đơn vị phân phối chiến lược F1 các dự án căn hộ thuộc Tập đoàn Bcons. Uy tín - Tận tâm - Chuyên nghiệp.
            </p>
            <div className="flex space-x-4">
               {['facebook', 'youtube', 'twitter', 'instagram'].map(social => (
                  <a key={social} href="#" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 hover:bg-emerald-600 hover:text-white transition-all">
                     <span className="sr-only">{social}</span>
                     <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10s10-4.477 10-10c0-5.523-4.477-10-10-10z" /></svg>
                  </a>
               ))}
            </div>
          </div>
          
          <div>
            <h5 className="text-white font-bold mb-6 uppercase text-xs tracking-widest flex items-center">
               <span className="w-8 h-[2px] bg-emerald-600 mr-3"></span> Liên Kết
            </h5>
            <ul className="space-y-3">
              {[
                 {l:'Trang chủ', h:'#top'}, 
                 {l:'Dự án đang bán', h:'#projects'}, 
                 {l:'Pháp lý dự án', h:'#'}, 
                 {l:'Tuyển dụng', h:'#'}
               ].map((item, idx) => (
                <li key={idx}><a href={item.h} className="hover:text-emerald-500 transition-colors text-sm flex items-center"><span className="mr-2 opacity-50">›</span> {item.l}</a></li>
              ))}
            </ul>
          </div>

          <div>
             <h5 className="text-white font-bold mb-6 uppercase text-xs tracking-widest flex items-center">
               <span className="w-8 h-[2px] bg-emerald-600 mr-3"></span> Dự Án Hot
            </h5>
            <ul className="space-y-4">
               {projects.slice(0, 3).map(p => (
                  <li key={p.id} className="flex gap-3 group cursor-pointer" onClick={() => setSelectedProject(p)}>
                     <img src={p.image} className="w-16 h-12 rounded-lg object-cover grayscale group-hover:grayscale-0 transition-all" />
                     <div>
                        <p className="text-white text-sm font-bold group-hover:text-emerald-500 transition-colors line-clamp-1">{p.name}</p>
                        <p className="text-[10px] uppercase font-bold text-slate-600">{p.status}</p>
                     </div>
                  </li>
               ))}
            </ul>
          </div>

          <div>
            <h5 className="text-white font-bold mb-6 uppercase text-xs tracking-widest flex items-center">
               <span className="w-8 h-[2px] bg-emerald-600 mr-3"></span> Văn Phòng
            </h5>
            <div className="space-y-4 text-sm">
               <div className="flex items-start">
                  <span className="text-xl mr-3">📍</span>
                  <p>176 Nguyễn Văn Thương, P.25, Q. Bình Thạnh, TP.HCM</p>
               </div>
               <div className="flex items-start">
                  <span className="text-xl mr-3">📞</span>
                  <div>
                     <p className="text-xs text-slate-500 uppercase font-bold">Hotline 24/7</p>
                     <p className="text-emerald-500 font-bold text-lg">0984.293.633</p>
                  </div>
               </div>
               <div className="flex items-start">
                  <span className="text-xl mr-3">📧</span>
                  <p>lienhe@bconschungcu.com</p>
               </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-900 pt-8 mt-8 text-center px-4">
           <p className="text-xs text-slate-600 mb-2">© 2025 BconsChungCu. All rights reserved.</p>
           <div className="flex justify-center items-center gap-4 text-[10px] text-slate-700 font-bold uppercase tracking-wider">
              <a href="#" className="hover:text-white">Điều khoản</a>
              <span>•</span>
              <a href="#" className="hover:text-white">Bảo mật</a>
              <span>•</span>
              <button onClick={() => setShowLoginModal(true)} className="hover:text-emerald-500 transition-colors">Admin Portal</button>
           </div>
        </div>
      </footer>

      <AIAssistant />
    </div>
  );
};

// Component chính wrap Provider
const App: React.FC = () => {
  return (
    <ProjectProvider>
      <MainContent />
    </ProjectProvider>
  );
};

export default App;
