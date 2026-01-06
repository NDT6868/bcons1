import React from 'react';
import LeadForm from '@/components/lead/LeadForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Liên Hệ & Báo Giá | Bcons Chung Cư',
  description: 'Liên hệ phòng kinh doanh Bcons để nhận bảng giá và chính sách ưu đãi mới nhất.',
};

export default function ContactPage() {
  return (
    <div className="pt-32 pb-24 min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16">
          
          <div className="space-y-12">
            <div>
              <h1 className="text-5xl font-black text-slate-900 mb-6">Liên Hệ <br/>Chủ Đầu Tư</h1>
              <p className="text-slate-500 text-lg leading-relaxed">
                Chúng tôi luôn sẵn sàng hỗ trợ bạn. Vui lòng để lại thông tin hoặc liên hệ trực tiếp qua Hotline.
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex items-start space-x-6">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-3xl text-emerald-600">📍</div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Văn Phòng Giao Dịch</h3>
                  <p className="text-slate-500">176 Nguyễn Văn Thương, P.25, Q. Bình Thạnh, TP.HCM</p>
                </div>
              </div>
              <div className="flex items-start space-x-6">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-3xl text-emerald-600">📞</div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Hotline 24/7</h3>
                  <a href="tel:0984293633" className="text-2xl font-black text-emerald-600 hover:underline">0984.293.633</a>
                </div>
              </div>
              <div className="flex items-start space-x-6">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-3xl text-emerald-600">📧</div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Email</h3>
                  <p className="text-slate-500">lienhe@bconschungcu.com</p>
                </div>
              </div>
            </div>

            <div className="p-8 bg-emerald-50 rounded-3xl border border-emerald-100">
              <p className="font-bold text-emerald-800 mb-2">Lưu ý quan trọng:</p>
              <p className="text-sm text-emerald-700/80">
                Hiện nay có nhiều website giả mạo. Quý khách vui lòng liên hệ trực tiếp hotline hoặc đăng ký tại form bên cạnh để đảm bảo quyền lợi và nhận bảng giá gốc từ Chủ đầu tư.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-[40px] shadow-2xl p-8 border border-slate-100">
            <LeadForm projectSlug="contact-page" projectName="Trang Liên Hệ" className="!shadow-none !border-0" />
          </div>

        </div>
      </div>
    </div>
  );
}