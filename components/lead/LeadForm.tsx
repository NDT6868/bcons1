
"use client";

import { useState } from "react";
import { createLead } from "@/services/lead.service";

interface LeadFormProps {
  projectSlug: string;
  projectName: string;
  className?: string;
}

export default function LeadForm({ projectSlug, projectName, className = "" }: LeadFormProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      await createLead({
        name: formData.get("name") as string,
        phone: formData.get("phone") as string,
        email: formData.get("email") as string,
        projectSlug,
        projectName,
        source: "project-detail-page-sidebar"
      });

      setSuccess(true);
      form.reset();
    } catch (error) {
      alert("Có lỗi xảy ra, vui lòng gọi hotline 0984.293.633");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className={`bg-emerald-50 p-8 rounded-2xl border border-emerald-100 text-center animate-fadeIn ${className}`}>
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">✓</div>
        <h3 className="font-bold text-slate-900 text-lg">Đăng Ký Thành Công!</h3>
        <p className="text-slate-600 mt-2 text-sm">Chuyên viên Bcons sẽ liên hệ với Anh/Chị trong vòng 5 phút tới.</p>
        <button onClick={() => setSuccess(false)} className="mt-4 text-emerald-600 text-sm font-bold hover:underline">
          Đăng ký thêm
        </button>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-[32px] p-8 shadow-xl border border-slate-100 ${className}`}>
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-slate-900">Đăng Ký Tư Vấn</h3>
        <p className="text-slate-500 text-sm mt-1">Nhận bảng giá & ưu đãi độc quyền {projectName}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input 
            name="name" 
            required 
            placeholder="Họ và tên *" 
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition-all" 
          />
        </div>
        <div>
          <input 
            name="phone" 
            required 
            type="tel"
            pattern="(84|0[3|5|7|8|9])+([0-9]{8})\b"
            title="Số điện thoại không hợp lệ"
            placeholder="Số điện thoại *" 
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition-all" 
          />
        </div>
        <div>
          <input 
            name="email" 
            type="email"
            placeholder="Email (Nhận file PDF)" 
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition-all" 
          />
        </div>
        
        <button 
          disabled={loading} 
          className="w-full bg-emerald-600 text-white font-black py-4 rounded-xl hover:bg-emerald-700 transition-all uppercase tracking-widest text-xs shadow-lg shadow-emerald-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              ĐANG GỬI...
            </span>
          ) : 'NHẬN TƯ VẤN MIỄN PHÍ'}
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-slate-50 text-center">
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[2px] mb-1">Hotline PKD Chủ Đầu Tư</p>
        <a href="tel:0984293633" className="text-2xl font-black text-emerald-600 hover:text-emerald-700 transition-colors">0984.293.633</a>
      </div>
    </div>
  );
}
