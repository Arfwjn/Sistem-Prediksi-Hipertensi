import React, { useState } from 'react';
import { useAuthStore } from '../../../stores/authStore';
import { useSettingsStore } from '../../../stores/settingsStore';


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

  const handleResetDatabase = async () => {
    if (confirm('Apakah Anda yakin ingin mereset seluruh database riwayat prediksi dan pasien ke setelan bawaan klinis?')) {
      try {
        await useSettingsStore.getState().resetDatabase();

        // Re-sync local form state from the refreshed store values
        const refreshedConfig = useSettingsStore.getState().modelConfig;
        const refreshedDoctor = useAuthStore.getState().doctor;

        setDocName(refreshedDoctor.name);
        setDocSpecialty(refreshedDoctor.specialty);
        setDocHospital(refreshedDoctor.hospital);

        setActiveModel(refreshedConfig.activeModel);
        setRfTrees(refreshedConfig.rfTrees);
        setRfMaxDepth(refreshedConfig.rfMaxDepth);
        setDtMinSamples(refreshedConfig.dtMinSamples);
        setLrIterations(refreshedConfig.lrIterations);
        setConfidenceFactor(refreshedConfig.confidenceFactor);

        triggerToast('Database berhasil di-reset ke nilai default klinis.');
      } catch (e) {
        console.error('Failed to reset database:', e);
        alert('Gagal mereset database. Pastikan backend server Anda berjalan.');
      }
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
