
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import * as firebaseAuth from 'firebase/auth';
import { auth } from '@/services/firebase';
import { useAuth } from '@/contexts/AuthContext';
import AdminDashboard from '@/components/AdminDashboard';

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  // Nếu đã login, hiển thị Dashboard luôn
  if (loading) return <div className="min-h-screen flex items-center justify-center">Đang tải...</div>;
  if (user) return <AdminDashboard />;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    setError('');

    try {
      await firebaseAuth.signInWithEmailAndPassword(auth, email, password);
      // Auth listener trong AuthContext sẽ tự update state và render Dashboard
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/invalid-credential') {
        setError('Email hoặc mật khẩu không chính xác.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Quá nhiều lần thử lại. Vui lòng đợi.');
      } else {
        setError('Đăng nhập thất bại. Vui lòng thử lại sau.');
      }
    } finally {
      setLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="bg-white rounded-[32px] w-full max-w-md p-10 shadow-2xl animate-scaleIn">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-emerald-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl shadow-xl shadow-emerald-200">
            🛡️
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-2">Bcons CMS</h2>
          <p className="text-slate-500 text-sm font-medium">Hệ thống quản trị tập trung</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Email</label>
            <input 
              type="email" 
              className="w-full p-4 rounded-xl border border-slate-200 focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all bg-slate-50 focus:bg-white font-medium text-slate-900"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@bconschungcu.com"
              autoFocus
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Mật khẩu</label>
            <input 
              type="password" 
              className="w-full p-4 rounded-xl border border-slate-200 focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all bg-slate-50 focus:bg-white font-medium text-slate-900"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-bold flex items-center border border-red-100 animate-pulse">
              <span className="mr-2">⚠️</span> {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loggingIn}
            className="w-full bg-emerald-600 text-white font-black py-4 rounded-xl hover:bg-emerald-700 transition-all uppercase tracking-widest text-sm mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loggingIn ? 'Đang xử lý...' : 'Đăng Nhập'}
          </button>
        </form>
        
        <div className="text-center mt-6">
           <p className="text-xs text-slate-400">Liên hệ bộ phận kỹ thuật nếu quên mật khẩu.</p>
        </div>
      </div>
    </div>
  );
}
