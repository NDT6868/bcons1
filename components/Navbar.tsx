"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
  { label: 'Trang chủ', href: '/' },
  { label: 'Dự án Bcons', href: '/du-an' },
  { label: 'Tiến độ', href: '/#progress' },
  { label: 'Liên hệ', href: '/lien-he' },
];

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Đóng menu mobile khi chuyển trang
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const isHomePage = pathname === '/';

  return (
    <nav className={`fixed w-full z-[80] transition-all duration-500 ${
      scrolled ? 'bg-white/90 backdrop-blur-xl shadow-lg py-3' : 'bg-transparent py-6'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center group">
              <span className={`text-2xl font-black transition-colors ${scrolled ? 'text-emerald-600' : 'text-emerald-700'}`}>BCONS</span>
              <span className={`text-2xl font-light ml-1 ${scrolled ? 'text-slate-900' : 'text-slate-900'}`}>CHUNGCU</span>
            </Link>
          </div>
          
          <div className="hidden lg:block">
            <div className="flex items-center space-x-10">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`text-[11px] font-black uppercase tracking-[2px] transition-all hover:text-emerald-600 ${
                    scrolled ? 'text-slate-600' : 'text-slate-700'
                  } ${pathname === link.href ? 'text-emerald-600' : ''}`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/lien-he"
                className="bg-emerald-600 text-white px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200/50"
              >
                Nhận Báo Giá
              </Link>
            </div>
          </div>

          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-slate-900 focus:outline-none bg-white/20 rounded-xl"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden fixed inset-0 z-[100] bg-white transition-all duration-500 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-12">
            <span className="text-2xl font-black text-emerald-600">BCONS</span>
            <button onClick={() => setIsOpen(false)} className="text-slate-900 p-2">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div className="space-y-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="block text-2xl font-bold text-slate-900 hover:text-emerald-600 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/lien-he"
              className="block w-full bg-emerald-600 text-white text-center font-bold py-5 rounded-3xl mt-12 shadow-xl shadow-emerald-100"
            >
              ĐĂNG KÝ NGAY
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;