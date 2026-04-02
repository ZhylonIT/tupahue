import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Genera el PDF de factibilidad del proyecto para el Grupo Tupahue
 */
export const generarPDFProyecto = (proyecto, joven) => {
  try {
    // 1. Validación de datos
    if (!proyecto || !proyecto.titulo) {
      alert("Error: No se encontró la información del proyecto.");
      return;
    }

    const doc = new jsPDF();
    
    // 2. Cabecera Institucional (Fondo gris oscuro)
    doc.setFillColor(33, 33, 33);
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("INFORME DE FACTIBILIDAD", 15, 25);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("GRUPO SCOUT TUPAHUE • SISTEMA DE GESTIÓN DE PROGRAMA", 15, 33);

    // 3. Información General
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(`PROYECTO: ${proyecto.titulo.toUpperCase()}`, 15, 55);
    
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(`Responsable: ${joven?.nombre || 'N/N'} ${joven?.apellido || ''}`, 15, 65);
    doc.text(`Unidad: ${proyecto.rama || 'N/A'} - ${proyecto.equipo || 'N/A'}`, 15, 72);
    doc.text(`Estado: ${proyecto.estado || 'BORRADOR'}`, 15, 79);
    doc.text(`Fecha de Emisión: ${new Date().toLocaleDateString()}`, 15, 86);

    // 4. Tabla de Contenidos 
    autoTable(doc, {
      startY: 95,
      head: [['SECCIÓN', 'DESCRIPCIÓN']],
      body: [
        ['OBJETIVOS / EL SUEÑO', proyecto.objetivos || 'Sin datos cargados.'],
        ['DIAGNÓSTICO / RECURSOS', proyecto.diagnostico || 'Sin datos cargados.'],
        ['ORGANIZACIÓN / TAREAS', proyecto.tareas || 'Sin datos cargados.'],
        ['INFORME DEL EDUCADOR', proyecto.comentariosEducador || 'Revisión técnica pendiente.']
      ],
      theme: 'grid',
      headStyles: { 
        fillColor: [46, 125, 50], 
        fontStyle: 'bold',
        halign: 'center'
      },
      columnStyles: { 
        0: { cellWidth: 50, fontStyle: 'bold', textColor: [46, 125, 50] } 
      },
      styles: { 
        fontSize: 10, 
        cellPadding: 5,
        overflow: 'linebreak' 
      },
      margin: { left: 15, right: 15 }
    });

    // 5. Pie de página y Firma
    // Usamos el resultado de la última tabla generada para posicionar la firma
    const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 35 : 150;
    
    doc.setDrawColor(150);
    doc.line(15, finalY, 80, finalY);
    
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text("Firma del Educador Responsable", 15, finalY + 5);

    // 6. Guardado con nombre limpio
    const nombreLimpio = proyecto.titulo.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    doc.save(`Tupahue_Proyecto_${nombreLimpio}.pdf`);

  } catch (error) {
    console.error("Error al generar el PDF:", error);
    alert("Hubo un fallo técnico al generar el PDF. Revisá la consola (F12).");
  }
};