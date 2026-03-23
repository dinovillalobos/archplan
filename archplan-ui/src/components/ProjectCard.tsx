import { useState } from 'react';
// Importamos los iconos
import { Layers, Clock, FileText, X, ExternalLink } from 'lucide-react'; 

interface ProjectCardProps {
  proyecto: any;
}

export default function ProjectCard({ proyecto }: ProjectCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [documentos, setDocumentos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleViewPlans = async () => {
    setIsModalOpen(true);
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/documentos/proyecto/${proyecto.id}`);
      const data = await response.json();
      setDocumentos(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="bg-arch-card p-6 rounded-xl border border-gray-800 flex flex-col md:flex-row justify-between items-center hover:border-arch-blue transition-all duration-300">
        <div className="flex items-center gap-6 w-full md:w-1/3">
          {/* Icono de Layers en lugar del rombo raro */}
          <Layers className="text-arch-blue" size={28} />
          <div>
            <h4 className="text-lg font-bold flex items-center gap-3 text-white">
              {proyecto.nombre} 
              <span className="bg-gray-800 text-xs text-gray-400 px-2 py-1 rounded">V-Final</span>
            </h4>
            <p className="text-sm text-arch-text-gray mt-1">Client: {proyecto.cliente}</p>
          </div>
        </div>

        <div className="w-full md:w-1/4 mt-4 md:mt-0">
          <p className="text-xs text-arch-text-gray uppercase tracking-wider mb-1">Status</p>
          <p className="text-sm font-medium flex items-center gap-2 text-white">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            {proyecto.estado}
          </p>
        </div>

        <div className="flex items-center justify-between w-full md:w-1/3 mt-6 md:mt-0">
          <div>
            <p className="text-xs text-arch-text-gray uppercase tracking-wider mb-1">Last Update</p>
            <p className="text-sm font-medium text-white">Today</p>
          </div>
          <div className="flex items-center gap-4">
            {/* Icono de Reloj profesional */}
            <button className="text-gray-400 hover:text-white transition-colors cursor-pointer">
              <Clock size={20} />
            </button>
            <button 
              onClick={handleViewPlans}
              className="bg-gray-200 hover:bg-white text-black px-6 py-2 rounded-lg text-sm font-bold transition-colors shadow-lg cursor-pointer">
              VIEW PLANS
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm p-4">
          <div className="bg-arch-card border border-gray-700 w-full max-w-2xl rounded-2xl shadow-2xl p-6 md:p-8 transform transition-all">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">
                Blueprints: <span className="text-arch-blue">{proyecto.nombre}</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white cursor-pointer">
                <X size={24} />
              </button>
            </div>

            <div className="bg-arch-dark rounded-xl p-4 min-h-[150px]">
              {isLoading ? (
                <p className="text-arch-text-gray text-center mt-10">Cargando planos...</p>
              ) : documentos.length === 0 ? (
                <p className="text-gray-500 text-center mt-10 italic">No hay planos registrados.</p>
              ) : (
                <ul className="space-y-3">
                  {documentos.map((doc: any) => (
                    <li key={doc.id} className="flex justify-between items-center bg-gray-800/50 p-4 rounded-lg border border-gray-700 hover:border-arch-blue transition-colors">
                      <div className="flex items-center gap-4">
                        <FileText size={24} className="text-arch-blue" />
                        <div>
                          <p className="font-semibold text-white">{doc.nombre}</p>
                          <p className="text-xs text-arch-text-gray">{doc.tipoArchivo}</p>
                        </div>
                      </div>
                      <a href={`http://localhost:8080/api/documentos/ver/${doc.nombre}`} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-arch-blue/20 text-arch-blue hover:bg-arch-blue hover:text-white px-4 py-2 rounded font-semibold text-sm transition-colors">
                        Open <ExternalLink size={16} />
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}