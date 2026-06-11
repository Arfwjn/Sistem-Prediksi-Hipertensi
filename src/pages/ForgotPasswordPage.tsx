import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, ShieldCheck, KeyRound, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import api from '../services/api';

// Animated floating particle component
function FloatingParticle({ delay, size, x, y, duration }: { delay: number; size: number; x: string; y: string; duration: number }) {
  return (
    <motion.div
      className="absolute rounded-full bg-amber-400/12 pointer-events-none"
      style={{ width: size, height: size, left: x, top: y }}
      animate={{
        y: [0, -20, 0],
        x: [0, 10, 0],
        opacity: [0.2, 0.5, 0.2],
        scale: [1, 1.1, 1],
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

type Step = 'request' | 'reset' | 'done';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>('request');
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Step 1: Request reset token
  const handleRequestToken = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email.trim()) {
      setError('Email wajib diisi.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.post('/forgot-password', { email });
      setSuccess(res.data?.message || 'Token reset password telah dikirim. Periksa email Anda atau gunakan token di bawah.');
      setStep('reset');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Email tidak ditemukan dalam sistem.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Reset password with token
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!token.trim() || !password.trim()) {
      setError('Token dan password baru wajib diisi.');
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
      await api.post('/reset-password', {
        email,
        token,
        password,
        password_confirmation: passwordConfirmation,
      });
      setStep('done');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Token tidak valid atau telah kadaluarsa.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/30 to-orange-50/20 flex items-center justify-center p-4 font-sans antialiased selection:bg-amber-500 selection:text-white relative overflow-hidden">
      {/* Animated background particles */}
      <FloatingParticle delay={0} size={75} x="12%" y="22%" duration={7} />
      <FloatingParticle delay={1} size={50} x="82%" y="18%" duration={6.5} />
      <FloatingParticle delay={2.5} size={85} x="68%" y="72%" duration={8} />
      <FloatingParticle delay={0.6} size={40} x="22%" y="78%" duration={9} />
      <FloatingParticle delay={1.5} size={55} x="48%" y="6%" duration={5.5} />

      {/* Subtle radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-200/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-[420px] relative z-10"
      >
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/60 shadow-[0_20px_60px_rgba(0,0,0,0.08)] p-8 md:p-10">

          {/* Logo and header */}
          <div className="text-center mb-7">
            <motion.div
              whileHover={{ scale: 1.08, rotate: 3 }}
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
              {step === 'done' ? 'Password Berhasil Direset' : 'Lupa Password'}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="text-sm text-slate-500 mt-1.5 font-medium"
            >
              {step === 'request' && 'Masukkan email untuk menerima token reset'}
              {step === 'reset' && 'Masukkan token dan password baru Anda'}
              {step === 'done' && 'Anda dapat login dengan password baru'}
            </motion.p>
          </div>

          {/* Messages */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600 font-medium text-center"
            >
              {error}
            </motion.div>
          )}
          {success && step === 'reset' && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="mb-4 p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-xs text-emerald-600 font-medium text-center"
            >
              {success}
            </motion.div>
          )}

          {/* STEP 1: Request reset token */}
          {step === 'request' && (
            <form onSubmit={handleRequestToken} className="space-y-4">
              <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 tracking-wide" htmlFor="fp-email">Alamat Email</label>
                <div className={`relative rounded-xl transition-all duration-300 ${focusedField === 'email' ? 'ring-2 ring-amber-400/40 ring-offset-1' : ''}`}>
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail className={`w-4.5 h-4.5 transition-colors duration-200 ${focusedField === 'email' ? 'text-amber-500' : 'text-slate-400'}`} />
                  </div>
                  <input
                    id="fp-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Masukkan email terdaftar"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50/80 border border-slate-200/80 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-amber-400 transition-all text-sm font-medium"
                  />
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="pt-1">
                <Button type="submit" variant="primary" size="lg" isLoading={isLoading} className="w-full">
                  {!isLoading && (
                    <>
                      <span>Kirim Token Reset</span>
                      <ArrowRight className="w-4.5 h-4.5" />
                    </>
                  )}
                  {isLoading && <span>Mengirim...</span>}
                </Button>
              </motion.div>
            </form>
          )}

          {/* STEP 2: Enter token + new password */}
          {step === 'reset' && (
            <form onSubmit={handleResetPassword} className="space-y-3.5">
              {/* Token */}
              <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 tracking-wide" htmlFor="fp-token">Token Reset</label>
                <div className={`relative rounded-xl transition-all duration-300 ${focusedField === 'token' ? 'ring-2 ring-amber-400/40 ring-offset-1' : ''}`}>
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <KeyRound className={`w-4.5 h-4.5 transition-colors duration-200 ${focusedField === 'token' ? 'text-amber-500' : 'text-slate-400'}`} />
                  </div>
                  <input
                    id="fp-token"
                    type="text"
                    required
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    onFocus={() => setFocusedField('token')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Masukkan token dari email"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50/80 border border-slate-200/80 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-amber-400 transition-all text-sm font-medium"
                  />
                </div>
              </motion.div>

              {/* New Password */}
              <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 tracking-wide" htmlFor="fp-password">Password Baru</label>
                <div className={`relative rounded-xl transition-all duration-300 ${focusedField === 'newpass' ? 'ring-2 ring-amber-400/40 ring-offset-1' : ''}`}>
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className={`w-4.5 h-4.5 transition-colors duration-200 ${focusedField === 'newpass' ? 'text-amber-500' : 'text-slate-400'}`} />
                  </div>
                  <input
                    id="fp-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField('newpass')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Minimal 6 karakter"
                    className="w-full pl-10 pr-11 py-2.5 bg-slate-50/80 border border-slate-200/80 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-amber-400 transition-all text-sm font-medium"
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

              {/* Confirm Password */}
              <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 tracking-wide" htmlFor="fp-password-confirm">Konfirmasi Password</label>
                <div className={`relative rounded-xl transition-all duration-300 ${focusedField === 'confirmpass' ? 'ring-2 ring-amber-400/40 ring-offset-1' : ''}`}>
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className={`w-4.5 h-4.5 transition-colors duration-200 ${focusedField === 'confirmpass' ? 'text-amber-500' : 'text-slate-400'}`} />
                  </div>
                  <input
                    id="fp-password-confirm"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    onFocus={() => setFocusedField('confirmpass')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Ulangi password baru"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50/80 border border-slate-200/80 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-amber-400 transition-all text-sm font-medium"
                  />
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="pt-1">
                <Button type="submit" variant="primary" size="lg" isLoading={isLoading} className="w-full">
                  {!isLoading && (
                    <>
                      <span>Reset Password</span>
                      <ArrowRight className="w-4.5 h-4.5" />
                    </>
                  )}
                  {isLoading && <span>Memproses...</span>}
                </Button>
              </motion.div>

              <button
                type="button"
                onClick={() => { setStep('request'); setError(''); setSuccess(''); }}
                className="w-full text-center text-xs text-slate-500 hover:text-slate-700 font-medium transition-colors cursor-pointer pt-1"
              >
                ← Kembali ke permintaan token
              </button>
            </form>
          )}

          {/* STEP 3: Success */}
          {step === 'done' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-100">
                <CheckCircle className="w-8 h-8 text-emerald-500" />
              </div>
              <p className="text-sm text-slate-600 font-medium mb-5">
                Password Anda berhasil direset. Silakan login dengan password baru.
              </p>
              <Link to="/login">
                <Button variant="primary" size="lg" className="w-full">
                  <span>Kembali ke Login</span>
                  <ArrowRight className="w-4.5 h-4.5" />
                </Button>
              </Link>
            </motion.div>
          )}

          {/* Link to Login (only on step 1 & 2) */}
          {step !== 'done' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-6 text-center"
            >
              <p className="text-xs text-slate-500 font-medium">
                Sudah ingat password?{' '}
                <Link to="/login" className="text-blue-600 hover:text-blue-800 font-semibold transition-colors">
                  Masuk di sini
                </Link>
              </p>
            </motion.div>
          )}

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
