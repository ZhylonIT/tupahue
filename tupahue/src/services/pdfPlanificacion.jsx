import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generarPDFPlanificacion = (data, ramaId) => {
  const doc = new jsPDF();
  let yPos = 15;

  const colorAzulTupahue = [26, 35, 126];
  const colorGrisHead = [230, 230, 230];

  const checkPage = (espacioRequerido) => {
    if (yPos + espacioRequerido > 275) {
      doc.addPage();
      yPos = 20;
    }
  };

  // --- TÍTULO PRINCIPAL ---
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...colorAzulTupahue);
  doc.text(`FICHA DE ACTIVIDADES RAMA ${ramaId.toUpperCase()}`, 105, yPos, { align: "center" });
  yPos += 10;

  // --- 1. DATOS GENERAL ---
  const cantidadScouts = data.equipos?.reduce((tot, eq) => tot + (eq.integrantes?.length || 0) + (eq.guia ? 1 : 0) + (eq.subguia ? 1 : 0), 0) || '-';
  const fechaAct = data.fechaActividad || new Date().toLocaleDateString();
  
  autoTable(doc, {
    startY: yPos,
    theme: 'plain',
    body: [
      [`Organismo: Grupo Scout Tupahue`, `Nombre Actividad: ${data.nombreActividad || 'Jornada Scout'}`],
      [`Fecha: ${fechaAct}`, `Ciclo de programa: ${data.cicloPrograma || '-'}`],
      [`Cantidad de protagonistas: ${cantidadScouts}`, '']
    ],
    styles: { fontSize: 10, cellPadding: 1, textColor: 20 }
  });
  yPos = doc.lastAutoTable.finalY + 5;

  // --- 2. PLAN DE RAMA ---
  autoTable(doc, {
    startY: yPos,
    theme: 'grid',
    head: [['PLAN DE RAMA']],
    body: [[data.planRama || 'Sin datos.']],
    headStyles: { fillColor: colorGrisHead, textColor: 20, fontStyle: 'bold' },
    styles: { fontSize: 9, cellPadding: 3, valign: 'top' }
  });
  yPos = doc.lastAutoTable.finalY + 5;

  // --- 3. DIAGNÓSTICO ---
  checkPage(30);
  autoTable(doc, {
    startY: yPos,
    theme: 'grid',
    head: [['DIAGNÓSTICO / PUNTO DE PARTIDA']],
    body: [[data.diagnostico || 'Sin datos.']],
    headStyles: { fillColor: colorGrisHead, textColor: 20, fontStyle: 'bold' },
    styles: { fontSize: 9, cellPadding: 3, valign: 'top' }
  });
  yPos = doc.lastAutoTable.finalY + 10;

  // --- 4. ESTRUCTURA DE EQUIPOS ---
  if (data.equipos && data.equipos.length > 0) {
    checkPage(40);
    const maxInt = Math.max(...data.equipos.map(e => e.integrantes?.length || 0), 5);
    const bodyEquipos = [
      ["Guía/Resp.", ...data.equipos.map(e => e.guia || '-')],
      ["Subguía", ...data.equipos.map(e => e.subguia || '-')],
      ...Array.from({ length: maxInt }).map((_, i) => [`${i+1}° Int.`, ...data.equipos.map(e => e.integrantes?.[i] || '-')])
    ];

    autoTable(doc, {
      startY: yPos,
      head: [["ROL", ...data.equipos.map(e => (e.nombre || 'EQUIPO').toUpperCase())]],
      body: bodyEquipos,
      theme: 'grid',
      headStyles: { fillColor: colorGrisHead, textColor: 20 },
      styles: { fontSize: 8, halign: 'center' },
      columnStyles: { 0: { halign: 'left', fontStyle: 'bold', fillColor: [245, 245, 245] } }
    });
    yPos = doc.lastAutoTable.finalY + 10;
  }

  // --- 5. PROGRESIÓN PERSONAL ---
  checkPage(30);
  
  const listaProgresiones = (data.progresiones && data.progresiones.length > 0) 
    ? data.progresiones 
    : (data.pasesAgendados && data.pasesAgendados.length > 0 ? data.pasesAgendados : []);

  if (listaProgresiones.length > 0) {
    autoTable(doc, {
      startY: yPos,
      head: [['NOMBRE DEL PROTAGONISTA', 'PROGRESIÓN / ETAPA ACTUAL']],
      body: listaProgresiones.map(p => [
        p.nombre || p.scout || p.integrante || 'Sin nombre',
        p.progresion || p.etapa || p.tipo || p.nivel || 'Sin definir'
      ]),
      theme: 'grid',
      headStyles: { fillColor: colorGrisHead, textColor: 20 },
      styles: { fontSize: 9 }
    });
  } else {
    autoTable(doc, {
      startY: yPos,
      head: [['NOMBRE DEL PROTAGONISTA', 'PROGRESIÓN / ETAPA ACTUAL']],
      body: [['Sin datos registrados en esta planificación', '-']],
      theme: 'grid',
      headStyles: { fillColor: colorGrisHead, textColor: 20 },
      styles: { fontSize: 9, halign: 'center', fontStyle: 'italic', textColor: 100 }
    });
  }
  yPos = doc.lastAutoTable.finalY + 10;

  // --- 6. OBJETIVOS DE LA JORNADA ---
  checkPage(30);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0,0,0);
  doc.text("OBJETIVOS DE LA JORNADA:", 14, yPos);
  yPos += 5;
  const objTxt = doc.splitTextToSize(data.objetivosJornada || "-", 180);
  doc.setFont("helvetica", "normal");
  doc.text(objTxt, 14, yPos);
  yPos += (objTxt.length * 5) + 5;

  // --- 7. CRONOGRAMA GENERAL ---
  checkPage(40);
  autoTable(doc, {
    startY: yPos,
    head: [['HORA', 'ACTIVIDAD', 'RESPONSABLE']],
    body: (data.cronograma || []).map(c => [c.hora || c.horario || '-', c.actividad || '-', c.responsable || '-']),
    theme: 'grid',
    headStyles: { fillColor: colorGrisHead, textColor: 20 },
    styles: { fontSize: 9 }
  });

  // --- 8. FICHAS DE ACTIVIDAD INDIVIDUALES ---
  if (data.listaActividades && data.listaActividades.length > 0) {
    data.listaActividades.forEach((act, idx) => {
      doc.addPage();

      // Mapeo y formateo de los Objetivos Educativos (viñetas por cada área)
      let objetivosEducativosTexto = '';
      if (act.objetivosEducativos) {
        const lineasObjetivos = Object.entries(act.objetivosEducativos)
          .filter(([area, objetivos]) => objetivos && objetivos.length > 0)
          .map(([area, objetivos]) => {
            const bullets = objetivos.map(obj => `• ${obj}`).join('\n');
            return `${area.toUpperCase()}:\n${bullets}`;
          });
        if (lineasObjetivos.length > 0) {
          objetivosEducativosTexto = lineasObjetivos.join('\n\n');
        }
      }
      if (!objetivosEducativosTexto) objetivosEducativosTexto = '-';

      autoTable(doc, {
        startY: 20,
        theme: 'grid',
        body: [
          [{ content: `ACTIVIDAD: ${(act.nombre || `Juego ${idx+1}`).toUpperCase()}`, colSpan: 2, styles: { fillColor: colorGrisHead, fontStyle: 'bold', halign: 'center' } }],
          [{ content: `Objetivos del Juego / Dinámica: ${act.objetivos || '-'}`, colSpan: 2 }],
          [{ content: `Objetivos Educativos a trabajar:\n\n${objetivosEducativosTexto}`, colSpan: 2, styles: { cellPadding: 4 } }],
          [`Duración: ${act.duracion || '-'}`, `Responsables/Apoyo: ${act.apoyo || '-'}`],
          [{ content: `Materiales: ${act.materiales || '-'}`, colSpan: 2 }],
          [{ content: `Desarrollo:\n\n${act.descripcion || '-'}`, colSpan: 2, styles: { minCellHeight: 50 } }],
          [{ content: `Recupero / Cierre:\n\n${act.recupero || '-'}`, colSpan: 2 }],
          [{ content: `Riesgos y Observaciones: ${act.notas || '-'}`, colSpan: 2, styles: { textColor: [200, 50, 50] } }]
        ],
        styles: { fontSize: 9, cellPadding: 4, textColor: 20 }
      });
    });
  }

  // --- PIE DE PÁGINA ---
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("Scouts de Argentina - Grupo Scout Tupahue", 14, 285);
    doc.text(`Página ${i} de ${pageCount}`, 180, 285);
  }

  const nombrePDF = `Actividad_${data.fechaActividad || new Date().toISOString().slice(0,10)}.pdf`;
  doc.save(nombrePDF);
};