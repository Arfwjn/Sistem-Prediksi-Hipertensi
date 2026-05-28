import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings, User, Cpu, CheckCircle2, RotateCcw, AlertCircle, Save, Info } from 'lucide-react';
import { useSettings } from '../features/settings/hooks/useSettings';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';

export default function SettingsPage() {
  const {
    docName,
    setDocName,
    docSpecialty,
    setDocSpecialty,
    docHospital,
    setDocHospital,
    activeModel,
    setActiveModel,
    rfTrees,
    setRfTrees,
    rfMaxDepth,
    setRfMaxDepth,
    dtMinSamples,
    setDtMinSamples,
    lrIterations,
    setLrIterations,
    confidenceFactor,
    setConfidenceFactor,
    showToast,
    toastMessage,
    handleSaveProfile,
    handleSaveModel,
    handleResetDatabase,
  } = useSettings();

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
              <Input
                label="Nama Lengkap Dokter"
                required
                value={docName}
                onChange={(e) => setDocName(e.target.value)}
              />

              <Input
                label="Spesialisasi"
                required
                value={docSpecialty}
                onChange={(e) => setDocSpecialty(e.target.value)}
              />

              <Input
                label="Rumah Sakit / Klinik"
                value={docHospital}
                onChange={(e) => setDocHospital(e.target.value)}
              />

              <div className="pt-4 select-none">
                <Button
                  type="submit"
                  className="w-full py-3 flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Perbarui Profil Kontak</span>
                </Button>
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
            <Select
              label="Metodologi Utama Classifier"
              value={activeModel}
              onChange={(e) => setActiveModel(e.target.value as any)}
              options={[
                { value: 'Random Forest', label: 'Random Forest (Sangat Akurat)' },
                { value: 'Decision Tree', label: 'Decision Tree (Sedang)' },
              ]}
            />

            {/* Random forest sliders */}
            {activeModel === 'Random Forest' && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-4 border-l-2 border-blue-500 pl-4 py-1"
              >
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs text-slate-655 font-bold">
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
                    className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-blue-600 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs text-slate-655 font-bold">
                    <span>Kedalaman Maksimal Cabang (Depth)</span>
                    <span className="text-blue-600">{rfMaxDepth}</span>
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="20"
                    value={rfMaxDepth}
                    onChange={(e) => setRfMaxDepth(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-blue-600 focus:outline-none"
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
                  <div className="flex justify-between items-center text-xs text-slate-655 font-bold">
                    <span>Min Samples Split</span>
                    <span className="text-emerald-700">{dtMinSamples}</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="10"
                    value={dtMinSamples}
                    onChange={(e) => setDtMinSamples(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-emerald-600 focus:outline-none"
                  />
                </div>
              </motion.div>
            )}

            {/* Precision factor adjustment slider */}
            <div className="space-y-1 pt-2">
              <div className="flex justify-between items-center text-xs text-slate-655 font-bold">
                <span className="flex items-center gap-1.5">
                  Faktor Kepercayaan AI
                  <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" title="Skala pengubah bias skor probabilitas kepercayaan hasil prediksi" />
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
                className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-blue-600 focus:outline-none"
              />
            </div>

            <div className="pt-2 select-none">
              <Button
                type="submit"
                variant="primary"
                className="w-full py-3 flex items-center justify-center gap-2 bg-slate-900 border-slate-900 hover:bg-slate-950 text-white"
              >
                <span>Terapkan Parameter AI</span>
              </Button>
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
          <Button
            onClick={handleResetDatabase}
            type="button"
            variant="danger"
            className="w-full sm:w-auto px-5 py-2.5 flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Database Ke Default</span>
          </Button>
        </div>
      </section>
    </div>
  );
}
