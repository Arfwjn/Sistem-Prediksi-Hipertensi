import React, { useMemo } from 'react';
import { Activity, BrainCircuit, Cpu, AlertTriangle, Users, Calendar } from 'lucide-react';
import { usePredictionStore } from '../../../stores/predictionStore';
import { usePatientStore } from '../../../stores/patientStore';
import { useSettingsStore } from '../../../stores/settingsStore';
import { GlowCard } from '../../../components/ui/spotlight-card';

export default function StatsCards() {
  const records = usePredictionStore((state) => state.records);
  const patients = usePatientStore((state) => state.patients);
  const modelConfig = useSettingsStore((state) => state.modelConfig);

  // High Risk count from database (Stage 2 and Crisis)
  const highRiskPatientsCount = useMemo(() => {
    return patients.filter(
      (p) => p.status === 'Tingkat 2'
    ).length;
  }, [patients]);

  // Average confidence score computed from real prediction records
  const avgConfidence = useMemo(() => {
    return records.length > 0
      ? (records.reduce((sum, r) => sum + r.confidenceScore, 0) / records.length).toFixed(1)
      : null;
  }, [records]);

  // Classifications Today calculation matching Indonesian month abbreviations
  const classificationsTodayCount = useMemo(() => {
    const now = new Date();
    const day = now.getDate();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const month = monthNames[now.getMonth()];
    const year = now.getFullYear();

    // Match both "d Mon yyyy" and "dd Mon yyyy" formats
    const match1 = `${day} ${month} ${year}`;
    const match2 = `${String(day).padStart(2, '0')} ${month} ${year}`;

    return records.filter((r) => {
      return r.date.includes(match1) || r.date.includes(match2);
    }).length;
  }, [records]);

  const activeModel = modelConfig.activeModel;

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 p-4">
      {/* Metric 1: Total Pasien */}
      <GlowCard 
        className="p-5 flex flex-col justify-between"
        glowColor="blue"
        customSize={true}
      >
        <div className="flex justify-between items-start">
          <div className="p-3 bg-blue-50 text-blue-600 border border-blue-100 rounded-xl">
            <Users className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-4 text-left">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Pasien</p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{patients.length}</p>
        </div>
      </GlowCard>

      {/* Metric 2: Total Klasifikasi */}
      <GlowCard 
        className="p-5 flex flex-col justify-between"
        glowColor="purple"
        customSize={true}
      >
        <div className="flex justify-between items-start">
          <div className="p-3 bg-purple-50 text-purple-600 border border-purple-100 rounded-xl">
            <Activity className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-4 text-left">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Klasifikasi</p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{records.length}</p>
        </div>
      </GlowCard>

      {/* Metric 3: Klasifikasi Hari Ini */}
      <GlowCard 
        className="p-5 flex flex-col justify-between"
        glowColor="green"
        customSize={true}
      >
        <div className="flex justify-between items-start">
          <div className="p-3 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl">
            <Calendar className="w-5 h-5" />
          </div>
          <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 select-none">Hari Ini</span>
        </div>
        <div className="mt-4 text-left">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Klasifikasi Hari Ini</p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{classificationsTodayCount}</p>
        </div>
      </GlowCard>

      {/* Metric 4: Rata-rata Confidence */}
      <GlowCard 
        className="p-5 flex flex-col justify-between"
        glowColor="orange"
        customSize={true}
      >
        <div className="flex justify-between items-start">
          <div className="p-3 bg-amber-50 text-amber-600 border border-amber-100 rounded-xl">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <span className="text-[9px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200 select-none">Medis</span>
        </div>
        <div className="mt-4 text-left">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Rerata Confidence</p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{avgConfidence !== null ? `${avgConfidence}%` : '—'}</p>
        </div>
      </GlowCard>

      {/* Metric 5: Model Classifier Aktif */}
      <GlowCard 
        className="p-5 flex flex-col justify-between"
        glowColor="blue"
        customSize={true}
      >
        <div className="flex justify-between items-start">
          <div className="p-3 bg-blue-50 text-blue-600 border border-blue-100 rounded-xl">
            <Cpu className="w-5 h-5" />
          </div>
          <span className="text-[9px] font-bold text-blue-600 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
            Aktif
          </span>
        </div>
        <div className="mt-4 text-left">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Model Classifier</p>
          <p className="text-sm font-extrabold text-slate-900 mt-1.5 truncate">Decision Tree <br/>& Random Forest</p>
        </div>
      </GlowCard>

      {/* Metric 6: Pasien Risiko Tinggi */}
      <GlowCard 
        className="p-5 flex flex-col justify-between"
        glowColor="red"
        customSize={true}
      >
        <div className="flex justify-between items-start">
          <div className="p-3 bg-red-50 text-red-600 border border-red-100 rounded-xl">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-4 text-left">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Risiko Tinggi (Tingkat 2)</p>
          <p className="text-2xl font-extrabold text-rose-600 mt-1">{highRiskPatientsCount}</p>
        </div>
      </GlowCard>
    </section>
  );
}
