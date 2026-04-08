import { 
  drawHeader, drawSignatures, drawCenteredText, drawJustifiedParagraph, 
  MARGEN_BASE, PAG_ANCHO 
} from './common';

export const drawAutorizacionEventoPage = (doc, scout, datos, margin = MARGEN_BASE) => {
  drawHeader(
    doc, 
    "Autorización de Padres / Madres / Tutores", 
    "para Salidas, Acantonamientos y/o Campamentos", 
    "Planilla Versión: 07-21 | www.scouts.org.ar", 
    margin
  );

  let y = 45;

  drawCenteredText(doc, "AUTORIZACIÓN DE PADRES / MADRES / TUTORES", y, 11, 'bold');
  drawCenteredText(doc, `PARA ${datos.tipoActividad || 'SALIDAS, ACANTONAMIENTOS Y/O CAMPAMENTOS'}`, y + 5, 11, 'bold');
  
  y += 18;

  const tutor = datos.tutorInfo || {};
  const nombreTutor = (tutor.nombre || "___________________________").toUpperCase();
  const nombreScout = `${scout.nombre} ${scout.apellido}`.toUpperCase();
  
  const fDesde = datos.fechaDesde ? datos.fechaDesde.split('-').reverse().join('/') : '___/___/___';
  const fHasta = datos.fechaHasta ? datos.fechaHasta.split('-').reverse().join('/') : '___/___/___';

  const cuerpo = `En la localidad de ${datos.localidad || '__________'}, provincia de ${datos.provincia || '__________'}, partido / departamento de ${datos.partido || '__________'}, a los ${new Date().getDate()} días del mes de ${new Date().toLocaleString('es-AR', {month: 'long'})} del año ${new Date().getFullYear()}, yo (1) ${nombreTutor} de nacionalidad ${tutor.nacionalidad || 'Argentina'} nacido/a el ${tutor.nacimiento || '___/___/_____'} DNI ${tutor.dni || '__________'} Teléfono: ${tutor.tel || '__________'} y con domicilio en ${tutor.domicilio || '____________________'} en mi carácter de (2) ${tutor.vinculo || '__________'} OTORGO AUTORIZACIÓN PARA QUE EL / LA MENOR (3) ${nombreScout} nacido/a el ${scout.fechaNacimiento || '___/___/_____'} y DNI ${scout.dni || '__________'} con domicilio en ${tutor.domicilio || '____________________'} para que realice la ${datos.tipoActividad || 'ACTIVIDAD'} desde el día ${fDesde} hasta el día ${fHasta} en el lugar ubicado en ${datos.lugarDestino || '__________'}, ${datos.ubicacionDestino || '__________'} acompañado de sus educadores/as pertenecientes al Grupo Scout N° 996 Nombre TUPAHUE del Distrito N° 3 de la Zona 8 de Scouts de Argentina Asociación Civil.`;

  y = drawJustifiedParagraph(doc, cuerpo, y, 10, margin, 1.5);

  y += 10;
  const legalText = `Asimismo, doy autorización: 1) Para que los/las responsables de las actividades tomen, en caso de accidente o enfermedad todas las medidas necesarias para salvaguardar la integridad y la salud del / la menor. 2) Para realizar cualquier intervención quirúrgica de urgencia que así lo requiera la integridad y la salud del / la menor, 3) Que el menor sea transportado por la Asociación desde y hasta el lugar donde se realice la actividad autorizada por el medio de transporte que decida la Institución, dando conformidad para que se realicen los trámites y gestiones inherentes a cada viaje, ante las autoridades pertinentes y empresas de transporte, comprometiéndome en caso de revocación a hacerlo saber a las autoridades correspondientes y por escrito.`;

  y = drawJustifiedParagraph(doc, legalText, y, 9, margin, 1.4);

  y += 20;
  const datosFirmas = {
    ...datos,
    aclaracionPadre: tutor.nombre,
    dniPadre: tutor.dni,
    firmaPadre: datos.firmaPadre 
  };
  drawSignatures(doc, y, datosFirmas, margin);

  // 🎯 CAJA DE AVAL ORDENADA
  y += 50; 
  doc.setDrawColor(0);
  doc.setLineWidth(0.3);
  
  const recuadroAncho = PAG_ANCHO - (margin * 2);
  doc.rect(margin, y, recuadroAncho, 45); 

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("AVAL DE LOS RESPONSABLES SCOUTS (4)", margin + 5, y + 6);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  
  const avalText = `Certifico que el/la Menor registrado/a en la categoría de Protagonista, posee el Legajo Personal completo según el capitulo 4, del Manual General de Normas de SAAC y que la persona que está otorgando autorización tiene su firma registrada en la "AUTORIZACIÓN DE INGRESO DE NIÑOS, NIÑAS Y JÓVENES MENORES DE 18 AÑOS".-`;

  const anchoTextoInterno = recuadroAncho - 10;
  doc.text(doc.splitTextToSize(avalText, anchoTextoInterno), margin + 5, y + 12, { align: 'justify', maxWidth: anchoTextoInterno });

  // 🎯 Firma en el espacio del medio
  if (scout.firmaDigitalImg) {
    doc.addImage(scout.firmaDigitalImg, 'PNG', margin + 15, y + 18, 35, 14);
  }

  // 🎯 Columnas inferiores para datos
  let yF = y + 34;
  const colX = margin + (recuadroAncho * 0.55); 
  doc.text("Firma: ___________________________", margin + 5, yF);
  doc.text(`Aclaración: ${scout.educadorAvalista || '.............................................'}`, colX, yF);
  doc.text(`DNI: ${scout.educadorDNI || '...........................'}`, margin + 5, yF + 8);
  doc.text("Función: Educador/a Responsable", colX, yF + 8);

  const footerY = 278;
  doc.setDrawColor(0, 91, 150);
  doc.setLineWidth(0.5);
  doc.line(margin, footerY, 210 - margin, footerY);
  
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.text("MIEMBRO DE LA ORGANIZACIÓN MUNDIAL DEL MOVIMIENTO SCOUT", 105, footerY + 5, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.text("Scouts de Argentina Asociación Civil - CUIT 30-69732250-3 - Libertad 1282, CABA.", 105, footerY + 9, { align: "center" });
};