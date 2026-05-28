import { useState, useEffect } from 'react';
import { usePredictionStore } from '../../../stores/predictionStore';
import { useSettingsStore } from '../../../stores/settingsStore';
import { HypertensionLevel } from '../../../utils/hypertension';
import { AIModelConfig } from '../../../types';

export function usePrediction() {
  const modelConfig = useSettingsStore((state) => state.modelConfig);
  const { addRecord } = usePredictionStore();

  // Inputs
  const [usia, setUsia] = useState<number | ''>(45);
  const [gender, setGender] = useState<'L' | 'P'>('L');
  const [berat, setBerat] = useState<number | ''>(70);
  const [tinggi, setTinggi] = useState<number | ''>(165);
  const [sistolik, setSistolik] = useState<number | ''>(145);
  const [diastolik, setDiastolik] = useState<number | ''>(95);
  const [bmi, setBmi] = useState<number>(25.7);

  // States
  const [currentResult, setCurrentResult] = useState<HypertensionLevel>('Tingkat 1');
  const [currentConfidence, setCurrentConfidence] = useState<number>(92);
  const [isClassifying, setIsClassifying] = useState(false);
  const [activeModel, setActiveModel] = useState(modelConfig.activeModel);

  // Sync active model with store config
  useEffect(() => {
    setActiveModel(modelConfig.activeModel);
  }, [modelConfig.activeModel]);

  // Auto-calculate BMI (local preview, backend recalculates authoritatively)
  useEffect(() => {
    if (typeof berat === 'number' && typeof tinggi === 'number' && tinggi > 0) {
      const heightM = tinggi / 100;
      setBmi(Math.round((berat / (heightM * heightM)) * 10) / 10);
    } else {
      setBmi(0);
    }
  }, [berat, tinggi]);

  const handleModelSelect = async (selectedModel: AIModelConfig['activeModel']) => {
    setActiveModel(selectedModel);
    try {
      await useSettingsStore.getState().updateModelConfig({ activeModel: selectedModel });
    } catch (e) {
      console.error('Failed to update model selection:', e);
    }
  };

  const handleClassify = async () => {
    if (!usia || !berat || !tinggi || !sistolik || !diastolik) {
      alert('Mohon isi semua data klinis pasien terlebih dahulu.');
      return;
    }

    setIsClassifying(true);

    try {
      const savedRecord = await addRecord({
        usia: Number(usia),
        gender,
        berat: Number(berat),
        tinggi: Number(tinggi),
        sistolik: Number(sistolik),
        diastolik: Number(diastolik)
      });

      setCurrentResult(savedRecord.result as HypertensionLevel);
      setCurrentConfidence(savedRecord.confidenceScore);
    } catch (e) {
      console.error(e);
      alert('Gagal memproses data klasifikasi AI. Pastikan backend server Anda berjalan.');
    } finally {
      setIsClassifying(false);
    }
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

  return {
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
  };
}
