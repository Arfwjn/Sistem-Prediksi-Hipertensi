import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HeartPulse, Cpu, AlertTriangle, ChevronRight, Activity, RotateCcw, BrainCircuit, Route, Info } from 'lucide-react';
import { Patient, PredictionRecord, AIModelConfig } from '../types';
import { classifyHypertension, generateConfidenceScore } from '../data';

interface DashboardProps {
  modelConfig: AIModelConfig;
  patients: Patient[];
  records: PredictionRecord[];
  onAddRecord: (record: PredictionRecord) => void;
  onUpdateModelConfig?: (config: AIModelConfig) => void;
}

export default function Dashboard({
  modelConfig,
  patients,
  records,
  onAddRecord,
  onUpdateModelConfig
}: DashboardProps) {
  // Calculator States
  const [usia, setUsia] = useState<number | ''>(45);
  const [gender, setGender] = useState<'L' | 'P'>('L');
  const [berat, setBerat] = useState<number | ''>(70);
  const [tinggi, setTinggi] = useState<number | ''>(165);
  const [sistolik, setSistolik] = useState<number | ''>(145);
  const [diastolik, setDiastolik] = useState<number | ''>(95);
  const [bmi, setBmi] = useState<number>(25.7);

  // Active Prediction states
  const [currentResult, setCurrentResult] = useState<'Normal' | 'Pra Hipertensi' | 'Tingkat 1' | 'Tingkat 2' | 'Krisis Hipertensi'>('Tingkat 1');
  const [currentConfidence, setCurrentConfidence] = useState<number>(92);
  const [isClassifying, setIsClassifying] = useState(false);
  const [activeModel, setActiveModel] = useState<'Random Forest' | 'Decision Tree' | 'Logistic Regression'>(modelConfig.activeModel);

  // Chart Hover States for Line Chart
  const [hoveredTrendIndex, setHoveredTrendIndex] = useState<number | null>(null);
  const [hoveredDoughnutIndex, setHoveredDoughnutIndex] = useState<number | null>(null);

  // Auto-calculate BMI
  useEffect(() => {
    if (typeof berat === 'number' && typeof tinggi === 'number' && tinggi > 0) {
      const calcBmi = berat / ((tinggi / 100) * (tinggi / 100));
      setBmi(parseFloat(calcBmi.toFixed(1)));
    } else {
      setBmi(0);
    }
  }, [berat, tinggi]);

  // Sync active model with configuration
  useEffect(() => {
    setActiveModel(modelConfig.activeModel);
  }, [modelConfig.activeModel]);

  // Execute Classification
  const handleClassify = () => {
    if (!usia || !berat || !tinggi || !sistolik || !diastolik) {
      alert('Mohon isi semua data klinis pasien telebih dahulu.');
      return;
    }

    setIsClassifying(true);

    setTimeout(() => {
      const resultClass = classifyHypertension(Number(sistolik), Number(diastolik));
      const confidence = generateConfidenceScore(
        Number(sistolik),
        Number(diastolik),
        Number(usia),
        bmi,
        activeModel,
        modelConfig
      );

      setCurrentResult(resultClass);
      setCurrentConfidence(confidence);
      setIsClassifying(false);

      // Save record
      const newRec: PredictionRecord = {
        id: `PAS-${String(records.length + 1).padStart(3, '0')}`,
        patientId: `PT-2023-${String(Math.floor(Math.random() * 900) + 100)}`,
        patientName: 'Pasien Rawat Jalan',
        date: new Date().toLocaleString('id-ID', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }) + ' WIB',
        modelUsed: activeModel,
        confidenceScore: confidence,
        systolic: Number(sistolik),
        diastolic: Number(diastolik),
        age: Number(usia),
        gender,
        weight: Number(berat),
        height: Number(tinggi),
        bmi,
        result: resultClass
      };

      onAddRecord(newRec);
    }, 900);
  };

  const handleReset = () => {
    setUsia('');
    setGender('L');
    setBerat('');
    setTinggi('');
    setSistolik('');
    setDiastolik('');
    setBmi(0);
  };

  // High Risk count from database
  const highRiskPatientsCount = patients.filter(
    (p) => p.status === 'Tingkat 2' || p.status === 'Krisis Hipertensi'
  ).length;

  // Handler for model selector change
  const handleModelSelect = (selectedModel: 'Random Forest' | 'Decision Tree' | 'Logistic Regression') => {
    setActiveModel(selectedModel);
    if (onUpdateModelConfig) {
      onUpdateModelConfig({
        ...modelConfig,
        activeModel: selectedModel,
      });
    }
  };

  // Custom charts mock parameters
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul'];
  const systolicTrend = [120, 125, 122, 130, 135, 140, 142];
  const diastolicTrend = [80, 82, 80, 85, 88, 90, 92];

  const sysPoints = [
    { x: 60, y: 160, val: 120, month: 'Jan' },
    { x: 160, y: 140, val: 125, month: 'Feb' },
    { x: 260, y: 152, val: 122, month: 'Mar' },
    { x: 360, y: 120, val: 130, month: 'Apr' },
    { x: 460, y: 100, val: 135, month: 'Mei' },
    { x: 560, y: 80, val: 140, month: 'Jun' },
    { x: 660, y: 72, val: 142, month: 'Jul' }
  ];

  const diaPoints = [
    { x: 60, y: 190, val: 80, month: 'Jan' },
    { x: 160, y: 184, val: 82, month: 'Feb' },
    { x: 260, y: 190, val: 80, month: 'Mar' },
    { x: 360, y: 175, val: 85, month: 'Apr' },
    { x: 460, y: 166, val: 88, month: 'Mei' },
    { x: 560, y: 160, val: 90, month: 'Jun' },
    { x: 660, y: 154, val: 92, month: 'Jul' }
  ];

  // Doughnut chart metrics for classes (Normal, Pra, Tingkat 1, Tingkat 2)
  const doughnutData = [
    { label: 'Normal', value: 45, color: '#10b981' },
    { label: 'Pra Hipertensi', value: 25, color: '#f59e0b' },
    { label: 'Tingkat 1', value: 20, color: '#bc4800' },
    { label: 'Tingkat 2', value: 10, color: '#ba1a1a' }
  ];

  // Colors mapping for hypertension results
  const resultDetails = {
    'Normal': { color: 'border-emerald-500 bg-emerald-50/10 text-emerald-800 ring-emerald-500/20', circleColor: 'emerald', barIndex: 0 },
    'Pra Hipertensi': { color: 'border-amber-500 bg-amber-50/10 text-amber-800 ring-amber-500/20', circleColor: 'amber', barIndex: 1 },
    'Tingkat 1': { color: 'border-orange-500 bg-orange-50/10 text-orange-850 ring-orange-500/20', circleColor: '[#bc4800]', barIndex: 2 },
    'Tingkat 2': { color: 'border-red-500 bg-red-50/15 text-red-800 ring-red-500/20', circleColor: 'red', barIndex: 3 },
    'Krisis Hipertensi': { color: 'border-rose-750 bg-rose-50/20 text-rose-955 ring-rose-500/40 animate-pulse', circleColor: 'rose', barIndex: 3 }
  }[currentResult];

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fadeIn select-none">
      
      {/* SECTION 1: METRICS OVERVIEW */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
        {/* Metric 1 */}
        <motion.div 
          whileHover={{ y: -3, scale: 1.01 }}
          className="p-6 bg-white border border-slate-200/90 rounded-2xl shadow-[0_4px_25px_rgba(0,0,0,0.03)] flex flex-col justify-between"
        >
          <div className="flex justify-between items-start">
            <div className="p-3 bg-blue-50 text-blue-600 border border-blue-100 rounded-xl">
              <Activity className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">+12%</span>
          </div>
          <div className="mt-6">
            <p className="text-xs font-semibold text-slate-400">Total Prediksi</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">{1123 + records.length}</p>
          </div>
        </motion.div>

        {/* Metric 2 */}
        <motion.div 
          whileHover={{ y: -3, scale: 1.01 }}
          className="p-6 bg-white border border-slate-200/90 rounded-2xl shadow-[0_4px_25px_rgba(0,0,0,0.03)] flex flex-col justify-between"
        >
          <div className="flex justify-between items-start">
            <div className="p-3 bg-amber-50 text-amber-600 border border-amber-100 rounded-xl">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-slate-500 bg-slate-100/80 px-2 py-0.5 rounded-full border border-slate-200 select-none">Medis</span>
          </div>
          <div className="mt-6">
            <p className="text-xs font-semibold text-slate-400">Akurasi Model (RF)</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">94.8%</p>
          </div>
        </motion.div>

        {/* Metric 3 */}
        <motion.div 
          whileHover={{ y: -3, scale: 1.01 }}
          className="p-6 bg-white border border-slate-200/90 rounded-2xl shadow-[0_4px_25px_rgba(0,0,0,0.03)] relative overflow-hidden flex flex-col justify-between"
        >
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-600" />
          <div className="flex justify-between items-start">
            <div className="p-3 bg-blue-550/10 text-blue-650 border border-blue-100/50 rounded-xl">
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
        </motion.div>

        {/* Metric 4 */}
        <motion.div 
          whileHover={{ y: -3, scale: 1.01 }}
          className="p-6 bg-white border border-slate-200/90 rounded-2xl shadow-[0_4px_25px_rgba(0,0,0,0.03)] flex flex-col justify-between"
        >
          <div className="flex justify-between items-start">
            <div className="p-3 bg-red-50 text-red-600 border border-red-100 rounded-xl">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-rose-700 bg-rose-50 border border-rose-100 px-2.5 py-1 rounded-full">+5%</span>
          </div>
          <div className="mt-6">
            <p className="text-xs font-semibold text-slate-400">Pasien Risiko Tinggi (Tingkat 2+)</p>
            <p className="text-3xl font-bold text-rose-600 mt-1">{29 + highRiskPatientsCount}</p>
          </div>
        </motion.div>
      </section>

      {/* SECTION 2: CALCULATOR & VISUALIZERS */}
      <section className="grid grid-cols-1 xl:grid-cols-12 gap-8 px-4">
        
        {/* Clinicial Input Calculator (Left 7 Columns) */}
        <div className="xl:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-[0_6px_35px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-[#0053db]/10 flex items-center justify-center text-[#0053db]">
              <HeartPulse className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 select-none">Input Data Klinis Pasien</h3>
              <p className="text-xs text-slate-400 mt-0.5">Klasifikasi instan berbasis model parameter anatomis</p>
            </div>
          </div>

          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Usia */}
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-bold text-slate-700 tracking-wide block">Usia (Tahun)</label>
                <input
                  type="number"
                  required
                  placeholder="Contoh: 45"
                  value={usia}
                  onChange={(e) => setUsia(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100/80 transition-all text-sm font-semibold text-slate-800"
                />
              </div>

              {/* Jenis Kelamin */}
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-bold text-slate-700 tracking-wide block">Jenis Kelamin</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setGender('L')}
                    className={`py-3 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2
                      ${gender === 'L' 
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                        : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'}`}
                  >
                    Laki-laki
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender('P')}
                    className={`py-3 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2
                      ${gender === 'P' 
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                        : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'}`}
                  >
                    Perempuan
                  </button>
                </div>
              </div>

              {/* Berat Badan */}
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-bold text-slate-700 tracking-wide block">Berat Badan (kg)</label>
                <input
                  type="number"
                  placeholder="Contoh: 70"
                  value={berat}
                  onChange={(e) => setBerat(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100/80 transition-all text-sm font-semibold text-slate-800"
                />
              </div>

              {/* Tinggi Badan */}
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-bold text-slate-700 tracking-wide block">Tinggi Badan (cm)</label>
                <input
                  type="number"
                  placeholder="Contoh: 165"
                  value={tinggi}
                  onChange={(e) => setTinggi(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100/80 transition-all text-sm font-semibold text-slate-800"
                />
              </div>

              {/* BMI (Calculated, Disabled) */}
              <div className="md:col-span-2 space-y-1.5 text-left">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-700 tracking-wide block">BMI (Terhitung Otomatis)</label>
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-100 border px-2 py-0.5 rounded-full select-none">Formula Standard</span>
                </div>
                <div className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-sm font-bold text-slate-500 cursor-not-allowed flex justify-between items-center">
                  <span>{bmi > 0 ? bmi : 'Isi berat dan tinggi badan...'}</span>
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
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-bold text-slate-700 tracking-wide block">Sistolik (mmHg)</label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="Contoh: 120"
                    value={sistolik}
                    onChange={(e) => setSistolik(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full pl-4 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100/80 transition-all text-sm font-semibold text-slate-800"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-400/80">
                    <span className="text-xs font-bold">SYS</span>
                  </div>
                </div>
              </div>

              {/* Diastolik */}
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-bold text-slate-700 tracking-wide block">Diastolik (mmHg)</label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="Contoh: 80"
                    value={diastolik}
                    onChange={(e) => setDiastolik(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full pl-4 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100/80 transition-all text-sm font-semibold text-slate-800"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-400/80">
                    <span className="text-xs font-bold">DIA</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Form CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-slate-100">
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={handleClassify}
                disabled={isClassifying}
                type="button"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-3.5 px-6 rounded-xl transition-all shadow-[0_4px_16px_rgba(37,99,235,0.2)] flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {isClassifying ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Mempasings data...</span>
                  </>
                ) : (
                  <>
                    <Cpu className="w-5 h-5 animate-pulse" />
                    <span>Proses Klasifikasi AI</span>
                  </>
                )}
              </motion.button>
              <button
                type="button"
                onClick={handleReset}
                className="py-3.5 px-6 border border-slate-250 hover:bg-slate-50 text-slate-600 hover:text-slate-900 font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset Form</span>
              </button>
            </div>
          </form>
        </div>

        {/* AI Result Card (Right 5 Columns) */}
        <div className="xl:col-span-5 flex flex-col gap-6">
          {/* Model active highlights */}
          <div className="p-5 bg-white border border-slate-100 rounded-2xl flex-shrink-0 text-left select-none relative overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.05),0_10px_40px_-5px_rgba(30,41,59,0.04)]">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-xs font-bold text-slate-800 flex items-center gap-2 tracking-tight uppercase">
                <Route className="text-blue-600 w-4 h-4" />
                <span>Model Evaluation Pipeline (Interactive)</span>
              </h4>
              <span className="text-[10px] font-black uppercase text-blue-600 bg-blue-50/80 px-2 py-0.5 rounded-full border border-blue-105">
                Ubah Model Aktif
              </span>
            </div>

            {/* A visual timeline path */}
            <div className="relative flex flex-col sm:flex-row items-center justify-between gap-3 py-2">
              {/* SVG connecting track behind */}
              <div className="absolute left-[15%] right-[15%] top-1/2 -translate-y-1/2 h-0.5 border-t border-dashed border-slate-200 hidden sm:block z-0" />
              
              {/* Decision Tree path step */}
              <motion.button
                whileHover={{ y: -1, scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="button"
                onClick={() => handleModelSelect('Decision Tree')}
                className={`relative flex-1 w-full p-3 rounded-xl border text-left transition-all z-10 flex items-center gap-2.5 cursor-pointer
                  ${activeModel === 'Decision Tree' 
                    ? 'bg-blue-600 border-blue-600 text-white shadow-[0_4px_16px_rgba(37,99,235,0.2)]' 
                    : 'bg-slate-50/50 hover:bg-slate-50 border-slate-200/80 text-slate-700'
                  }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs select-none shadow-sm transition-colors
                  ${activeModel === 'Decision Tree' 
                    ? 'bg-white/10 text-white' 
                    : 'bg-amber-500/10 text-amber-700 border border-amber-500/20'
                  }`}
                >
                  DT
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold truncate">Decision Tree</p>
                  <p className={`text-[9px] truncate ${activeModel === 'Decision Tree' ? 'text-blue-105/90 font-semibold' : 'text-slate-400 font-semibold'}`}>
                    Cepat &amp; Logis
                  </p>
                </div>
                {activeModel === 'Decision Tree' && (
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                )}
              </motion.button>

              {/* Random Forest path step (Most accurate) */}
              <motion.button
                whileHover={{ y: -1, scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="button"
                onClick={() => handleModelSelect('Random Forest')}
                className={`relative flex-1 w-full p-3 rounded-xl border text-left transition-all z-10 flex items-center gap-2.5 cursor-pointer
                  ${activeModel === 'Random Forest' 
                    ? 'bg-blue-600 border-blue-600 text-white shadow-[0_4px_16px_rgba(37,99,235,0.2)]' 
                    : 'bg-slate-50/50 hover:bg-slate-50 border-slate-200/80 text-slate-700'
                  }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs select-none shadow-sm transition-colors
                  ${activeModel === 'Random Forest' 
                    ? 'bg-white/10 text-white' 
                    : 'bg-blue-500/10 text-blue-700 border border-blue-500/20'
                  }`}
                >
                  RF
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold truncate">Random Forest</p>
                  <p className={`text-[9px] truncate ${activeModel === 'Random Forest' ? 'text-blue-105/90 font-semibold' : 'text-slate-400 font-semibold'}`}>
                    Ensemble Akurat
                  </p>
                </div>
                {activeModel === 'Random Forest' && (
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                )}
              </motion.button>

              {/* Logistic Regression path step */}
              <motion.button
                whileHover={{ y: -1, scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="button"
                onClick={() => handleModelSelect('Logistic Regression')}
                className={`relative flex-1 w-full p-3 rounded-xl border text-left transition-all z-10 flex items-center gap-2.5 cursor-pointer
                  ${activeModel === 'Logistic Regression' 
                    ? 'bg-blue-600 border-blue-600 text-white shadow-[0_4px_16px_rgba(37,99,235,0.2)]' 
                    : 'bg-slate-50/50 hover:bg-slate-50 border-slate-200/80 text-slate-700'
                  }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs select-none shadow-sm transition-colors
                  ${activeModel === 'Logistic Regression' 
                    ? 'bg-white/10 text-white' 
                    : 'bg-indigo-500/10 text-indigo-700 border border-indigo-500/20'
                  }`}
                >
                  LR
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold truncate">Logistic Reg.</p>
                  <p className={`text-[9px] truncate ${activeModel === 'Logistic Regression' ? 'text-blue-105/90 font-semibold' : 'text-slate-400 font-semibold'}`}>
                    Statistik Linear
                  </p>
                </div>
                {activeModel === 'Logistic Regression' && (
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                )}
              </motion.button>
            </div>
          </div>

          {/* Interactive Circular gauge for result prediction */}
          <div className="p-6 bg-gradient-to-br from-white to-slate-50/80 border border-slate-200 rounded-2xl flex-1 flex flex-col justify-center text-center relative overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
            {/* Visual alignment left indicator */}
            <div className={`absolute left-0 top-0 bottom-0 w-2 
              ${currentResult === 'Normal' ? 'bg-emerald-500' :
                currentResult === 'Pra Hipertensi' ? 'bg-amber-400' :
                currentResult === 'Tingkat 1' ? 'bg-orange-500' : 'bg-red-600'}`} 
            />

            <div className="mb-4">
              <span className={`inline-flex items-center gap-1.5 px-3.5 py-1 text-xs font-bold border rounded-full shadow-sm
                ${currentResult === 'Normal' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
                  currentResult === 'Pra Hipertensi' ? 'bg-amber-50 border-amber-200 text-amber-800' :
                  currentResult === 'Tingkat 1' ? 'bg-orange-50 border-orange-200 text-orange-850' : 'bg-red-50 border-red-200 text-red-800'}`}
              >
                <Activity className="w-3.5 h-3.5" />
                Hipertensi {currentResult}
              </span>
            </div>

            <motion.h2 
              key={currentResult}
              initial={{ scale: 0.95, opacity: 0.8 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-4xl font-extrabold text-slate-900 tracking-tight"
            >
              {currentResult === 'Normal' ? 'Normal' : currentResult === 'Pra Hipertensi' ? 'Pra Hip' : currentResult}
            </motion.h2>
            <p className="text-xs text-slate-400 font-medium mt-1">Berdasarkan model {activeModel}</p>

            {/* High fidelity inline SVG Circular score graph */}
            <div className="relative w-40 h-40 mx-auto mt-6 mb-2">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background tracks */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#f1f5f9"
                  strokeWidth="8"
                />
                {/* Dynamic colored progress indicator */}
                <motion.circle
                  initial={{ strokeDashoffset: 251 }}
                  animate={{ strokeDashoffset: 251 - (251 * currentConfidence) / 100 }}
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke={
                    currentResult === 'Normal' ? '#10b981' :
                    currentResult === 'Pra Hipertensi' ? '#f59e0b' :
                    currentResult === 'Tingkat 1' ? '#f97316' : '#dc2626'
                  }
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray="251.2"
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                />
              </svg>
              {/* Inner details overlays */}
              <div className="absolute inset-0 flex flex-col justify-center items-center select-none">
                <span className="text-3xl font-extrabold text-slate-800 tracking-tight">{currentConfidence}%</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Kepercayaan</span>
              </div>
            </div>

            {/* Stages Bar represent index mapping */}
            <div className="grid grid-cols-4 gap-1.5 mt-auto max-w-[280px] mx-auto w-full pt-4">
              <div className={`h-2 rounded-full transition-all duration-300 ${currentResult === 'Normal' ? 'bg-emerald-500 shadow-sm shadow-emerald-200' : 'bg-emerald-100 opacity-40'}`} />
              <div className={`h-2 rounded-full transition-all duration-300 ${currentResult === 'Pra Hipertensi' ? 'bg-amber-400 shadow-sm shadow-amber-200' : 'bg-amber-100 opacity-40'}`} />
              <div className={`h-2 rounded-full transition-all duration-300 ${currentResult === 'Tingkat 1' ? 'bg-orange-500 shadow-sm shadow-orange-200' : 'bg-orange-100 opacity-40'}`} />
              <div className={`h-2 rounded-full transition-all duration-300 ${currentResult === 'Tingkat 2' || currentResult === 'Krisis Hipertensi' ? 'bg-red-600 shadow-sm shadow-red-200' : 'bg-red-100 opacity-40'}`} />
            </div>
            
            <div className="grid grid-cols-4 gap-1.5 max-w-[280px] mx-auto w-full mt-1.5 text-[9px] font-bold text-slate-400 uppercase select-none">
              <span className={currentResult === 'Normal' ? 'text-emerald-700 font-extrabold' : ''}>Normal</span>
              <span className={currentResult === 'Pra Hipertensi' ? 'text-amber-600 font-extrabold' : ''}>Pra</span>
              <span className={currentResult === 'Tingkat 1' ? 'text-orange-600 font-extrabold' : ''}>Tingkat 1</span>
              <span className={currentResult === 'Tingkat 2' || currentResult === 'Krisis Hipertensi' ? 'text-red-700 font-extrabold' : ''}>Tingkat 2</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: ADVANCED DATA VISUAlIZERS (Custom SVGs) */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-4 pb-12">
        {/* Line Chart card component */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05),0_10px_40px_-5px_rgba(30,41,59,0.04)] relative text-left">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h4 className="text-sm font-bold text-slate-800 uppercase tracking-tight">Tren Tekanan Darah (Klinis)</h4>
              <p className="text-xs text-slate-400 mt-0.5 font-medium">Rata-rata profil sistolik vs diastolik bulanan (Jan-Jul)</p>
            </div>
            {/* Legend indicators */}
            <div className="flex gap-4 select-none">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                <span className="w-2.5 h-2.5 bg-blue-600 rounded-full" />
                SYS (Sistolik)
              </span>
              <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full" />
                DIA (Diastolik)
              </span>
            </div>
          </div>

          {/* Render Custom Responsive interactive-friendly SVG Line chart */}
          <div className="h-64 w-full relative">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 700 240">
              <defs>
                <linearGradient id="sysGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity="0.00" />
                </linearGradient>
                <linearGradient id="diaGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0.00" />
                </linearGradient>
              </defs>

              {/* Grids lines background */}
              <line x1="40" y1="40" x2="680" y2="40" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="40" y1="90" x2="680" y2="90" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="40" y1="140" x2="680" y2="140" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="40" y1="190" x2="680" y2="190" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />

              {/* Dynamic Area Under Curves Filled Glows */}
              <path
                d="M 60,160 C 110,150 110,140 160,140 C 210,140 210,152 260,152 C 310,152 310,120 360,120 C 410,120 410,100 460,100 C 510,100 510,80 560,80 C 610,80 610,72 660,72 L 660,220 L 60,220 Z"
                fill="url(#sysGlow)"
                className="pointer-events-none transition-all duration-350"
              />
              <path
                d="M 60,190 C 110,187 110,184 160,184 C 210,184 210,190 260,190 C 310,190 310,175 360,175 C 410,175 410,166 460,166 C 510,166 510,160 560,160 C 610,160 610,154 660,154 L 660,220 L 60,220 Z"
                fill="url(#diaGlow)"
                className="pointer-events-none transition-all duration-350"
              />

              {/* Exact Curved Splines representing computed coordinates */}
              <path
                d="M 60,160 C 110,150 110,140 160,140 C 210,140 210,152 260,152 C 310,152 310,120 360,120 C 410,120 410,100 460,100 C 510,100 510,80 560,80 C 610,80 610,72 660,72"
                fill="none"
                stroke="#2563eb"
                strokeWidth="3.5"
                strokeLinecap="round"
                className="pointer-events-none"
              />
              <path
                d="M 60,190 C 110,187 110,184 160,184 C 210,184 210,190 260,190 C 310,190 310,175 360,175 C 410,175 410,166 460,166 C 510,166 510,160 560,160 C 610,160 610,154 660,154"
                fill="none"
                stroke="#6366f1"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="5 3"
                className="pointer-events-none"
              />

              {/* Interactive guidelines drawing on active hover column slice */}
              {hoveredTrendIndex !== null && (
                <line
                  x1={60 + hoveredTrendIndex * 100}
                  y1="25"
                  x2={60 + hoveredTrendIndex * 100}
                  y2="215"
                  stroke="#cbd5e1"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  className="pointer-events-none"
                />
              )}

              {/* Coordinate points overlay indexes */}
              {/* SYS coordinates markers with glow animations */}
              {sysPoints.map((pt, idx) => (
                <g key={`sys-pt-${idx}`} className="pointer-events-none">
                  {hoveredTrendIndex === idx && (
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="12"
                      fill="none"
                      stroke="#2563eb"
                      strokeWidth="1.5"
                      className="animate-ping opacity-35"
                    />
                  )}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={hoveredTrendIndex === idx ? '7.5' : '5'}
                    fill="#ffffff"
                    stroke="#2563eb"
                    strokeWidth={hoveredTrendIndex === idx ? '3.5' : '2.5'}
                    className="transition-all duration-150"
                  />
                </g>
              ))}

              {/* DIA Coordinates markers with micro glowing rings */}
              {diaPoints.map((pt, idx) => (
                <g key={`dia-pt-${idx}`} className="pointer-events-none">
                  {hoveredTrendIndex === idx && (
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="10"
                      fill="none"
                      stroke="#6366f1"
                      strokeWidth="1.5"
                      className="animate-ping opacity-30"
                    />
                  )}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={hoveredTrendIndex === idx ? '6.5' : '4.5'}
                    fill="#ffffff"
                    stroke="#6366f1"
                    strokeWidth={hoveredTrendIndex === idx ? '3' : '2'}
                    className="transition-all duration-150"
                  />
                </g>
              ))}

              {/* Month Titles Label */}
              {months.map((m, idx) => (
                <text
                  key={`lbl-month-${idx}`}
                  x={60 + idx * 100}
                  y="235"
                  textAnchor="middle"
                  className="text-[10px] font-bold text-slate-400 uppercase select-none"
                >
                  {m}
                </text>
              ))}

              {/* Responsive columns vertical slices triggers covers entire chart height */}
              {sysPoints.map((pt, idx) => (
                <rect
                  key={`slice-hover-trigger-${idx}`}
                  x={10 + idx * 100}
                  y="10"
                  width="100"
                  height="210"
                  fill="transparent"
                  className="cursor-crosshair select-none"
                  onMouseEnter={() => setHoveredTrendIndex(idx)}
                  onMouseLeave={() => setHoveredTrendIndex(null)}
                />
              ))}
            </svg>

            {/* Float values popup bubble styled elegantly next to cursor line */}
            <AnimatePresence>
              {hoveredTrendIndex !== null && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  className="absolute p-3 bg-slate-900 border border-slate-800 text-white rounded-xl text-[11px] font-semibold shadow-xl z-20 flex flex-col gap-1 text-left select-none pointer-events-none"
                  style={{
                    left: `${60 + hoveredTrendIndex * 100}px`,
                    transform: hoveredTrendIndex >= 5 ? 'translateX(-115%)' : 'translateX(12px)',
                    top: '25px'
                  }}
                >
                  <span className="font-bold border-b border-slate-800 pb-1.5 text-slate-400 flex items-center justify-between gap-6">
                    <span>{months[hoveredTrendIndex]} (Rata-rata)</span>
                    <span className="text-[9px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded uppercase font-black">Histori</span>
                  </span>
                  <p className="text-blue-400 mt-1.5 flex items-center justify-between gap-4">
                    <span>Sistolik (SYS):</span>
                    <span className="text-white font-black">{systolicTrend[hoveredTrendIndex]} <span className="text-[9px] text-white/50 font-normal">mmHg</span></span>
                  </p>
                  <p className="text-indigo-300 flex items-center justify-between gap-4">
                    <span>Diastolik (DIA):</span>
                    <span className="text-white font-black">{diastolicTrend[hoveredTrendIndex]} <span className="text-[9px] text-white/50 font-normal">mmHg</span></span>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Distributions Doughnut chart */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05),0_10px_40px_-5px_rgba(30,41,59,0.04)] relative text-left">
          <h4 className="text-sm font-bold text-slate-800 uppercase tracking-tight mb-1">Distribusi Diagnosis</h4>
          <p className="text-xs text-slate-400 font-medium mb-6">Persentase profil diagnosis rekam klinis sistem</p>

          <div className="flex flex-col sm:flex-row items-center justify-around gap-6 h-64 sm:h-56">
            {/* Custom static pie donut representation upgraded with active readout */}
            <div className="relative w-40 h-40 flex-shrink-0">
              <svg className="w-full h-full transform -rotate-90 scale-x-[-1]" viewBox="0 0 100 100">
                {/* Normal Circle 45% */}
                <circle
                  cx="50"
                  cy="50"
                  r="35"
                  fill="transparent"
                  stroke="#10b981"
                  strokeWidth={hoveredDoughnutIndex === 0 ? "13.5" : "11"}
                  strokeDasharray="98.9 219.9"
                  strokeDashoffset="0"
                  className="cursor-pointer transition-all duration-200"
                  onMouseEnter={() => setHoveredDoughnutIndex(0)}
                  onMouseLeave={() => setHoveredDoughnutIndex(null)}
                />
                
                {/* Pra Hipertensi segment 25% */}
                <circle
                  cx="50"
                  cy="50"
                  r="35"
                  fill="transparent"
                  stroke="#f59e0b"
                  strokeWidth={hoveredDoughnutIndex === 1 ? "13.5" : "11"}
                  strokeDasharray="54.9 219.9"
                  strokeDashoffset="-98.9"
                  className="cursor-pointer transition-all duration-200"
                  onMouseEnter={() => setHoveredDoughnutIndex(1)}
                  onMouseLeave={() => setHoveredDoughnutIndex(null)}
                />

                {/* Tingkat 1 segment 20% */}
                <circle
                  cx="50"
                  cy="50"
                  r="35"
                  fill="transparent"
                  stroke="#e11d48"
                  strokeWidth={hoveredDoughnutIndex === 2 ? "13.5" : "11"}
                  strokeDasharray="43.9 219.9"
                  strokeDashoffset="-153.9"
                  className="cursor-pointer transition-all duration-200"
                  onMouseEnter={() => setHoveredDoughnutIndex(2)}
                  onMouseLeave={() => setHoveredDoughnutIndex(null)}
                />

                {/* Tingkat 2 segment 10% */}
                <circle
                  cx="50"
                  cy="50"
                  r="35"
                  fill="transparent"
                  stroke="#be123c"
                  strokeWidth={hoveredDoughnutIndex === 3 ? "13.5" : "11"}
                  strokeDasharray="21.9 219.9"
                  strokeDashoffset="-197.9"
                  className="cursor-pointer transition-all duration-200"
                  onMouseEnter={() => setHoveredDoughnutIndex(3)}
                  onMouseLeave={() => setHoveredDoughnutIndex(null)}
                />
              </svg>
              
              {/* Central text overlay with smooth AnimatePresence transition */}
              <div className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none select-none transition-all duration-200">
                <AnimatePresence mode="wait">
                  {hoveredDoughnutIndex === null ? (
                    <motion.div
                      key="total"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="text-center"
                    >
                      <span className="text-2xl font-black text-slate-800 tracking-tight block leading-none">100%</span>
                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block mt-1">Diagnosis</span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key={`doughnut-${hoveredDoughnutIndex}`}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="text-center px-1 max-w-[84px]"
                    >
                      <span 
                        className="text-2xl font-black tracking-tight block leading-none transition-colors"
                        style={{ color: doughnutData[hoveredDoughnutIndex].color === '#bc4800' ? '#e11d48' : doughnutData[hoveredDoughnutIndex].color === '#ba1a1a' ? '#be123c' : doughnutData[hoveredDoughnutIndex].color }}
                      >
                        {doughnutData[hoveredDoughnutIndex].value}%
                      </span>
                      <span className="text-[8px] font-black text-slate-500 uppercase tracking-wide block mt-1 leading-snug break-words">
                        {doughnutData[hoveredDoughnutIndex].label}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Custom interactive Legend sidebar panels */}
            <div className="flex-1 space-y-1.5 select-none w-full sm:w-auto text-left">
              {doughnutData.map((item, idx) => (
                <div 
                  key={item.label}
                  onMouseEnter={() => setHoveredDoughnutIndex(idx)}
                  onMouseLeave={() => setHoveredDoughnutIndex(null)}
                  className={`p-2 rounded-xl border flex items-center justify-between transition-all cursor-pointer duration-150
                    ${hoveredDoughnutIndex === idx 
                      ? 'bg-slate-50/80 border-slate-200/80 shadow-sm translate-x-1' 
                      : 'bg-white border-transparent'
                    }`}
                >
                  <div className="flex items-center gap-2">
                    <span 
                      className="w-2.5 h-2.5 rounded-full" 
                      style={{ backgroundColor: item.color === '#bc4800' ? '#e11d48' : item.color === '#ba1a1a' ? '#be123c' : item.color }} 
                    />
                    <span className="text-xs font-bold text-slate-655">{item.label}</span>
                  </div>
                  <span className="text-[11px] font-extrabold text-slate-700 bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded-md">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
