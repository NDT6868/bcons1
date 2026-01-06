
import React, { useState, useRef } from 'react';
import { useProjects } from '../contexts/ProjectContext';
import { Project } from '../types';

// --- Helper Components ---

const Toast: React.FC<{ message: string; type: 'success' | 'error'; onClose: () => void }> = ({ message, type, onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-4 right-4 z-[300] px-6 py-4 rounded-xl shadow-2xl flex items-center animate-fadeIn ${
      type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-500 text-white'
    }`}>
      <span className="mr-3 text-xl">{type === 'success' ? '✓' : '✕'}</span>
      <p className="font-bold text-sm">{message}</p>
    </div>
  );
};

const ImageUploader: React.FC<{ 
  currentImage: string; 
  onImageChange: (base64: string) => void;
  label: string; 
}> = ({ currentImage, onImageChange, label }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        alert("File quá lớn! Vui lòng chọn ảnh dưới 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">{label}</label>
      <div 
        className="relative group cursor-pointer border-2 border-dashed border-slate-200 rounded-xl overflow-hidden hover:border-emerald-400 transition-all bg-slate-50 min-h-[160px] flex items-center justify-center"
        onClick={() => fileInputRef.current?.click()}
      >
        {currentImage ? (
          <>
            <img src={currentImage} alt="Preview" className="w-full h-full object-cover absolute inset-0" />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-white font-bold text-sm bg-black/50 px-4 py-2 rounded-lg">Thay đổi ảnh</span>
            </div>
          </>
        ) : (
          <div className="text-center p-6">
            <span className="text-3xl block mb-2">📷</span>
            <span className="text-xs text-slate-400 font-bold uppercase">Click để tải ảnh lên</span>
          </div>
        )}
      </div>
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />
      {currentImage && (
        <input 
          type="text" 
          value={currentImage.substring(0, 30) + '...'} 
          disabled 
          className="w-full text-[10px] bg-white border border-slate-100 rounded-lg p-2 text-slate-400 font-mono"
        />
      )}
    </div>
  );
};

// --- Main Component ---

const AdminDashboard: React.FC = () => {
  const { projects, updateProject, addProject, deleteProject, resetToDefault, logout, adminUsers, addAdmin, deleteAdmin } = useProjects();
  const [currentView, setCurrentView] = useState<'projects' | 'accounts'>('projects');
  
  // Project Edit State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Project>>({});
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'details' | 'media' | 'legal'>('general');
  
  // Account Edit State
  const [newAdminUser, setNewAdminUser] = useState('');
  const [newAdminPass, setNewAdminPass] = useState('');

  const [toast, setToast] = useState<{msg: string, type: 'success' | 'error'} | null>(null);

  // Stats
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === 'Đang mở bán').length;
  const upcomingProjects = projects.filter(p => p.status === 'Sắp ra mắt').length;
  
  const generateId = (name: string) => name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, '');

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
  };

  const handleEdit = (project: Project) => {
    setEditingId(project.id);
    setFormData(project);
    setActiveTab('general');
    setShowModal(true);
  };

  const handleAddNew = () => {
    setEditingId(null);
    setFormData({
      id: '',
      name: '',
      location: '',
      price: '',
      priceNumeric: 0,
      status: 'Sắp ra mắt',
      image: '',
      description: '',
      amenities: [],
      externalAmenities: [],
      area: '',
      blocks: '',
      floors: '',
      units: '',
      handover: '',
      mapUrl: '',
      floorPlans: [],
      gallery: [],
      progress: '',
      legal: { constructionPermit: '', handoverDecision: '', pinkBook: '' }
    });
    setActiveTab('general');
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        updateProject(formData as Project);
        showToast('Cập nhật dự án thành công!');
      } else {
        const newProject = { 
          ...formData, 
          id: formData.id || generateId(formData.name || 'new-project') 
        } as Project;
        addProject(newProject);
        showToast('Thêm dự án mới thành công!');
      }
      setShowModal(false);
    } catch (err) {
      showToast('Có lỗi xảy ra', 'error');
    }
  };

  const handleAddAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminUser || !newAdminPass) return;
    try {
      addAdmin({ username: newAdminUser, password: newAdminPass });
      showToast('Đã thêm tài khoản admin mới');
      setNewAdminUser('');
      setNewAdminPass('');
    } catch (error: any) {
      showToast(error.message, 'error');
    }
  };

  const handleDeleteAdmin = (username: string) => {
    if (window.confirm(`Bạn có chắc muốn xóa tài khoản "${username}"?`)) {
      try {
        deleteAdmin(username);
        showToast('Đã xóa tài khoản');
      } catch (error: any) {
        showToast(error.message, 'error');
      }
    }
  };

  const handleChange = (field: keyof Project, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex">
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white fixed h-full hidden md:flex flex-col z-20">
        <div className="p-8 border-b border-slate-800">
          <h2 className="text-2xl font-black text-emerald-500 tracking-tighter">BCONS<span className="text-white font-light">CMS</span></h2>
          <p className="text-xs text-slate-500 mt-2">v2.5.0 - Admin Portal</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <div 
            onClick={() => setCurrentView('projects')}
            className={`px-4 py-3 rounded-xl font-bold text-sm flex items-center cursor-pointer border transition-all ${
              currentView === 'projects' ? 'bg-emerald-600/10 text-emerald-400 border-emerald-600/20' : 'border-transparent text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <span className="mr-3">📊</span> Dashboard
          </div>
          <div 
            onClick={() => setCurrentView('accounts')}
            className={`px-4 py-3 rounded-xl font-bold text-sm flex items-center cursor-pointer border transition-all ${
              currentView === 'accounts' ? 'bg-emerald-600/10 text-emerald-400 border-emerald-600/20' : 'border-transparent text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <span className="mr-3">🛡️</span> Tài khoản Admin
          </div>
          <div className="px-4 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl font-bold text-sm flex items-center cursor-pointer transition-colors" onClick={() => window.open('/', '_blank')}>
            <span className="mr-3">🌐</span> Xem Website
          </div>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button onClick={resetToDefault} className="w-full text-left px-4 py-3 text-slate-400 hover:text-red-400 text-xs font-bold uppercase tracking-wider mb-2">
             ⚠ Reset Dữ Liệu
          </button>
          <button onClick={logout} className="w-full bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-xl font-bold text-sm transition-colors flex items-center justify-center">
            Đăng Xuất
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-8">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900">
              {currentView === 'projects' ? 'Tổng quan hệ thống' : 'Quản lý tài khoản'}
            </h1>
            <p className="text-slate-500 mt-1">Xin chào, Admin! Hệ thống hoạt động bình thường.</p>
          </div>
          {currentView === 'projects' && (
            <button onClick={handleAddNew} className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 flex items-center">
              <span className="mr-2 text-xl">+</span> Thêm Dự Án
            </button>
          )}
        </header>

        {currentView === 'projects' ? (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {[
                { t: 'Tổng Dự Án', v: totalProjects, c: 'bg-blue-50 text-blue-600', i: '🏢' },
                { t: 'Đang Mở Bán', v: activeProjects, c: 'bg-emerald-50 text-emerald-600', i: '🔥' },
                { t: 'Sắp Ra Mắt', v: upcomingProjects, c: 'bg-purple-50 text-purple-600', i: '🚀' }
              ].map((s, idx) => (
                <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{s.t}</p>
                    <p className="text-3xl font-black text-slate-900">{s.v}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${s.c}`}>{s.i}</div>
                </div>
              ))}
            </div>

            {/* Project Table */}
            <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 text-slate-900 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100">
                    <tr>
                      <th className="p-6">Dự án</th>
                      <th className="p-6">Giá & Vị trí</th>
                      <th className="p-6">Trạng thái</th>
                      <th className="p-6 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {projects.map(project => (
                      <tr key={project.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="p-6">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-12 rounded-lg overflow-hidden bg-slate-100">
                              <img src={project.image} alt="" className="w-full h-full object-cover" />
                            </div>
                            <span className="font-bold text-slate-900">{project.name}</span>
                          </div>
                        </td>
                        <td className="p-6">
                          <p className="font-bold text-emerald-600">{project.price}</p>
                          <p className="text-xs text-slate-400 truncate max-w-[200px]">{project.location}</p>
                        </td>
                        <td className="p-6">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            project.status === 'Đang mở bán' ? 'bg-emerald-100 text-emerald-700' : 
                            project.status === 'Sắp ra mắt' ? 'bg-blue-100 text-blue-700' :
                            'bg-slate-100 text-slate-600'
                          }`}>
                            {project.status}
                          </span>
                        </td>
                        <td className="p-6 text-right space-x-2">
                          <button onClick={() => handleEdit(project)} className="bg-white border border-slate-200 text-slate-600 hover:border-emerald-500 hover:text-emerald-600 p-2 rounded-lg transition-all shadow-sm">
                            ✎
                          </button>
                          <button onClick={() => { if(window.confirm('Xóa dự án này?')) { deleteProject(project.id); showToast('Đã xóa dự án', 'success'); }}} className="bg-white border border-slate-200 text-slate-600 hover:border-red-500 hover:text-red-600 p-2 rounded-lg transition-all shadow-sm">
                            🗑
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Create Account Form */}
            <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 h-fit">
              <h3 className="text-xl font-black text-slate-900 mb-6">Tạo tài khoản mới</h3>
              <form onSubmit={handleAddAdmin} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Tên đăng nhập</label>
                  <input 
                    required 
                    type="text" 
                    value={newAdminUser}
                    onChange={e => setNewAdminUser(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 outline-none font-medium"
                    placeholder="VD: sales_manager"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Mật khẩu</label>
                  <input 
                    required 
                    type="password" 
                    value={newAdminPass}
                    onChange={e => setNewAdminPass(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 outline-none font-medium"
                    placeholder="••••••••"
                  />
                </div>
                <button type="submit" className="w-full bg-slate-900 text-white font-black py-4 rounded-xl hover:bg-emerald-600 transition-all uppercase tracking-widest text-xs mt-4">
                  Thêm Tài Khoản
                </button>
              </form>
            </div>

            {/* List Accounts */}
            <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-8 border-b border-slate-100 bg-slate-50/50">
                 <h3 className="text-xl font-black text-slate-900">Danh sách Admin</h3>
                 <p className="text-xs text-slate-500 mt-1">Quản lý quyền truy cập CMS</p>
              </div>
              <div className="divide-y divide-slate-100">
                {adminUsers.map((user, idx) => (
                  <div key={idx} className="p-6 flex items-center justify-between group hover:bg-slate-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-lg">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{user.username}</p>
                        <p className="text-xs text-slate-400">********</p>
                      </div>
                    </div>
                    {user.username !== 'admin' && (
                      <button 
                        onClick={() => handleDeleteAdmin(user.username)}
                        className="text-slate-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-all"
                        title="Xóa tài khoản"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    )}
                    {user.username === 'admin' && (
                       <span className="text-[10px] font-bold bg-slate-200 text-slate-600 px-3 py-1 rounded-full uppercase">Mặc định</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Edit Project Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] w-full max-w-5xl h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-scaleIn">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white z-10">
              <h3 className="text-xl font-black text-slate-900">{editingId ? `Cập nhật: ${formData.name}` : 'Thêm Dự Án Mới'}</h3>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">✕</button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-100 px-6 space-x-6 overflow-x-auto">
              {[
                { id: 'general', label: 'Thông tin chung' },
                { id: 'details', label: 'Chi tiết & Thông số' },
                { id: 'media', label: 'Hình ảnh & Video' },
                { id: 'legal', label: 'Pháp lý & Tiến độ' }
              ].map(tab => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
                    activeTab === tab.id ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
              <form id="projectForm" onSubmit={handleSave} className="max-w-4xl mx-auto space-y-8">
                
                {activeTab === 'general' && (
                  <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                       <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Tên dự án *</label>
                       <input required className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-lg"
                        value={formData.name} onChange={e => handleChange('name', e.target.value)} />
                    </div>
                    <div>
                       <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Giá hiển thị (Text)</label>
                       <input className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-medium"
                        value={formData.price} onChange={e => handleChange('price', e.target.value)} />
                    </div>
                    <div>
                       <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Giá lọc (Số - Tỷ)</label>
                       <input type="number" step="0.1" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-medium"
                        value={formData.priceNumeric} onChange={e => handleChange('priceNumeric', parseFloat(e.target.value))} />
                    </div>
                    <div>
                       <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Trạng thái</label>
                       <select className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-medium"
                        value={formData.status} onChange={e => handleChange('status', e.target.value)}>
                        <option value="Sắp ra mắt">Sắp ra mắt</option>
                        <option value="Đang mở bán">Đang mở bán</option>
                        <option value="Đã bàn giao">Đã bàn giao</option>
                       </select>
                    </div>
                    <div className="md:col-span-2">
                       <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Địa chỉ</label>
                       <input className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3"
                        value={formData.location} onChange={e => handleChange('location', e.target.value)} />
                    </div>
                    <div className="md:col-span-2">
                       <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Mô tả dự án</label>
                       <textarea rows={5} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3"
                        value={formData.description} onChange={e => handleChange('description', e.target.value)} />
                    </div>
                  </div>
                )}

                {activeTab === 'details' && (
                  <div className="space-y-6">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                      <h4 className="text-sm font-black text-slate-900 uppercase mb-4">Quy mô & Kết cấu</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                          { l: 'Diện tích đất', k: 'area' }, { l: 'Số Block', k: 'blocks' },
                          { l: 'Số tầng', k: 'floors' }, { l: 'Tổng số căn', k: 'units' }
                        ].map(f => (
                          <div key={f.k}>
                            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">{f.l}</label>
                            <input className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-medium"
                              value={formData[f.k as keyof Project] as string} onChange={e => handleChange(f.k as keyof Project, e.target.value)} />
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                      <h4 className="text-sm font-black text-slate-900 uppercase mb-4">Tiện ích (Mỗi dòng 1 tiện ích)</h4>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Nội khu</label>
                          <textarea rows={6} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm"
                            value={formData.amenities?.join('\n')} 
                            onChange={e => setFormData({...formData, amenities: e.target.value.split('\n')})} 
                            placeholder="Hồ bơi tràn bờ&#10;Công viên cây xanh..."
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Ngoại khu</label>
                          <textarea rows={6} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm"
                            value={formData.externalAmenities?.join('\n')} 
                            onChange={e => setFormData({...formData, externalAmenities: e.target.value.split('\n')})} 
                            placeholder="Làng Đại học&#10;Bến xe Miền Đông..."
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'media' && (
                  <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6">
                     <ImageUploader 
                       label="Ảnh bìa dự án (Banner chính)"
                       currentImage={formData.image || ''}
                       onImageChange={(base64) => handleChange('image', base64)}
                     />
                     
                     <div>
                       <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Link Video Youtube</label>
                       <input className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-mono text-sm"
                        value={formData.videoUrl} onChange={e => handleChange('videoUrl', e.target.value)} />
                     </div>

                     <div>
                       <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Link Google Maps Embed</label>
                       <input className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-mono text-sm"
                        value={formData.mapUrl} onChange={e => handleChange('mapUrl', e.target.value)} />
                     </div>
                     
                     {/* Gallery simple management for now */}
                     <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Thư viện ảnh (Links online, mỗi dòng 1 link)</label>
                        <textarea rows={4} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-mono"
                          value={formData.gallery?.join('\n')} 
                          onChange={e => setFormData({...formData, gallery: e.target.value.split('\n')})}
                        />
                        <p className="text-[10px] text-slate-400 mt-1 italic">* Tính năng upload nhiều ảnh đang được phát triển. Vui lòng dùng link ảnh trực tiếp.</p>
                     </div>
                  </div>
                )}

                {activeTab === 'legal' && (
                  <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Cập nhật tiến độ xây dựng</label>
                      <textarea rows={3} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3"
                        value={formData.progress} onChange={e => handleChange('progress', e.target.value)} />
                    </div>
                    
                    <div className="grid gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <h4 className="text-sm font-bold text-slate-900">Hồ sơ pháp lý</h4>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Giấy phép xây dựng</label>
                        <input className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-sm"
                          value={formData.legal?.constructionPermit} 
                          onChange={e => setFormData({...formData, legal: {...formData.legal, constructionPermit: e.target.value}})} />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Sổ hồng / Hình thức sở hữu</label>
                        <input className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-sm"
                          value={formData.legal?.pinkBook} 
                          onChange={e => setFormData({...formData, legal: {...formData.legal, pinkBook: e.target.value}})} />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Thời gian bàn giao (Dự kiến)</label>
                        <input className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-sm"
                          value={formData.handover} 
                          onChange={e => handleChange('handover', e.target.value)} />
                      </div>
                    </div>
                  </div>
                )}

              </form>
            </div>

            <div className="p-6 border-t border-slate-100 bg-white flex justify-end gap-3 z-10">
              <button type="button" onClick={() => setShowModal(false)} className="px-8 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition-colors">Hủy Bỏ</button>
              <button onClick={() => document.getElementById('projectForm')?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))} className="px-8 py-3 rounded-xl font-bold text-white bg-slate-900 hover:bg-emerald-600 shadow-lg hover:shadow-emerald-200 transition-all">
                {editingId ? 'Lưu Thay Đổi' : 'Tạo Mới'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
