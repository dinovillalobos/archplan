// src/components/BudgetTracker.tsx
import { useState, useEffect } from 'react';
import { X, DollarSign, Plus, Receipt, AlertCircle, Edit2, Check, Trash2 } from 'lucide-react';

interface BudgetTrackerProps {
  proyecto: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function BudgetTracker({ proyecto, isOpen, onClose }: BudgetTrackerProps) {
  const [gastos, setGastos] = useState<any[]>([]);
  const [nuevoConcepto, setNuevoConcepto] = useState('');
  const [nuevoMonto, setNuevoMonto] = useState('');
  const [nuevaCategoria, setNuevaCategoria] = useState('Materiales');
  const [isLoading, setIsLoading] = useState(false);

  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [currentBudget, setCurrentBudget] = useState(proyecto.presupuestoTotal || 0);
  const [tempBudget, setTempBudget] = useState(currentBudget.toString());

  useEffect(() => {
    if (isOpen) {
      cargarGastos();
      setCurrentBudget(proyecto.presupuestoTotal || 0);
      setTempBudget((proyecto.presupuestoTotal || 0).toString());
      setIsEditingBudget(false);
    }
  }, [isOpen, proyecto.id, proyecto.presupuestoTotal]);

  const cargarGastos = async () => {
    const token = localStorage.getItem('archplan_token');
    try {
      const res = await fetch(`http://localhost:8080/api/gastos/proyecto/${proyecto.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setGastos(data);
      }
    } catch (error) {
      console.error("Error al cargar gastos:", error);
    }
  };

  const handleAgregarGasto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoConcepto.trim() || !nuevoMonto) return;
    setIsLoading(true);

    const token = localStorage.getItem('archplan_token');
    try {
      const res = await fetch(`http://localhost:8080/api/gastos/proyecto/${proyecto.id}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ 
          concepto: nuevoConcepto, 
          monto: parseFloat(nuevoMonto),
          categoria: nuevaCategoria
        })
      });
      
      if (res.ok) {
        setNuevoConcepto('');
        setNuevoMonto('');
        cargarGastos();
      }
    } catch (error) {
      console.error("Error al registrar gasto:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateBudget = async () => {
    const token = localStorage.getItem('archplan_token');
    try {
      const nuevoTotal = parseFloat(tempBudget);
      const res = await fetch(`http://localhost:8080/api/proyectos/${proyecto.id}/presupuesto`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ presupuestoTotal: nuevoTotal })
      });
      if (res.ok) {
        setIsEditingBudget(false);
        setCurrentBudget(nuevoTotal);
      }
    } catch (error) { console.error(error); }
  };

  const handleDeleteGasto = async (gastoId: number) => {
    if (!window.confirm("¿Delete this expense? This action cannot be undone.")) return;
    const token = localStorage.getItem('archplan_token');
    try {
      const res = await fetch(`http://localhost:8080/api/gastos/${gastoId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) cargarGastos();
    } catch (error) { console.error(error); }
  };

  const totalGastado = gastos.reduce((acc, gasto) => acc + gasto.monto, 0);
  const saldoRestante = currentBudget - totalGastado;
  const porcentajeGastado = currentBudget > 0 ? (totalGastado / currentBudget) * 100 : 0;
  const progressColor = porcentajeGastado > 90 ? 'bg-red-500' : porcentajeGastado > 75 ? 'bg-yellow-500' : 'bg-green-500';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm p-4">
      {/* Aumentamos el ancho máximo a 6xl y la altura al 90% de la pantalla */}
      <div className="bg-arch-dark border border-gray-700 w-full max-w-6xl rounded-2xl shadow-2xl p-6 md:p-8 flex flex-col h-[90vh]">
        
        {/* Encabezado Principal */}
        <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4 shrink-0">
          <div>
            <h3 className="text-2xl font-bold text-white flex items-center gap-3">
              Budget & Expenses
              <span className="bg-arch-blue/20 text-arch-blue text-sm px-3 py-1 rounded-full">{proyecto.nombre}</span>
            </h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white cursor-pointer p-2 rounded-full hover:bg-gray-800 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* --- NUEVO LAYOUT: GRID DE 2 COLUMNAS (1/3 Izquierda, 2/3 Derecha) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 min-h-0 overflow-hidden">
          
          {/* COLUMNA IZQUIERDA: Métricas y Formulario */}
          <div className="col-span-1 flex flex-col gap-5 overflow-y-auto pr-2 pb-4 custom-scrollbar">
            
            {/* Métrica: Presupuesto Total */}
            <div className="bg-arch-card p-4 rounded-xl border border-gray-700 relative group shrink-0">
              <p className="text-xs text-arch-text-gray uppercase tracking-wider mb-1 flex justify-between items-center">
                Total Budget
                {!isEditingBudget && (
                  <button onClick={() => setIsEditingBudget(true)} className="text-gray-500 hover:text-arch-blue opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Edit2 size={14} />
                  </button>
                )}
              </p>
              {isEditingBudget ? (
                <div className="flex items-center gap-2 mt-1">
                  <div className="relative flex-1">
                    <DollarSign size={16} className="absolute left-2 top-1.5 text-gray-500" />
                    <input 
                      type="number" 
                      autoFocus
                      value={tempBudget}
                      onChange={(e) => setTempBudget(e.target.value)}
                      className="w-full bg-arch-dark border border-arch-blue rounded pl-7 pr-2 py-1 text-white font-bold outline-none text-sm"
                    />
                  </div>
                  <button onClick={handleUpdateBudget} className="bg-green-500 hover:bg-green-600 text-white p-1.5 rounded cursor-pointer"><Check size={16} /></button>
                  <button onClick={() => { setIsEditingBudget(false); setTempBudget(currentBudget.toString()); }} className="bg-gray-700 hover:bg-gray-600 text-white p-1.5 rounded cursor-pointer"><X size={16} /></button>
                </div>
              ) : (
                <h4 className="text-2xl font-bold text-white">${currentBudget.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h4>
              )}
            </div>

            {/* Fila de Métricas Secundarias */}
            <div className="grid grid-cols-2 gap-4 shrink-0">
              <div className="bg-arch-card p-4 rounded-xl border border-gray-700">
                <p className="text-xs text-arch-text-gray uppercase tracking-wider mb-1">Spent</p>
                <h4 className="text-lg font-bold text-red-400">${totalGastado.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h4>
              </div>
              <div className="bg-arch-card p-4 rounded-xl border border-gray-700">
                <p className="text-xs text-arch-text-gray uppercase tracking-wider mb-1">Balance</p>
                <h4 className={`text-lg font-bold ${saldoRestante < 0 ? 'text-red-500' : 'text-green-400'}`}>
                  ${saldoRestante.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </h4>
              </div>
            </div>

            {/* Barra de Progreso */}
            <div className="bg-arch-card p-4 rounded-xl border border-gray-700 shrink-0">
              <div className="flex justify-between text-xs text-arch-text-gray font-bold mb-2">
                <span>Usage</span>
                <span>{porcentajeGastado.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2.5 overflow-hidden">
                <div className={`h-2.5 rounded-full transition-all duration-500 ${progressColor}`} style={{ width: `${Math.min(porcentajeGastado, 100)}%` }}></div>
              </div>
              {porcentajeGastado > 90 && (
                <p className="text-red-400 text-xs mt-3 flex items-center gap-1">
                  <AlertCircle size={14} /> Warning: Budget almost exhausted.
                </p>
              )}
            </div>

            {/* Formulario de Nuevo Gasto */}
            <div className="bg-gray-800/30 p-5 rounded-xl border border-gray-700 mt-2 shrink-0">
              <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                <Plus size={18} className="text-arch-blue" /> Record Expense
              </h4>
              <form onSubmit={handleAgregarGasto} className="space-y-4">
                <div>
                  <label className="block text-xs text-arch-text-gray mb-1">Description</label>
                  <input type="text" required value={nuevoConcepto} onChange={(e) => setNuevoConcepto(e.target.value)} placeholder="e.g. Steel beams" className="w-full bg-arch-dark border border-gray-600 rounded px-3 py-2 text-white text-sm focus:border-arch-blue outline-none" />
                </div>
                <div>
                  <label className="block text-xs text-arch-text-gray mb-1">Amount ($)</label>
                  <div className="relative">
                    <DollarSign size={14} className="absolute left-3 top-2.5 text-gray-500" />
                    <input type="number" step="0.01" required value={nuevoMonto} onChange={(e) => setNuevoMonto(e.target.value)} placeholder="0.00" className="w-full bg-arch-dark border border-gray-600 rounded pl-8 pr-3 py-2 text-white text-sm focus:border-arch-blue outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-arch-text-gray mb-1">Category</label>
                  <select value={nuevaCategoria} onChange={(e) => setNuevaCategoria(e.target.value)} className="w-full bg-arch-dark border border-gray-600 rounded px-3 py-2 text-white text-sm focus:border-arch-blue outline-none">
                    <option>Materiales</option>
                    <option>Mano de Obra</option>
                    <option>Permisos</option>
                    <option>Maquinaria</option>
                  </select>
                </div>
                <button type="submit" disabled={isLoading} className="w-full bg-arch-blue hover:bg-blue-600 text-white font-bold py-3 mt-2 rounded-lg transition-colors text-sm cursor-pointer disabled:opacity-50">
                  Save Record
                </button>
              </form>
            </div>
          </div>

          {/* COLUMNA DERECHA: Tabla de Historial (Toma todo el alto disponible) */}
          <div className="col-span-1 lg:col-span-2 border border-gray-700 rounded-xl overflow-hidden flex flex-col bg-arch-dark/30">
            <div className="bg-gray-800/50 p-4 border-b border-gray-700 shrink-0">
              <h4 className="text-white font-bold text-sm flex items-center gap-2">
                <Receipt size={16} className="text-arch-text-gray" /> Transaction History
              </h4>
            </div>
            
            <div className="flex-1 overflow-y-auto p-0 custom-scrollbar">
              {gastos.length === 0 ? (
                <div className="h-full flex items-center justify-center text-gray-500 text-sm italic p-10">
                  No expenses recorded yet.
                </div>
              ) : (
                <table className="w-full text-left text-sm text-gray-300">
                  <thead className="text-xs text-arch-text-gray uppercase bg-gray-900/50 sticky top-0 z-10 backdrop-blur-md">
                    <tr>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Description</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4 text-right">Amount</th>
                      <th className="px-4 py-4 text-center"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {gastos.map((gasto, idx) => (
                      <tr key={idx} className="hover:bg-gray-800/40 group transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-gray-400">{gasto.fecha}</td>
                        <td className="px-6 py-4 font-medium text-white">{gasto.concepto}</td>
                        <td className="px-6 py-4">
                          <span className="bg-gray-800 text-xs px-2.5 py-1 rounded-full border border-gray-700 text-gray-300">{gasto.categoria}</span>
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-red-400 whitespace-nowrap">
                          ${gasto.monto.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-4 py-4 text-center">
                          <button 
                            onClick={() => handleDeleteGasto(gasto.id)}
                            className="text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all cursor-pointer p-1 rounded hover:bg-red-500/10"
                            title="Delete record"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}