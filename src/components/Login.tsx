import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Heart, User, Lock, ArrowRight, Activity, Eye, EyeOff } from 'lucide-react';

interface LoginProps {
  onLoginSuccess: (doctorName: string) => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [username, setUsername] = useState('arief.sidik');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Username dan Password wajib diisi.');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    // Simulate doctor authentication
    setTimeout(() => {
      if (username === 'arief.sidik' && password === 'password123') {
        onLoginSuccess('Dr. Arief Sidik');
      } else {
        setError('Kredensial salah. Gunakan username "arief.sidik" dan password "password123".');
        setIsLoading(false);
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-12 font-sans font-normal antialiased selection:bg-blue-550 selection:text-white">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-[1200px] h-[90vh] min-h-[650px] bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200/50 flex flex-col lg:flex-row"
      >
        {/* Left Hand: Login Form Panel */}
        <div className="w-full lg:w-5/12 bg-white flex flex-col justify-center px-6 py-12 md:px-12 lg:px-16 relative z-10">
          <div className="w-full max-w-[380px] mx-auto">
            {/* Logo and Brand Header */}
            <div className="mb-8 text-center lg:text-left">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-14 h-14 bg-blue-50/80 rounded-2xl flex items-center justify-center mb-6 mx-auto lg:mx-0 border border-blue-100 shadow-sm"
              >
                <Heart className="text-[#0053db] fill-[#0053db]/10 w-8 h-8" />
              </motion.div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Selamat Datang</h1>
              <p className="text-sm font-medium text-slate-500">Sistem Klasifikasi Tingkat Hipertensi AI</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="p-3.5 bg-red-550/10 border border-red-200 rounded-xl text-xs text-red-700 font-medium"
                >
                  {error}
                </motion.div>
              )}

              {/* Username field */}
              <div className="space-y-1.5 animate-fadeIn">
                <label className="text-xs font-semibold text-slate-700 tracking-wide" htmlFor="username">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="text-slate-400 w-5 h-5" />
                  </div>
                  <input
                    id="username"
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Masukkan username"
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50/80 border border-slate-200 rounded-2xl text-slate-950 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-sm font-medium shadow-inner"
                  />
                </div>
              </div>

              {/* Password field */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 tracking-wide" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="text-slate-400 w-5 h-5" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan password"
                    className="w-full pl-11 pr-12 py-3.5 bg-slate-50/80 border border-slate-200 rounded-2xl text-slate-950 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-sm font-medium shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Help Actions */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center space-x-2.5 cursor-pointer group select-none">
                  <div className="relative flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="absolute w-5 h-5 opacity-0 cursor-pointer z-10"
                    />
                    <motion.div 
                      animate={{
                        backgroundColor: rememberMe ? '#0053db' : '#f8fafc',
                        borderColor: rememberMe ? '#0053db' : '#cbd5e1',
                      }}
                      className="w-5 h-5 border rounded-md flex items-center justify-center transition-colors shadow-sm"
                    >
                      {rememberMe && (
                        <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      )}
                    </motion.div>
                  </div>
                  <span className="text-xs text-slate-500 group-hover:text-slate-700 font-medium transition-colors">
                    Ingat saya
                  </span>
                </label>
                <button
                  type="button"
                  onClick={() => setError('Silakan hubungi administrator IT untuk mereset kata sandi Anda.')}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Lupa Password?
                </button>
              </div>

              {/* CTA button */}
              <motion.button
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading}
                type="submit"
                className="w-full bg-[#0053db] hover:bg-[#004ac6] text-white font-semibold text-sm py-3.5 px-6 rounded-2xl shadow-[0_4px_18px_rgba(0,83,219,0.3)] hover:shadow-[0_8px_24px_rgba(0,83,219,0.4)] transition-all duration-200 flex justify-center items-center gap-2 mt-4 disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Memverifikasi...</span>
                  </div>
                ) : (
                  <>
                    <span>Masuk Sistem</span>
                    <ArrowRight className="w-4.5 h-4.5" />
                  </>
                )}
              </motion.button>
            </form>

            <div className="mt-10 text-center">
              <p className="text-xs text-slate-400 font-medium">
                Sistem hanya untuk tenaga medis berwenang.
              </p>
            </div>
          </div>
        </div>

        {/* Right Hand: AI Illustration / Feature Showcase */}
        <div className="hidden lg:flex lg:w-7/12 bg-gradient-to-tr from-blue-200 via-blue-50 to-indigo-100 relative items-center justify-center overflow-hidden p-12">
          {/* Neon Radial Highlights */}
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-300/30 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="absolute bottom-[-15%] right-[-15%] w-[60%] h-[60%] bg-indigo-300/30 rounded-full blur-[100px] pointer-events-none"></div>

          <div className="relative w-full h-full flex flex-col items-center justify-center z-10">
            {/* Visual Graphics Illustration using requested hotlink */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="w-full max-w-[460px] h-full max-h-[460px] flex items-center justify-center relative select-none"
            >
              <img 
                alt="Healthcare AI Illustration" 
                referrerPolicy="no-referrer"
                className="max-w-full max-h-full object-contain filter drop-shadow-[0_20px_50px_rgba(0,0,0,0.08)] rounded-3xl"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBF84h0iBs4tvBz-v3OcfigPY3H2tu1_GkBeeCrgz8JCs2fC_OPtJr5K52zs3FdbyQucYqm0aaspAuABLiSkMwv1xbhRSe6ncwxY3yhlfnrjgDvCqmRDmoHLms1I9zwq9lKhd3KseNI9nG9N7QjclwDR3_n7gzSxH-8UjrI_mImuUGlp9RpAaR-QSPxHNwEEQ9SCZcaPTXRcfI0awhWLEl9BSlz3gRIljTInptS223_irCT5SCP-AVJdOocG50ey5N47ciGY8wVs-0" 
              />
            </motion.div>

            {/* Floating Glassmorphism Status Panel */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.7 }}
              className="absolute bottom-6 left-6 right-6 p-5 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/40 shadow-[0_12px_45px_rgba(0,0,0,0.06)] flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#0053db]/10 flex items-center justify-center border border-[#0053db]/20">
                  <Activity className="text-[#0053db] w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-800">Akurasi Prediksi AI</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Update terbaru: 98.4% tingkat akurasi klinis</p>
                </div>
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full shadow-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[11px] font-bold text-emerald-800 select-none tracking-wide">Sistem Aktif</span>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
