
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
  { label: 'Trang chủ', href: '/' },
  { label: 'Dự án', href: '/#projects' },
  { label: 'Tiến độ', href: '/#progress' },
  { label: 'Liên hệ', href: '/lien-he' }, // Chuyển thành page riêng hoặc section
];

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHome = pathname === '/';

  return (
    <nav className={`fixed top-0 w-full z-[80] transition-all duration-300 ${
      scrolled ? 'bg-white/90 backdrop-blur-md shadow-md py-3' : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center group z-50">
            <span className="text-2xl font-black text-emerald-600">BCONS</span>
            <span className="text-2xl font-light ml-1 text-slate-900">REAL</span>
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`text-[11px] font-bold uppercase tracking-[2px] transition-colors hover:text-emerald-600 ${
                  scrolled || !isHome ? 'text-slate-600' : 'text-slate-800' // Giả sử homepage hero màu sáng
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="#lead-form"
              className="bg-emerald-600 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200"
            >
              Nhận Báo Giá
            </Link>
          </div>

          {/* Mobile Toggle */}
          <div className="lg:hidden z-50">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-slate-900 focus:outline-none"
            >
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

      {/* Mobile Menu Overlay */}
      <div className={`lg:hidden fixed inset-0 bg-white z-40 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col items-center justify-center h-full space-y-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="text-2xl font-bold text-slate-900 hover:text-emerald-600"
            >
              {link.label}
            </Link>
          ))}
          <Link
             href="#lead-form"
             onClick={() => setIsOpen(false)}
             className="bg-emerald-600 text-white px-10 py-4 rounded-full text-sm font-bold uppercase tracking-widest"
          >
            Đăng Ký Ngay
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Header;
