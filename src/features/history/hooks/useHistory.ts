import { useState, useMemo } from 'react';
import { usePredictionStore } from '../../../stores/predictionStore';

export function useHistory() {
  const { records, deleteRecord } = usePredictionStore();
  const [filterText, setFilterText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [exporting, setExporting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const itemsPerPage = 5;

  // Filter records based on query matching ID, name or Patient ID
  const filtered = useMemo(() => {
    return records.filter(
      (r) =>
        r.patientName.toLowerCase().includes(filterText.toLowerCase()) ||
        r.id.toLowerCase().includes(filterText.toLowerCase()) ||
        r.patientId.toLowerCase().includes(filterText.toLowerCase())
    );
  }, [records, filterText]);

  const totalPages = useMemo(() => {
    return Math.ceil(filtered.length / itemsPerPage);
  }, [filtered.length, itemsPerPage]);

  const startIndex = useMemo(() => {
    return (currentPage - 1) * itemsPerPage;
  }, [currentPage, itemsPerPage]);

  const paginated = useMemo(() => {
    return filtered.slice(startIndex, startIndex + itemsPerPage);
  }, [filtered, startIndex, itemsPerPage]);

  const handleExport = (format: 'PDF' | 'CSV') => {
    setExporting(true);
    if (format === 'CSV') {
      const headers = [
        'ID Rekam',
        'ID Pasien',
        'Nama Pasien',
        'Usia',
        'Jenis Kelamin',
        'Berat Badan (kg)',
        'Tinggi Badan (cm)',
        'IMT (kg/m2)',
        'Sistolik (mmHg)',
        'Diastolik (mmHg)',
        'Hasil Klasifikasi',
        'Skor Kepercayaan (%)',
        'Tanggal Pemeriksaan'
      ];
      const rows = filtered.map((r) => [
        r.id,
        r.patientId,
        `"${r.patientName.replace(/"/g, '""')}"`,
        r.age,
        r.gender === 'L' ? 'Laki-laki' : 'Perempuan',
        r.weight,
        r.height,
        r.bmi,
        r.systolic,
        r.diastolic,
        `"${r.result}"`,
        r.confidenceScore,
        `"${r.date}"`
      ]);
      const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `riwayat_klasifikasi_hipertensi_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    setTimeout(() => {
      setExporting(false);
      setToastMessage(`Laporan riwayat klinis berhasil diexport (${format})!`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 600);
  };

  const handleDeleteRecord = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus catatan riwayat prediksi ini?')) {
      deleteRecord(id);
      // Adjust current page if we delete the last item on the page
      if (paginated.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  return {
    records,
    filterText,
    setFilterText,
    currentPage,
    setCurrentPage,
    exporting,
    showToast,
    toastMessage,
    filtered,
    paginated,
    totalPages,
    startIndex,
    itemsPerPage,
    handleExport,
    handleDeleteRecord,
  };
}
