// src/components/NewProjectModal.tsx
import { useState } from "react";
import { X, Building, DollarSign } from "lucide-react";

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectCreated: (newProject: any) => void;
}

export default function NewProjectModal({
  isOpen,
  onClose,
  onProjectCreated,
}: NewProjectModalProps) {
  const [formData, setFormData] = useState({
    nombre: "",
    cliente: "",
    estado: "Planning",
    presupuestoTotal: "" // <-- Agregamos el presupuesto
  });
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem('archplan_token'); // Sacamos el pase VIP
      
      const response = await fetch("http://localhost:8080/api/proyectos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // <-- Indispensable para que Java te deje pasar
        },
        body: JSON.stringify({
            ...formData,
            presupuestoTotal: parseFloat(formData.presupuestoTotal) || 0 // Aseguramos que sea número
        }),
      });

      if (response.ok) {
        const newProject = await response.json();
        onProjectCreated(newProject);
        onClose();
        setFormData({ nombre: "", cliente: "", estado: "Planning", presupuestoTotal: "" });
      }
    } catch (error) {
      console.error("Error de conexión:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm p-4">
      <div className="bg-arch-card border border-gray-700 w-full max-w-md rounded-2xl shadow-2xl p-6 md:p-8 transform transition-all">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Building className="text-arch-blue" />
            New Project
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white cursor-pointer transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-arch-text-gray uppercase tracking-wider mb-2">Project Name</label>
            <input type="text" required value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} className="w-full bg-arch-dark border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-arch-blue" placeholder="Ej. Residencial Arcos" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-arch-text-gray uppercase tracking-wider mb-2">Client Name</label>
            <input type="text" required value={formData.cliente} onChange={(e) => setFormData({ ...formData, cliente: e.target.value })} className="w-full bg-arch-dark border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-arch-blue" placeholder="Ej. Inmobiliaria Global" />
          </div>

          {/* --- NUEVO CAMPO: PRESUPUESTO --- */}
          <div>
            <label className="block text-xs font-semibold text-arch-text-gray uppercase tracking-wider mb-2">Total Budget ($)</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3.5 text-gray-500" size={18} />
              <input 
                type="number" 
                step="0.01"
                required 
                value={formData.presupuestoTotal} 
                onChange={(e) => setFormData({ ...formData, presupuestoTotal: e.target.value })} 
                className="w-full bg-arch-dark border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-arch-blue" 
                placeholder="0.00" 
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-arch-text-gray uppercase tracking-wider mb-2">Initial Status</label>
            <select value={formData.estado} onChange={(e) => setFormData({ ...formData, estado: e.target.value })} className="w-full bg-arch-dark border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-arch-blue appearance-none">
              <option value="Planning">Planning</option>
              <option value="Construction">Construction</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <button type="submit" disabled={isLoading} className="w-full bg-arch-blue hover:bg-blue-600 text-white font-bold py-3 rounded-lg mt-6 transition-colors shadow-lg shadow-blue-500/20">
            {isLoading ? "Creating..." : "Create Project"}
          </button>
        </form>
      </div>
    </div>
  );
}