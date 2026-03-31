import { useState, useEffect } from 'react';
import ProjectCard from './components/ProjectCard';
import Sidebar from './components/Sidebar'; 
import NewProjectModal from './components/NewProjectModal'; 
import StatusChart from './components/StatusChart';
import Login from './components/Login'; 
import { Building2, ShieldCheck, Search, ChevronDown, PieChart, DollarSign } from 'lucide-react';
import { Routes, Route } from 'react-router-dom';
import Directory from './components/Directory';

function App() {
  // --- 2. NUEVO ESTADO PARA LA SEGURIDAD ---
  // Revisa si ya hay un token en la bóveda al cargar la página
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('archplan_token'));
  
  const [proyectos, setProyectos] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Función central para recargar la lista mostrando el "Pase VIP"
  const fetchProyectos = () => {
    const token = localStorage.getItem('archplan_token');
    
    fetch('http://localhost:8080/api/proyectos', {
      headers: {
        'Authorization': `Bearer ${token}` // <-- AQUÍ VA EL PASE VIP
      }
    })
      .then(res => {
        if (!res.ok) {
          if (res.status === 401 || res.status === 403) {
            // Si el token expiró o es falso, lo borramos y lo mandamos al Login
            localStorage.removeItem('archplan_token');
            setIsAuthenticated(false);
          }
          throw new Error("No autorizado o error de servidor");
        }
        return res.json();
      })
      .then(data => setProyectos(data))
      .catch(err => console.error("Error al conectar con Java:", err));
  };

  useEffect(() => {
    // Solo pedimos los proyectos si el usuario ya inició sesión
    if (isAuthenticated) {
      fetchProyectos();
    }
  }, [isAuthenticated]);

  const filteredProyectos = proyectos.filter((proyecto: any) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      proyecto.nombre?.toLowerCase().includes(searchLower) ||
      proyecto.cliente?.toLowerCase().includes(searchLower) ||
      proyecto.estado?.toLowerCase().includes(searchLower)
    );
  });

  // --- 3. LA BARRERA DE SEGURIDAD ---
  // Si no está autenticado, NADA del Dashboard se dibuja, solo el Login
  if (!isAuthenticated) {
    return <Login onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="flex h-screen bg-arch-dark overflow-hidden">
      <Sidebar />

      <div className="flex-1 overflow-y-auto">
        {/* --- EL SEMÁFORO DE RUTAS --- */}
        <Routes>
          
         {/* RUTA 1: El Dashboard Principal */}
          <Route path="/" element={
            <div className="p-8 md:p-10 max-w-7xl mx-auto animate-fade-in">
              <header className="flex justify-between items-center mb-10">
                <h2 className="text-3xl font-bold tracking-tight text-white">Executive Dashboard</h2>
                <div className="flex items-center gap-6">
                  <button onClick={() => setIsModalOpen(true)} className="bg-arch-blue hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-blue-500/20 cursor-pointer">
                    Create New Project
                  </button>
                </div>
              </header>

              <p className="text-arch-text-gray mt-[-20px] mb-8 text-sm">System-wide architectural metrics and progress tracking.</p>

              {/* --- EL CEREBRO MATEMÁTICO --- */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* 1. Métrica de Proyectos Totales */}
                <div className="bg-arch-card p-6 rounded-xl border border-gray-800 hover:border-arch-blue transition-colors">
                  <div className="flex justify-between items-start">
                    <p className="text-xs font-semibold tracking-widest text-arch-text-gray uppercase">Active Projects</p>
                    <Building2 className="text-arch-blue" size={24} />
                  </div>
                  <h3 className="text-5xl font-bold text-white mt-4">{proyectos.length}</h3>
                </div>

                {/* 2. Métrica de Capital Global (Dinámico) */}
                <div className="bg-arch-card p-6 rounded-xl border border-gray-800 hover:border-green-500 transition-colors">
                  <div className="flex justify-between items-start">
                    <p className="text-xs font-semibold tracking-widest text-arch-text-gray uppercase">Global Capital Managed</p>
                    <DollarSign className="text-green-500" size={24} />
                  </div>
                  <h3 className="text-4xl font-bold text-white mt-5 truncate" title={`$${proyectos.reduce((acc, p) => acc + (p.presupuestoTotal || 0), 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`}>
                    ${proyectos.reduce((acc, p) => acc + (p.presupuestoTotal || 0), 0).toLocaleString('en-US', { maximumFractionDigits: 0 })}
                  </h3>
                </div>

                {/* 3. Distribución de Estados (El StatusChart dinámico) */}
                <div className="bg-arch-card p-6 rounded-xl border border-gray-800 flex flex-col hover:border-arch-blue transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-xs font-semibold tracking-widest text-arch-text-gray uppercase">Status Distribution</p>
                    <PieChart className="text-arch-text-gray" size={24} />
                  </div>
                  <StatusChart proyectos={proyectos} />
                </div>
              </div> 

              <div className="mt-12 mb-8 flex flex-col md:flex-row justify-between items-center bg-arch-card p-4 rounded-xl border border-gray-800">
                <div className="flex items-center w-full md:w-1/2 bg-arch-dark px-4 py-2 rounded-lg border border-gray-700 focus-within:border-arch-blue transition-colors">
                  <Search className="text-gray-500 mr-3" size={20} />
                  <input type="text" placeholder="Search by Client, Architect or Project Name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-transparent border-none outline-none text-sm w-full text-white placeholder-gray-600 focus:ring-0" />
                </div>
              </div>

              <h3 className="text-xl font-bold text-white mb-6">Active Blueprints</h3>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {filteredProyectos.length === 0 ? (
                   <div className="text-center py-10 border border-dashed border-gray-700 rounded-xl bg-gray-800/30">
                     <p className="text-gray-400 italic">No hay proyectos registrados aún.</p>
                   </div>
               ) : (
                  filteredProyectos.map((proyecto: any) => (
                    <ProjectCard 
                      key={proyecto.id} 
                      proyecto={proyecto} 
                      onUpdate={fetchProyectos} 
                    />
                  ))
                )}
              </div>
            </div>
          } />

          {/* RUTA 2: El Nuevo Directorio */}
          <Route path="/directory" element={<Directory />} />

        </Routes>

        {/* El Modal de nuevo proyecto se queda afuera para que pueda abrirse desde donde sea */}
        <NewProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onProjectCreated={fetchProyectos} />
      </div>
    </div>
  );
}

export default App;