import React from 'react';
import ClinicalForm from '../features/prediction/components/ClinicalForm';
import PredictionResult from '../features/prediction/components/PredictionResult';
import { usePrediction } from '../features/prediction/hooks/usePrediction';

export default function ClassificationPage() {
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
    accuracyDT,
    accuracyRF,
    isClassifying,
    handleClassify,
    handleReset,
  } = usePrediction();

  return (
    <div className="max-w-7xl mx-auto animate-fadeIn select-none">
      <section className="grid grid-cols-1 xl:grid-cols-12 gap-6 px-4 py-4 items-stretch">
        {/* Clinicial Input Calculator (Left 7 Columns) */}
        <div className="xl:col-span-7 h-full">
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
        <div className="xl:col-span-5 flex flex-col h-full">
          <PredictionResult
            result={currentResult}
            confidence={currentConfidence}
            accuracyDT={accuracyDT}
            accuracyRF={accuracyRF}
          />
        </div>
      </section>
    </div>
  );
}

