import { useState, useEffect } from 'react';
import ProjectCard from './components/ProjectCard';
import Sidebar from './components/Sidebar'; 
import NewProjectModal from './components/NewProjectModal'; 
import StatusChart from './components/StatusChart';
import Login from './components/Login'; 
import { Building2, Search, PieChart, DollarSign, Menu, Wallet } from 'lucide-react';
import { Routes, Route } from 'react-router-dom';
import Directory from './components/Directory';

function App() {
  // --- ESTADO PARA LA SEGURIDAD ---
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('archplan_token'));
  
  const [proyectos, setProyectos] = useState<any[]>([]);
  const [totalGastadoGlobal, setTotalGastadoGlobal] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Función central para recargar la lista
 const fetchProyectos = async () => {
    const token = localStorage.getItem('archplan_token');
    
    try {
      // 1. Traemos los proyectos
      const resProyectos = await fetch('http://localhost:8080/api/proyectos', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!resProyectos.ok) throw new Error("Error al cargar proyectos");
      const dataProyectos = await resProyectos.json();
      setProyectos(dataProyectos);

      // 2. Traemos el total de gastos para el Cerebro Matemático
      const resGastos = await fetch('http://localhost:8080/api/gastos/total', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (resGastos.ok) {
        const dataGastos = await resGastos.json();
        setTotalGastadoGlobal(dataGastos.totalGastado || 0);
      }
      
    } catch (err) {
      console.error("Error al conectar con Java:", err);
      // Aquí puedes manejar el logout si el token expira como lo tenías antes
    }
  };

  useEffect(() => {
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

  if (!isAuthenticated) {
    return <Login onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    // ESTRUCTURA BLINDADA: Siempre es fila (Sidebar a la izquierda, Contenido a la derecha)
    <div className="flex h-screen bg-arch-dark overflow-hidden">
      
      {/* 1. EL SIDEBAR (Gestiona su propia visibilidad en móvil) */}
      <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      {/* 2. EL PANEL DERECHO (Columna vertical que contiene el header móvil y tu dashboard) */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden relative">
        
        {/* --- HEADER MÓVIL (ENVUELTO EN UNA CAJA DE CUARENTENA) --- */}
        <div className="md:hidden">
          <div className="flex justify-between items-center p-4 border-b border-gray-800 bg-arch-dark shrink-0">
            <h1 className="text-xl font-bold tracking-wider text-white">
              Arch<span className="text-arch-text-gray">Plan</span>
            </h1>
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="text-gray-400 hover:text-white p-1 rounded-md hover:bg-gray-800 transition-colors cursor-pointer"
            >
              <Menu size={28} />
            </button>
          </div>
        </div>

        {/* --- CONTENIDO PRINCIPAL (Con scroll independiente) --- */}
        <div className="flex-1 overflow-y-auto w-full">
          <Routes>
            
            {/* RUTA 1: El Dashboard Principal */}
            <Route path="/" element={
              <div className="p-4 md:p-8 w-full animate-fade-in">           

                  {/* --- HEADER INDESTRUCTIBLE CON GRID --- */}
                <header className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center mb-8">
                  
                  {/* Columna Izquierda: Textos */}
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                    Executive Dashboard
                    </h2>
                    <p className="text-arch-text-gray mt-1 text-sm">
                    System-wide architectural metrics and progress tracking.
                    </p>
                  </div>
                  
                  {/* Columna Derecha: Botón (Se va a la derecha en PC, ocupa todo en Móvil) */}
                  <div className="flex md:justify-end">
                    <button 
                      onClick={() => setIsModalOpen(true)} 
                      className="w-full md:w-auto bg-arch-blue hover:bg-blue-600 text-white px-6 py-3 rounded-lg text-sm font-bold transition-all shadow-lg cursor-pointer"
                    >
                    Create New Project
                    </button>
                  </div>

                </header>

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

                 {/* 2. Métrica de Capital Global y Saldo */}
                  <div className="bg-arch-card p-6 rounded-xl border border-gray-800 hover:border-green-500 transition-colors">
                    <div className="flex justify-between items-start">
                      <p className="text-xs font-semibold tracking-widest text-arch-text-gray uppercase">Capital Disponible</p>
                      <Wallet className="text-green-500" size={24} />
                    </div>
                    
                    {/* El Cerebro Matemático: Presupuesto Total - Gastos Totales (SIN SÍMBOLO DE DÓLAR) */}
                    <h3 className="text-4xl font-bold text-white mt-3 truncate" title={`Presupuesto: ${(proyectos.reduce((acc, p) => acc + (p.presupuestoTotal || 0), 0))} - Gastado: ${totalGastadoGlobal}`}>
                      {(proyectos.reduce((acc, p) => acc + (p.presupuestoTotal || 0), 0) - totalGastadoGlobal).toLocaleString('en-US', { maximumFractionDigits: 0 })}
                    </h3>
                    
                    <p className="text-[10px] text-arch-text-gray mt-2">
                      <span className="text-red-400 font-bold">{totalGastadoGlobal.toLocaleString('en-US')}</span> gastados en total
                    </p>
                  </div>

                  {/* 3. Distribución de Estados */}
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

          {/* El Modal de nuevo proyecto */}
          <NewProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onProjectCreated={fetchProyectos} />
        
        </div>
      </div> 
    </div> 
    );
}

export default App;
