import React, { useState } from 'react';
import { MapPin, Phone, Award, Map, ExternalLink, Clock, HeartHandshake, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function PuskesmasCard() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const googleMapsUrl = "https://www.google.com/maps/search/?api=1&query=Puskesmas+1+Kembaran+Banyumas";

  return (
    <div className="px-4 grid grid-cols-1 lg:grid-cols-12 gap-6 w-full items-stretch">
      {/* Card 1: Media (Gambar & Logo) - col-span-5 */}
      <div className="lg:col-span-5 flex flex-col h-full">
        <div className="p-5 flex flex-col justify-between h-full bg-white border border-slate-200 rounded-xl shadow-xs hover:border-slate-300 transition-colors">
          {/* Building Image */}
          <div className="w-full h-40 rounded-xl overflow-hidden border border-slate-200 shadow-xs relative shrink-0">
            <img 
              src="/puskesmas_building.png" 
              alt="Gedung Puskesmas 1 Kembaran" 
              className="w-full h-full object-cover select-none pointer-events-none"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Logos Group */}
          <div className="flex items-center gap-3 shrink-0 bg-slate-50/60 p-2.5 rounded-xl border border-slate-200/80 shadow-xs w-full justify-center mt-4">
            <img 
              src="/logo_banyumas.png" 
              alt="Logo Banyumas" 
              className="h-10 w-auto object-contain select-none pointer-events-none"
            />
            <div className="h-7 w-[1px] bg-slate-200" />
            <img 
              src="/logo_dinkes.png" 
              alt="Logo Dinas Kesehatan" 
              className="h-10 w-auto object-contain select-none pointer-events-none"
            />
            <div className="h-7 w-[1px] bg-slate-200" />
            <img 
              src="/logo_puskesmas.png" 
              alt="Logo Puskesmas" 
              className="h-10 w-auto object-contain select-none pointer-events-none"
            />
          </div>
        </div>
      </div>

      {/* Card 2: Informasi Puskesmas - col-span-7 */}
      <div className="lg:col-span-7 flex flex-col h-full">
        <div className="p-5 sm:p-6 flex flex-col justify-between h-full bg-white border border-slate-200 rounded-xl shadow-xs hover:border-slate-300 transition-colors text-left gap-4">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight leading-tight">Puskesmas 1 Kembaran</h2>
              <span 
                className="text-xs font-semibold text-slate-500 cursor-help select-none"
                title="Puskesmas 1 Kembaran terakreditasi Paripurna oleh Kementerian Kesehatan RI"
              >
                (Akreditasi Paripurna)
              </span>
            </div>
            
            <p className="text-xs font-semibold text-slate-400 flex items-center gap-2 flex-wrap border-b border-slate-100 pb-3">
              <span className="font-bold text-slate-700">Kode Puskesmas:</span> P3302110101
              <span className="text-slate-350">|</span>
              <span className="font-bold text-slate-600">Wilayah Kerja:</span> Kec. Kembaran (16 Desa)
            </p>

            <div className="space-y-2.5 text-xs text-slate-600 font-medium">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-slate-800 shrink-0 mt-0.5" />
                <span>Jl. Raya Kembaran No. 1, Kec. Kembaran, Kab. Banyumas, Jawa Tengah 53182</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-800 shrink-0" />
                <span>(0281) 6844243</span>
              </p>
            </div>
          </div>

          {/* Action Row: Lihat Selengkapnya (link) & Petunjuk Lokasi (button) */}
          <div className="flex items-center justify-between gap-4 pt-16 border-t border-slate-100 mt-auto">
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-xs font-bold text-slate-700 hover:text-slate-950 hover:underline underline-offset-4 cursor-pointer transition-colors"
            >
              Lihat Selengkapnya
            </button>

            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-black active:bg-slate-800 text-white rounded-lg border border-slate-900 border-b-2 shadow-xs active:border-b active:translate-y-[1px] transition-all cursor-pointer text-xs font-semibold"
            >
              <Map className="w-4 h-4 text-white" />
              <span>Google Maps</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          </div>
        </div>
      </div>


      {/* Modal Detail Informasi Puskesmas */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black z-50 cursor-pointer"
            />
            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 md:max-w-2xl md:mx-auto bg-white rounded-2xl shadow-2xl border border-slate-205 p-6 z-50 text-left overflow-y-auto max-h-[85vh] select-none"
            >
              {/* Header */}
              <div className="flex justify-between items-start border-b border-slate-100 pb-4 mb-4">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">
                    Profil Puskesmas 1 Kembaran
                  </h3>
                  <p className="text-xs text-slate-400 font-semibold mt-0.5">Kabupaten Banyumas, Jawa Tengah</p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="space-y-4 text-xs text-slate-600 leading-relaxed font-sans">
                <div>
                  <h4 className="font-extrabold text-slate-800 uppercase tracking-wider text-[10px] mb-1.5">
                    Tentang Kami
                  </h4>
                  <p className="font-medium">
                    Puskesmas 1 Kembaran merupakan unit pelaksana teknis dinas kesehatan kabupaten Banyumas yang menyelenggarakan pelayanan kesehatan tingkat pertama. Puskesmas berkomitmen untuk menyediakan layanan kesehatan yang bermutu, merata, dan terjangkau bagi seluruh lapisan masyarakat di wilayah Kecamatan Kembaran.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-extrabold text-slate-800 uppercase tracking-wider text-[10px] mb-1.5">
                      Jam Pelayanan
                    </h4>
                    <ul className="space-y-1 font-semibold list-disc list-inside text-slate-600">
                      <li>Senin - Kamis: 07:30 - 14:00 WIB</li>
                      <li>Jumat: 07:30 - 11:00 WIB</li>
                      <li>Sabtu: 07:30 - 12:30 WIB</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-extrabold text-slate-800 uppercase tracking-wider text-[10px] mb-1.5">
                      Status Pelayanan
                    </h4>
                    <ul className="space-y-1 font-semibold list-disc list-inside text-slate-600">
                      <li>Akreditasi Paripurna (Tertinggi)</li>
                      <li>Unit Gawat Darurat (UGD) 24 Jam</li>
                      <li>Puskesmas Rawat Jalan</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h4 className="font-extrabold text-slate-800 uppercase tracking-wider text-[10px] mb-1.5">Visi Puskesmas</h4>
                  <p className="font-medium italic bg-slate-50 border border-slate-100 p-2.5 rounded-xl text-center text-slate-700">
                    "Terwujudnya pelayanan kesehatan yang bermutu, merata, dan terjangkau menuju masyarakat Kecamatan Kembaran yang sehat secara mandiri."
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end pt-4 border-t border-slate-100 mt-6 gap-3 select-none">
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-white border border-slate-200 border-b-2 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-50 transition-all flex items-center gap-1.5 shadow-xs cursor-pointer active:translate-y-[1px]"
                >
                  <Map className="w-4 h-4 text-slate-700" />
                  <span>Petunjuk Arah</span>
                </a>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Tutup Profil
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
