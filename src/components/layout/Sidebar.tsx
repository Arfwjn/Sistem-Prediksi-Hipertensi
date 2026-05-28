import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, History, Users, Settings, LogOut, Heart, X } from 'lucide-react';
import { useUIStore } from '../../stores/uiStore';
import { useAuthStore } from '../../stores/authStore';

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isOpenMobile, setIsOpenMobile } = useUIStore();
  const logout = useAuthStore((state) => state.logout);

  const menuItems = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      description: 'Hasil klasifikasi & tren BP'
    },
    {
      path: '/history',
      label: 'Riwayat Prediksi',
      icon: History,
      description: 'Laporan klinis terekam'
    },
    {
      path: '/patients',
      label: 'Data Pasien',
      icon: Users,
      description: 'Daftar pasien & detail medis'
    }
  ];

  const handleLogoutClick = () => {
    if (confirm('Apakah Anda yakin ingin keluar dari sistem?')) {
      logout();
      navigate('/login');
    }
  };

  const SidebarContent = () => (
    <div className="h-full flex flex-col py-6 bg-white border-r border-slate-200/85 shadow-sm">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-6 mb-10 select-none">
        <div className="w-10 h-10 rounded-xl bg-blue-50/70 flex items-center justify-center border border-blue-100/50">
          <Heart className="text-[#0053db] fill-[#0053db]/10 w-5.5 h-5.5 animate-pulse" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-slate-950 tracking-tight leading-none">Sistem Klasifikasi</h1>
          <p className="text-xs font-semibold text-slate-400 mt-1">Hipertensi AI</p>
        </div>
        {isOpenMobile && (
          <button 
            type="button" 
            onClick={() => setIsOpenMobile(false)}
            className="ml-auto p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all md:hidden cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Main Navigation List */}
      <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => {
          // Check if active path matches
          const isActive = location.pathname.startsWith(item.path);
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsOpenMobile(false)}
              className="w-full text-left group flex items-center gap-3.5 px-4 py-3 rounded-2xl relative transition-all duration-200 decoration-none"
            >
              {isActive && (
                <motion.div
                  layoutId="activeBar"
                  className="absolute inset-0 bg-blue-50/80 rounded-2xl border border-blue-100/50 shadow-sm z-0"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <div className={`relative z-10 p-2 rounded-xl transition-all duration-200
                ${isActive 
                  ? 'bg-blue-600 text-white shadow-[0_4px_12px_rgba(37,99,235,0.25)] border border-blue-600' 
                  : 'bg-slate-50 border border-slate-200/80 text-slate-400 group-hover:text-slate-600 group-hover:bg-slate-100'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div className="relative z-10 flex-grow select-none">
                <span className={`text-sm font-semibold block transition-colors duration-200
                  ${isActive ? 'text-blue-700' : 'text-slate-600 group-hover:text-slate-900'}
                `}>
                  {item.label}
                </span>
                <span className={`text-[10px] block font-medium transition-colors duration-200
                  ${isActive ? 'text-blue-500' : 'text-slate-400 group-hover:text-slate-500'}
                `}>
                  {item.description}
                </span>
              </div>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Navigation (Settings & Logout) */}
      <div className="px-4 mt-auto pt-6 border-t border-slate-100 space-y-1.5">
        <NavLink
          to="/settings"
          onClick={() => setIsOpenMobile(false)}
          className={({ isActive }) =>
            `w-full text-left group flex items-center gap-3.5 px-4 py-3.5 rounded-2xl relative transition-all duration-200 decoration-none
            ${isActive ? 'bg-blue-50/50 border border-blue-100/50' : 'hover:bg-slate-50'}
          `}
        >
          {({ isActive }) => (
            <>
              <div className={`p-2 rounded-xl border transition-all duration-200
                ${isActive 
                  ? 'bg-blue-600 text-white shadow-md border-blue-600' 
                  : 'bg-slate-50 border-slate-200/80 text-slate-400 group-hover:text-slate-600 group-hover:bg-slate-100'
                }`}
              >
                <Settings className="w-5 h-5" />
              </div>
              <div className="select-none flex-1">
                <span className={`text-sm font-semibold block transition-colors duration-200
                  ${isActive ? 'text-blue-700' : 'text-slate-600 group-hover:text-slate-900'}
                `}>
                  Pengaturan
                </span>
                <span className="text-[10px] text-slate-400 block font-medium">Model & Profil Dokter</span>
              </div>
            </>
          )}
        </NavLink>

        <button
          onClick={handleLogoutClick}
          className="w-full text-left group flex items-center gap-3.5 px-4 py-3.5 rounded-2xl hover:bg-red-50/60 transition-all duration-200 cursor-pointer"
        >
          <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-400 group-hover:text-red-600 group-hover:bg-red-100 group-hover:border-red-200 transition-all duration-200">
            <LogOut className="w-5 h-5" />
          </div>
          <div className="select-none">
            <span className="text-sm font-semibold text-slate-600 group-hover:text-red-700 block transition-colors duration-200">
              Logout
            </span>
            <span className="text-[10px] text-slate-400 group-hover:text-red-500 block font-medium transition-colors duration-200">
              Keluar dari akun
            </span>
          </div>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar Layout */}
      <aside className="hidden md:flex flex-col h-screen w-72 shrink-0 sticky left-0 top-0 overflow-y-auto z-10">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Slider Drawers */}
      <AnimatePresence>
        {isOpenMobile && (
          <>
            {/* Backdrop overlays */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpenMobile(false)}
              className="fixed inset-0 bg-slate-950/40 backdrop-blur-[1px] z-40 md:hidden"
            />
            {/* Drawer Drawer Body */}
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-[280px] z-50 md:hidden pb-safe"
            >
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
