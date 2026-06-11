import React from 'react';
import { HeartPulse, Cpu, RotateCcw } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

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
}: ClinicalFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClassify();
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-[0_6px_35px_rgba(0,0,0,0.04)] text-left h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4 flex-shrink-0">
        <div className="w-10 h-10 rounded-xl bg-[#0053db]/10 flex items-center justify-center text-[#0053db]">
          <HeartPulse className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900 select-none">Input Data Klinis Pasien</h3>
          <p className="text-xs text-slate-400 mt-0.5">Klasifikasi instan berbasis model parameter anatomis</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 flex-grow flex flex-col justify-between">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-5">
          {/* Usia */}
          <div className="space-y-1.5 col-span-1 md:col-span-2">
            <label className="text-xs font-bold text-slate-700 tracking-wide block">Usia (Tahun)</label>
            <input
              type="number"
              required
              placeholder="Contoh: 45"
              value={usia}
              onChange={(e) => setUsia(e.target.value === '' ? '' : Number(e.target.value))}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100/80 transition-all text-sm font-semibold text-slate-800 focus:outline-none"
            />
          </div>

          {/* Jenis Kelamin */}
          <div className="space-y-1.5 col-span-1 md:col-span-4">
            <label className="text-xs font-bold text-slate-700 tracking-wide block">Jenis Kelamin</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setGender('L')}
                className={`py-3 px-3 rounded-xl border text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer
                  ${gender === 'L' 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                    : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'}`}
              >
                Laki-laki
              </button>
              <button
                type="button"
                onClick={() => setGender('P')}
                className={`py-3 px-3 rounded-xl border text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer
                  ${gender === 'P' 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                    : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'}`}
              >
                Perempuan
              </button>
            </div>
          </div>

          {/* Berat Badan */}
          <div className="space-y-1.5 col-span-1 md:col-span-2">
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
          <div className="space-y-1.5 col-span-1 md:col-span-2">
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

          {/* BMI (Calculated, Disabled) */}
          <div className="space-y-1.5 col-span-1 md:col-span-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-700 tracking-wide block">IMT (Otomatis)</label>              
            </div>
            <div className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-sm font-bold text-slate-500 cursor-not-allowed flex justify-between items-center">
              <span>{bmi > 0 ? bmi : 'Isi berat/tinggi badan...'}</span>
              {bmi > 0 && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold uppercase tracking-wider
                  ${bmi < 18.5 ? 'bg-amber-100 text-amber-800 border-amber-200' :
                    bmi < 25.0 ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                    bmi < 30.0 ? 'bg-amber-100 text-amber-800 border-amber-200' : 'bg-red-100 text-red-800 border-red-200'}`}
                >
                  {bmi < 18.5 ? 'Kurang' : bmi < 25.0 ? 'Ideal' : bmi < 30.0 ? 'Berlebih' : 'Obesitas'}
                </span>
              )}
            </div>
          </div>

          {/* Sistolik */}
          <div className="space-y-1.5 col-span-1 md:col-span-3">
            <label className="text-xs font-bold text-slate-700 tracking-wide block">Tekanan Sistolik (mmHg)</label>
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
          <div className="space-y-1.5 col-span-1 md:col-span-3">
            <label className="text-xs font-bold text-slate-700 tracking-wide block">Tekanan Diastolik (mmHg)</label>
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

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-100">
          <Button
            type="submit"
            isLoading={isClassifying}
            className="flex-1 py-3.5 flex items-center justify-center gap-2 cursor-pointer text-sm"
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
