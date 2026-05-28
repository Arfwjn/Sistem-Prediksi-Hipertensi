import React from 'react';
import StatsCards from '../features/dashboard/components/StatsCards';
import ClinicalForm from '../features/prediction/components/ClinicalForm';
import ModelSelector from '../features/prediction/components/ModelSelector';
import PredictionResult from '../features/prediction/components/PredictionResult';
import BPTrendChart from '../features/charts/components/BPTrendChart';
import DiagnosisDonut from '../features/charts/components/DiagnosisDonut';
import { usePrediction } from '../features/prediction/hooks/usePrediction';

export default function DashboardPage() {
  const {
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
    currentResult,
    currentConfidence,
    isClassifying,
    activeModel,
    handleModelSelect,
    handleClassify,
    handleReset,
  } = usePrediction();

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fadeIn select-none">
      {/* SECTION 1: METRICS OVERVIEW */}
      <StatsCards />

      {/* SECTION 2: CALCULATOR & VISUALIZERS */}
      <section className="grid grid-cols-1 xl:grid-cols-12 gap-8 px-4">
        {/* Clinicial Input Calculator (Left 7 Columns) */}
        <div className="xl:col-span-7">
          <ClinicalForm
            usia={usia}
            setUsia={setUsia}
            gender={gender}
            setGender={setGender}
            berat={berat}
            setBerat={setBerat}
            tinggi={tinggi}
            setTinggi={setTinggi}
            sistolik={sistolik}
            setSistolik={setSistolik}
            diastolik={diastolik}
            setDiastolik={setDiastolik}
            bmi={bmi}
            isClassifying={isClassifying}
            onClassify={handleClassify}
            onReset={handleReset}
          />
        </div>

        {/* AI Result Card (Right 5 Columns) */}
        <div className="xl:col-span-5 flex flex-col gap-6">
          <ModelSelector
            activeModel={activeModel}
            onModelSelect={handleModelSelect}
          />
          <PredictionResult
            result={currentResult}
            confidence={currentConfidence}
            activeModel={activeModel}
          />
        </div>
      </section>

      {/* SECTION 3: ADVANCED DATA VISUALIZERS */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-4 pb-12">
        <BPTrendChart />
        <DiagnosisDonut />
      </section>
    </div>
  );
}
