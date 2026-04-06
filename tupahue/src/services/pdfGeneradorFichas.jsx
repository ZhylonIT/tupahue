import jsPDF from 'jspdf';
import logoSAAC from '../assets/images/Logo_SAAC.png';

export const generarFichaMedicaPDF = (scout, returnBlob = false) => {
  const doc = new jsPDF('p', 'mm', 'a4');
  
  // 🎯 REFUERZO: Nos aseguramos de que dm sea un objeto y no falle si faltan datos
  const dm = scout.datosMedicos || {};
  
  const margin = 10;
  const pageWidth = 210;
  doc.setFont("helvetica");

  // --- ENCABEZADO ---
  try {
    doc.addImage(logoSAAC, 'PNG', margin, 10, 45, 18);
  } catch (e) { console.warn("Logo no cargado"); }

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("FORMULARIO DE INFORMACIÓN DE SALUD", 125, 15, { align: "center" });
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("Planilla Versión: 01-25 | www.scouts.org.ar", 125, 20, { align: "center" });

  // Cuadro DDJJ
  doc.setDrawColor(0);
  doc.setFillColor(240, 240, 240);
  doc.rect(85, 24, 80, 8, 'F');
  doc.rect(85, 24, 80, 8, 'S');
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("DECLARACIÓN JURADA DE SALUD", 125, 28, { align: "center" });
  doc.setFontSize(6.5);
  doc.text("Los datos consignados tienen carácter de declaración jurada por el firmante", 125, 31, { align: "center" });

  // --- 1. DATOS PERSONALES ---
  let y = 38;
  doc.setFontSize(8);
  doc.rect(margin, y, 190, 24);
  doc.line(margin, y + 6, margin + 190, y + 6);
  doc.line(margin, y + 12, margin + 190, y + 12);
  doc.line(margin, y + 18, margin + 190, y + 18);
  doc.line(105, y, 105, y + 12); 
  doc.line(57, y + 12, 57, y + 18); 
  doc.line(105, y + 12, 105, y + 18); 
  doc.line(152, y + 12, 152, y + 18); 

  doc.setFont("helvetica", "normal");
  doc.text(`Apellido: ${scout.apellido || ''}`, margin + 2, y + 4.5);
  doc.text(`Nombre: ${scout.nombre || ''}`, 107, y + 4.5);
  doc.text(`Fecha Nac: ${scout.fechaNacimiento || scout.fecha_nacimiento || ''}`, margin + 2, y + 10.5);
  doc.text(`Control Médico: ${dm.fechaControl || ''}`, 107, y + 10.5);
  doc.text(`D.N.I: ${scout.dni || ''}`, margin + 2, y + 16.5);
  doc.text(`N° Zona: 8`, 59, y + 16.5);
  doc.text(`N° Distrito: 3`, 107, y + 16.5);
  doc.text(`N° Grupo: 996`, 154, y + 16.5);
  doc.text(`Domicilio: ${dm.domicilio || ''}`, margin + 2, y + 22.5);

  // --- 2. GRILLAS LATERALES ---
  y = 72;
  const colW = 92;
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("Conteste las siguientes situaciones (SI o NO)", margin, y - 2);
  
  const situac = [
    ["Tiene hemorragias nasales", dm.hemorragias],
    ["Sangran sus encías al cepillarse", dm.encias],
    ["Tiene dolor de cabeza", dm.dolorCabeza],
    ["Sufre presión alta", dm.presionAlta],
    ["Sufre presión baja", dm.presionBaja],
    ["Recibió transfusiones de sangre", dm.transfusiones],
    ["Ha tenido convulsiones", dm.convulsiones],
    ["Tuvo cirugías en el último año", dm.cirugias],
    ["Tuvo internaciones en el último año", dm.internaciones],
    ["Realiza actividad física", dm.actividadFisica],
    ["Puede realizar cualquier actividad física", dm.cualquierActividad]
  ];

  doc.setFont("helvetica", "normal");
  situac.forEach((s, i) => {
    const rowY = y + (i * 5);
    doc.rect(margin, rowY, colW, 5);
    doc.text(s[0], margin + 2, rowY + 3.5);
    doc.setFont("helvetica", "bold");
    doc.text(s[1] ? "SI" : "NO", margin + colW - 8, rowY + 3.5);
    doc.setFont("helvetica", "normal");
  });

  doc.rect(margin, y + 55, colW, 10);
  doc.setFontSize(7);
  doc.text("Si respondió NO, especifique:", margin + 2, y + 58.5);
  doc.setFontSize(8);
  doc.text(dm.motivoNoActividad || '', margin + 2, y + 63);

  // Columna Derecha: Clínica
  const x2 = margin + colW + 6;
  doc.rect(x2, y, colW, 10);
  doc.line(x2 + 46, y, x2 + 46, y + 10);
  doc.line(x2, y + 5, x2 + colW, y + 5);
  doc.text(`G. Sanguíneo: ${dm.grupoSanguineo || ''}`, x2 + 2, y + 3.5);
  doc.text(`Factor RH: ${dm.factorRh || ''}`, x2 + 48, y + 3.5);
  doc.text(`Peso (kg): ${dm.peso || ''}`, x2 + 2, y + 8.5);
  doc.text(`Talla (m): ${dm.talla || ''}`, x2 + 48, y + 8.5);

  // Preguntas Clínicas Detalladas
  const clinicas = [
    { q: "¿Toma medicación? Cuál:", a: dm.medicacion ? dm.cualMedicacion : 'NO' },
    { q: "¿Enfermedad crónica? Cuál:", a: dm.cronica ? dm.cualCronica : 'NO' },
    { q: "¿Requiere tratamiento? Cuál:", a: dm.tratamiento ? dm.cualTratamiento : 'NO' },
    { q: "¿Tiene CUD?", a: dm.cud ? 'SI' : 'NO' },
    { q: "¿Sufre alguna alergia? Cuál:", a: dm.alergia ? dm.cualAlergia : 'NO' },
    { q: "¿Anticoagulado? Droga:", a: dm.anticoagulado ? dm.drogaAnticoagulante : 'NO' },
    { q: "¿Dieta especial? Cuál:", a: dm.dieta ? dm.cualDieta : 'NO' },
    { q: "¿Ataques pánico? Frecuencia:", a: dm.panico ? dm.frecuenciaPanico : 'NO' },
    { q: "¿Salud mental? Cuál:", a: dm.saludMental ? dm.cualSaludMental : 'NO' },
    { q: "¿Tratamiento mental? Cuál:", a: dm.tratamientoMental ? dm.cualTratamientoMental : 'NO' },
    { q: "¿Miedo excesivo o fobia?", a: dm.fobia ? 'SI' : 'NO' }
  ];

  clinicas.forEach((c, i) => {
    const rowY = y + 12 + (i * 6);
    doc.rect(x2, rowY, colW, 6);
    doc.setFontSize(6.5);
    doc.text(c.q, x2 + 2, rowY + 2.5);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    // 🎯 Aseguramos que el valor no sea undefined
    const answer = c.a === true ? 'SI' : (c.a === false || !c.a ? 'NO' : String(c.a));
    doc.text(answer, x2 + 2, rowY + 5.2, { maxWidth: colW - 4 });
    doc.setFont("helvetica", "normal");
  });

  // --- 3. VACUNAS ---
  y = 145;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("Vacunas | Última Dosis", margin, y - 2);
  doc.setFont("helvetica", "normal");
  const vacs = [
    ["Quintuple", dm.vacunaQuintuple],
    ["Triple Bacteriana Celular", dm.vacunaTripleCelular],
    ["Triple Bacteriana Acelular", dm.vacunaTripleAcelular],
    ["Doble Bacteriana", dm.vacunaDoble],
    ["Calendario Completo", dm.calendarioCompleto ? 'SI' : 'NO'],
    ["No tiene vacunas", dm.noTieneVacunas ? 'SI' : 'NO'],
    ["No sabe/No contesta", dm.noSabeVacunas ? 'SI' : 'NO']
  ];
  vacs.forEach((v, i) => {
    doc.rect(margin, y + (i * 4.5), colW, 4.5);
    doc.text(v[0], margin + 2, y + (i * 4.5) + 3.2);
    doc.setFont("helvetica", "bold");
    doc.text(String(v[1] || '-'), margin + colW - 15, y + (i * 4.5) + 3.2);
    doc.setFont("helvetica", "normal");
  });

  // Box Aptitud
  const yAptitud = 148.5;
  doc.rect(x2, yAptitud, colW, 11);
  doc.line(x2, yAptitud + 5.5, x2 + colW, yAptitud + 5.5);
  doc.setFontSize(7);
  doc.text("¿Adjunta certificado aptitud médica?", x2 + 2, yAptitud + 4);
  doc.text("¿Desea hablar con un educador?", x2 + 2, yAptitud + 9.5);
  doc.setFont("helvetica", "bold");
  doc.text(dm.adjuntaCertificado ? "SI" : "NO", x2 + colW - 8, yAptitud + 4);
  doc.text(dm.hablarEducador ? "SI" : "NO", x2 + colW - 8, yAptitud + 9.5);

  // --- 4. COBERTURA MÉDICA ---
  y = 188;
  doc.rect(margin, y, 190, 15);
  doc.line(margin, y + 7.5, margin + 190, y + 7.5);
  doc.line(105, y + 7.5, 105, y + 15);
  doc.setFont("helvetica", "normal");
  doc.text(`Obra Social / Prepaga: ${dm.obraSocial || ''}`, margin + 2, y + 5);
  doc.text(`Credencial N°: ${dm.nroCredencial || ''}`, margin + 2, y + 12);
  doc.text(`Tel. Emergencia OS: ${dm.telObraSocial || ''}`, 107, y + 12);

  // --- 5. FIRMAS ---
  y = 215;
  doc.setFontSize(7.5);
  doc.text("Declaro bajo juramento que toda la información aportada es verídica...", margin, y);
  doc.line(margin, y + 25, margin + 65, y + 25);
  doc.text("Firma Adulto/Madre/Padre/Tutor", margin, y + 30);
  
  doc.text("Aclaración: ___________________________", 110, y + 10);
  doc.text("DNI: ___________________________", 110, y + 17);
  doc.text(`Fecha: ${new Date().toLocaleDateString('es-AR')}`, 110, y + 24);

  // Sello Aval
  if (scout.avaladoPorEducadores) {
    doc.setDrawColor(26, 35, 126);
    doc.rect(margin + 120, y + 35, 70, 25);
    doc.setTextColor(26, 35, 126);
    doc.setFont("helvetica", "bold");
    doc.text("AVALADO DIGITALMENTE", margin + 155, y + 41, { align: "center" });
    doc.setFontSize(7);
    doc.text(`Educador: ${scout.educadorAvalista || ''}`, margin + 122, y + 47);
    doc.text(`DNI: ${scout.educadorDNI || ''}`, margin + 122, y + 52);
    
    if (scout.firmaDigitalImg) {
      try {
        doc.addImage(scout.firmaDigitalImg, 'PNG', margin + 160, y + 45, 25, 12);
      } catch (e) {}
    }
  }

  if (returnBlob) return doc.output('blob');
  doc.save(`Ficha_Medica_${scout.apellido}.pdf`);
};