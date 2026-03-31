// src/components/NewContractorModal.tsx
import { useState } from "react";
import { X, UserPlus } from "lucide-react";

interface NewContractorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void; // Avisa a la tabla que recargue
}

export default function NewContractorModal({ isOpen, onClose, onCreated }: NewContractorModalProps) {
  const [formData, setFormData] = useState({
    nombre: "",
    especialidad: "Obra Civil",
    telefono: "",
    email: "",
    direccion: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem('archplan_token');
      const response = await fetch("http://localhost:8080/api/contratistas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onCreated();
        onClose();
        setFormData({ nombre: "", especialidad: "Obra Civil", telefono: "", email: "", direccion: "" });
      }
    } catch (error) {
      console.error("Error al guardar:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm p-4">
      <div className="bg-arch-card border border-gray-700 w-full max-w-md rounded-2xl shadow-2xl p-6 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <UserPlus className="text-arch-blue" />
            Add Contractor
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white cursor-pointer">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-arch-text-gray uppercase mb-1">Company Name</label>
            <input type="text" required value={formData.nombre} onChange={(e) => setFormData({...formData, nombre: e.target.value})} className="w-full bg-arch-dark border border-gray-700 rounded-lg px-3 py-2.5 text-white focus:border-arch-blue outline-none" placeholder="Ej. Grupo Plomeros SA" />
          </div>
          
          <div>
            <label className="block text-xs font-semibold text-arch-text-gray uppercase mb-1">Specialty</label>
            <select value={formData.especialidad} onChange={(e) => setFormData({...formData, especialidad: e.target.value})} className="w-full bg-arch-dark border border-gray-700 rounded-lg px-3 py-2.5 text-white focus:border-arch-blue outline-none">
              <option>Obra Civil</option>
              <option>Estructura Metálica</option>
              <option>Instalación Eléctrica</option>
              <option>Plomería e Hidráulica</option>
              <option>Acabados</option>
              <option>Maquinaria Pesada</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-arch-text-gray uppercase mb-1">Phone</label>
              <input type="text" required value={formData.telefono} onChange={(e) => setFormData({...formData, telefono: e.target.value})} className="w-full bg-arch-dark border border-gray-700 rounded-lg px-3 py-2.5 text-white focus:border-arch-blue outline-none" placeholder="55 1234 5678" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-arch-text-gray uppercase mb-1">Email</label>
              <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-arch-dark border border-gray-700 rounded-lg px-3 py-2.5 text-white focus:border-arch-blue outline-none" placeholder="contacto@empresa.com" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-arch-text-gray uppercase mb-1">Address / Location</label>
            <input type="text" required value={formData.direccion} onChange={(e) => setFormData({...formData, direccion: e.target.value})} className="w-full bg-arch-dark border border-gray-700 rounded-lg px-3 py-2.5 text-white focus:border-arch-blue outline-none" placeholder="Ciudad, Estado" />
          </div>

          <button type="submit" disabled={isLoading} className="w-full bg-arch-blue hover:bg-blue-600 text-white font-bold py-3 rounded-lg mt-4 transition-colors disabled:opacity-50">
            Save Contractor
          </button>
        </form>
      </div>
    </div>
  );
}