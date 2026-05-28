import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Download, Trash2, ChevronLeft, ChevronRight, Activity, Calendar, DownloadCloud } from 'lucide-react';
import { PredictionRecord } from '../types';

interface HistoryListProps {
  records: PredictionRecord[];
  onDeleteRecord: (id: string) => void;
}

export default function HistoryList({ records, onDeleteRecord }: HistoryListProps) {
  const [filterText, setFilterText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [exporting, setExporting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const itemsPerPage = 5;

  // Filter records
  const filtered = records.filter(
    (r) =>
      r.patientName.toLowerCase().includes(filterText.toLowerCase()) ||
      r.id.toLowerCase().includes(filterText.toLowerCase()) ||
      r.patientId.toLowerCase().includes(filterText.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginated = filtered.slice(startIndex, startIndex + itemsPerPage);

  const handleExport = (format: 'PDF' | 'CSV') => {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      setToastMessage(`Laporan berhasil diexport dalam format ${format}! File tersimpan di sistem.`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 1500);
  };

  const getBadgeStyle = (result: string) => {
    switch (result) {
      case 'Normal':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Pra Hipertensi':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Tingkat 1':
        return 'bg-orange-550/10 text-orange-900 border-orange-200/50';
      case 'Tingkat 2':
        return 'bg-red-50 text-red-800 border-red-200';
      default:
        // Krisis
        return 'bg-rose-100 text-rose-900 border-rose-350 animate-pulse';
    }
  };

  const getCircleColor = (result: string) => {
    switch (result) {
      case 'Normal':
        return 'bg-emerald-500';
      case 'Pra Hipertensi':
        return 'bg-amber-500';
      case 'Tingkat 1':
        return 'bg-[#bc4800]';
      default:
        return 'bg-red-650';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-4 select-none relative">
      {/* Toast notifications */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed top-24 right-8 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-xl text-xs font-bold border border-slate-700 flex items-center gap-2.5"
          >
            <DownloadCloud className="w-5 h-5 text-blue-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="text-left">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Riwayat Prediksi Klasifikasi</h2>
          <p className="text-sm font-semibold text-slate-400 mt-1">Daftar riwayat klasifikasi tingkat hipertensi pasien yang terekam</p>
        </div>
        
        {/* Export Buttons */}
        <div className="flex gap-2">
          <motion.button
            whileTap={{ scale: 0.98 }}
            disabled={exporting}
            onClick={() => handleExport('PDF')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>Export PDF</span>
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.98 }}
            disabled={exporting}
            onClick={() => handleExport('CSV')}
            className="bg-slate-100 hover:bg-slate-200 text-slate-750 font-bold text-xs py-2.5 px-4 border border-slate-250 rounded-xl transition-all disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </motion.button>
        </div>
      </div>

      {/* Table grid wrapper card */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-[0_4px_25px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col">
        {/* Toolbar Header filters */}
        <div className="p-4 md:p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center bg-slate-50/60 gap-4">
          <div className="relative w-full max-w-md">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4.5 h-4.5" />
            </span>
            <input
              type="text"
              placeholder="Filter by Patient ID or Name..."
              value={filterText}
              onChange={(e) => {
                setFilterText(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100/80 transition-all font-sans"
            />
          </div>
          <div className="flex gap-2 select-none">
            <span className="text-[10px] font-bold text-slate-400 bg-slate-100/50 border px-3 py-1 rounded-full uppercase tracking-wider">
              {filtered.length} Ditemukan
            </span>
          </div>
        </div>

        {/* Data Table contents */}
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#f8fafc]/80 border-b border-slate-200 select-none">
              <tr>
                <th className="py-3 px-6 text-[10px] font-bold text-slate-450 uppercase tracking-wider">ID Pasien</th>
                <th className="py-3 px-6 text-[10px] font-bold text-slate-450 uppercase tracking-wider">Nama Pasien</th>
                <th className="py-3 px-6 text-[10px] font-bold text-slate-450 uppercase tracking-wider">Tanggal Prediksi</th>
                <th className="py-3 px-6 text-[10px] font-bold text-slate-450 uppercase tracking-wider">Model Classifier</th>
                <th className="py-3 px-6 text-[10px] font-bold text-slate-450 uppercase tracking-wider text-center">Skor Kepercayaan</th>
                <th className="py-3 px-6 text-[10px] font-bold text-slate-450 uppercase tracking-wider">Hasil Klasifikasi</th>
                <th className="py-3 px-6 text-[10px] font-bold text-slate-450 uppercase tracking-wider text-center">Aksi</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-slate-100 bg-white font-medium">
              <AnimatePresence mode="popLayout">
                {paginated.length > 0 ? (
                  paginated.map((item) => (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.25 }}
                      className="hover:bg-slate-50/50 transition-colors group text-slate-750"
                    >
                      <td className="py-4.5 px-6 text-xs font-bold text-blue-700 tracking-wide select-text">{item.patientId}</td>
                      <td className="py-4.5 px-6 text-xs font-bold text-slate-900 select-text">{item.patientName}</td>
                      <td className="py-4.5 px-6 text-xs text-slate-400 select-text">
                        <div className="flex items-center gap-1.5 font-semibold">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{item.date}</span>
                        </div>
                      </td>
                      <td className="py-4.5 px-6 text-xs text-slate-500">{item.modelUsed}</td>
                      <td className="py-4.5 px-6 text-center select-none">
                        <span className="inline-flex items-center justify-center px-2 py-0.5 bg-blue-50 border border-blue-150 text-blue-800 rounded-md text-[10px] font-bold">
                          {item.confidenceScore}%
                        </span>
                      </td>
                      <td className="py-4.5 px-6">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 border rounded-full text-[10px] font-bold tracking-wide uppercase ${getBadgeStyle(item.result)}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${getCircleColor(item.result)}`} />
                          {item.result}
                        </span>
                      </td>
                      <td className="py-4.5 px-6 text-center">
                        <div className="flex justify-center">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onDeleteRecord(item.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 group-hover:bg-red-50 text-slate-400 group-hover:text-red-700 border border-slate-200/50 group-hover:border-red-200 rounded-xl transition-all duration-200 cursor-pointer"
                            title="Hapus Data Prediksi"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-bold">Hapus</span>
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr className="select-none">
                    <td colSpan={7} className="py-16 text-center">
                      <div className="flex flex-col items-center justify-center max-w-[280px] mx-auto py-4">
                        <div className="p-4 bg-slate-50 rounded-full border mb-4">
                          <Activity className="w-8 h-8 text-slate-400" />
                        </div>
                        <h4 className="text-sm font-bold text-slate-800">Tidak Ada Data Ditemukan</h4>
                        <p className="text-xs text-slate-400 text-center mt-1 leading-relaxed font-semibold">
                          Kami tidak menemukan data untuk kata kunci pencarian "{filterText}". Coba lagi.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Dynamic Pagination toolbar */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-150 bg-[#f8fafc]/50 flex items-center justify-between select-none">
            <p className="text-xs font-semibold text-slate-400">
              Menampilkan <span className="font-bold text-slate-800">{startIndex + 1}</span> hingga{' '}
              <span className="font-bold text-slate-800">
                {Math.min(startIndex + itemsPerPage, filtered.length)}
              </span>{' '}
              dari <span className="font-bold text-slate-800">{filtered.length}</span> hasil prediksi
            </p>
            <div className="flex gap-1">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((c) => Math.max(1, c - 1))}
                className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              {/* Pagination indexes */}
              {Array.from({ length: totalPages }).map((_, i) => {
                const pageIndex = i + 1;
                const isSelected = currentPage === pageIndex;
                return (
                  <button
                    key={`pg-idx-${pageIndex}`}
                    onClick={() => setCurrentPage(pageIndex)}
                    className={`w-8 h-8 rounded-lg font-bold text-xs transition-colors cursor-pointer
                      ${isSelected 
                        ? 'bg-blue-600 text-white shadow-sm' 
                        : 'bg-white border border-slate-200 hover:bg-slate-50 text-slate-650'
                      }`}
                  >
                    {pageIndex}
                  </button>
                );
              })}

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((c) => Math.min(totalPages, c + 1))}
                className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
