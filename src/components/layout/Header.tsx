import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, Bell, CircleCheck, ShieldCheck, ChevronDown, UserRound } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useUIStore } from '../../stores/uiStore';
import { useNotificationStore } from '../../stores/notificationStore';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const doctor = useAuthStore((state) => state.doctor);
  const logout = useAuthStore((state) => state.logout);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const toggleOpenMobile = useUIStore((state) => state.toggleOpenMobile);

  const { notifications, unreadCount, fetchNotifications, markAllAsRead, deleteNotification } = useNotificationStore();

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      fetchNotifications();
    }
  }, [isLoggedIn, fetchNotifications]);

  // Dynamically compute relative time
  const getRelativeTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) return 'Baru saja';
      if (diffMins < 60) return `${diffMins}m yang lalu`;
      if (diffHours < 24) return `${diffHours} jam yang lalu`;
      return `${diffDays} hari yang lalu`;
    } catch (e) {
      return 'Baru saja';
    }
  };

  // Dynamically compute active title based on path
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.startsWith('/dashboard')) return 'Dashboard Analitik Hipertensi';
    if (path.startsWith('/sistem-klasifikasi')) return 'Sistem Klasifikasi Tingkat Hipertensi';
    if (path.startsWith('/history')) return 'Riwayat Prediksi Klasifikasi';
    if (path.startsWith('/patients')) return 'Manajemen Data Pasien';
    if (path.startsWith('/evaluasi')) return 'Hasil Evaluasi Model AI';
    if (path.startsWith('/settings')) return 'Pengaturan Algoritma AI';
    return 'Clinical Intelligence System';
  };

  const handleLogoutClick = () => {
    if (confirm('Apakah Anda yakin ingin keluar dari sistem?')) {
      logout();
      navigate('/login');
    }
  };

  const handleEditProfileClick = () => {
    navigate('/settings');
    setProfileDropdownOpen(false);
  };

  return (
    <header className="h-[80px] w-full bg-white/85 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-30 px-6 flex justify-between items-center select-none">
      <div className="flex items-center gap-4">
        {/* Mobile menu trigger */}
        <button
          onClick={toggleOpenMobile}
          className="md:hidden text-slate-500 hover:text-slate-800 p-2 hover:bg-slate-50 border border-slate-200 rounded-xl transition-all cursor-pointer"
        >
          <Menu className="w-5.5 h-5.5" />
        </button>

        {/* Dynamic Nav Title */}
        <div className="flex items-center gap-2">
          <span className="hidden leading-7 text-2xl font-bold text-slate-900 md:block tracking-tight">
            {getPageTitle()}
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
            className="text-slate-500 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 hover:border-blue-100 p-2.5 rounded-2xl transition-all duration-200 relative cursor-pointer"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1.5 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            )}
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
                    {unreadCount > 0 && (
                      <span 
                        onClick={markAllAsRead}
                        className="text-[10px] font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors px-2.5 py-1 rounded-full select-none cursor-pointer"
                      >
                        Tandai sudah baca
                      </span>
                    )}
                  </div>
                  <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-slate-400 flex flex-col items-center justify-center gap-2 select-none">
                        <Bell className="w-8 h-8 text-slate-300 stroke-[1.5]" />
                        <p className="text-xs font-medium">Belum ada pemberitahuan baru.</p>
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div 
                          key={notif.id} 
                          className={`p-4 hover:bg-slate-50/80 transition-colors relative group/item ${!notif.isRead ? 'bg-blue-50/5' : ''}`}
                        >
                          {/* Specific notification deletion hover close trigger */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notif.id);
                            }}
                            className="absolute top-4 right-4 text-slate-300 hover:text-red-500 opacity-0 group-hover/item:opacity-100 transition-opacity p-0.5 rounded cursor-pointer"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                          
                          <div className="flex justify-between items-start pr-4">
                            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                              {!notif.isRead && (
                                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                  notif.type === 'danger' ? 'bg-red-500 animate-pulse' :
                                  notif.type === 'warning' ? 'bg-amber-500' :
                                  notif.type === 'success' ? 'bg-emerald-500' : 'bg-blue-500'
                                }`} />
                              )}
                              {notif.title}
                            </h4>
                            <span className="text-[9px] font-medium text-slate-400 select-none shrink-0">{getRelativeTime(notif.createdAt)}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 font-medium mt-1 leading-relaxed pr-4 text-left">{notif.desc}</p>
                        </div>
                      ))
                    )}
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
              alt="Logo Dinas Kesehatan"
              referrerPolicy="no-referrer"
              className="w-9 h-9 rounded-xl border border-blue-100 object-contain bg-white pointer-events-none p-0.5"
              src="/logo_dinkes.png"
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
                      alt="Logo Dinas Kesehatan"
                      referrerPolicy="no-referrer"
                      className="w-11 h-11 rounded-xl object-contain bg-white border border-slate-200 p-0.5"
                      src="/logo_dinkes.png"
                    />
                    <div>
                      <h3 className="text-xs font-bold text-slate-800 leading-snug">{doctor.name}</h3>
                      <p className="text-[10px] font-bold text-blue-600 mt-0.5">{doctor.specialty}</p>
                      <p className="text-[9px] font-semibold text-slate-400 mt-0.5">{doctor.hospital}</p>
                    </div>
                  </div>

                  <ul className="py-2.5 space-y-1 pl-0 list-none">
                    <li>
                      <button
                        onClick={handleEditProfileClick}
                        className="w-full text-left flex items-center gap-2.5 px-3 py-2 text-[12px] font-semibold text-slate-700 hover:text-blue-700 hover:bg-blue-50/50 rounded-xl transition-all cursor-pointer"
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
                      onClick={handleLogoutClick}
                      className="w-full text-center py-2 text-[12px] font-bold text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl transition-colors cursor-pointer"
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
