// src/components/Sidebar.tsx
import { LayoutDashboard, Archive, Settings, Users, LogOut, X } from 'lucide-react'; 
import { NavLink } from 'react-router-dom'; 

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const navLinkClass = ({ isActive }: { isActive: boolean }) => 
    isActive 
      ? "flex items-center gap-3 px-4 py-3 bg-arch-blue/10 text-arch-blue rounded-lg border-l-2 border-arch-blue font-semibold transition-colors"
      : "flex items-center gap-3 px-4 py-3 text-arch-text-gray hover:text-white transition-colors border-l-2 border-transparent";

  const handleLogout = () => {
    localStorage.removeItem('archplan_token');
    window.location.reload(); 
  };

  return (
    <>
      {/* 1. OVERLAY (Fondo oscuro transparente solo para móviles cuando está abierto) */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* 2. EL SIDEBAR (Diseño a prueba de balas con Left Posicional) */}
      <aside className={`fixed md:relative top-0 h-screen z-50 w-64 bg-arch-dark border-r border-gray-800 flex flex-col justify-between transition-all duration-300 ease-in-out shrink-0 ${isOpen ? 'left-0' : '-left-64 md:left-0'}`}>
        
        <div>
          <div className="p-6 border-b border-gray-800 flex justify-between items-center">
            <h1 className="text-2xl font-bold tracking-wider text-white">
              Arch<span className="text-arch-text-gray">Plan</span>
            </h1>
            {/* Botón de cerrar solo visible en móviles */}
            <button onClick={onClose} className="md:hidden text-gray-400 hover:text-white cursor-pointer transition-colors p-1 rounded-md hover:bg-gray-800">
              <X size={24} />
            </button>
          </div>

          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-arch-blue/20 text-arch-blue w-8 h-8 rounded flex items-center justify-center font-bold shrink-0">
                A
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-white truncate">Project Space</p>
                <p className="text-[10px] text-arch-text-gray tracking-widest truncate">V-FINAL EDITION</p>
              </div>
            </div>

            <nav className="space-y-2">
              <NavLink to="/" className={navLinkClass} end onClick={onClose}>
                <LayoutDashboard size={20} /> Current Works
              </NavLink>
              <NavLink to="/directory" className={navLinkClass} onClick={onClose}>
                <Users size={20} /> Directory
              </NavLink>
              <NavLink to="/archive" className={navLinkClass} onClick={onClose}>
                <Archive size={20} /> Archive
              </NavLink>
              <NavLink to="/settings" className={navLinkClass} onClick={onClose}>
                <Settings size={20} /> Settings
              </NavLink>
            </nav>
          </div>
        </div>

        <div className="p-6 border-t border-gray-800 flex flex-col gap-4">
          <div className="bg-arch-card p-4 rounded-lg border border-gray-700">
            <p className="text-xs text-arch-text-gray font-semibold mb-2">STORAGE USAGE</p>
            <div className="w-full bg-gray-800 rounded-full h-1.5 mb-2">
              <div className="bg-white h-1.5 rounded-full" style={{ width: '75%' }}></div>
            </div>
            <p className="text-xs text-arch-text-gray">75% of 10GB used</p>
          </div>

          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer w-full font-semibold mt-2"
          >
            <LogOut size={20} /> Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}