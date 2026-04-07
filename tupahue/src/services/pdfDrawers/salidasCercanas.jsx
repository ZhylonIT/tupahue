import { 
  drawHeader, drawSignatures, drawCenteredText, drawJustifiedParagraph, drawSectionTitle, 
  MARGEN_BASE, PAG_ANCHO
} from './common';

export const drawSalidasCercanasPage = (doc, scout, datos, margin = MARGEN_BASE) => {
  drawHeader(
    doc, 
    "AUTORIZACIÓN SALIDAS CERCANAS", 
    "Planilla Versión: 07-21 | www.scouts.org.ar", 
    "Distrito 3 - Zona 8 | Grupo Scout Tupahue 996", 
    margin
  );

  let y = 45;
  drawCenteredText(doc, "AUTORIZACIÓN ANUAL PARA SALIDAS CERCANAS", y, 12, 'bold');
  drawCenteredText(doc, `Grupo Scout Tupahue 996`, y + 5, 10, 'normal');

  y += 18;
  
  const cuerpo = `En la localidad de ${datos.localidad}, provincia de ${datos.provincia}, partido de ${datos.partido}, a los ${datos.dia} días del mes de ${datos.mes} del año ${datos.anio}, yo ${datos.tutorNombre} con DNI ${datos.tutorDni} con domicilio en ${datos.tutorDomicilio} y teléfono ${datos.tutorTelefono}, en mi carácter de ${datos.tutorVinculo}, OTORGO AUTORIZACIÓN PARA QUE EL/LA MENOR ${scout.nombre} ${scout.apellido} con DNI ${scout.dni} y domicilio en ${datos.scoutDomicilio}, para salir de la sede del Grupo Scout N° 996 del Distrito 3 (Zona 8) perteneciente a la Zona 8 de Scouts de Argentina Asociación Civil, durante el presente año ${datos.anio}.`;

  // 🎯 El drawer ahora envía el margen correcto
  y = drawJustifiedParagraph(doc, cuerpo, y, 10, margin, 1.5);

  y += 10; 
  const cuerpo2 = `Dichas actividades podrán ser: juegos por el barrio / localidad, visita a plazas, servicios y cualquier otra actividad fuera de la sede del grupo en un rango no mayor a ${datos.rangoDistancia}, siempre y cuando la salida no requiera pernocte. Dejo constancia que tengo conocimiento que para las actividades no abarcadas en esta autorización, los responsables del Organismo me pedirán autorización particular en cada caso. Asimismo, doy autorización para que el menor sea transportado por la Asociación por el medio de transporte que decida la Institución, comprometiéndome en caso de revocación a hacerlo saber por escrito.`;
  
  y = drawJustifiedParagraph(doc, cuerpo2, y, 10, margin, 1.5);

  y += 15;

  const anchoImprimible = PAG_ANCHO - (2 * margin);
  drawSectionTitle(doc, "IV. AVAL DE LOS RESPONSABLES SCOUTS", y, margin);
  y += 7;
  doc.setLineWidth(0.3);
  doc.rect(margin, y, anchoImprimible, 38);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  
  // Justificamos también el texto pequeño del aval
  const textoAval = "Certifico que el/la Menor posee el Legajo Personal completo según el capitulo 4, del Manual General de Normas de SAAC y que la persona que está otorgando autorización tiene su firma registrada en la autorización de ingreso.";
  doc.text(doc.splitTextToSize(textoAval, anchoImprimible - 6), margin + 3, y + 6, { align: "justify", maxWidth: anchoImprimible - 6 });
  
  doc.setFontSize(9);
  doc.text("Firma Educador: ___________________________", margin + 3, y + 20);
  doc.text("Aclaración: ___________________________", 110, y + 20);
  doc.text("DNI: ___________________________", margin + 3, y + 30);
  doc.text("Función: Jefe de Unidad/Grupo", 110, y + 30);

  // Firmas al pie en posición fija para evitar solapamientos
  drawSignatures(doc, 230, datos, margin); 
};