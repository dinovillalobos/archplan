// src/components/Sidebar.tsx
import { LayoutDashboard, Archive, Settings, Users } from 'lucide-react'; // <-- Añadimos Users
import { NavLink } from 'react-router-dom'; // <-- Importamos NavLink

export default function Sidebar() {
  // Función dinámica para darle estilo al botón cuando está "activo"
  const navLinkClass = ({ isActive }: { isActive: boolean }) => 
    isActive 
      ? "flex items-center gap-3 px-4 py-3 bg-arch-blue/10 text-arch-blue rounded-lg border-l-2 border-arch-blue font-semibold transition-colors"
      : "flex items-center gap-3 px-4 py-3 text-arch-text-gray hover:text-white transition-colors border-l-2 border-transparent";

  return (
    <aside className="w-64 bg-arch-dark border-r border-gray-800 h-screen flex flex-col justify-between sticky top-0 hidden md:flex shrink-0">
      
      <div>
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-2xl font-bold tracking-wider text-white">
            Arch<span className="text-arch-text-gray">Plan</span>
          </h1>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-arch-blue/20 text-arch-blue w-8 h-8 rounded flex items-center justify-center font-bold">
              A
            </div>
            <div>
              <p className="text-sm font-bold text-white">Project Space</p>
              <p className="text-xs text-arch-text-gray tracking-widest">V-FINAL EDITION</p>
            </div>
          </div>

          {/* Navigation Links con React Router */}
          <nav className="space-y-2">
            <NavLink to="/" className={navLinkClass} end>
              <LayoutDashboard size={20} /> Current Works
            </NavLink>
            
            {/* --- NUESTRO NUEVO MÓDULO --- */}
            <NavLink to="/directory" className={navLinkClass}>
              <Users size={20} /> Directory
            </NavLink>

            <NavLink to="/archive" className={navLinkClass}>
              <Archive size={20} /> Archive
            </NavLink>
            
            <NavLink to="/settings" className={navLinkClass}>
              <Settings size={20} /> Settings
            </NavLink>
          </nav>
        </div>
      </div>

      {/* Storage */}
      <div className="p-6 border-t border-gray-800">
        <div className="bg-arch-card p-4 rounded-lg border border-gray-700">
          <p className="text-xs text-arch-text-gray font-semibold mb-2">STORAGE USAGE</p>
          <div className="w-full bg-gray-800 rounded-full h-1.5 mb-2">
            <div className="bg-white h-1.5 rounded-full" style={{ width: '75%' }}></div>
          </div>
          <p className="text-xs text-arch-text-gray">75% of 10GB used</p>
        </div>
      </div>
    </aside>
  );
}