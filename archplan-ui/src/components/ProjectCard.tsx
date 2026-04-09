// src/components/ProjectCard.tsx
import { useState } from 'react';
import { Layers, Clock, FileText, X, ExternalLink, UploadCloud, Loader2, ChevronDown, Kanban, DollarSign } from 'lucide-react';
import KanbanBoard from './KanbanBoard';
import BudgetTracker from './BudgetTracker';


interface ProjectCardProps {
  proyecto: any;
  onUpdate: () => void;
}

export default function ProjectCard({ proyecto, onUpdate }: ProjectCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isKanbanOpen, setIsKanbanOpen] = useState(false);
  const [isBudgetOpen, setIsBudgetOpen] = useState(false);
  const [documentos, setDocumentos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);

  const fetchDocumentos = async () => {
    try {
      const token = localStorage.getItem('archplan_token');
      const response = await fetch(`http://localhost:8080/api/documentos/proyecto/${proyecto.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setDocumentos(data);
    } catch (error) {
      console.error("Error al obtener documentos:", error);
    }
  };

  const handleViewPlans = async () => {
    setIsModalOpen(true);
    setIsLoading(true);
    await fetchDocumentos();
    setIsLoading(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('archivo', file);
    formData.append('proyectoId', proyecto.id.toString());

    try {
      const token = localStorage.getItem('archplan_token');
      const response = await fetch('http://localhost:8080/api/documentos/subir', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });

      if (response.ok) {
        await fetchDocumentos();
      } else {
        console.error("Error al subir el archivo");
      }
    } catch (error) {
      console.error("Error de conexión:", error);
    } finally {
      setIsUploading(false);
    }
  };

  // --- NUEVA FUNCIÓN: CAMBIAR ESTADO ---
  const handleStatusChange = async (nuevoEstado: string) => {
    setIsUpdatingStatus(true);
    const token = localStorage.getItem('archplan_token');
    try {
      const response = await fetch(`http://localhost:8080/api/proyectos/${proyecto.id}/estado`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ estado: nuevoEstado })
      });

      if (response.ok && onUpdate) {
        onUpdate(); // Le chiflamos a App.tsx para que recargue todo
      }
    } catch (error) {
      console.error("Error al actualizar estado:", error);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  return (
    <>
     <div className="bg-arch-card p-5 rounded-xl border border-gray-800 flex flex-col justify-between hover:border-arch-blue transition-all duration-300 gap-4 h-full shadow-lg">
        
        {/* SECCIÓN 1: Header (Icono, Título y Badge) */}
        <div className="flex gap-3 items-start">
          <div className="bg-arch-dark p-2.5 rounded-lg border border-gray-700 shrink-0">
            <Layers className="text-arch-blue" size={20} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex justify-between items-start gap-2">
              <h4 className="text-base font-bold text-white truncate" title={proyecto.nombre}>
                {proyecto.nombre}
              </h4>
              <span className="bg-arch-blue/10 border border-arch-blue/30 text-arch-blue text-[9px] uppercase font-black px-1.5 py-0.5 rounded tracking-wider shrink-0 mt-0.5">
                PRJ-{proyecto.id.toString().padStart(3, '0')}
              </span>
            </div>
            <p className="text-xs text-arch-text-gray mt-0.5 truncate">Client: <span className="text-gray-300">{proyecto.cliente}</span></p>
          </div>
        </div>

        {/* SECCIÓN 2: Dropdown de Estado (Ocupa todo el ancho disponible) */}
        <div className="flex flex-col relative w-full mt-2 flex-1">
          <div className="flex justify-between items-end mb-1.5 px-1">
            <p className="text-[10px] text-arch-text-gray uppercase tracking-wider font-bold">Project Phase</p>
            <p className="text-[9px] flex items-center gap-1 text-gray-500">
              <Clock size={10} className={isUpdatingStatus ? "animate-spin text-arch-blue" : ""} /> 
              {isUpdatingStatus ? 'Updating...' : 'Today'}
            </p>
          </div>
          
          <div className="relative w-full">
            <button 
              onClick={() => setIsStatusMenuOpen(!isStatusMenuOpen)}
              onBlur={() => setTimeout(() => setIsStatusMenuOpen(false), 200)}
              disabled={isUpdatingStatus}
              className={`flex items-center justify-between w-full px-3 py-2 rounded-md text-xs font-bold border transition-all cursor-pointer shadow-sm ${
                proyecto.estado === 'Completed' ? 'bg-green-500/10 text-green-500 border-green-500/30 hover:bg-green-500/20' :
                proyecto.estado === 'Construction' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30 hover:bg-yellow-500/20' :
                'bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700'
              }`}
            >
              <span className="flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full ${
                  proyecto.estado === 'Completed' ? 'bg-green-500' :
                  proyecto.estado === 'Construction' ? 'bg-yellow-500' :
                  'bg-gray-400'
                }`}></span>
                {proyecto.estado}
              </span>
              {isUpdatingStatus ? (
                <Loader2 size={12} className="animate-spin text-current opacity-70" />
              ) : (
                <ChevronDown size={14} className={`transition-transform duration-200 opacity-70 ${isStatusMenuOpen ? 'rotate-180' : ''}`} />
              )}
            </button>

            {isStatusMenuOpen && (
              <div className="absolute top-full left-0 mt-1 w-full bg-arch-dark border border-gray-700 rounded-lg shadow-2xl z-50 overflow-hidden">
                {['Planning', 'Construction', 'Completed'].map((estado) => (
                  <button
                    key={estado}
                    onClick={() => {
                      handleStatusChange(estado);
                      setIsStatusMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs font-medium hover:bg-gray-700 transition-colors flex items-center gap-2 ${
                      proyecto.estado === estado ? 'bg-gray-800 text-white' : 'text-gray-400'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      estado === 'Completed' ? 'bg-green-500' :
                      estado === 'Construction' ? 'bg-yellow-500' :
                      'bg-gray-400'
                    }`}></span>
                    {estado}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* SECCIÓN 3: Footer con Quick Actions */}
        <div className="flex items-center justify-between mt-2 pt-4 border-t border-gray-800/50">
          <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Tools</p>
          <div className="flex items-center gap-1">
            <button onClick={handleViewPlans} title="View Blueprints" className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/80 rounded-lg transition-all cursor-pointer">
              <FileText size={18} />
            </button>
            <button onClick={() => setIsKanbanOpen(true)} title="Project Board" className="p-2 text-gray-400 hover:text-arch-blue hover:bg-arch-blue/10 rounded-lg transition-all cursor-pointer">
              <Kanban size={18} />
            </button>
            <button onClick={() => setIsBudgetOpen(true)} title="Financial Tracking" className="p-2 text-gray-400 hover:text-green-500 hover:bg-green-500/10 rounded-lg transition-all cursor-pointer">
              <DollarSign size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* --- MODAL 1: PLANOS PDF --- */}
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

            <div className="mb-6 p-6 border-2 border-dashed border-gray-700 rounded-xl bg-gray-800/30 text-center hover:border-arch-blue transition-colors relative">
              <input 
                type="file" 
                accept="application/pdf"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
              />
              <div className="flex flex-col items-center justify-center pointer-events-none">
                {isUploading ? (
                  <Loader2 className="text-arch-blue mb-2 animate-spin" size={32} />
                ) : (
                  <UploadCloud className="text-arch-text-gray mb-2" size={32} />
                )}
                <p className="text-sm font-semibold text-white">
                  {isUploading ? 'Uploading Blueprint...' : 'Click or drag a PDF here to upload'}
                </p>
                <p className="text-xs text-arch-text-gray mt-1">Only .pdf files are supported</p>
              </div>
            </div>

            <div className="bg-arch-dark rounded-xl p-4 min-h-[150px] max-h-[300px] overflow-y-auto">
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

      {/* El Kanban ahora vive afuera del modal de PDFs */}
      <KanbanBoard 
        proyectoId={proyecto.id} 
        proyectoNombre={proyecto.nombre}
        isOpen={isKanbanOpen} 
        onClose={() => setIsKanbanOpen(false)} 
      />

      {/* NUESTRO NUEVO TRACKER FINANCIERO */}
      <BudgetTracker
        proyecto={proyecto}
        isOpen={isBudgetOpen}
        onClose={() => setIsBudgetOpen(false)}
        onUpdate={onUpdate}
      />
    </>
  );
}