import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, ArrowRight, Eye, EyeOff, ShieldCheck, Mail, UserPlus } from 'lucide-react';
import { Button } from '../components/ui/Button';
import api from '../services/api';

// Animated floating particle component
function FloatingParticle({ delay, size, x, y, duration }: { delay: number; size: number; x: string; y: string; duration: number }) {
  return (
    <motion.div
      className="absolute rounded-full bg-indigo-400/15 pointer-events-none"
      style={{ width: size, height: size, left: x, top: y }}
      animate={{
        y: [0, -25, 0],
        x: [0, 12, 0],
        opacity: [0.3, 0.6, 0.3],
        scale: [1, 1.15, 1],
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

export default function RegisterPage() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name.trim() || !username.trim() || !email.trim() || !password.trim()) {
      setError('Semua field wajib diisi.');
      return;
    }

    if (password !== passwordConfirmation) {
      setError('Konfirmasi password tidak cocok.');
      return;
    }

    if (password.length < 6) {
      setError('Password minimal 6 karakter.');
      return;
    }

    setIsLoading(true);

    try {
      await api.post('/register', {
        name,
        username,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });
      setSuccess('Registrasi berhasil! Mengalihkan ke halaman login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Registrasi gagal. Silakan coba lagi.';
      setError(msg);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/40 to-blue-50/30 flex items-center justify-center p-4 font-sans antialiased selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      {/* Animated background particles */}
      <FloatingParticle delay={0} size={70} x="8%" y="25%" duration={7} />
      <FloatingParticle delay={1.2} size={55} x="85%" y="12%" duration={6} />
      <FloatingParticle delay={2} size={90} x="75%" y="65%" duration={8} />
      <FloatingParticle delay={0.8} size={45} x="15%" y="80%" duration={9} />
      <FloatingParticle delay={1.8} size={60} x="55%" y="8%" duration={5.5} />

      {/* Subtle radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-200/20 rounded-full blur-[120px] pointer-events-none" />

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
          <div className="text-center mb-7">
            <motion.div
              whileHover={{ scale: 1.08, rotate: -3 }}
              whileTap={{ scale: 0.95 }}
              className="w-14 h-14 mx-auto mb-4 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center justify-center cursor-pointer overflow-hidden"
            >
              <img src="/logo_banyumas.png" alt="Logo" className="w-10 h-10 object-contain" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-2xl font-bold text-slate-900 tracking-tight"
            >
              Buat Akun Baru
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="text-sm text-slate-500 mt-1.5 font-medium"
            >
              Daftarkan akun untuk akses sistem
            </motion.p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600 font-medium text-center"
              >
                {error}
              </motion.div>
            )}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-xs text-emerald-600 font-medium text-center"
              >
                {success}
              </motion.div>
            )}

            {/* Nama Lengkap */}
            <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 tracking-wide" htmlFor="reg-name">Nama Lengkap</label>
              <div className={`relative rounded-xl transition-all duration-300 ${focusedField === 'name' ? 'ring-2 ring-indigo-400/40 ring-offset-1' : ''}`}>
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <UserPlus className={`w-4.5 h-4.5 transition-colors duration-200 ${focusedField === 'name' ? 'text-indigo-500' : 'text-slate-400'}`} />
                </div>
                <input
                  id="reg-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Masukkan nama lengkap"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50/80 border border-slate-200/80 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-400 transition-all text-sm font-medium"
                />
              </div>
            </motion.div>

            {/* Username */}
            <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }} className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 tracking-wide" htmlFor="reg-username">Username</label>
              <div className={`relative rounded-xl transition-all duration-300 ${focusedField === 'username' ? 'ring-2 ring-indigo-400/40 ring-offset-1' : ''}`}>
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <User className={`w-4.5 h-4.5 transition-colors duration-200 ${focusedField === 'username' ? 'text-indigo-500' : 'text-slate-400'}`} />
                </div>
                <input
                  id="reg-username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={() => setFocusedField('username')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Masukkan username"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50/80 border border-slate-200/80 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-400 transition-all text-sm font-medium"
                />
              </div>
            </motion.div>

            {/* Email */}
            <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 tracking-wide" htmlFor="reg-email">Email</label>
              <div className={`relative rounded-xl transition-all duration-300 ${focusedField === 'email' ? 'ring-2 ring-indigo-400/40 ring-offset-1' : ''}`}>
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className={`w-4.5 h-4.5 transition-colors duration-200 ${focusedField === 'email' ? 'text-indigo-500' : 'text-slate-400'}`} />
                </div>
                <input
                  id="reg-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Masukkan email"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50/80 border border-slate-200/80 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-400 transition-all text-sm font-medium"
                />
              </div>
            </motion.div>

            {/* Password */}
            <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.45 }} className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 tracking-wide" htmlFor="reg-password">Password</label>
              <div className={`relative rounded-xl transition-all duration-300 ${focusedField === 'password' ? 'ring-2 ring-indigo-400/40 ring-offset-1' : ''}`}>
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className={`w-4.5 h-4.5 transition-colors duration-200 ${focusedField === 'password' ? 'text-indigo-500' : 'text-slate-400'}`} />
                </div>
                <input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Minimal 6 karakter"
                  className="w-full pl-10 pr-11 py-2.5 bg-slate-50/80 border border-slate-200/80 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-400 transition-all text-sm font-medium"
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

            {/* Konfirmasi Password */}
            <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 tracking-wide" htmlFor="reg-password-confirm">Konfirmasi Password</label>
              <div className={`relative rounded-xl transition-all duration-300 ${focusedField === 'passwordConfirm' ? 'ring-2 ring-indigo-400/40 ring-offset-1' : ''}`}>
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className={`w-4.5 h-4.5 transition-colors duration-200 ${focusedField === 'passwordConfirm' ? 'text-indigo-500' : 'text-slate-400'}`} />
                </div>
                <input
                  id="reg-password-confirm"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  onFocus={() => setFocusedField('passwordConfirm')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Ulangi password"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50/80 border border-slate-200/80 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-400 transition-all text-sm font-medium"
                />
              </div>
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
                    <span>Daftar Akun</span>
                    <ArrowRight className="w-4.5 h-4.5" />
                  </>
                )}
                {isLoading && <span>Mendaftarkan...</span>}
              </Button>
            </motion.div>
          </form>

          {/* Link to Login */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65 }}
            className="mt-6 text-center"
          >
            <p className="text-xs text-slate-500 font-medium">
              Sudah punya akun?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-800 font-semibold transition-colors">
                Masuk di sini
              </Link>
            </p>
          </motion.div>

          {/* Footer badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400"
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
          Klasifikasi Hipertensi Puskesmas Kembaran 1 &copy; {new Date().getFullYear()}
        </motion.p>
      </motion.div>
    </div>
  );
}
