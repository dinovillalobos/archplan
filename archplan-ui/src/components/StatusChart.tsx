// src/components/StatusChart.tsx
import { Clock, Hammer, CheckCircle2 } from 'lucide-react';

interface StatusChartProps {
  proyectos: any[];
}

export default function StatusChart({ proyectos }: StatusChartProps) {
  // Evitamos dividir por cero si no hay proyectos
  const total = proyectos.length === 0 ? 1 : proyectos.length;
  
  const planning = proyectos.filter(p => p.estado === 'Planning').length;
  const construction = proyectos.filter(p => p.estado === 'Construction').length;
  const completed = proyectos.filter(p => p.estado === 'Completed').length;

  const getPercent = (value: number) => Math.round((value / total) * 100);

  return (
    <div className="flex flex-col gap-4 mt-2 w-full">
      
      {/* Barra de Planning (Gris/Azul) */}
      <div>
        <div className="flex justify-between text-xs text-arch-text-gray font-bold mb-1.5">
          <span className="flex items-center gap-1.5"><Clock size={14} className="text-gray-400"/> Planning ({planning})</span>
          <span>{getPercent(planning)}%</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-2">
          <div className="bg-gray-400 h-2 rounded-full transition-all duration-1000" style={{ width: `${getPercent(planning)}%` }}></div>
        </div>
      </div>

      {/* Barra de Construcción (Amarillo) */}
      <div>
        <div className="flex justify-between text-xs text-arch-text-gray font-bold mb-1.5">
          <span className="flex items-center gap-1.5"><Hammer size={14} className="text-yellow-500"/> Construction ({construction})</span>
          <span>{getPercent(construction)}%</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-2">
          <div className="bg-yellow-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${getPercent(construction)}%` }}></div>
        </div>
      </div>

      {/* Barra de Completados (Verde) */}
      <div>
        <div className="flex justify-between text-xs text-arch-text-gray font-bold mb-1.5">
          <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-green-500"/> Completed ({completed})</span>
          <span>{getPercent(completed)}%</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-2">
          <div className="bg-green-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${getPercent(completed)}%` }}></div>
        </div>
      </div>

    </div>
  );
}