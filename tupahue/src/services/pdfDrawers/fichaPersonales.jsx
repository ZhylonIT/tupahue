import { 
  drawHeader, drawSignatures, drawSectionTitle, 
  MARGEN_BASE, CENTRO_X, PAG_ANCHO 
} from './common';

export const drawFichaPersonalesPage = (doc, scout, datos, margin = MARGEN_BASE) => {
  // 1. Encabezado profesional centrado
  drawHeader(
    doc, 
    "FICHA DE DATOS PERSONALES", 
    "Legajo Digital Único - Versión 2026", 
    "Distrito 3 - Zona 8 | Grupo Scout Tupahue 996", 
    margin
  );

  let y = 38;

  // --- SECCIÓN I: DATOS DEL BENEFICIARIO ---
  drawSectionTitle(doc, "I. DATOS DEL BENEFICIARIO", y, margin);
  y += 7;
  
  const anchoRec = PAG_ANCHO - (margin * 2);
  doc.rect(margin, y, anchoRec, 32); // Cuadro de datos
  
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  
  doc.text(`Apellidos: ${scout.apellido?.toUpperCase()}`, margin + 5, y + 7);
  doc.text(`Nombres: ${scout.nombre}`, CENTRO_X + 5, y + 7);
  
  doc.text(`D.N.I: ${scout.dni}`, margin + 5, y + 14);
  doc.text(`Fecha de Nacimiento: ${scout.fechaNacimiento || scout.fecha_nacimiento || ''}`, CENTRO_X + 5, y + 14);
  
  doc.text(`Nacionalidad: ${datos.nacionalidad || ''}`, margin + 5, y + 21);
  doc.text(`Religión / Culto: ${datos.religion || ''}`, CENTRO_X + 5, y + 21);
  
  doc.text(`Institución Educativa: ${datos.escuela || ''}`, margin + 5, y + 28);
  doc.text(`Grado / Año: ${datos.grado || ''}`, CENTRO_X + 5, y + 28);

  y += 40;

  // --- SECCIÓN II: GRUPO FAMILIAR ---
  drawSectionTitle(doc, "II. DATOS DEL GRUPO FAMILIAR (Adultos Responsables)", y, margin);
  y += 7;
  
  doc.rect(margin, y, anchoRec, 60); // Cuadro de familia
  
  // Responsable 1
  doc.setFont("helvetica", "bold");
  doc.setFillColor(245, 245, 245);
  doc.rect(margin, y, anchoRec, 6, 'F');
  doc.text("Responsable 1 (Titular de cuenta)", margin + 5, y + 4.5);
  
  doc.setFont("helvetica", "normal");
  doc.text(`Nombre y Apellido: ${datos.tutor1Nombre}`, margin + 5, y + 12);
  doc.text(`Vínculo: ${datos.tutor1Vinculo}`, CENTRO_X + 40, y + 12);
  
  doc.text(`D.N.I: ${datos.tutor1Dni}`, margin + 5, y + 19);
  doc.text(`Teléfono: ${datos.tutor1Tel}`, CENTRO_X + 5, y + 19);
  
  doc.text(`Ocupación: ${datos.tutor1Ocupacion}`, margin + 5, y + 26);
  doc.text(`E-mail: ${datos.tutor1Email}`, CENTRO_X + 5, y + 26);

  // Responsable 2
  y += 30;
  doc.line(margin, y, margin + anchoRec, y);
  doc.setFont("helvetica", "bold");
  doc.rect(margin, y, anchoRec, 6, 'F');
  doc.text("Responsable 2", margin + 5, y + 4.5);
  
  doc.setFont("helvetica", "normal");
  doc.text(`Nombre y Apellido: ${datos.tutor2Nombre || 'No declarado'}`, margin + 5, y + 12);
  doc.text(`Vínculo: ${datos.tutor2Vinculo || ''}`, CENTRO_X + 40, y + 12);
  
  doc.text(`D.N.I: ${datos.tutor2Dni || ''}`, margin + 5, y + 19);
  doc.text(`Teléfono: ${datos.tutor2Tel || ''}`, CENTRO_X + 5, y + 19);
  doc.text(`Ocupación: ${datos.tutor2Ocupacion || ''}`, margin + 5, y + 26);

  y += 38;

  // --- SECCIÓN III: RETIRO DE ACTIVIDADES ---
  drawSectionTitle(doc, "III. RETIRO DE ACTIVIDADES", y, margin);
  y += 7;
  
  doc.rect(margin, y, anchoRec, 20);
  doc.setFontSize(8);
  doc.text("Personas mayores de edad autorizadas para retirar al beneficiario además de los padres:", margin + 3, y + 6);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  const autorizados = datos.personasAutorizadas || "No se declaran otras personas.";
  const lineasAutorizados = doc.splitTextToSize(autorizados, anchoRec - 10);
  doc.text(lineasAutorizados, margin + 5, y + 12);

  // --- FIRMAS ---
  // Posicionamos las firmas al final de la página (y=225)
  drawSignatures(doc, 225, datos, margin);
};