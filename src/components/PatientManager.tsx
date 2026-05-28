import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, UserPlus, SlidersHorizontal, SortAsc, Edit3, Trash2, Eye, X, Phone, Mail, MapPin, Sparkles, TrendingUp } from 'lucide-react';
import { Patient, BPHistoryEntry } from '../types';

interface PatientManagerProps {
  patients: Patient[];
  onAddPatient: (patient: Patient) => void;
  onDeletePatient: (id: string) => void;
  onEditPatient: (patient: Patient) => void;
}

export default function PatientManager({
  patients,
  onAddPatient,
  onDeletePatient,
  onEditPatient
}: PatientManagerProps) {
  const [filterText, setFilterText] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  // Form states inside new patient builder
  const [newName, setNewName] = useState('');
  const [newAge, setNewAge] = useState<number | ''>('');
  const [newGender, setNewGender] = useState<'L' | 'P'>('L');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newStatus, setNewStatus] = useState<Patient['status']>('Normal');

  // Filter lists
  const filtered = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(filterText.toLowerCase()) ||
      p.id.toLowerCase().includes(filterText.toLowerCase())
  );

  const handleCreatePatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newAge) {
      alert('Nama Lengkap dan Usia wajib diisi.');
      return;
    }

    // Default historical simulation
    const mockBP: BPHistoryEntry[] = [
      { date: 'Mei', systolic: 120, diastolic: 80 },
      { date: 'Jun', systolic: 122, diastolic: 81 },
      { date: 'Jul', systolic: 125, diastolic: 83 }
    ];

    const newPat: Patient = {
      id: `PT-2023-${String(patients.length + 1).padStart(3, '0')}`,
      name: newName,
      age: Number(newAge),
      gender: newGender,
      phone: newPhone || '0812-0000-0000',
      email: newEmail || 'pasien@gmail.com',
      address: newAddress || 'Jl. Raya Kebon Jeruk No. 5',
      status: newStatus,
      lastChecked: new Date().toISOString().split('T')[0],
      bpHistory: mockBP
    };

    onAddPatient(newPat);
    setIsAddOpen(false);

    // Reset Form
    setNewName('');
    setNewAge('');
    setNewPhone('');
    setNewEmail('');
    setNewAddress('');
    setNewStatus('Normal');
  };

  const getStatusBadgeStyle = (status: Patient['status']) => {
    switch (status) {
      case 'Normal':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Pra Hipertensi':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Tingkat 1':
        return 'bg-orange-50 text-orange-900 border-orange-200';
      case 'Tingkat 2':
        return 'bg-red-50 text-red-800 border-red-200';
      default:
        // Krisis
        return 'bg-rose-100 text-rose-800 border-rose-220 animate-pulse';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-4 select-none">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 text-left">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Manajemen Data Pasien</h1>
          <p className="text-sm font-semibold text-slate-400 mt-1">Kelola informasi klinis, profil, dan rekam riwayat pasien secara terpusat.</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsAddOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3 px-5 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2"
        >
          <UserPlus className="w-4.5 h-4.5" />
          <span>Tambah Pasien Baru</span>
        </motion.button>
      </div>

      {/* Toolbar searchable and ordering filters */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-[0_4px_25px_rgba(0,0,0,0.02)] flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4.5 h-4.5" />
          </span>
          <input
            type="text"
            placeholder="Cari Nama atau ID Pasien..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100/80 transition-all font-sans"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button className="flex-1 md:flex-initial bg-slate-50 border border-slate-200 hover:bg-slate-100/85 text-slate-600 font-bold text-xs px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors">
            <SlidersHorizontal className="w-4 h-4 text-slate-400" />
            <span>Filter</span>
          </button>
          <button className="flex-1 md:flex-initial bg-slate-50 border border-slate-200 hover:bg-slate-100/85 text-slate-600 font-bold text-xs px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors">
            <SortAsc className="w-4 h-4 text-slate-400" />
            <span>Urutkan</span>
          </button>
        </div>
      </div>

      {/* Main Patient Data Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-[0_4px_25px_rgba(0,0,0,0.02)]">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="bg-[#f8fafc]/80 border-b border-slate-200 font-bold text-[10px] text-slate-400 uppercase tracking-widest select-none">
              <tr>
                <th className="py-3.5 px-6">ID Pasien</th>
                <th className="py-3.5 px-6">Nama Lengkap</th>
                <th className="py-3.5 px-6">Usia</th>
                <th className="py-3.5 px-6">Jenis Kelamin</th>
                <th className="py-3.5 px-6">Cek Terakhir</th>
                <th className="py-3.5 px-6">Status Terakhir</th>
                <th className="py-3.5 px-6 text-right">Aksi</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700 bg-white">
              {filtered.length > 0 ? (
                filtered.map((pat) => {
                  const initial = pat.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase();

                  return (
                    <motion.tr
                      key={pat.id}
                      layoutId={`pat-row-${pat.id}`}
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
                      <td className="py-4.5 px-6 font-bold text-blue-700 select-text">{pat.id}</td>
                      <td className="py-4.5 px-6 select-text">
                        <div className="flex items-center gap-3">
                          <div className="w-8.5 h-8.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center font-bold text-xs shadow-inner">
                            {initial}
                          </div>
                          <span className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors">{pat.name}</span>
                        </div>
                      </td>
                      <td className="py-4.5 px-6 text-slate-600">{pat.age} Tahun</td>
                      <td className="py-4.5 px-6 text-slate-500">{pat.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</td>
                      <td className="py-4.5 px-6 text-slate-400 select-text">
                        {new Date(pat.lastChecked).toLocaleDateString('id-ID', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="py-4.5 px-6">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wide shadow-sm ${getStatusBadgeStyle(pat.status)}`}>
                          {pat.status}
                        </span>
                      </td>
                      
                      {/* Interactive hover actions row slider */}
                      <td className="py-4.5 px-6 text-right select-none">
                        <div className="flex justify-end gap-1 px-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
                          <button
                            onClick={() => setSelectedPatient(pat)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-650 hover:bg-blue-50 border border-transparent hover:border-blue-100 transition-all"
                            title="Detail Rekam Medis"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeletePatient(pat.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 transition-all"
                            title="Hapus Pasien"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    <div className="py-6 font-bold select-none">Tidak ada pasien yang cocok dengan pencarian Anda.</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Minimal pagination reports status */}
        <div className="p-4 border-t border-slate-100 bg-[#f8fafc]/50 flex items-center justify-between text-xs font-semibold text-slate-400 select-none">
          <p>Menampilkan <span className="font-bold text-slate-800">{filtered.length}</span> dari <span className="font-bold text-slate-800">{patients.length}</span> pasien terdaftar</p>
        </div>
      </div>

      {/* OVERLAY MODULE: PATIENT DETAILS DETAIL POPUP (Eye Icon) */}
      <AnimatePresence>
        {selectedPatient && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPatient(null)}
              className="fixed inset-0 bg-slate-950/80 z-40 transition-colors"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="fixed top-12 max-h-[85vh] left-1/2 -translate-x-1/2 w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 z-50 overflow-hidden flex flex-col p-6 text-left"
            >
              {/* Header Details */}
              <div className="flex justify-between items-start pb-4 border-b border-slate-100">
                <div className="flex gap-4 items-center">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-base shadow-lg">
                    {selectedPatient.name.split(' ').map((n)=>n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-900 tracking-tight leading-snug">{selectedPatient.name}</h3>
                    <p className="text-xs text-slate-450 font-bold uppercase tracking-wider mt-0.5">{selectedPatient.id}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedPatient(null)}
                  className="p-1.5 border hover:bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-700 rounded-xl transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Informative Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6 overflow-y-auto pr-1">
                {/* Contact clinical lists */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest select-none">Kontak & Demografis</h4>
                  <ul className="space-y-3">
                    <li className="flex gap-3 text-xs font-semibold text-slate-705">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <div>
                        <span className="text-slate-400 font-medium block">Telepon</span>
                        <span className="mt-0.5 block select-text">{selectedPatient.phone}</span>
                      </div>
                    </li>
                    <li className="flex gap-3 text-xs font-semibold text-slate-705">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <div>
                        <span className="text-slate-400 font-medium block">E-mail</span>
                        <span className="mt-0.5 block select-text">{selectedPatient.email}</span>
                      </div>
                    </li>
                    <li className="flex gap-3 text-xs font-semibold text-slate-705">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <div>
                        <span className="text-slate-400 font-medium block">Alamat</span>
                        <span className="mt-0.5 block leading-relaxed select-text">{selectedPatient.address}</span>
                      </div>
                    </li>
                  </ul>
                </div>

                {/* Patient status details */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest select-none">Metrik Diagnosis Terakhir</h4>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-150 relative">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold text-slate-500">Kondisi Klinis</span>
                      <span className={`px-2.5 py-1 text-[9px] font-bold rounded-full border ${getStatusBadgeStyle(selectedPatient.status)}`}>
                        {selectedPatient.status}
                      </span>
                    </div>

                    <div className="flex gap-4 mt-4">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400">Usia</span>
                        <p className="font-bold text-base text-slate-800 mt-0.5">{selectedPatient.age} Tahun</p>
                      </div>
                      <div className="border-l border-slate-200 pl-4">
                        <span className="text-[10px] font-bold text-slate-400">Gender</span>
                        <p className="font-bold text-base text-slate-800 mt-0.5">
                          {selectedPatient.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Historial trends tracking chart */}
                <div className="md:col-span-2 space-y-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest select-none">Tren Rekor History Tekanan Darah</h4>
                  {selectedPatient.bpHistory && selectedPatient.bpHistory.length > 0 ? (
                    <div className="bg-blue-50/20 p-4 border border-blue-100 rounded-2xl">
                      <div className="flex justify-around items-center gap-2 select-none">
                        {selectedPatient.bpHistory.map((item, idx) => (
                          <div key={`${selectedPatient.id}-history-pt-${idx}`} className="text-center">
                            <span className="text-[9px] font-bold text-slate-400 uppercase">{item.date}</span>
                            <div className="mt-1.5 flex gap-1 font-bold text-[14px]">
                              <span className="text-blue-600">{item.systolic}</span>
                              <span className="text-slate-312">/</span>
                              <span className="text-indigo-500">{item.diastolic}</span>
                            </div>
                            <span className="text-[9px] font-medium text-slate-400 block tracking-wide mt-1">mmHg</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center p-6 bg-slate-50 rounded-2xl text-slate-400 font-semibold select-none text-xs">
                      Tidak ada tren historical BP terekam untuk pasien ini.
                    </div>
                  )}
                </div>
              </div>

              {/* Action feet */}
              <div className="mt-auto border-t border-slate-100 pt-4 flex justify-end">
                <button
                  onClick={() => setSelectedPatient(null)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
                >
                  Tutup Rincian
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* OVERLAY MODULE: TAMBAH PASIEN BARU FORM MODAL */}
      <AnimatePresence>
        {isAddOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddOpen(false)}
              className="fixed inset-0 bg-slate-950/80 z-40 transition-colors"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="fixed top-12 max-h-[85vh] left-1/2 -translate-x-1/2 w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 z-50 overflow-hidden flex flex-col p-6 text-left"
            >
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <UserPlus className="text-blue-600 w-5 h-5" />
                  <span>Tambah Pasien Baru</span>
                </h3>
                <button
                  onClick={() => setIsAddOpen(false)}
                  className="p-1.5 hover:bg-slate-50 border border-slate-200 text-slate-400 hover:text-slate-700 rounded-xl transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreatePatient} className="space-y-4 py-4 overflow-y-auto flex-1 pr-1">
                {/* Nama Pasien */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Nama Lengkap</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Andi Wijaya"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-105/80 transition-all text-xs font-semibold text-slate-800"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Usia */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Usia (Tahun)</label>
                    <input
                      type="number"
                      required
                      placeholder="Contoh: 40"
                      value={newAge}
                      onChange={(e) => setNewAge(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-105/80 transition-all text-xs font-semibold text-slate-800"
                    />
                  </div>

                  {/* Gender */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Jenis Kelamin</label>
                    <select
                      value={newGender}
                      onChange={(e) => setNewGender(e.target.value as 'L' | 'P')}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-105/80 transition-all text-xs font-semibold text-slate-800 appearance-none bg-no-repeat"
                    >
                      <option value="L">Laki-laki</option>
                      <option value="P">Perempuan</option>
                    </select>
                  </div>
                </div>

                {/* Telepon */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Nomor Telepon</label>
                  <input
                    type="text"
                    placeholder="Contoh: 0812-xxxx-xxxx"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-105/80 transition-all text-xs font-semibold text-slate-800"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">E-mail</label>
                  <input
                    type="email"
                    placeholder="Contoh: andi@gmail.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-105/80 transition-all text-xs font-semibold text-slate-800"
                  />
                </div>

                {/* Alamat */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Alamat Lengkap</label>
                  <textarea
                    rows={2}
                    placeholder="Contoh: Jl. Diponegoro No. 12"
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-105/80 transition-all text-xs font-semibold text-slate-800 select-text"
                  />
                </div>

                {/* Status Terakhir */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Staging Terakhir</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as Patient['status'])}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-105/80 transition-all text-xs font-semibold text-slate-800 appearance-none"
                  >
                    <option value="Normal">Normal</option>
                    <option value="Pra Hipertensi">Pra Hipertensi</option>
                    <option value="Tingkat 1">Hipertensi Tingkat 1</option>
                    <option value="Tingkat 2">Hipertensi Tingkat 2</option>
                    <option value="Krisis Hipertensi">Krisis Hipertensi</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4 border-t border-slate-100 select-none">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Simpan Data Pasien</span>
                  </motion.button>
                  <button
                    type="button"
                    onClick={() => setIsAddOpen(false)}
                    className="px-5 py-3 border border-slate-200 hover:bg-slate-50 text-slate-500 font-bold text-xs rounded-xl transition-colors"
                  >
                    Kembali
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
