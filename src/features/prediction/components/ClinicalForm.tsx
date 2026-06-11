import React from 'react';
import { HeartPulse, Cpu, RotateCcw, Search, X } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { usePatientStore } from '../../../stores/patientStore';

interface ClinicalFormProps {
  usia: number | '';
  setUsia: (val: number | '') => void;
  gender: 'L' | 'P';
  setGender: (val: 'L' | 'P') => void;
  berat: number | '';
  setBerat: (val: number | '') => void;
  tinggi: number | '';
  setTinggi: (val: number | '') => void;
  sistolik: number | '';
  setSistolik: (val: number | '') => void;
  diastolik: number | '';
  setDiastolik: (val: number | '') => void;
  bmi: number;
  isClassifying: boolean;
  onClassify: () => void;
  onReset: () => void;

  patientType: 'registered' | 'new';
  selectedPatientId: string | '';
  patientName: string;
  setPatientType: (val: 'registered' | 'new') => void;
  setSelectedPatientId: (val: string | '') => void;
  setPatientName: (val: string) => void;
}

export default function ClinicalForm({
  usia,
  setUsia,
  gender,
  setGender,
  berat,
  setBerat,
  tinggi,
  setTinggi,
  sistolik,
  setSistolik,
  diastolik,
  setDiastolik,
  bmi,
  isClassifying,
  onClassify,
  onReset,

  patientType,
  selectedPatientId,
  patientName,
  setPatientType,
  setSelectedPatientId,
  setPatientName,
}: ClinicalFormProps) {
  const patients = usePatientStore((state) => state.patients);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isFocused, setIsFocused] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClassify();
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-[0_6px_35px_rgba(0,0,0,0.04)] text-left h-full flex flex-col justify-between">
      <div className="flex items-center gap-3 mb-5 border-b border-slate-100 pb-4 flex-shrink-0">
        <div className="w-10 h-10 rounded-xl bg-[#0053db]/10 flex items-center justify-center text-[#0053db]">
          <HeartPulse className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900 select-none">Input Data Klinis Pasien</h3>
          <p className="text-xs text-slate-400 mt-0.5">Klasifikasi instan berbasis model parameter anatomis</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 flex-grow flex flex-col justify-between">
        <div className="space-y-4">
          {/* Baris 1: Identitas & Tipe Pasien (2 Kolom) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Tipe Pasien (Pasien Terdaftar vs Baru) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 tracking-wide block">Tipe Pasien</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setPatientType('registered');
                  }}
                  className={`py-3 px-3 rounded-xl border text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer
                    ${patientType === 'registered' 
                      ? 'bg-blue-600 text-white border-blue-605 shadow-md' 
                      : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'}`}
                >
                  Pasien Terdaftar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPatientType('new');
                    setSelectedPatientId('');
                    setPatientName('');
                    setUsia('');
                    setGender('L');
                    setSearchQuery('');
                  }}
                  className={`py-3 px-3 rounded-xl border text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer
                    ${patientType === 'new' 
                      ? 'bg-blue-600 text-white border-blue-605 shadow-md' 
                      : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'}`}
                >
                  Pasien Baru
                </button>
              </div>
            </div>

            {/* Pemilihan / Input Identitas Pasien */}
            <div className="space-y-1.5 relative">
              {patientType === 'registered' ? (
                <>
                  <label className="text-xs font-bold text-slate-700 tracking-wide block">Cari Pasien Terdaftar</label>
                  {selectedPatientId ? (
                    <div className="relative">
                      <input
                        type="text"
                        readOnly
                        value={`${patientName} (${selectedPatientId})`}
                        className="w-full pl-4 pr-10 py-3 bg-blue-50/50 border border-blue-200 rounded-xl text-sm font-bold text-blue-900 focus:outline-none select-none cursor-not-allowed"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedPatientId('');
                          setPatientName('');
                          setUsia('');
                          setGender('L');
                          setSearchQuery('');
                        }}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-red-500 cursor-pointer"
                        title="Hapus pilihan pasien"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Search className="w-4 h-4" />
                      </span>
                      <input
                        type="text"
                        placeholder="Cari Nama atau ID Pasien..."
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          setIsFocused(true);
                        }}
                        onFocus={() => setIsFocused(true)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100/80 transition-all text-sm font-semibold text-slate-800 focus:outline-none font-sans"
                      />
                      {searchQuery && (
                        <button
                          type="button"
                          onClick={() => setSearchQuery('')}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {isFocused && searchQuery.trim().length > 0 && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setIsFocused(false)} />
                          <div className="absolute z-20 w-full bg-white border border-slate-200 rounded-xl shadow-xl mt-1 max-h-48 overflow-y-auto divide-y divide-slate-100/60">
                            {patients.filter(p => 
                              p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              p.id.toLowerCase().includes(searchQuery.toLowerCase())
                            ).length > 0 ? (
                              patients
                                .filter(p => 
                                  p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                  p.id.toLowerCase().includes(searchQuery.toLowerCase())
                                )
                                .map(p => (
                                  <div
                                    key={p.id}
                                    onClick={() => {
                                      setSelectedPatientId(p.id);
                                      setPatientName(p.name);
                                      setUsia(p.age);
                                      setGender(p.gender);
                                      setIsFocused(false);
                                      setSearchQuery('');
                                    }}
                                    className="px-4 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-blue-700 cursor-pointer transition-colors text-left flex justify-between items-center"
                                  >
                                    <span>{p.name}</span>
                                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded border border-slate-200/50">{p.id}</span>
                                  </div>
                                ))
                            ) : (
                              <div className="px-4 py-3 text-xs font-medium text-slate-400 text-left">
                                Tidak ada pasien terdaftar yang cocok
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <>
                  <label className="text-xs font-bold text-slate-700 tracking-wide block">Nama Lengkap Pasien Baru</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Budi Santoso"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100/80 transition-all text-sm font-semibold text-slate-800 focus:outline-none"
                  />
                </>
              )}
            </div>
          </div>

          {/* Baris 2: Usia & Jenis Kelamin (2 Kolom) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Usia */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 tracking-wide block">Usia (Tahun)</label>
              <input
                type="number"
                required
                placeholder="Contoh: 45"
                value={usia}
                disabled={patientType === 'registered'}
                onChange={(e) => setUsia(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100/80 disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed transition-all text-sm font-semibold text-slate-800 focus:outline-none"
              />
            </div>

            {/* Jenis Kelamin */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 tracking-wide block">Jenis Kelamin</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  disabled={patientType === 'registered'}
                  onClick={() => setGender('L')}
                  className={`py-3 px-3 rounded-xl border text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed
                    ${gender === 'L' 
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                      : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100 disabled:bg-slate-50 disabled:text-slate-400'}`}
                >
                  Laki-laki
                </button>
                <button
                  type="button"
                  disabled={patientType === 'registered'}
                  onClick={() => setGender('P')}
                  className={`py-3 px-3 rounded-xl border text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed
                    ${gender === 'P' 
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                      : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100 disabled:bg-slate-50 disabled:text-slate-400'}`}
                >
                  Perempuan
                </button>
              </div>
            </div>
          </div>

          {/* Baris 3: Berat Badan & Tinggi Badan (2 Kolom) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Berat Badan */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 tracking-wide block">Berat Badan (kg)</label>
              <input
                type="number"
                required
                placeholder="Contoh: 70"
                value={berat}
                onChange={(e) => setBerat(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100/80 transition-all text-sm font-semibold text-slate-800 focus:outline-none"
              />
            </div>

            {/* Tinggi Badan */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 tracking-wide block">Tinggi Badan (cm)</label>
              <input
                type="number"
                required
                placeholder="Contoh: 165"
                value={tinggi}
                onChange={(e) => setTinggi(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100/80 transition-all text-sm font-semibold text-slate-800 focus:outline-none"
              />
            </div>
          </div>

          {/* Baris 4: IMT, Sistolik, & Diastolik (3 Kolom Berjejer) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* BMI / IMT (Calculated, Disabled) */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-700 tracking-wide block">IMT (Otomatis)</label>
              </div>
              <div className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-sm font-bold text-slate-500 cursor-not-allowed flex justify-between items-center h-[46px]">
                <span>{bmi > 0 ? bmi : 'Isi data fisik...'}</span>
                {bmi > 0 && (
                  <span className={`text-[9px] px-1.5 py-0.5 rounded border font-bold uppercase tracking-wide
                    ${bmi < 18.5 ? 'bg-amber-100 text-amber-800 border-amber-200' :
                      bmi < 25.0 ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                      bmi < 30.0 ? 'bg-amber-100 text-amber-800 border-amber-200' : 'bg-red-100 text-red-800 border-red-200'}`}
                  >
                    {bmi < 18.5 ? 'Kurang' : bmi < 25.0 ? 'Ideal' : bmi < 30.0 ? 'Lebih' : 'Obes'}
                  </span>
                )}
              </div>
            </div>

            {/* Sistolik */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 tracking-wide block">Sistolik (mmHg)</label>
              <input
                type="number"
                required
                placeholder="Contoh: 145"
                value={sistolik}
                onChange={(e) => setSistolik(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100/80 transition-all text-sm font-semibold text-slate-800 focus:outline-none"
              />
            </div>

            {/* Diastolik */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 tracking-wide block">Diastolik (mmHg)</label>
              <input
                type="number"
                required
                placeholder="Contoh: 95"
                value={diastolik}
                onChange={(e) => setDiastolik(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100/80 transition-all text-sm font-semibold text-slate-800 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-100">
          <Button
            type="submit"
            isLoading={isClassifying}
            className="flex-grow py-3.5 flex items-center justify-center gap-2 cursor-pointer text-sm"
          >
            {!isClassifying && <Cpu className="w-5 h-5 animate-pulse" />}
            <span>Proses Klasifikasi AI</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={onReset}
            className="py-3.5 flex items-center justify-center gap-2 cursor-pointer text-sm"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Form</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
