import { 
  drawHeader, drawSignatures, drawCenteredText, drawJustifiedParagraph, 
  MARGEN_BASE, PAG_ANCHO 
} from './common';

export const drawFichaIngresoPage = (doc, scout, datos, margin = MARGEN_BASE) => {
  drawHeader(doc, "Autorización de Ingreso de", "Niños, Niñas y Jóvenes Menores de 18 Años", "Planilla Versión: 07-21 | www.scouts.org.ar", margin);

  let y = 45;
  drawCenteredText(doc, "AUTORIZACIÓN DE INGRESO DE", y, 12, 'bold');
  drawCenteredText(doc, "NIÑOS, NIÑAS Y JÓVENES MENORES DE 18 AÑOS", y + 5, 12, 'bold');
  
  y += 18;
  const nombreTutor = (datos.tutorNombre || "___________________________").toUpperCase();
  const nombreScout = `${scout.nombre} ${scout.apellido}`.toUpperCase();
  const fechaNacScout = scout.fechaNacimiento || scout.fecha_nacimiento || "___/___/_____";

  const cuerpo = `En la localidad de ${datos.localidad || '__________'}, provincia de ${datos.provincia || '__________'}, partido / departamento de ${datos.partido || '__________'}, a los ${datos.dia || '___'} días del mes de ${datos.mes || '__________'} del año ${datos.anio || '____'}, YO (1) ${nombreTutor} de nacionalidad ${datos.tutorNacionalidad || '__________'}, nacido/a el ${datos.tutorNacimiento || '___/___/_____'} de ${datos.tutorDni || '__________'} DNI y con domicilio en ${datos.tutorDomicilio || '____________________'}, Teléfono: ${datos.tutorTelefono || '__________'}, en mi carácter de (2) ${datos.tutorVinculo || '__________'} OTORGO AUTORIZACIÓN para que EL MENOR (3) ${nombreScout} de nacionalidad ${datos.scoutNacionalidad || '__________'} nacido/a el ${fechaNacScout} de ${scout.dni || '__________'} y DNI con domicilio en ${datos.scoutDomicilio || '____________________'} para que participe de las actividades scouts desarrolladas por los dirigentes pertenecientes al Grupo Scout N° 996 Nombre TUPAHUE del Distrito N° 3 de la Zona N° 8 de Scouts de Argentina Asociación Civil.`;

  y = drawJustifiedParagraph(doc, cuerpo, y, 10, margin, 1.5);

  y += 8;
  doc.setFont("helvetica", "bold").setFontSize(8.5);
  doc.text("A la autorización se debe adjuntar fotocopias de la Partida de Nacimiento del Menor y de frente y dorso del DNI, tanto del menor, como del autorizante y de otra documentación legal.", margin, y, { maxWidth: PAG_ANCHO - (margin * 2) });

  y += 20;
  drawSignatures(doc, y, { ...datos, aclaracionPadre: datos.tutorNombre, dniPadre: datos.tutorDni }, margin);

  y += 35;
  doc.setFont("helvetica", "normal").setFontSize(8);
  doc.text(`Formula aclaraciones sobre la situación de tenencia o guarda del menor (4):`, margin, y);
  y += 2;
  doc.setDrawColor(200); doc.rect(margin, y, PAG_ANCHO - (margin * 2), 15);
  if (datos.aclaracionTenencia) {
    doc.setFont("helvetica", "italic").text(datos.aclaracionTenencia, margin + 2, y + 6, { maxWidth: PAG_ANCHO - (margin * 2) - 4 });
  }

  y += 25;
  drawCenteredText(doc, "TESTIGOS (5)", y, 10, 'bold');
  doc.line(margin, y + 2, PAG_ANCHO - margin, y + 2);

  y += 15;
  const colW = (PAG_ANCHO - (margin * 2)) / 2;
  doc.setFont("helvetica", "normal").setFontSize(8.5);

  // 🎯 AVAL JEFE GRUPO (Columna Izquierda)
  if (scout.aval_jefe_firma) {
    doc.addImage(scout.aval_jefe_firma, 'PNG', margin + 15, y - 14, 30, 12);
  }
  doc.line(margin + 5, y, margin + colW - 5, y);
  doc.text("Firma Jefe de Grupo", margin + 5, y + 4);
  doc.text(`Aclaración: ${scout.aval_jefe_aclaracion || '.......................................'}`, margin + 5, y + 10);
  doc.text(`DNI: ${scout.aval_jefe_dni || '.................................................'}`, margin + 5, y + 14);


  // 🎯 AVAL EDUCADOR RAMA (Columna Derecha)
  const firmaEdu = scout.aval_educador_firma || scout.firmaDigitalImg; // Backwards compatible
  if (firmaEdu) {
    doc.addImage(firmaEdu, 'PNG', margin + colW + 15, y - 14, 30, 12);
  }
  doc.line(margin + colW + 5, y, PAG_ANCHO - margin - 5, y);
  doc.text(`Firma Educador de Rama (${scout.rama || '__________'})`, margin + colW + 5, y + 4);
  doc.text(`Aclaración: ${scout.aval_educador_aclaracion || scout.educadorAvalista || '.......................................'}`, margin + colW + 5, y + 10);
  doc.text(`DNI: ${scout.aval_educador_dni || scout.educadorDNI || '.................................................'}`, margin + colW + 5, y + 14);


  y = 265;
  doc.setFontSize(6);
  doc.text("1. Nombre y apellido completo de quien firma la autorización. / 2. Carácter: padre/madre/tutor/guardador. / 3. Nombre y apellido del menor.", margin, y);
  doc.text("4. Aclare situación judicial si corresponde. / 5. La autorización debe ser firmada ante al menos dos educadores del Grupo Scout.", margin, y + 3);
};