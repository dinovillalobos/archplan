// src/components/Directory.tsx
import { useState, useEffect } from 'react';
import { Users, Search, Plus, Phone, Mail, MapPin, Trash2 } from 'lucide-react';
import NewContractorModal from './NewContractorModal';

export default function Directory() {
  const [contratistas, setContratistas] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    cargarContratistas();
  }, []);

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
    } catch (error) {
      console.error("Error al cargar contratistas:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Remove this contractor from the directory?")) return;
    const token = localStorage.getItem('archplan_token');
    try {
      const res = await fetch(`http://localhost:8080/api/contratistas/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) cargarContratistas();
    } catch (error) {
      console.error(error);
    }
  };

  // Filtro de búsqueda en tiempo real
  const filteredContratistas = contratistas.filter(c => 
    c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.especialidad.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 md:p-10 max-w-7xl mx-auto animate-fade-in">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <Users className="text-arch-blue" size={32} />
            Contractor Directory
          </h2>
          <p className="text-arch-text-gray mt-1 text-sm">Manage your external teams and suppliers.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-arch-blue hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-lg flex items-center gap-2 cursor-pointer">
          <Plus size={18} /> Add Contractor
        </button>
      </header>

      {/* Buscador */}
      <div className="mb-8 flex items-center w-full md:w-1/2 bg-arch-card px-4 py-3 rounded-xl border border-gray-700 focus-within:border-arch-blue transition-colors shadow-lg">
        <Search className="text-gray-500 mr-3" size={20} />
        <input 
          type="text" 
          placeholder="Search by company name or specialty..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-transparent border-none outline-none text-sm w-full text-white placeholder-gray-600 focus:ring-0"
        />
      </div>

      {/* Grid de Contratistas Dinámico */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContratistas.length === 0 ? (
          <p className="text-arch-text-gray italic col-span-full">No contractors found. Add your first team member!</p>
        ) : (
          filteredContratistas.map((contratista) => (
            <div key={contratista.id} className="bg-arch-card p-6 rounded-xl border border-gray-800 hover:border-arch-blue transition-colors relative group">
              
              {/* Botón oculto de eliminar */}
              <button 
                onClick={() => handleDelete(contratista.id)}
                className="absolute top-4 right-4 text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer p-1 rounded hover:bg-red-500/10"
              >
                <Trash2 size={18} />
              </button>

              <div className="flex justify-between items-start mb-4 pr-6">
                <div>
                  <h3 className="text-lg font-bold text-white">{contratista.nombre}</h3>
                  <span className="inline-block mt-1 bg-gray-800 text-xs text-gray-300 px-2.5 py-1 rounded-full border border-gray-700">
                    {contratista.especialidad}
                  </span>
                </div>
              </div>
              <div className="space-y-3 mt-6">
                <p className="flex items-center gap-3 text-sm text-arch-text-gray">
                  <Phone size={16} className="text-gray-500" /> {contratista.telefono}
                </p>
                <p className="flex items-center gap-3 text-sm text-arch-text-gray">
                  <Mail size={16} className="text-gray-500" /> {contratista.email}
                </p>
                <p className="flex items-center gap-3 text-sm text-arch-text-gray">
                  <MapPin size={16} className="text-gray-500" /> {contratista.direccion}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      <NewContractorModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onCreated={cargarContratistas} 
      />
    </div>
  );
}