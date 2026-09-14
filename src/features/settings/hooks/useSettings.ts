import React, { useState } from 'react';
import { useAuthStore } from '../../../stores/authStore';
import { useSettingsStore } from '../../../stores/settingsStore';
import { usePatientStore } from '../../../stores/patientStore';
import { usePredictionStore } from '../../../stores/predictionStore';
import { settingsService } from '../../../services/settingsService';

export function useSettings() {
  const { doctor, updateDoctor } = useAuthStore();
  const patients = usePatientStore((state) => state.patients);
  const records = usePredictionStore((state) => state.records);

  // 1. Profil Tenaga Medis & Faskes
  const [docName, setDocName] = useState(doctor.name || 'Dr. Arief Sidik');
  const [docSpecialty, setDocSpecialty] = useState(doctor.specialty || 'Dokter Penanggung Jawab Klinis');
  const [docHospital, setDocHospital] = useState(doctor.hospital || 'Puskesmas Banyumas');
  const [docSip, setDocSip] = useState(() => localStorage.getItem('klinikal_doc_sip') || 'SIP.503/449/123/2023');
  const [faskesAddress, setFaskesAddress] = useState(() => localStorage.getItem('klinikal_faskes_address') || 'Jl. Raya Banyumas No. 12, Kec. Banyumas, Kab. Banyumas');
  const [faskesPhone, setFaskesPhone] = useState(() => localStorage.getItem('klinikal_faskes_phone') || '(0281) 796123');

  // 2. Ubah Kata Sandi Akun
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // 3. Notifikasi Toast
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'danger'>('success');

  const triggerToast = (msg: string, type: 'success' | 'danger' = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3500);
  };

  // Simpan Profil Faskes & Nakes
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName.trim() || !docSpecialty.trim()) {
      alert('Nama Tenaga Medis dan Spesialisasi wajib diisi.');
      return;
    }

    try {
      await updateDoctor({
        name: docName,
        specialty: docSpecialty,
        hospital: docHospital,
      });

      localStorage.setItem('klinikal_doc_sip', docSip);
      localStorage.setItem('klinikal_faskes_address', faskesAddress);
      localStorage.setItem('klinikal_faskes_phone', faskesPhone);

      triggerToast('Profil fasilitas kesehatan & nakes berhasil disimpan!', 'success');
    } catch (err: any) {
      triggerToast(err.message || 'Gagal memperbarui profil.', 'danger');
    }
  };

  // Ganti Kata Sandi
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('Semua kolom kata sandi wajib diisi.');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('Kata sandi baru minimal 6 karakter.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Konfirmasi kata sandi baru tidak cocok.');
      return;
    }

    setIsChangingPassword(true);
    try {
      await settingsService.changePassword({
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: confirmPassword,
      });

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      triggerToast('Kata sandi akun Anda berhasil diperbarui!', 'success');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Gagal mengubah kata sandi. Pastikan kata sandi lama benar.';
      setPasswordError(msg);
      triggerToast(msg, 'danger');
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Unduh Backup Data Registri & Rekam Medis (JSON)
  const handleDownloadBackupJSON = () => {
    const backupData = {
      system: 'Klinikal Hipertensi CDSS',
      exportedAt: new Date().toISOString(),
      facility: docHospital,
      clinician: docName,
      totalPatients: patients.length,
      totalRecords: records.length,
      patients: patients,
      records: records,
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    const dateStr = new Date().toISOString().split('T')[0];
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `backup_klinikal_hipertensi_${dateStr}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    triggerToast('File cadangan basis data (JSON) berhasil diunduh!', 'success');
  };

  // Unduh Laporan Rekapitulasi Medis (CSV)
  const handleDownloadRecapCSV = () => {
    const headers = [
      'No',
      'ID Pasien',
      'Nama Pasien',
      'Usia',
      'Gender',
      'Telepon',
      'Alamat',
      'Status Terakhir',
      'Terakhir Periksa',
      'Jumlah Riwayat Tensi',
    ];

    const rows = patients.map((p, idx) => [
      idx + 1,
      `"${p.id}"`,
      `"${p.name}"`,
      p.age,
      p.gender === 'L' ? 'Laki-laki' : 'Perempuan',
      `"${p.phone || '-'}"`,
      `"${p.address || '-'}"`,
      `"${p.status}"`,
      `"${p.lastChecked || '-'}"`,
      p.bpHistory ? p.bpHistory.length : 0,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `rekapitulasi_pasien_hipertensi_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    triggerToast('Laporan rekapitulasi data pasien (CSV) berhasil diunduh!', 'success');
  };

  // Reset Database
  const handleResetDatabase = async () => {
    if (confirm('PERINGATAN: Apakah Anda yakin ingin mereset seluruh database riwayat prediksi dan pasien ke setelan awal pabrik? Tindakan ini tidak dapat dibatalkan.')) {
      try {
        await useSettingsStore.getState().resetDatabase();
        triggerToast('Database berhasil di-reset ke nilai default klinis.', 'success');
      } catch (e) {
        console.error('Failed to reset database:', e);
        alert('Gagal mereset database. Pastikan backend server Anda berjalan.');
      }
    }
  };

  return {
    // Profil Faskes
    docName,
    setDocName,
    docSpecialty,
    setDocSpecialty,
    docHospital,
    setDocHospital,
    docSip,
    setDocSip,
    faskesAddress,
    setFaskesAddress,
    faskesPhone,
    setFaskesPhone,
    handleSaveProfile,

    // Ubah Password
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    isChangingPassword,
    passwordError,
    handleChangePassword,

    // Cadangan Data & Reset
    totalPatients: patients.length,
    totalRecords: records.length,
    handleDownloadBackupJSON,
    handleDownloadRecapCSV,
    handleResetDatabase,

    // Toast
    showToast,
    toastMessage,
    toastType,
  };
}
