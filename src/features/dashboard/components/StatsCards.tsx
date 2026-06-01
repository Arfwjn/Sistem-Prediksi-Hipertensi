import React from 'react';
import { Activity, BrainCircuit, Cpu, AlertTriangle } from 'lucide-react';
import { usePredictionStore } from '../../../stores/predictionStore';
import { usePatientStore } from '../../../stores/patientStore';
import { useSettingsStore } from '../../../stores/settingsStore';
import { GlowCard } from '../../../components/ui/spotlight-card';

export default function StatsCards() {
  const records = usePredictionStore((state) => state.records);
  const patients = usePatientStore((state) => state.patients);
  const modelConfig = useSettingsStore((state) => state.modelConfig);

  // High Risk count from database
  const highRiskPatientsCount = patients.filter(
    (p) => p.status === 'Tingkat 2' || p.status === 'Krisis Hipertensi'
  ).length;

  // Average confidence score computed from real prediction records
  const avgConfidence = records.length > 0
    ? (records.reduce((sum, r) => sum + r.confidenceScore, 0) / records.length).toFixed(1)
    : null;

  const activeModel = modelConfig.activeModel;

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
      {/* Metric 1: Total Prediksi */}
      <GlowCard 
        className="p-6 flex flex-col justify-between"
        glowColor="blue"
        customSize={true}
      >
        <div className="flex justify-between items-start">
          <div className="p-3 bg-blue-50 text-blue-600 border border-blue-100 rounded-xl">
            <Activity className="w-6 h-6" />
          </div>
        </div>
        <div className="mt-6">
          <p className="text-xs font-semibold text-slate-400">Total Pasien</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">{patients.length}</p>
        </div>
      </GlowCard>

      {/* Metric 2: Akurasi Model */}
      <GlowCard 
        className="p-6 flex flex-col justify-between"
        glowColor="orange"
        customSize={true}
      >
        <div className="flex justify-between items-start">
          <div className="p-3 bg-amber-50 text-amber-600 border border-amber-100 rounded-xl">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold text-slate-500 bg-slate-100/80 px-2 py-0.5 rounded-full border border-slate-200 select-none">Medis</span>
        </div>
        <div className="mt-6">
          <p className="text-xs font-semibold text-slate-400">Rata-rata Confidence</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">{avgConfidence !== null ? `${avgConfidence}%` : '—'}</p>
        </div>
      </GlowCard>

      {/* Metric 3: Classifier Aktif */}
      <GlowCard 
        className="p-6 relative overflow-hidden flex flex-col justify-between"
        glowColor="purple"
        customSize={true}
      >
        <div className="flex justify-between items-start">
          <div className="p-3 bg-blue-555/10 text-blue-600 border border-blue-100/50 rounded-xl">
            <Cpu className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            Sistem Aktif
          </span>
        </div>
        <div className="mt-6">
          <p className="text-xs font-semibold text-slate-400 text-left">Model Classifier Aktif</p>
          <p className="text-xl font-bold text-slate-900 mt-1.5 text-left truncate">{activeModel} v2</p>
        </div>
      </GlowCard>

      {/* Metric 4: Pasien Risiko Tinggi */}
      <GlowCard 
        className="p-6 flex flex-col justify-between"
        glowColor="red"
        customSize={true}
      >
        <div className="flex justify-between items-start">
          <div className="p-3 bg-red-50 text-red-600 border border-red-100 rounded-xl">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
        <div className="mt-6">
          <p className="text-xs font-semibold text-slate-400">Pasien Risiko Tinggi (Tingkat 2+)</p>
          <p className="text-3xl font-bold text-rose-600 mt-1">{highRiskPatientsCount}</p>
        </div>
      </GlowCard>
    </section>
  );
}
