// src/components/KanbanBoard.tsx
import { useState, useEffect } from 'react';
import { X, Plus, GripVertical, Clock, AlertCircle, CheckCircle2, User } from 'lucide-react';

interface KanbanBoardProps {
  proyectoId: number;
  proyectoNombre: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function KanbanBoard({ proyectoId, proyectoNombre, isOpen, onClose }: KanbanBoardProps) {
  const [tareas, setTareas] = useState<any[]>([]);
  // --- NUEVO: Estado para guardar la lista de empresas ---
  const [contratistas, setContratistas] = useState<any[]>([]);
  
  const [nuevaTarea, setNuevaTarea] = useState('');
  // --- NUEVO: Estado para saber a quién le asignamos la tarea ---
  const [contratistaAsignado, setContratistaAsignado] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      cargarTareas();
      cargarContratistas(); // --- NUEVO: Cargamos el directorio al abrir el tablero
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

  // --- NUEVO: Función para traer el Directorio ---
  const cargarContratistas = async () => {
    const token = localStorage.getItem('archplan_token');
    try {
      const res = await fetch('http://localhost:8080/api/contratistas', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setContratistas(data);
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
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ 
          titulo: nuevaTarea, 
          estado: 'TODO',
          contratista: contratistaAsignado // --- NUEVO: Enviamos el nombre del responsable
        })
      });
      
      if (res.ok) {
        setNuevaTarea('');
        setContratistaAsignado(''); // Limpiamos el selector
        cargarTareas();
      }
    } catch (error) { console.error(error); } 
    finally { setIsLoading(false); }
  };

  const handleDragStart = (e: React.DragEvent, idTarea: number) => {
    e.dataTransfer.setData('tareaId', idTarea.toString());
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const handleDrop = async (e: React.DragEvent, nuevoEstado: string) => {
    e.preventDefault();
    const tareaId = e.dataTransfer.getData('tareaId');
    if (!tareaId) return;

    setTareas(prev => prev.map(t => t.id.toString() === tareaId ? { ...t, estado: nuevoEstado } : t));

    const token = localStorage.getItem('archplan_token');
    try {
      await fetch(`http://localhost:8080/api/tareas/${tareaId}/estado`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ estado: nuevoEstado })
      });
    } catch (error) {
      console.error(error);
      cargarTareas();
    }
  };

  const renderColumna = (titulo: string, estado: string, icon: any, colorBorder: string) => {
    const tareasColumna = tareas.filter(t => t.estado === estado);

    return (
      <div 
        className={`bg-gray-800/30 border ${colorBorder} rounded-xl p-4 flex flex-col h-[500px]`}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, estado)}
      >
        <div className="flex items-center gap-2 mb-4 border-b border-gray-700 pb-3">
          {icon}
          <h4 className="font-bold text-white uppercase text-sm tracking-wider">{titulo}</h4>
          <span className="ml-auto bg-gray-800 text-gray-400 text-xs py-1 px-2 rounded-full font-bold">
            {tareasColumna.length}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
          {tareasColumna.map(tarea => (
            <div
              key={tarea.id}
              draggable
              onDragStart={(e) => handleDragStart(e, tarea.id)}
              className="bg-arch-card p-3 rounded-lg border border-gray-700 hover:border-arch-blue cursor-grab active:cursor-grabbing shadow-lg"
            >
              <div className="flex items-start gap-2">
                <GripVertical size={16} className="text-gray-500 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-white font-medium leading-snug">{tarea.titulo}</p>
                  
                  {/* --- NUEVO: Dibujamos la etiqueta del responsable si existe --- */}
                  {tarea.contratista && (
                    <div className="mt-2 flex items-center gap-1.5 bg-arch-blue/10 text-arch-blue text-[10px] font-bold px-2 py-1 rounded-md w-fit border border-arch-blue/20">
                      <User size={10} />
                      {tarea.contratista}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {tareasColumna.length === 0 && (
            <div className="h-full flex items-center justify-center border-2 border-dashed border-gray-700 rounded-lg">
              <p className="text-gray-500 text-xs italic">Drop tasks here</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm p-4">
      <div className="bg-arch-dark border border-gray-700 w-full max-w-6xl rounded-2xl shadow-2xl p-6 flex flex-col h-[85vh]">
        
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-2xl font-bold text-white flex items-center gap-3">
              Task Board
              <span className="bg-arch-blue/20 text-arch-blue text-sm px-3 py-1 rounded-full">{proyectoNombre}</span>
            </h3>
            <p className="text-sm text-arch-text-gray mt-1">Assign tasks to your external teams and track progress.</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white cursor-pointer p-2 rounded-full hover:bg-gray-800">
            <X size={24} />
          </button>
        </div>

        {/* --- NUEVO: Formulario mejorado con selector de contratista --- */}
        <form onSubmit={handleAgregarTarea} className="mb-6 flex gap-3">
          <input 
            type="text" 
            required
            value={nuevaTarea}
            onChange={(e) => setNuevaTarea(e.target.value)}
            placeholder="What needs to be done on site?"
            className="flex-1 bg-arch-card border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-arch-blue"
          />
          
          {/* El Selector Dinámico */}
          <select 
            value={contratistaAsignado} 
            onChange={(e) => setContratistaAsignado(e.target.value)}
            className="w-1/4 bg-arch-card border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-arch-blue outline-none"
          >
            <option value="">Unassigned</option>
            {contratistas.map(c => (
              <option key={c.id} value={c.nombre}>{c.nombre} ({c.especialidad})</option>
            ))}
          </select>

          <button 
            type="submit" 
            disabled={isLoading}
            className="bg-arch-blue hover:bg-blue-600 text-white font-bold px-6 rounded-lg transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Plus size={20} /> Add Task
          </button>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 overflow-hidden">
          {renderColumna('Por Hacer', 'TODO', <AlertCircle size={18} className="text-gray-400" />, 'border-t-4 border-t-gray-500')}
          {renderColumna('En Progreso', 'IN_PROGRESS', <Clock size={18} className="text-yellow-500" />, 'border-t-4 border-t-yellow-500')}
          {renderColumna('Completado', 'DONE', <CheckCircle2 size={18} className="text-green-500" />, 'border-t-4 border-t-green-500')}
        </div>

      </div>
    </div>
  );
}