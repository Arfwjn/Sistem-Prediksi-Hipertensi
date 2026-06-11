import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, ArrowRight, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { Button } from '../components/ui/Button';

// Animated floating particle component
function FloatingParticle({ delay, size, x, y, duration }: { delay: number; size: number; x: string; y: string; duration: number }) {
  return (
    <motion.div
      className="absolute rounded-full bg-blue-400/15 pointer-events-none"
      style={{ width: size, height: size, left: x, top: y }}
      animate={{
        y: [0, -30, 0],
        x: [0, 15, 0],
        opacity: [0.3, 0.7, 0.3],
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration,
        repeat: Infinity,
        delay,
        ease: 'easeInOut',
      }}
    />
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoggedIn } = useAuthStore();

  const [username, setUsername] = useState('arfwjn');
  const [password, setPassword] = useState('arfwjn');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/dashboard', { replace: true });
    }
  }, [isLoggedIn, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Username dan Password wajib diisi.');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      await login({ username, password });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Kredensial salah. Periksa kembali username dan password Anda.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/30 flex items-center justify-center p-4 font-sans antialiased selection:bg-blue-500 selection:text-white relative overflow-hidden">
      {/* Animated background particles */}
      <FloatingParticle delay={0} size={80} x="10%" y="20%" duration={6} />
      <FloatingParticle delay={1} size={60} x="80%" y="15%" duration={8} />
      <FloatingParticle delay={2} size={100} x="70%" y="70%" duration={7} />
      <FloatingParticle delay={0.5} size={40} x="20%" y="75%" duration={9} />
      <FloatingParticle delay={1.5} size={50} x="50%" y="10%" duration={5} />
      <FloatingParticle delay={3} size={70} x="90%" y="50%" duration={6.5} />

      {/* Subtle radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-200/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-[420px] relative z-10"
      >
        {/* Glass card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/60 shadow-[0_20px_60px_rgba(0,0,0,0.08)] p-8 md:p-10">
          
          {/* Logo and header */}
          <div className="text-center mb-8">
            <motion.div
              whileHover={{ scale: 1.08, rotate: 3 }}
              whileTap={{ scale: 0.95 }}
              className="w-16 h-16 mx-auto mb-5 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center justify-center cursor-pointer overflow-hidden"
            >
              <img src="/logo_banyumas.png" alt="Logo" className="w-11 h-11 object-contain" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-2xl font-bold text-slate-900 tracking-tight"
            >
              Selamat Datang
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="text-sm text-slate-500 mt-1.5 font-medium"
            >
              Sistem Klasifikasi Tingkat Hipertensi
            </motion.p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600 font-medium text-center"
              >
                {error}
              </motion.div>
            )}

            {/* Username */}
            <motion.div
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-1.5"
            >
              <label className="text-xs font-semibold text-slate-600 tracking-wide" htmlFor="username">
                Username
              </label>
              <div className={`relative rounded-xl transition-all duration-300 ${focusedField === 'username' ? 'ring-2 ring-blue-400/40 ring-offset-1' : ''}`}>
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <User className={`w-4.5 h-4.5 transition-colors duration-200 ${focusedField === 'username' ? 'text-blue-500' : 'text-slate-400'}`} />
                </div>
                <input
                  id="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={() => setFocusedField('username')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Masukkan username"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50/80 border border-slate-200/80 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-400 transition-all text-sm font-medium"
                />
              </div>
            </motion.div>

            {/* Password */}
            <motion.div
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-1.5"
            >
              <label className="text-xs font-semibold text-slate-600 tracking-wide" htmlFor="password">
                Password
              </label>
              <div className={`relative rounded-xl transition-all duration-300 ${focusedField === 'password' ? 'ring-2 ring-blue-400/40 ring-offset-1' : ''}`}>
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className={`w-4.5 h-4.5 transition-colors duration-200 ${focusedField === 'password' ? 'text-blue-500' : 'text-slate-400'}`} />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Masukkan password"
                  className="w-full pl-10 pr-11 py-3 bg-slate-50/80 border border-slate-200/80 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-400 transition-all text-sm font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
            </motion.div>

            {/* Remember & Forgot */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-between"
            >
              <label className="flex items-center gap-2 cursor-pointer group select-none">
                <div className="relative flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="absolute w-4 h-4 opacity-0 cursor-pointer z-10"
                  />
                  <motion.div
                    animate={{
                      backgroundColor: rememberMe ? '#0053db' : '#f8fafc',
                      borderColor: rememberMe ? '#0053db' : '#cbd5e1',
                    }}
                    className="w-4 h-4 border rounded-[5px] flex items-center justify-center"
                  >
                    {rememberMe && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    )}
                  </motion.div>
                </div>
                <span className="text-xs text-slate-500 group-hover:text-slate-700 font-medium transition-colors">
                  Ingat saya
                </span>
              </label>
              <Link
                to="/forgot-password"
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
              >
                Lupa Password?
              </Link>
            </motion.div>

            {/* Submit */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              className="pt-2"
            >
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isLoading}
                className="w-full"
              >
                {!isLoading && (
                  <>
                    <span>Masuk Sistem</span>
                    <ArrowRight className="w-4.5 h-4.5" />
                  </>
                )}
                {isLoading && <span>Memverifikasi...</span>}
              </Button>
            </motion.div>
          </form>

          {/* Register link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65 }}
            className="mt-6 text-center"
          >
            <p className="text-xs text-slate-500 font-medium">
              Belum punya akun?{' '}
              <Link to="/register" className="text-blue-600 hover:text-blue-800 font-semibold transition-colors">
                Daftar di sini
              </Link>
            </p>
          </motion.div>

          {/* Footer badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-400"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span className="font-medium">Puskesmas Kembaran 1</span>
          </motion.div>
        </div>

        {/* Bottom brand tag */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-[11px] text-slate-400 mt-5 font-medium select-none"
        >
          Klasifikasi Hipertensi Puskemas Kembaran 1 &copy; {new Date().getFullYear()}
        </motion.p>
      </motion.div>
    </div>
  );
}
