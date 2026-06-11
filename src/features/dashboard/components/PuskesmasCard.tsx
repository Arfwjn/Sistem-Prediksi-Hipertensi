import React, { useState } from 'react';
import { MapPin, Phone, Award, Map, ExternalLink, Clock, HeartHandshake, X } from 'lucide-react';
import { GlowCard } from '../../../components/ui/spotlight-card';
import { motion, AnimatePresence } from 'motion/react';

export default function PuskesmasCard() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const googleMapsUrl = "https://www.google.com/maps/search/?api=1&query=Puskesmas+1+Kembaran+Banyumas";

  return (
    <div className="px-4 grid grid-cols-1 lg:grid-cols-12 gap-6 w-full items-stretch">
      {/* Card 1: Media (Gambar & Logo) - col-span-5 */}
      <div className="lg:col-span-5 flex flex-col h-full">
        <GlowCard 
          className="p-5 flex flex-col justify-between h-full bg-gradient-to-br from-blue-50/50 via-white to-white border-blue-100/50"
          glowColor="blue"
          customSize={true}
        >
          {/* Building Image */}
          <div className="w-full h-40 rounded-xl overflow-hidden border border-slate-200/80 shadow-sm relative shrink-0">
            <img 
              src="/puskesmas_building.png" 
              alt="Gedung Puskesmas 1 Kembaran" 
              className="w-full h-full object-cover select-none pointer-events-none hover:scale-102 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Logos Group */}
          <div className="flex items-center gap-3 shrink-0 bg-white/95 p-2 rounded-xl border border-slate-200/60 shadow-sm w-full justify-center mt-4">
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
        </GlowCard>
      </div>

      {/* Card 2: Informasi Puskesmas - col-span-7 */}
      <div className="lg:col-span-7 flex flex-col h-full">
        <GlowCard 
          className="p-5 sm:p-6 flex flex-col justify-between h-full bg-gradient-to-br from-indigo-50/30 via-white to-white border-blue-100/50 text-left gap-4"
          glowColor="blue"
          customSize={true}
        >
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight leading-tight">Puskesmas 1 Kembaran</h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 border border-emerald-250 text-emerald-700 shadow-sm">
                <Award className="w-3.5 h-3.5" />
                Akreditasi Paripurna
              </span>
            </div>
            
            <p className="text-xs font-semibold text-slate-400 flex items-center gap-2 flex-wrap border-b border-slate-100 pb-3">
              <span className="font-bold text-blue-600">Kode Puskesmas:</span> P3302110101
              <span className="text-slate-350">|</span>
              <span className="font-bold text-indigo-500">Wilayah Kerja:</span> Kec. Kembaran (16 Desa)
            </p>

            <div className="space-y-2.5 text-xs text-slate-500 font-medium">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>Jl. Raya Kembaran No. 1, Kec. Kembaran, Kab. Banyumas, Jawa Tengah 53182</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-500 shrink-0" />
                <span>(0281) 6844243</span>
              </p>
            </div>
          </div>

          {/* Action Row: Lihat Selengkapnya (link) & Petunjuk Lokasi (button) */}
          <div className="flex items-center justify-between gap-4 pt-16 border-t border-slate-100 mt-auto">
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-xs font-bold text-blue-600 hover:text-blue-750 hover:underline underline-offset-4 cursor-pointer transition-colors"
            >
              Lihat Selengkapnya
            </button>

            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-1.5 py-1 bg-rose-50 rounded-full border border-rose-250 text-rose-700 hover:bg-rose-100 shadow-sm active:scale-98 transition-all cursor-pointer"
            >
              <Map className="w-4 h-4" />
              <span>Google Maps</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </GlowCard>
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
                  <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                    <span>Profil Puskesmas 1 Kembaran</span>
                  </h3>
                  <p className="text-xs text-slate-400 font-semibold mt-0.5">Kabupaten Banyumas, Jawa Tengah</p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-650 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="space-y-4 text-xs text-slate-600 leading-relaxed font-sans">
                <div>
                  <h4 className="font-extrabold text-slate-800 uppercase tracking-wider text-[10px] mb-1.5 flex items-center gap-1.5">
                    <HeartHandshake className="w-3.5 h-3.5 text-blue-605" />
                    Tentang Kami
                  </h4>
                  <p className="font-medium">
                    Puskesmas 1 Kembaran merupakan unit pelaksana teknis dinas kesehatan kabupaten Banyumas yang menyelenggarakan pelayanan kesehatan tingkat pertama. Puskesmas berkomitmen untuk menyediakan layanan kesehatan yang bermutu, merata, dan terjangkau bagi seluruh lapisan masyarakat di wilayah Kecamatan Kembaran.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-extrabold text-slate-800 uppercase tracking-wider text-[10px] mb-1.5 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-indigo-650" />
                      Jam Pelayanan
                    </h4>
                    <ul className="space-y-1 font-semibold list-disc list-inside text-slate-600">
                      <li>Senin - Kamis: 07:30 - 14:00 WIB</li>
                      <li>Jumat: 07:30 - 11:00 WIB</li>
                      <li>Sabtu: 07:30 - 12:30 WIB</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-extrabold text-slate-800 uppercase tracking-wider text-[10px] mb-1.5 flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-emerald-600" />
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
                  className="px-4 py-2 bg-rose-50 border border-rose-200/80 rounded-xl text-xs font-bold text-rose-700 hover:bg-rose-100 transition-colors flex items-center gap-1.5"
                >
                  <Map className="w-4 h-4" />
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
