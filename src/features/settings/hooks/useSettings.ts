import React, { useState } from 'react';
import { useAuthStore } from '../../../stores/authStore';
import { useSettingsStore } from '../../../stores/settingsStore';
import { usePatientStore } from '../../../stores/patientStore';
import { usePredictionStore } from '../../../stores/predictionStore';
import { AIModelConfig } from '../../../types';

export function useSettings() {
  const { doctor, updateDoctor, logout } = useAuthStore();
  const { modelConfig, updateModelConfig } = useSettingsStore();

  // Doctor form states
  const [docName, setDocName] = useState(doctor.name);
  const [docSpecialty, setDocSpecialty] = useState(doctor.specialty);
  const [docHospital, setDocHospital] = useState(doctor.hospital);

  // Model states
  const [activeModel, setActiveModel] = useState(modelConfig.activeModel);
  const [rfTrees, setRfTrees] = useState(modelConfig.rfTrees);
  const [rfMaxDepth, setRfMaxDepth] = useState(modelConfig.rfMaxDepth);
  const [dtMinSamples, setDtMinSamples] = useState(modelConfig.dtMinSamples);
  const [lrIterations, setLrIterations] = useState(modelConfig.lrIterations);
  const [confidenceFactor, setConfidenceFactor] = useState(modelConfig.confidenceFactor);

  // Notifications
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName.trim() || !docSpecialty.trim()) {
      alert('Nama Dokter dan Spesialisasi tidak boleh kosong.');
      return;
    }
    updateDoctor({
      name: docName,
      specialty: docSpecialty,
      hospital: docHospital
    });
    triggerToast('Profil Dokter berhasil diperbarui!');
  };

  const handleSaveModel = (e: React.FormEvent) => {
    e.preventDefault();
    updateModelConfig({
      activeModel,
      rfTrees,
      rfMaxDepth,
      dtMinSamples,
      lrIterations,
      confidenceFactor
    });
    triggerToast('Konfigurasi Parameter AI berhasil disimpan!');
  };

  const handleResetDatabase = () => {
    if (confirm('Apakah Anda yakin ingin mereset seluruh database riwayat prediksi dan pasien ke setelan bawaan klinis?')) {
      usePatientStore.getState().resetPatients();
      usePredictionStore.getState().resetRecords();
      useSettingsStore.getState().resetSettings();
      // Keep doc logged in but reset to default doc info except name (optional, or fully reset authStore)
      useAuthStore.getState().updateDoctor({
        name: 'Dr. Arief Sidik',
        specialty: 'Cardiologist',
        hospital: 'Heart & Vascular Center',
      });

      // Reset local fields
      setDocName('Dr. Arief Sidik');
      setDocSpecialty('Cardiologist');
      setDocHospital('Heart & Vascular Center');
      
      setActiveModel('Random Forest');
      setRfTrees(100);
      setRfMaxDepth(12);
      setDtMinSamples(4);
      setLrIterations(200);
      setConfidenceFactor(0.98);

      triggerToast('Database berhasil di-reset ke nilai default klinis.');
    }
  };

  return {
    docName,
    setDocName,
    docSpecialty,
    setDocSpecialty,
    docHospital,
    setDocHospital,
    activeModel,
    setActiveModel,
    rfTrees,
    setRfTrees,
    rfMaxDepth,
    setRfMaxDepth,
    dtMinSamples,
    setDtMinSamples,
    lrIterations,
    setLrIterations,
    confidenceFactor,
    setConfidenceFactor,
    showToast,
    toastMessage,
    handleSaveProfile,
    handleSaveModel,
    handleResetDatabase,
  };
}
