
import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-500 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-12 mb-12">
        <div className="md:col-span-1">
          <Link href="/" className="inline-block mb-4 group">
             <span className="text-white font-black text-2xl tracking-tighter group-hover:text-emerald-500 transition-colors">BCONS<span className="font-light italic text-emerald-500 group-hover:text-white">REAL</span></span>
          </Link>
          <p className="text-sm leading-relaxed mb-6 text-slate-400">
             Đơn vị phân phối chiến lược F1 các dự án căn hộ thuộc Tập đoàn Bcons. Uy tín - Tận tâm - Chuyên nghiệp.
          </p>
        </div>
        
        <div>
          <h5 className="text-white font-bold mb-6 uppercase text-xs tracking-widest flex items-center">
             <span className="w-8 h-[2px] bg-emerald-600 mr-3"></span> Liên Kết
          </h5>
          <ul className="space-y-3 text-sm">
            <li><Link href="/" className="hover:text-white transition-colors">Trang chủ</Link></li>
            <li><Link href="/#projects" className="hover:text-white transition-colors">Dự án triển khai</Link></li>
            <li><Link href="/lien-he" className="hover:text-white transition-colors">Liên hệ tư vấn</Link></li>
            <li><Link href="/admin/login" className="hover:text-white transition-colors">Admin Portal</Link></li>
          </ul>
        </div>

        <div className="md:col-span-2">
          <h5 className="text-white font-bold mb-6 uppercase text-xs tracking-widest flex items-center">
             <span className="w-8 h-[2px] bg-emerald-600 mr-3"></span> Văn Phòng Giao Dịch
          </h5>
          <div className="space-y-4 text-sm">
             <p>📍 176 Nguyễn Văn Thương, P.25, Q. Bình Thạnh, TP.HCM</p>
             <p className="text-white font-bold text-lg">📞 0984.293.633 (Hotline 24/7)</p>
             <p>📧 lienhe@bconschungcu.com</p>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-900 pt-8 text-center px-4">
         <p className="text-xs text-slate-600">© 2025 Bcons Real Estate. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
