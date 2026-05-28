import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings, User, Cpu, Sparkles, CheckCircle2, RotateCcw, AlertCircle, Save, Info } from 'lucide-react';
import { DoctorProfile, AIModelConfig } from '../types';

interface SettingsProps {
  doctor: DoctorProfile;
  modelConfig: AIModelConfig;
  onUpdateDoctor: (update: DoctorProfile) => void;
  onUpdateModelConfig: (update: AIModelConfig) => void;
  onResetDatabase: () => void;
}

export default function SettingsPage({
  doctor,
  modelConfig,
  onUpdateDoctor,
  onUpdateModelConfig,
  onResetDatabase
}: SettingsProps) {
  // Doctor form states
  const [docName, setDocName] = useState(doctor.name);
  const [docSpecialty, setDocSpecialty] = useState(doctor.specialty);
  const [docHospital, setDocHospital] = useState(doctor.hospital);

  // Model states
  const [activeModel, setActiveModel] = useState(modelConfig.activeModel);
  const [rfTrees, setRfTrees] = useState(modelConfig.rfTrees);
  const [rfMaxDepth, setRfMaxDepth] = useState(modelConfig.rfMaxDepth);
  const [dtMinSamples, setDtMinSamples] = useState(modelConfig.dtMinSamples);
  const [lrIterations, setLrIterations] = useState(modelConfig.lrIterations);
  const [confidenceFactor, setConfidenceFactor] = useState(modelConfig.confidenceFactor);

  // Notifications
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName.trim() || !docSpecialty.trim()) {
      alert('Nama Dokter dan Spesialisasi tidak boleh kosong.');
      return;
    }
    onUpdateDoctor({
      ...doctor,
      name: docName,
      specialty: docSpecialty,
      hospital: docHospital
    });
    triggerToast('Profil Dokter berhasil diperbarui!');
  };

  const handleSaveModel = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateModelConfig({
      activeModel,
      rfTrees,
      rfMaxDepth,
      dtMinSamples,
      lrIterations,
      confidenceFactor
    });
    triggerToast('Konfigurasi Parameter AI berhasil disimpan!');
  };

  const handleResetClick = () => {
    if (confirm('Apakah Anda yakin ingin mereset seluruh database riwayat prediksi dan pasien ke setelan bawaan klinis?')) {
      onResetDatabase();
      triggerToast('Database berhasil di-reset ke nilai default klinis.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4 select-none relative text-left">
      {/* Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed top-24 right-8 z-50 bg-slate-900 border border-slate-750 text-white px-5 py-3 rounded-xl shadow-xl text-xs font-bold flex items-center gap-2.5"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Settings className="w-6 h-6 text-slate-800" />
          <span>Pengaturan Sistem Klasifikasi</span>
        </h2>
        <p className="text-sm font-semibold text-slate-400 mt-1">Konfigurasikan profil dokter dan model kecerdasan buatan (AI) klinis.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Tab 1: Physician Profile Settings */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2 border-b pb-3 border-slate-100 select-none">
              <User className="text-blue-600 w-5 h-5" />
              <span>Profil Pengguna (Dokter)</span>
            </h3>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Nama Lengkap Dokter</label>
                <input
                  type="text"
                  required
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-105/80 transition-all text-xs font-semibold text-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Spesialisasi</label>
                <input
                  type="text"
                  required
                  value={docSpecialty}
                  onChange={(e) => setDocSpecialty(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-105/80 transition-all text-xs font-semibold text-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Rumah Sakit / Klinik</label>
                <input
                  type="text"
                  value={docHospital}
                  onChange={(e) => setDocHospital(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-105/80 transition-all text-xs font-semibold text-slate-800"
                />
              </div>

              <div className="pt-4 select-none">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Perbarui Profil Kontak</span>
                </motion.button>
              </div>
            </form>
          </div>
        </div>

        {/* Tab 2: Hyperparameters and active models configuration */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2 border-b pb-3 border-slate-100 select-none">
            <Cpu className="text-blue-600 w-5 h-5" />
            <span>Konfigurasi Algoritma AI</span>
          </h3>

          <form onSubmit={handleSaveModel} className="space-y-5 pt-4">
            {/* Active Model */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Metodologi Utama Classifier</label>
              <select
                value={activeModel}
                onChange={(e) => setActiveModel(e.target.value as AIModelConfig['activeModel'])}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-105/80 transition-all text-xs font-semibold text-slate-800"
              >
                <option value="Random Forest">Random Forest (Sangat Akurat)</option>
                <option value="Decision Tree">Decision Tree (Sedang)</option>
                <option value="Logistic Regression">Logistic Regression (Asosiatif)</option>
              </select>
            </div>

            {/* Random forest sliders */}
            {activeModel === 'Random Forest' && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-4 border-l-2 border-blue-500 pl-4 py-1"
              >
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs text-slate-650 font-bold">
                    <span>Jumlah Estimator Pohon (Trees)</span>
                    <span className="text-blue-600">{rfTrees}</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="250"
                    step="10"
                    value={rfTrees}
                    onChange={(e) => setRfTrees(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-blue-600"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs text-slate-650 font-bold">
                    <span>Kedalaman Maksimal Cabang (Depth)</span>
                    <span className="text-blue-600">{rfMaxDepth}</span>
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="20"
                    value={rfMaxDepth}
                    onChange={(e) => setRfMaxDepth(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
              </motion.div>
            )}

            {/* Decision tree sliders */}
            {activeModel === 'Decision Tree' && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-4 border-l-2 border-emerald-500 pl-4 py-1"
              >
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs text-slate-650 font-bold">
                    <span>Min Samples Split</span>
                    <span className="text-emerald-700">{dtMinSamples}</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="10"
                    value={dtMinSamples}
                    onChange={(e) => setDtMinSamples(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-emerald-600"
                  />
                </div>
              </motion.div>
            )}

            {/* Logistic regression inputs */}
            {activeModel === 'Logistic Regression' && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-4 border-l-2 border-indigo-500 pl-4 py-1"
              >
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-650 block">Maksimal Iterasi Konvergensi</label>
                  <input
                    type="number"
                    min="50"
                    max="1000"
                    step="50"
                    value={lrIterations}
                    onChange={(e) => setLrIterations(Number(e.target.value))}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 text-xs font-semibold text-slate-800"
                  />
                </div>
              </motion.div>
            )}

            {/* Precision factor adjustment slider */}
            <div className="space-y-1 pt-2">
              <div className="flex justify-between items-center text-xs text-slate-650 font-bold">
                <span className="flex items-center gap-1.5">
                  Faktor Kepercayaan AI
                  <Info className="w-3.5 h-3.5 text-slate-400" title="Skala pengubah bias skor probabilitas kepercayaan hasil prediksi" />
                </span>
                <span className="text-blue-600 font-bold">{confidenceFactor}x</span>
              </div>
              <input
                type="range"
                min="0.80"
                max="1.10"
                step="0.01"
                value={confidenceFactor}
                onChange={(e) => setConfidenceFactor(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            <div className="pt-2 select-none">
              <motion.button
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-950 text-white font-bold text-xs py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Terapkan Parameter AI</span>
              </motion.button>
            </div>
          </form>
        </div>
      </div>

      {/* Database control sector */}
      <section className="bg-red-50/20 border border-red-150 rounded-2xl p-6 select-none shadow-[0_4px_15px_rgba(220,38,38,0.01)] text-left">
        <h4 className="text-sm font-bold text-red-700 flex items-center gap-2 border-b border-red-100 pb-3">
          <AlertCircle className="w-5 h-5 text-red-650" />
          <span>Zona Bahaya (Danger Zone)</span>
        </h4>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-4">
          <div>
            <h5 className="text-xs font-bold text-slate-800 leading-snug">Reset Seluruh Kumpulan Data Medis</h5>
            <p className="text-[11px] font-semibold text-slate-450 leading-relaxed mt-0.5">
              Tindakan ini akan mengosongkan seluruh perubahan baru, riwayat pasien yang Anda tambahkan, dan mengembalikan setelan mock pabrik.
            </p>
          </div>
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleResetClick}
            type="button"
            className="w-full sm:w-auto px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Database Ke Default</span>
          </motion.button>
        </div>
      </section>
    </div>
  );
}
