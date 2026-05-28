import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, Settings, Bell, CircleCheck, HeartHandshake, ShieldCheck, CreditCard, ChevronDown, UserRound } from 'lucide-react';
import { DoctorProfile } from '../types';

interface HeaderProps {
  doctor: DoctorProfile;
  activeTitle: string;
  onMenuToggle: () => void;
  onLogout: () => void;
  onEditProfileClick: () => void;
}

export default function Header({
  doctor,
  activeTitle,
  onMenuToggle,
  onLogout,
  onEditProfileClick
}: HeaderProps) {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const notifications = [
    { id: 1, title: 'Data Pasien Terupdate', desc: 'Ahmad Hidayat mengupdate data klinis terbaru.', time: '5m yang lalu' },
    { id: 2, title: 'Optimasi AI Selesai', desc: 'Kecepatan model Random Forest meningkat 12%.', time: '1 jam yang lalu' },
    { id: 3, title: 'Batas Risiko Terlewati', desc: 'Sistolik pasien PT-2023-004 mencapai 184 mmHg.', time: '3 jam yang lalu', alert: true }
  ];

  return (
    <header className="h-[80px] w-full bg-white/85 backdrop-blur-md border-b border-slate-250 sticky top-0 z-30 px-6 flex justify-between items-center select-none">
      <div className="flex items-center gap-4">
        {/* Mobile menu trigger */}
        <button
          onClick={onMenuToggle}
          className="md:hidden text-slate-500 hover:text-slate-800 p-2 hover:bg-slate-50 border border-slate-200 rounded-xl transition-all"
        >
          <Menu className="w-5.5 h-5.5" />
        </button>

        {/* Dynamic Nav Title */}
        <div className="flex items-center gap-2">
          <span className="hidden leading-7 text-2xl font-bold text-slate-900 md:block tracking-tight">
            {activeTitle}
          </span>
          <span className="leading-7 text-lg font-bold text-slate-900 md:hidden block tracking-tight">
            Hipertensi AI
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Toggleable Notification Drawer */}
        <div className="relative">
          <button
            onClick={() => {
              setNotificationsOpen(!notificationsOpen);
              setProfileDropdownOpen(false);
            }}
            className="text-slate-500 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 hover:border-blue-100 p-2.5 rounded-2xl transition-all relative"
          >
            <Bell className="w-5 h-5 animate-pulse" />
            <span className="absolute top-1 right-1.5 w-2 h-2 rounded-full bg-red-500" />
          </button>

          <AnimatePresence>
            {notificationsOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setNotificationsOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-slate-150 z-50 overflow-hidden"
                >
                  <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Pemberitahuan</span>
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-550/10 px-2 py-0.5 rounded-full select-none cursor-pointer">
                      Tandai sudah baca
                    </span>
                  </div>
                  <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                    {notifications.map((notif) => (
                      <div key={notif.id} className={`p-4 hover:bg-slate-50/80 transition-colors ${notif.alert ? 'bg-red-50/10' : ''}`}>
                        <div className="flex justify-between items-start">
                          <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                            {notif.alert && <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />}
                            {notif.title}
                          </h4>
                          <span className="text-[9px] font-medium text-slate-400">{notif.time}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium mt-1 leading-relaxed">{notif.desc}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Doctor profile card */}
        <div className="relative">
          <div
            onClick={() => {
              setProfileDropdownOpen(!profileDropdownOpen);
              setNotificationsOpen(false);
            }}
            className="flex items-center gap-3 p-1.5 pr-4 border border-slate-200 hover:border-blue-150 bg-slate-50/40 hover:bg-blue-50/20 rounded-2xl cursor-pointer transition-all active:scale-98 relative"
          >
            <img
              alt="Doctor Avatar"
              referrerPolicy="no-referrer"
              className="w-9 h-9 rounded-xl border border-blue-100 object-cover bg-white pointer-events-none"
              src={doctor.avatarUrl}
            />
            <div className="hidden md:block text-left">
              <p className="text-[12.5px] font-bold text-slate-800 leading-tight tracking-tight">{doctor.name}</p>
              <p className="text-[10px] font-semibold text-slate-400 leading-none mt-0.5">{doctor.specialty}</p>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 hidden md:block" />
          </div>

          <AnimatePresence>
            {profileDropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setProfileDropdownOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-slate-150 z-50 p-4"
                >
                  <div className="flex gap-3 pb-3 border-b border-slate-100 select-none">
                    <img
                      alt="Doctor Avatar dropdown"
                      referrerPolicy="no-referrer"
                      className="w-11 h-11 rounded-xl object-cover bg-slate-100 border border-slate-200"
                      src={doctor.avatarUrl}
                    />
                    <div>
                      <h3 className="text-xs font-bold text-slate-800 leading-snug">{doctor.name}</h3>
                      <p className="text-[10px] font-bold text-blue-600 mt-0.5">{doctor.specialty}</p>
                      <p className="text-[9px] font-semibold text-slate-400 mt-0.5">{doctor.hospital}</p>
                    </div>
                  </div>

                  <ul className="py-2.5 space-y-1">
                    <li>
                      <button
                        onClick={() => {
                          onEditProfileClick();
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full text-left flex items-center gap-2.5 px-3 py-2 text-[12px] font-semibold text-slate-700 hover:text-blue-700 hover:bg-blue-50/50 rounded-xl transition-all"
                      >
                        <UserRound className="w-4 h-4 text-slate-400 group-hover:text-blue-500" />
                        <span>Edit Profil Anda</span>
                      </button>
                    </li>
                    <li className="select-none">
                      <div className="flex items-center justify-between px-3 py-2 text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl font-bold uppercase tracking-wider">
                        <div className="flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Kredibilitas Medis</span>
                        </div>
                        <CircleCheck className="w-3.5 h-3.5 text-emerald-600" />
                      </div>
                    </li>
                  </ul>

                  <div className="border-t border-slate-100 pt-2.5 mt-1">
                    <button
                      onClick={onLogout}
                      className="w-full text-center py-2 text-[12px] font-bold text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl transition-colors"
                    >
                      Logout dari Sistem
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
