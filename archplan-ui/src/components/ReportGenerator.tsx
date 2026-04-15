import { useState } from 'react';
import { FileText, Loader2 } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ReportGeneratorProps {
  proyectoId: number;
  proyectoNombre: string;
  presupuestoTotal: number;
}

export default function ReportGenerator({ proyectoId, proyectoNombre, presupuestoTotal }: ReportGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const generarPDF = async () => {
    setIsGenerating(true);
    const token = localStorage.getItem('archplan_token');

    try {
      // 1. Recopilar datos desde Java
      const [resGastos, resTareas] = await Promise.all([
        fetch(`http://localhost:8080/api/gastos/proyecto/${proyectoId}`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`http://localhost:8080/api/tareas/proyecto/${proyectoId}`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      const gastos = resGastos.ok ? await resGastos.json() : [];
      const tareas = resTareas.ok ? await resTareas.json() : [];

      // Matemáticas rápidas
      const totalGastado = gastos.reduce((acc: number, g: any) => acc + g.monto, 0);
      const saldo = presupuestoTotal - totalGastado;
      const tareasCompletadas = tareas.filter((t: any) => t.estado === 'DONE').length;

      // 2. Inicializar el documento PDF
      const doc = new jsPDF();
      
      // --- ENCABEZADO ---
      doc.setFontSize(22);
      doc.setTextColor(41, 128, 185); // Azul ArchPlan
      doc.text('Reporte Ejecutivo de Obra', 14, 20);
      
      doc.setFontSize(12);
      doc.setTextColor(50, 50, 50);
      doc.text(`Proyecto: ${proyectoNombre}`, 14, 30);
      doc.text(`Fecha de emisión: ${new Date().toLocaleDateString('es-MX')}`, 14, 36);

      // --- RESUMEN FINANCIERO ---
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text('1. Resumen Financiero', 14, 50);

      autoTable(doc, {
        startY: 55,
        head: [['Presupuesto Inicial', 'Total Gastado', 'Saldo Disponible']],
        body: [[
          `$${presupuestoTotal.toLocaleString('en-US')}`, 
          `$${totalGastado.toLocaleString('en-US')}`, 
          `$${saldo.toLocaleString('en-US')}`
        ]],
        theme: 'grid',
        headStyles: { fillColor: [41, 128, 185] }
      });

      // --- DESGLOSE DE GASTOS ---
      doc.text('2. Desglose de Gastos', 14, (doc as any).lastAutoTable.finalY + 15);
      
      const gastosBody = gastos.map((g: any) => [
        g.fecha, 
        g.concepto, 
        g.categoria, 
        `$${g.monto.toLocaleString('en-US')}`
      ]);

      autoTable(doc, {
        startY: (doc as any).lastAutoTable.finalY + 20,
        head: [['Fecha', 'Concepto', 'Categoría', 'Monto']],
        body: gastosBody.length > 0 ? gastosBody : [['-', 'Sin gastos registrados', '-', '-']],
        theme: 'striped',
        headStyles: { fillColor: [52, 73, 94] }
      });

      // --- ESTADO DE TAREAS ---
      doc.text(`3. Progreso de Tareas (${tareasCompletadas}/${tareas.length} Completadas)`, 14, (doc as any).lastAutoTable.finalY + 15);

      const tareasBody = tareas.map((t: any) => [
        t.titulo,
        t.contratista || 'Interno',
        t.estado === 'TODO' ? 'Por Hacer' : t.estado === 'IN_PROGRESS' ? 'En Progreso' : 'Completado'
      ]);

      autoTable(doc, {
        startY: (doc as any).lastAutoTable.finalY + 20,
        head: [['Tarea', 'Asignado A', 'Estado']],
        body: tareasBody.length > 0 ? tareasBody : [['-', 'Sin tareas registradas', '-']],
        theme: 'striped',
        headStyles: { fillColor: [52, 73, 94] }
      });

      // 3. Guardar el PDF
      doc.save(`Reporte_${proyectoNombre.replace(/\s+/g, '_')}.pdf`);

    } catch (error) {
      console.error("Error al generar el reporte:", error);
      alert("Hubo un error al generar el documento.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button 
      onClick={generarPDF} 
      disabled={isGenerating}
      className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-3 py-1.5 rounded border border-gray-600 transition-colors text-xs font-bold"
      title="Descargar PDF del Proyecto"
    >
      {isGenerating ? <Loader2 size={14} className="animate-spin" /> : <FileText size={14} />}
      {isGenerating ? 'Generando...' : 'Reporte PDF'}
    </button>
  );
}