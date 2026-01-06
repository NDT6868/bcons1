
"use client";

import React, { useState } from "react";
import { createLead } from "@/services/lead.service";

interface LeadFormProps {
  projectSlug: string;
  projectName: string;
  className?: string;
  onSuccess?: () => void; // Callback khi gửi thành công
}

export default function LeadForm({ 
  projectSlug, 
  projectName, 
  className = "",
  onSuccess 
}: LeadFormProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });

  const validatePhone = (phone: string) => {
    // Regex cho số điện thoại Việt Nam (84 hoặc 0 + 9 chữ số)
    const regex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
    return regex.test(phone);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 1. Client Validation
    if (!formData.name.trim()) {
      setError("Vui lòng nhập họ tên.");
      return;
    }
    if (!validatePhone(formData.phone)) {
      setError("Số điện thoại không đúng định dạng.");
      return;
    }

    setLoading(true);

    try {
      // 2. Call Service
      await createLead({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        message: formData.message,
        projectSlug,
        projectName,
        source: "web-form"
      });

      // 3. Handle Success
      setSuccess(true);
      setFormData({ name: '', phone: '', email: '', message: '' }); // Reset form
      if (onSuccess) onSuccess();

    } catch (err) {
      setError("Có lỗi kết nối. Vui lòng gọi trực tiếp hotline 0984.293.633");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null); // Clear error khi user gõ lại
  };

  // --- RENDER SUCCESS STATE ---
  if (success) {
    return (
      <div className={`bg-emerald-50 p-8 rounded-[32px] border border-emerald-100 text-center animate-fadeIn ${className}`}>
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl shadow-sm">✓</div>
        <h3 className="font-black text-slate-900 text-xl mb-2">Đăng Ký Thành Công!</h3>
        <p className="text-slate-600 mb-6 text-sm leading-relaxed">
          Cảm ơn Anh/Chị <strong>{formData.name}</strong>. Hệ thống đã ghi nhận thông tin.
          <br/>Chuyên viên tư vấn sẽ liên hệ trong vòng 5 phút.
        </p>
        <button 
          onClick={() => setSuccess(false)} 
          className="text-emerald-600 font-bold text-sm hover:underline bg-white px-6 py-3 rounded-xl border border-emerald-100 shadow-sm"
        >
          Đăng ký thêm thông tin khác
        </button>
      </div>
    );
  }

  // --- RENDER FORM STATE ---
  return (
    <div className={`bg-white rounded-[32px] p-8 shadow-2xl border border-slate-100 relative overflow-hidden ${className}`}>
      {loading && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex items-center justify-center rounded-[32px]">
           <div className="flex flex-col items-center">
             <svg className="animate-spin h-8 w-8 text-emerald-600 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
             </svg>
             <span className="text-xs font-bold text-emerald-800 animate-pulse">ĐANG GỬI...</span>
           </div>
        </div>
      )}

      <div className="text-center mb-8">
        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Đăng Ký Tư Vấn</h3>
        <p className="text-slate-500 text-xs mt-1 font-medium">Nhận bảng giá & chính sách {projectName}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-bold flex items-center border border-red-100 animate-pulse">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            {error}
          </div>
        )}

        <div className="space-y-4">
          <input 
            name="name" 
            value={formData.name}
            onChange={handleChange}
            placeholder="Họ và tên *" 
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500 transition-all placeholder:font-normal placeholder:text-slate-400" 
          />
          <input 
            name="phone" 
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Số điện thoại (Zalo) *" 
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500 transition-all placeholder:font-normal placeholder:text-slate-400" 
          />
          <input 
            name="email" 
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email (Để nhận file PDF)" 
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500 transition-all placeholder:font-normal placeholder:text-slate-400" 
          />
          <textarea
            name="message"
            rows={2}
            value={formData.message}
            onChange={handleChange}
            placeholder="Nhu cầu cụ thể: 2PN, tầng cao, hướng mát..."
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500 transition-all placeholder:font-normal placeholder:text-slate-400 resize-none"
          />
        </div>
        
        <button 
          type="submit"
          disabled={loading} 
          className="w-full bg-emerald-600 text-white font-black py-4 rounded-2xl hover:bg-emerald-700 transition-all uppercase tracking-widest text-xs shadow-xl shadow-emerald-200 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
        >
          NHẬN TƯ VẤN MIỄN PHÍ
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-slate-50 text-center">
        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[2px] mb-1">Hotline PKD Chủ Đầu Tư</p>
        <a href="tel:0984293633" className="text-2xl font-black text-emerald-600 hover:text-emerald-700 transition-colors block hover:scale-105 transform duration-200">
          0984.293.633
        </a>
      </div>
    </div>
  );
}
