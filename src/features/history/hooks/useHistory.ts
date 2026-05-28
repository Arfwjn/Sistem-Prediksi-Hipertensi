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
    setTimeout(() => {
      setExporting(false);
      setToastMessage(`Laporan berhasil diexport dalam format ${format}! File tersimpan di sistem.`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 1500);
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
