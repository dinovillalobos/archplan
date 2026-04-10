// src/components/KanbanBoard.tsx
import { useState, useEffect, type ChangeEvent } from 'react';
import { X, Plus, GripVertical, Clock, AlertCircle, CheckCircle2, Camera, Loader2, User, History, ImageIcon } from 'lucide-react';
interface KanbanBoardProps {
  proyectoId: number;
  proyectoNombre: string;
  isOpen: boolean;
  onClose: () => void;
}

const getInitials = (name: string) => {
  if (!name) return '?';
  const words = name.trim().split(' ');
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return name.substring(0, 2).toUpperCase();
};

export default function KanbanBoard({ proyectoId, proyectoNombre, isOpen, onClose }: KanbanBoardProps) {
  const [tareas, setTareas] = useState<any[]>([]);
  const [contratistas, setContratistas] = useState<any[]>([]);
  const [nuevaTarea, setNuevaTarea] = useState('');
  const [contratistaAsignado, setContratistaAsignado] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingFotoId, setUploadingFotoId] = useState<number | null>(null);
  const [historialAbiertoId, setHistorialAbiertoId] = useState<number | null>(null);
  const [historialDatos, setHistorialDatos] = useState<any[]>([]);
  const [imagenAmpliada, setImagenAmpliada] = useState<string | null>(null);
  const [activeMobileTab, setActiveMobileTab] = useState('TODO');

  useEffect(() => {
    if (isOpen) {
      cargarTareas();
      cargarContratistas(); 
    }
  }, [isOpen, proyectoId]);

  const cargarTareas = async () => {
    const token = localStorage.getItem('archplan_token');
    try {
      const res = await fetch(`http://localhost:8080/api/tareas/proyecto/${proyectoId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) setTareas(await res.json());
    } catch (error) { console.error(error); }
  };

  const cargarContratistas = async () => {
    const token = localStorage.getItem('archplan_token');
    try {
      const res = await fetch('http://localhost:8080/api/contratistas', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) setContratistas(await res.json());
    } catch (error) { console.error(error); }
  };

  const cambiarEstado = async (tareaId: number, nuevoEstado: string) => {
    setTareas(prev => prev.map(t => t.id === tareaId ? { ...t, estado: nuevoEstado } : t));
    const token = localStorage.getItem('archplan_token');
    try {
      await fetch(`http://localhost:8080/api/tareas/${tareaId}/estado`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ estado: nuevoEstado })
      });
    } catch (error) {
      console.error(error);
      cargarTareas(); 
    }
  };

  const abrirHistorial = async (tareaId: number) => {
    setHistorialAbiertoId(tareaId);
    setHistorialDatos([]); // Limpiamos mientras carga
    const token = localStorage.getItem('archplan_token');
    try {
      const res = await fetch(`http://localhost:8080/api/tareas/${tareaId}/historial`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setHistorialDatos(await res.json());
      }
    } catch (error) { console.error(error); }
  };

  const handleAgregarTarea = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevaTarea.trim()) return;
    setIsLoading(true);
    const token = localStorage.getItem('archplan_token');
    try {
      const res = await fetch(`http://localhost:8080/api/tareas/proyecto/${proyectoId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ titulo: nuevaTarea, estado: 'TODO', contratista: contratistaAsignado })
      });
      if (res.ok) {
        setNuevaTarea('');
        setContratistaAsignado(''); 
        cargarTareas();
        setActiveMobileTab('TODO');
      }
    } catch (error) { console.error(error); } 
    finally { setIsLoading(false); }
  };

  const handleSubirFoto = async (e: ChangeEvent<HTMLInputElement>, tareaId: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingFotoId(tareaId);
    const formData = new FormData();
    formData.append('foto', file);
    const token = localStorage.getItem('archplan_token');
    try {
      const res = await fetch(`http://localhost:8080/api/tareas/${tareaId}/foto`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      if (res.ok) await cargarTareas(); 
    } catch (error) { console.error(error); } 
    finally { setUploadingFotoId(null); }
  };

  const handleDragStart = (e: React.DragEvent, idTarea: number) => {
    e.dataTransfer.setData('tareaId', idTarea.toString());
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const handleDrop = (e: React.DragEvent, nuevoEstado: string) => {
    e.preventDefault();
    const tareaIdStr = e.dataTransfer.getData('tareaId');
    if (!tareaIdStr) return;
    cambiarEstado(parseInt(tareaIdStr, 10), nuevoEstado);
  };

  const renderColumna = (titulo: string, estado: string, icon: any, colorBorder: string) => {
    const tareasColumna = tareas.filter(t => t.estado === estado);
    const isVisibleInMobile = activeMobileTab === estado;

    return (
      <div 
        className={`${isVisibleInMobile ? 'flex' : 'hidden'} lg:flex bg-[#13161c] border border-gray-800 ${colorBorder} rounded-xl p-4 flex-col h-full w-full min-w-0`}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, estado)}
      >
        <div className="flex items-center gap-2 mb-4 border-b border-gray-800 pb-3 shrink-0">
          {icon}
          <h4 className="font-bold text-gray-300 uppercase text-xs tracking-wider">{titulo}</h4>
          <span className="ml-auto bg-gray-800/50 text-gray-400 text-xs py-0.5 px-2.5 rounded-full font-bold border border-gray-700">
            {tareasColumna.length}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
          {tareasColumna.map(tarea => (
            <div
              key={tarea.id}
              draggable
              onDragStart={(e) => handleDragStart(e, tarea.id)}
              className="bg-arch-card p-3.5 rounded-lg border border-gray-700/60 hover:border-arch-blue cursor-grab active:cursor-grabbing shadow-md flex flex-col transition-colors"
            >
              
              <div className="flex justify-between items-start gap-3">
                <div className="flex items-start gap-2 flex-1 min-w-0">
                  <GripVertical size={16} className="text-gray-600 mt-0.5 shrink-0 hidden md:block" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-100 font-medium leading-snug break-words">{tarea.titulo}</p>
                    
                    {tarea.contratista && (
                      <div className="mt-2.5 flex items-center gap-2" title={`Contratista: ${tarea.contratista}`}>
                        <div className="w-5 h-5 rounded-full bg-arch-blue/20 text-arch-blue flex items-center justify-center text-[9px] font-bold border border-arch-blue/30 shrink-0">
                          {getInitials(tarea.contratista)}
                        </div>
                        <span className="text-[10px] text-gray-400 font-semibold truncate">{tarea.contratista}</span>
                      </div>
                    )}
                  </div>
                </div>

               {tarea.fotoUrl && (
                <div className="mt-2 flex justify-end">
                  <button 
                    onClick={() => setImagenAmpliada(`http://localhost:8080/api/uploads/${tarea.fotoUrl}`)}
                    className="text-[10px] text-arch-blue hover:text-white hover:bg-arch-blue/20 transition-all font-bold px-2 py-1 rounded border border-arch-blue/30 flex items-center gap-1.5"
                  >
                    <ImageIcon size={12} /> 1 Evidencia subida
                  </button>
                </div>
              )}

              {/* --- MODAL VISUALIZADOR DE IMAGEN (LIGHTBOX) --- */}
              {imagenAmpliada && (
                <div 
                  className="fixed inset-0 bg-black/95 z-[300] flex items-center justify-center p-4 backdrop-blur-md animate-fade-in"
                  onClick={() => setImagenAmpliada(null)}
                >
                  <button 
                    className="absolute top-6 right-6 text-white hover:text-arch-blue transition-colors p-2 bg-gray-900/50 rounded-full"
                    onClick={() => setImagenAmpliada(null)}
                  >
                    <X size={32} />
                  </button>
                  
                  <div className="max-w-5xl max-h-[90vh] relative group" onClick={(e) => e.stopPropagation()}>
                    <img 
                      src={imagenAmpliada} 
                      alt="Evidencia Ampliada" 
                      className="max-w-full max-h-[85vh] rounded-xl shadow-2xl border border-gray-800 object-contain"
                    />
                    <div className="absolute bottom-[-40px] left-0 right-0 text-center text-gray-400 text-sm font-medium">
                      Evidencia de Obra - {proyectoNombre}
                    </div>
                  </div>
                </div>
              )}
              </div>

              {/* BARRA DE ACCIÓN INFERIOR */}
              <div className="mt-3 pt-3 border-t border-gray-800/60 flex justify-between items-center gap-2">
                
                {/* SELECTOR DE ESTADO MÓVIL */}
                <div className="md:hidden shrink-0">
                  <select 
                    value={tarea.estado}
                    onChange={(e) => cambiarEstado(tarea.id, e.target.value)}
                    className="bg-gray-800 text-[10px] text-gray-300 font-bold border border-gray-700 rounded px-2 py-1.5 outline-none focus:border-arch-blue"
                  >
                    <option value="TODO">A Por Hacer</option>
                    <option value="IN_PROGRESS">A En Progreso</option>
                    <option value="DONE">A Completado</option>
                  </select>
                </div>
                
                <div className="ml-auto flex items-center gap-2">
                  <button 
                    onClick={() => abrirHistorial(tarea.id)}
                    className="text-gray-500 hover:text-arch-blue p-1.5 rounded-md hover:bg-arch-blue/10 transition-colors"
                    title="Ver Historial"
                  >
                    <History size={14} />
                  </button>
                  </div>

                <div className="ml-auto">
                  {uploadingFotoId === tarea.id ? (
                    <div className="flex items-center gap-1.5 text-xs text-arch-blue italic font-semibold">
                      <Loader2 size={12} className="animate-spin" /> Subiendo...
                    </div>
                  ) : (
                    <label className="cursor-pointer text-gray-400 hover:text-white bg-gray-800/30 hover:bg-gray-700 px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 text-xs font-semibold">
                      <input type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => handleSubirFoto(e, tarea.id)} />
                      <Camera size={14} /> Evidencia
                    </label>
                  )}
                </div>

 
              </div>

            </div>
          ))}
          
          {tareasColumna.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-gray-800 rounded-lg py-10 opacity-50">
              <AlertCircle size={20} className="text-gray-600 mb-2" />
              <p className="text-gray-500 text-[10px] font-medium uppercase tracking-widest">Columna Vacía</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/85 flex items-center justify-center z-[100] backdrop-blur-sm p-4 lg:p-8 transition-all overflow-y-auto"
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        className="bg-[#0a0d13] w-full max-w-[1700px] h-[95vh] lg:h-[85vh] shadow-[0_0_50px_rgba(0,0,0,0.6)] rounded-2xl overflow-hidden relative border border-gray-700/50 flex flex-col p-4 md:p-6 lg:p-8 m-auto"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* HEADER Y CERRAR */}
        <div className="flex justify-between items-center mb-5 shrink-0 pr-16 relative z-10">
          <h3 className="text-xl md:text-2xl font-bold text-white flex flex-row items-center gap-3">
            Tablero KANBAN
            <span className="bg-arch-blue/20 text-arch-blue text-[10px] md:text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider">
              {proyectoNombre}
            </span>
          </h3>
        </div>

        {/* TABS MÓVILES */}
        <div className="lg:hidden w-full mb-4 shrink-0 relative z-10">
          <div className="flex bg-gray-900/80 border border-gray-800 p-1.5 rounded-xl">
            {[
              { id: 'CREAR', label: 'Crear' },
              { id: 'TODO', label: 'Por Hacer' },
              { id: 'IN_PROGRESS', label: 'Progreso' },
              { id: 'DONE', label: 'Hecho' }
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveMobileTab(tab.id)}
                className={`flex-1 py-2 text-[10px] font-bold rounded-lg transition-all ${
                  activeMobileTab === tab.id ? 'bg-arch-card text-white shadow border border-gray-700' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ÁREA DE COLUMNAS (1 FILA, 4 COLUMNAS EN PC) */}
        <div className="flex-1 min-h-0 relative z-10">
          <div className="absolute inset-0 grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-5 pb-2 min-w-0">
            
            {/* COLUMNA 1: FORMULARIO */}
            <div className={`${activeMobileTab === 'CREAR' ? 'flex' : 'hidden'} lg:flex bg-[#13161c] border border-gray-800 border-t-4 border-t-arch-blue rounded-xl p-4 flex-col h-full w-full shadow-lg min-w-0`}>
              <div className="flex items-center gap-2 mb-4 border-b border-gray-800 pb-3 shrink-0">
                <Plus size={18} className="text-arch-blue" />
                <h4 className="font-bold text-gray-300 uppercase text-xs tracking-wider">Nueva Tarea</h4>
              </div>
              
              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                <form onSubmit={handleAgregarTarea} className="flex flex-col gap-5">
                  <div>
                    <label className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-2 block">Descripción</label>
                    <textarea 
                      required
                      rows={3}
                      value={nuevaTarea}
                      onChange={(e) => setNuevaTarea(e.target.value)}
                      placeholder="Ej. Colado de losa..."
                      className="w-full bg-[#0a0d13] border border-gray-700/80 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-arch-blue resize-none transition-colors shadow-inner"
                    />
                  </div>
                  
                  <div>
                    <label className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-2 block">Asignar A</label>
                    <select 
                      value={contratistaAsignado} 
                      onChange={(e) => setContratistaAsignado(e.target.value)}
                      className="w-full bg-[#0a0d13] border border-gray-700/80 rounded-xl px-4 py-3 text-sm text-gray-300 focus:outline-none focus:border-arch-blue outline-none cursor-pointer transition-colors shadow-inner appearance-none"
                    >
                      <option value="">Nadie / Interno</option>
                      {contratistas.map(c => (
                        <option key={c.id} value={c.nombre}>{c.nombre} ({c.especialidad})</option>
                      ))}
                    </select>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className="bg-arch-blue hover:bg-blue-600 text-white font-bold w-full py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-arch-blue/20 flex items-center justify-center gap-2 cursor-pointer mt-2"
                  >
                    {isLoading ? <Loader2 size={18} className="animate-spin" /> : 'Crear Tarea'} 
                  </button>
                </form>
              </div>
            </div>

{/* COLUMNAS KANBAN 2, 3, y 4 */}
            {renderColumna('Por Hacer', 'TODO', <AlertCircle size={18} className="text-gray-400" />, 'border-t-4 border-t-gray-500')}
            {renderColumna('En Progreso', 'IN_PROGRESS', <Clock size={16} className="text-yellow-500" />, 'border-t-4 border-t-yellow-500')}
            {renderColumna('Completado', 'DONE', <CheckCircle2 size={16} className="text-green-500" />, 'border-t-4 border-t-green-500')}
            
          </div>
        </div>

        {/* --- MODAL DE HISTORIAL --- */}
        {historialAbiertoId && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-[200] backdrop-blur-sm p-4 rounded-2xl">
            <div className="bg-arch-dark border border-gray-700 w-full max-w-md rounded-xl shadow-2xl p-6 relative">
              <button onClick={() => setHistorialAbiertoId(null)} className="absolute top-4 right-4 text-gray-500 hover:text-white">
                <X size={20} />
              </button>
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <History className="text-arch-blue" size={20} /> Timeline de Tarea
              </h3>

              <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                {historialDatos.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center italic">No hay movimientos registrados aún.</p>
                ) : (
                  historialDatos.map((log, i) => (
                    <div key={log.id} className="relative pl-6">
                      {/* Línea conectora */}
                      {i !== historialDatos.length - 1 && <div className="absolute left-2.5 top-6 bottom-[-30px] w-px bg-gray-700"></div>}
                      
                      {/* Punto del timeline */}
                      <div className="absolute left-[5px] top-1.5 w-2 h-2 rounded-full bg-arch-blue shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>
                      
                      <div className="bg-gray-800/40 border border-gray-700 p-3 rounded-lg">
                        <p className="text-xs text-gray-400 mb-1">
                          {new Date(log.fechaCambio).toLocaleString('es-MX', { dateStyle: 'medium', timeStyle: 'short' })}
                        </p>
                        <p className="text-sm text-gray-200">
                          Movido a <span className="font-bold text-white px-1.5 py-0.5 rounded bg-gray-800 border border-gray-600">{log.estadoNuevo}</span>
                        </p>
                        {log.estadoAnterior && (
                          <p className="text-[10px] text-gray-500 mt-1">
                            (Anteriormente: {log.estadoAnterior})
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
        {/* --- FIN DEL MODAL DE HISTORIAL --- */}

        {/* BOTÓN CERRAR AL FINAL DEL DOM PARA ASEGURAR VISIBILIDAD DE CLICK */}
        <button 
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onClose();
          }} 
          title="Cerrar Kanban"
          className="absolute top-4 right-4 lg:top-7 lg:right-7 z-[90] text-gray-400 hover:text-white p-2.5 cursor-pointer bg-gray-800/80 backdrop-blur-md rounded-full shadow-2xl border border-gray-500/50 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/50 transition-all outline-none"
        >
          <X size={24} />
        </button>

      </div>
    </div>
  );
}