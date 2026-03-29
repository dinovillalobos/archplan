// src/components/StatusChart.tsx
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface StatusChartProps {
  proyectos: any[];
}

export default function StatusChart({ proyectos }: StatusChartProps) {
  // 1. Agrupamos y contamos cuántos proyectos hay por cada estado
  const statusCounts = proyectos.reduce((acc: any, current: any) => {
    const status = current.estado || 'Unknown';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  // 2. Formateamos los datos como lo pide Recharts: [{ name: 'Planning', value: 3 }, ...]
  const data = Object.keys(statusCounts).map(key => ({
    name: key,
    value: statusCounts[key]
  }));

  // 3. Definimos nuestros colores corporativos (Azul ArchPlan, Verde, Naranja, etc.)
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

  // Si no hay datos, mostramos un mensaje sutil
  if (proyectos.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-arch-text-gray text-sm italic">Awaiting project data...</p>
      </div>
    );
  }

  return (
    <div className="h-32 w-full mt-2">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            innerRadius={40}  // Esto hace que sea una dona y no un pastel entero
            outerRadius={60}
            paddingAngle={5}  // Espacio elegante entre las rebanadas
            dataKey="value"
            stroke="none"     // Quitamos el borde blanco por defecto
          >
            {data.map((_entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          {/* Tooltip personalizado para que combine con el modo oscuro */}
          <Tooltip 
            contentStyle={{ backgroundColor: '#161b22', borderColor: '#374151', borderRadius: '8px', color: '#fff' }}
            itemStyle={{ color: '#94a3b8', fontWeight: 'bold' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}