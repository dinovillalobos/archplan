import { useState, useEffect } from 'react';
import ProjectCard from './components/ProjectCard';
import Sidebar from './components/Sidebar'; 
import NewProjectModal from './components/NewProjectModal'; 
import StatusChart from './components/StatusChart';
import { Building2, ShieldCheck, Search, ChevronDown, PieChart } from 'lucide-react';

function App() {
  const [proyectos, setProyectos] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // --- NUEVO ESTADO: Lo que el usuario escribe en el buscador ---
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    fetch('http://localhost:8080/api/proyectos')
      .then(res => res.json())
      .then(data => setProyectos(data))
      .catch(err => console.error("Error al conectar con Java:", err));
  }, []);

  // --- LA MAGIA DEL FILTRO EN TIEMPO REAL ---
  // Filtramos la lista original basándonos en si el nombre, cliente o estado coinciden con el buscador
  const filteredProyectos = proyectos.filter((proyecto: any) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      proyecto.nombre?.toLowerCase().includes(searchLower) ||
      proyecto.cliente?.toLowerCase().includes(searchLower) ||
      proyecto.estado?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="flex h-screen bg-arch-dark overflow-hidden">
      <Sidebar />

      <div className="flex-1 overflow-y-auto">
        <div className="p-8 md:p-10 max-w-7xl mx-auto">
          
          <header className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold tracking-tight text-white">Executive Dashboard</h2>
            <div className="flex items-center gap-6">
              <button className="px-5 py-2.5 border border-gray-700 rounded-lg text-sm font-medium hover:bg-white/5 transition-colors text-white cursor-pointer">
                Export Report
              </button>
              <button 
                onClick={() => setIsModalOpen(true)} 
                className="bg-arch-blue hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-blue-500/20 cursor-pointer">
                Create New Project
              </button>
            </div>
          </header>

          <p className="text-arch-text-gray mt-[-20px] mb-8 text-sm">System-wide architectural metrics and progress tracking.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-arch-card p-6 rounded-xl border border-gray-800 hover:border-arch-blue transition-colors">
              <div className="flex justify-between items-start">
                <p className="text-xs font-semibold tracking-widest text-arch-text-gray uppercase">Total Projects</p>
                <Building2 className="text-arch-text-gray" size={24} />
              </div>
              <h3 className="text-5xl font-bold text-white mt-4">{proyectos.length}</h3>
              <p className="text-green-500 text-xs mt-2 font-medium">+12% from last quarter</p>
            </div>

            <div className="bg-arch-card p-6 rounded-xl border border-gray-800">
              <div className="flex justify-between items-start">
                <p className="text-xs font-semibold tracking-widest text-arch-text-gray uppercase">Active Licenses</p>
                <ShieldCheck className="text-arch-text-gray" size={24} />
              </div>
              <h3 className="text-5xl font-bold text-white mt-4">128</h3>
              <p className="text-arch-text-gray text-xs mt-2 font-medium">Registered architects</p>
            </div>

           <div className="bg-arch-card p-6 rounded-xl border border-gray-800 flex flex-col hover:border-arch-blue transition-colors">
            <div className="flex justify-between items-start mb-2">
              <p className="text-xs font-semibold tracking-widest text-arch-text-gray uppercase">Status Distribution</p>
              <PieChart className="text-arch-text-gray" size={24} />
            </div>
            {/* ¡Aquí insertamos la magia! Le pasamos el array de proyectos original */}
            <StatusChart proyectos={proyectos} />
          </div>
          </div> 

          {/* --- BARRA DE BÚSQUEDA --- */}
          <div className="mt-12 mb-8 flex flex-col md:flex-row justify-between items-center bg-arch-card p-4 rounded-xl border border-gray-800">
            <div className="flex items-center w-full md:w-1/2 bg-arch-dark px-4 py-2 rounded-lg border border-gray-700 focus-within:border-arch-blue transition-colors">
              <Search className="text-gray-500 mr-3" size={20} />
              <input 
                type="text" 
                placeholder="Search by Client, Architect or Project Name..." 
                className="bg-transparent border-none outline-none text-sm w-full text-white placeholder-gray-600 focus:ring-0"
                value={searchTerm} // 1. Enlazamos el input a nuestro estado
                onChange={(e) => setSearchTerm(e.target.value)} // 2. Actualizamos el estado en cada tecleo
              />
            </div>
            <div className="flex gap-4 mt-4 md:mt-0 text-sm font-semibold text-arch-text-gray">
              <button className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer">
                LOCATION: All Regions <ChevronDown size={16} />
              </button>
              <button className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer">
                SORT: Latest Update <ChevronDown size={16} />
              </button>
            </div>
          </div>

          <h3 className="text-xl font-bold text-white mb-6">Active Blueprints</h3>
          
          <div className="flex flex-col gap-4">
            {/* Usamos filteredProyectos en lugar de la lista original */}
            {filteredProyectos.length === 0 ? (
               <p className="text-arch-text-gray italic">
                 {searchTerm ? `No matches found for "${searchTerm}"...` : "No hay proyectos registrados aún."}
               </p>
            ) : (
              filteredProyectos.map((proyecto: any) => (
                <ProjectCard key={proyecto.id} proyecto={proyecto} />
              ))
            )}
          </div>

        </div>

        <NewProjectModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onProjectCreated={() => {
            fetch('http://localhost:8080/api/proyectos')
              .then(res => res.json())
              .then(data => setProyectos(data));
          }}
        />
      </div>
    </div>
  );
}

export default App;