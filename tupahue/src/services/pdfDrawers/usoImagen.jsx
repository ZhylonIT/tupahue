import { 
  drawHeader, drawSignatures, drawCenteredText, drawJustifiedParagraph, 
  MARGEN_BASE 
} from './common';

export const drawUsoImagenPage = (doc, scout, datos, margin = MARGEN_BASE) => {
  // 1. ENCABEZADO OFICIAL
  drawHeader(
    doc, 
    "AUTORIZACIÓN USO DE IMAGEN", 
    "Planilla Versión: 07-21 | www.scouts.org.ar", 
    "Niños, Niñas y Jóvenes Menores de 18 años", 
    margin
  );

  let y = 45;

  // 2. TÍTULOS CENTRALES
  drawCenteredText(doc, "AUTORIZACIÓN USO DE IMAGEN", y, 12, 'bold');
  doc.line(65, y + 1, 145, y + 1);
  
  y += 12;

  // 3. DESTINATARIO
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("Sres.", margin, y);
  y += 5;
  doc.text("SCOUTS DE ARGENTINA ASOCIACION CIVIL", margin, y);
  y += 5;
  doc.setFont("helvetica", "normal");
  doc.text("Libertad 1282 C.A.B.A.", margin, y);

  y += 15;

  // 4. PREPARACIÓN DE DATOS
  const anio = datos.anio || new Date().getFullYear();
  const nombreScout = `${scout.nombre} ${scout.apellido}`.toUpperCase();
  
  // Normalizamos nombres para el párrafo
  const nombreTutor = (datos.tutorNombre || "___________________________").toUpperCase();
  const dniTutor = datos.tutorDni || "___________";
  const domicilioTutor = datos.tutorDomicilio || "______________________________________";

  // 🎯 MAPEADO CRÍTICO PARA drawSignatures:
  // drawSignatures suele buscar 'aclaracionPadre' y 'dniPadre'. 
  // Se los inyectamos al objeto datos para que el motor de firmas los encuentre.
  const datosFirmas = {
    ...datos,
    aclaracionPadre: datos.tutorNombre,
    dniPadre: datos.tutorDni,
    fechaFirmaPadre: datos.fechaFirmaPadre || new Date().toLocaleDateString('es-AR')
  };

  const cuerpo1 = `Por medio de la presente, yo ${nombreTutor} con DNI ${dniTutor}, domiciliado/a en ${domicilioTutor} y en mi carácter de Padre/Madre/Tutor/Curador, autorizo a SCOUTS DE ARGENTINA ASOCIACION CIVIL ("SAAC"), a utilizar de manera amplia, irrestricta y gratuita las imágenes del/la menor ${nombreScout} con DNI ${scout.dni}, que sean tomadas en el año ${anio} en las Actividades Scouts (en adelante, las "Imágenes"), sin limitación temporal alguna y/o geográfica, para su almacenamiento, transmisión, uso, reproducción, comunicación pública, difusión, publicación y/o edición en cualquier tipo de formato, soporte y/o medio de difusión, producto gráfico y/o audiovisual, vinculado directa y/o indirectamente con la promoción, difusión y conocimiento de sus actividades, productos y/u objetivos de SAAC (incluyendo, pero no limitado a medios audiovisuales, redes sociales, internet, medios gráficos impresos, existente y/o a desarrollarse en el futuro).`;

  y = drawJustifiedParagraph(doc, cuerpo1, y, 10, margin, 1.6);

  y += 8;

  const cuerpo2 = `Asimismo, dejo constancia de que he explicado al/a la menor ${nombreScout} sobre las características y alcance de la presente autorización y que renuncio expresa e irrevocablemente a todo y cualquier tipo de reclamo contra SAAC, sus directores, autoridades y miembros en relación a los derechos autorizados por medio de la presente sobre las Imágenes y/o a percibir cualquier suma en concepto de indemnización o remuneración por los usos autorizados precedentemente indicados, relevando a SAAC de cualquier responsabilidad al respecto.`;

  y = drawJustifiedParagraph(doc, cuerpo2, y, 10, margin, 1.6);

  // 5. SECCIÓN DE FIRMAS (Ahora con los datos mapeados)
  drawSignatures(doc, 230, datosFirmas, margin);

  // 6. PIE DE PÁGINA
  const footerY = 275;
  doc.setDrawColor(0, 91, 150);
  doc.setLineWidth(0.5);
  doc.line(margin, footerY, 210 - margin, footerY);
  
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.text("MIEMBRO DE LA ORGANIZACIÓN MUNDIAL DEL MOVIMIENTO SCOUT", 105, footerY + 5, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.text("Scouts de Argentina Asociación Civil - Personería Jurídica Nacional N° 1645416 - CUIT 30-69732250-3", 105, footerY + 9, { align: "center" });
};