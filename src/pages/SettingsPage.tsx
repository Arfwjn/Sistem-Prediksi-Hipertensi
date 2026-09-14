import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Settings,
  User,
  Building2,
  ShieldCheck,
  Database,
  Download,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Save,
  Lock,
  FileSpreadsheet,
  AlertCircle,
  Phone,
  MapPin,
  FileBadge,
} from 'lucide-react';
import { useSettings } from '../features/settings/hooks/useSettings';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');

  const {
    // 1. Profil Faskes & Nakes
    docName,
    setDocName,
    docSpecialty,
    setDocSpecialty,
    docHospital,
    setDocHospital,
    docSip,
    setDocSip,
    faskesAddress,
    setFaskesAddress,
    faskesPhone,
    setFaskesPhone,
    handleSaveProfile,

    // 2. Ubah Password
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    isChangingPassword,
    passwordError,
    handleChangePassword,

    // 3. Cadangan Data & Reset
    totalPatients,
    totalRecords,
    handleDownloadBackupJSON,
    handleDownloadRecapCSV,
    handleResetDatabase,

    // 4. Toast
    showToast,
    toastMessage,
    toastType,
  } = useSettings();

  return (
    <div className="max-w-5xl mx-auto space-y-6 p-4 select-none relative text-left">
      {/* Toast Alert */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`fixed top-20 right-8 z-50 px-5 py-3 rounded-xl shadow-lg text-xs font-semibold flex items-center gap-2.5 border ${
              toastType === 'danger'
                ? 'bg-red-900 border-red-700 text-white'
                : 'bg-slate-900 border-slate-700 text-white'
            }`}
          >
            {toastType === 'danger' ? (
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            )}
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Halaman */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center">
            <Settings className="w-5 h-5 text-slate-700" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Pengaturan Sistem & Faskes</h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Kelola profil fasilitas kesehatan, tenaga medis penanggung jawab, keamanan akun, dan pencadangan data.
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 mt-6">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all border cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Building2 className={`w-4 h-4 ${activeTab === 'profile' ? 'text-white' : 'text-slate-500'}`} />
            <span>Profil Fasilitas Kesehatan & Nakes</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all border cursor-pointer ${
              activeTab === 'security'
                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className={`w-4 h-4 ${activeTab === 'security' ? 'text-white' : 'text-slate-500'}`} />
            <span>Keamanan Akun & Manajemen Data</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: PROFIL FASILITAS KESEHATAN & TENAGA MEDIS */}
      {/* ========================================================================= */}
      {activeTab === 'profile' && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Form Profil Faskes & Nakes */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-5">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <User className="w-4 h-4 text-slate-700" />
                <span>Identitas Resmi Layanan Klinis</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Informasi ini dicantumkan pada tajuk (*kop*) lembar rekam medis dan rekapitulasi data pemeriksaan pasien.
              </p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Nama Lengkap Tenaga Medis"
                  required
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  placeholder="Contoh: Dr. Arief Sidik"
                />

                <Input
                  label="Spesialisasi / Jabatan Klinis"
                  required
                  value={docSpecialty}
                  onChange={(e) => setDocSpecialty(e.target.value)}
                  placeholder="Contoh: Dokter Penanggung Jawab Klinis"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Nama Fasilitas Kesehatan (Puskesmas)"
                  required
                  value={docHospital}
                  onChange={(e) => setDocHospital(e.target.value)}
                  placeholder="Contoh: Puskesmas Banyumas"
                />

                <Input
                  label="Nomor SIP / STR Tenaga Medis"
                  value={docSip}
                  onChange={(e) => setDocSip(e.target.value)}
                  placeholder="Contoh: SIP.503/449/123/2023"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Alamat Wilayah Kerja Puskesmas"
                  value={faskesAddress}
                  onChange={(e) => setFaskesAddress(e.target.value)}
                  placeholder="Contoh: Jl. Raya Banyumas No. 12"
                />

                <Input
                  label="Nomor Telepon / Kontak Layanan"
                  value={faskesPhone}
                  onChange={(e) => setFaskesPhone(e.target.value)}
                  placeholder="Contoh: (0281) 796123"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <Button type="submit" variant="primary" className="px-6 py-2.5 flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  <span>Simpan Profil Layanan</span>
                </Button>
              </div>
            </form>
          </div>

          {/* Pratinjau Kredensial & Kop Resmi */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <FileBadge className="w-4 h-4 text-slate-600" />
              <span>Pratinjau Kredensial Medis</span>
            </h3>

            <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs shrink-0">
                  {docName ? docName.split(' ').map((n) => n[0]).slice(0, 2).join('') : 'DR'}
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-slate-900 truncate">{docName || 'Nama Tenaga Medis'}</h4>
                  <p className="text-xs text-slate-500 font-medium truncate">{docSpecialty || 'Jabatan Klinis'}</p>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-3 space-y-2.5 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span className="text-slate-400">Instansi:</span>
                  <span className="font-semibold text-slate-800 text-right">{docHospital}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span className="text-slate-400">No. SIP:</span>
                  <span className="font-semibold text-slate-800 text-right">{docSip}</span>
                </div>
                <div className="flex items-start justify-between text-slate-600 gap-2">
                  <span className="text-slate-400 shrink-0">Wilayah:</span>
                  <span className="font-semibold text-slate-800 text-right leading-tight">{faskesAddress}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span className="text-slate-400">Kontak:</span>
                  <span className="font-semibold text-slate-800 text-right">{faskesPhone}</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-lg text-xs text-blue-800 space-y-1">
              <div className="font-semibold flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                <span>Legitimasi Hasil Diagnosis</span>
              </div>
              <p className="text-[11px] text-blue-700 leading-relaxed">
                Identitas fasilitas kesehatan dan nomor izin praktik dokter akan tercantum pada tanda tangan laporan pemeriksaan klinis pasien.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: KEAMANAN AKUN & CADANGAN DATA */}
      {/* ========================================================================= */}
      {activeTab === 'security' && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Ubah Kata Sandi */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Lock className="w-4 h-4 text-slate-700" />
                  <span>Keamanan Akun (Ganti Kata Sandi)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Perbarui kata sandi masuk akun tenaga medis Anda untuk menjaga kerahasiaan data rekam medis pasien.
                </p>
              </div>

              {passwordError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 font-medium">
                  {passwordError}
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-3">
                <Input
                  label="Kata Sandi Saat Ini"
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Masukkan kata sandi saat ini"
                />

                <Input
                  label="Kata Sandi Baru"
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                />

                <Input
                  label="Konfirmasi Kata Sandi Baru"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ulangi kata sandi baru"
                />

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isChangingPassword}
                    className="w-full py-2.5 flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isChangingPassword ? 'Menyimpan...' : 'Perbarui Kata Sandi Akun'}</span>
                  </Button>
                </div>
              </form>
            </div>

            {/* Cadangan Basis Data & Ekspor */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Database className="w-4 h-4 text-slate-700" />
                    <span>Cadangan & Rekapitulasi Data</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Unduh salinan data rekam medis untuk keperluan arsip faskes atau pelaporan dinas kesehatan.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 py-2">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-center">
                    <span className="text-[11px] font-semibold text-slate-400 block">Total Pasien Registri</span>
                    <span className="text-xl font-bold text-slate-900 mt-0.5 block">{totalPatients}</span>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-center">
                    <span className="text-[11px] font-semibold text-slate-400 block">Riwayat Pemeriksaan</span>
                    <span className="text-xl font-bold text-slate-900 mt-0.5 block">{totalRecords}</span>
                  </div>
                </div>

                <div className="space-y-2.5 pt-1">
                  <button
                    type="button"
                    onClick={handleDownloadBackupJSON}
                    className="w-full py-2.5 px-4 rounded-lg text-xs font-semibold bg-slate-50 hover:bg-slate-100 border border-slate-300 text-slate-800 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Download className="w-4 h-4 text-slate-600" />
                      <span>Unduh Cadangan Basis Data (JSON)</span>
                    </span>
                    <span className="text-[11px] text-slate-400">Full Backup</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadRecapCSV}
                    className="w-full py-2.5 px-4 rounded-lg text-xs font-semibold bg-slate-50 hover:bg-slate-100 border border-slate-300 text-slate-800 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                      <span>Unduh Rekapitulasi Pasien (CSV / Excel)</span>
                    </span>
                    <span className="text-[11px] text-slate-400">Format Laporan</span>
                  </button>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed pt-2 border-t border-slate-100">
                File cadangan mencakup metadata faskes, identitas pasien, dan histori tensi lengkap berstandar UTF-8.
              </p>
            </div>
          </div>

          {/* Zona Pemeliharaan Sistem (Reset Database) */}
          <div className="bg-red-50/30 border border-red-200 rounded-xl p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h4 className="text-xs font-bold text-red-900 flex items-center gap-1.5 uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <span>Zona Pemeliharaan Sistem (Danger Zone)</span>
                </h4>
                <p className="text-xs text-slate-600 mt-1 max-w-xl">
                  Mereset seluruh basis data ke kondisi bawaan awal (demo pabrik). Seluruh pasien dan riwayat yang ditambahkan manual akan dibersihkan.
                </p>
              </div>

              <Button
                onClick={handleResetDatabase}
                type="button"
                variant="danger"
                className="px-4 py-2 text-xs flex items-center gap-1.5 shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Database Bawaan</span>
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
