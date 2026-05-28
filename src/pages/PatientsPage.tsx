import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, UserPlus, SlidersHorizontal, SortAsc, Trash2, Eye, X, Phone, Mail, MapPin, Calendar } from 'lucide-react';
import { usePatients } from '../features/patients/hooks/usePatients';
import { Patient } from '../types';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { formatDate } from '../utils/format';

export default function PatientsPage() {
  const {
    filterText,
    setFilterText,
    isAddOpen,
    setIsAddOpen,
    selectedPatient,
    setSelectedPatient,
    newName,
    setNewName,
    newAge,
    setNewAge,
    newGender,
    setNewGender,
    newPhone,
    setNewPhone,
    newEmail,
    setNewEmail,
    newAddress,
    setNewAddress,
    newStatus,
    setNewStatus,
    filtered,
    patients,
    handleCreatePatient,
    handleDeletePatient,
  } = usePatients();

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-4 select-none">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 text-left">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Manajemen Data Pasien</h1>
          <p className="text-sm font-semibold text-slate-400 mt-1">Kelola informasi klinis, profil, dan rekam riwayat pasien secara terpusat.</p>
        </div>
        <Button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-2"
        >
          <UserPlus className="w-4.5 h-4.5" />
          <span>Tambah Pasien Baru</span>
        </Button>
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
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100/80 transition-all font-sans focus:outline-none"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button className="flex-1 md:flex-initial bg-slate-50 border border-slate-200 hover:bg-slate-100/85 text-slate-600 font-bold text-xs px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer">
            <SlidersHorizontal className="w-4 h-4 text-slate-400" />
            <span>Filter</span>
          </button>
          <button className="flex-1 md:flex-initial bg-slate-50 border border-slate-200 hover:bg-slate-100/85 text-slate-600 font-bold text-xs px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer">
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
                    <tr
                      key={pat.id}
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
                      <td className="py-4.5 px-6 font-bold text-blue-700 select-text">{pat.id}</td>
                      <td className="py-4.5 px-6 select-text">
                        <div className="flex items-center gap-3">
                          <div className="w-8.5 h-8.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center font-bold text-xs shadow-inner select-none">
                            {initial}
                          </div>
                          <span className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors">{pat.name}</span>
                        </div>
                      </td>
                      <td className="py-4.5 px-6 text-slate-600">{pat.age} Tahun</td>
                      <td className="py-4.5 px-6 text-slate-500">{pat.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</td>
                      <td className="py-4.5 px-6 text-slate-450 select-text">
                        {formatDate(pat.lastChecked)}
                      </td>
                      <td className="py-4.5 px-6">
                        <Badge variant={pat.status}>{pat.status}</Badge>
                      </td>
                      
                      {/* Interactive hover actions row slider */}
                      <td className="py-4.5 px-6 text-right select-none">
                        <div className="flex justify-end gap-1 px-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
                          <button
                            onClick={() => setSelectedPatient(pat)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-650 hover:bg-blue-50 border border-transparent hover:border-blue-100 transition-all cursor-pointer"
                            title="Detail Rekam Medis"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeletePatient(pat.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 transition-all cursor-pointer"
                            title="Hapus Pasien"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
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

      {/* OVERLAY MODULE: PATIENT DETAILS DETAIL POPUP (Modal UI Component) */}
      <Modal
        isOpen={!!selectedPatient}
        onClose={() => setSelectedPatient(null)}
        title="Rincian Pasien & Rekam Medis"
        size="lg"
      >
        {selectedPatient && (
          <div className="flex flex-col text-left">
            {/* Header Details */}
            <div className="flex gap-4 items-center pb-4 border-b border-slate-100">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-base shadow-lg">
                {selectedPatient.name.split(' ').map((n)=>n[0]).join('').slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 tracking-tight leading-snug">{selectedPatient.name}</h3>
                <p className="text-xs text-slate-450 font-bold uppercase tracking-wider mt-0.5">{selectedPatient.id}</p>
              </div>
            </div>

            {/* Informative Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6 overflow-y-auto max-h-[50vh] pr-1">
              {/* Contact clinical lists */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest select-none">Kontak & Demografis</h4>
                <ul className="space-y-3 pl-0 list-none">
                  <li className="flex gap-3 text-xs font-semibold text-slate-700">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <div>
                      <span className="text-slate-400 font-medium block">Telepon</span>
                      <span className="mt-0.5 block select-text">{selectedPatient.phone}</span>
                    </div>
                  </li>
                  <li className="flex gap-3 text-xs font-semibold text-slate-700">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <div>
                      <span className="text-slate-400 font-medium block">E-mail</span>
                      <span className="mt-0.5 block select-text">{selectedPatient.email}</span>
                    </div>
                  </li>
                  <li className="flex gap-3 text-xs font-semibold text-slate-700">
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
                    <span className="text-xs font-semibold text-slate-550">Kondisi Klinis</span>
                    <Badge variant={selectedPatient.status}>{selectedPatient.status}</Badge>
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
                            <span className="text-slate-300">/</span>
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

            {/* Footer buttons */}
            <div className="border-t border-slate-100 pt-4 flex justify-end">
              <Button
                onClick={() => setSelectedPatient(null)}
                variant="secondary"
              >
                Tutup Rincian
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* OVERLAY MODULE: TAMBAH PASIEN BARU FORM MODAL */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Tambah Pasien Baru"
      >
        <form onSubmit={handleCreatePatient} className="space-y-4 text-left max-h-[60vh] overflow-y-auto pr-1">
          {/* Nama Pasien */}
          <Input
            label="Nama Lengkap"
            required
            placeholder="Contoh: Andi Wijaya"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-4">
            {/* Usia */}
            <Input
              type="number"
              label="Usia (Tahun)"
              required
              placeholder="Contoh: 40"
              value={newAge}
              onChange={(e) => setNewAge(e.target.value === '' ? '' : Number(e.target.value))}
            />

            {/* Gender */}
            <Select
              label="Jenis Kelamin"
              value={newGender}
              onChange={(e) => setNewGender(e.target.value as 'L' | 'P')}
              options={[
                { value: 'L', label: 'Laki-laki' },
                { value: 'P', label: 'Perempuan' },
              ]}
            />
          </div>

          {/* Telepon */}
          <Input
            label="Nomor Telepon"
            placeholder="Contoh: 0812-xxxx-xxxx"
            value={newPhone}
            onChange={(e) => setNewPhone(e.target.value)}
          />

          {/* Email */}
          <Input
            type="email"
            label="E-mail"
            placeholder="Contoh: andi@gmail.com"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />

          {/* Alamat */}
          <div className="space-y-1.5 flex flex-col">
            <label className="text-xs font-semibold text-slate-655 tracking-wide uppercase">Alamat Lengkap</label>
            <textarea
              rows={2}
              placeholder="Contoh: Jl. Diponegoro No. 12"
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all font-sans"
            />
          </div>

          {/* Status Terakhir */}
          <Select
            label="Staging Terakhir"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value as Patient['status'])}
            options={[
              { value: 'Normal', label: 'Normal' },
              { value: 'Pra Hipertensi', label: 'Pra Hipertensi' },
              { value: 'Tingkat 1', label: 'Hipertensi Tingkat 1' },
              { value: 'Tingkat 2', label: 'Hipertensi Tingkat 2' },
              { value: 'Krisis Hipertensi', label: 'Krisis Hipertensi' },
            ]}
          />

          <div className="flex gap-3 pt-4 border-t border-slate-100 select-none">
            <Button
              type="submit"
              className="flex-grow py-3.5"
            >
              Simpan Data Pasien
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddOpen(false)}
            >
              Kembali
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
