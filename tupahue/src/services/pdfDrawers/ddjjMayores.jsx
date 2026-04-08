import { 
  drawHeader, drawSignatures, drawCenteredText, drawJustifiedParagraph, 
  MARGEN_BASE, PAG_ANCHO 
} from './common';

export const drawDdjjMayoresPage = (doc, scout, datos, margin = MARGEN_BASE) => {
  drawHeader(
    doc, 
    "Declaración Jurada para Participación de Jóvenes", 
    "Mayores de 18 años en Salidas – Acantonamientos - Campamentos", 
    "Planilla Versión: 07-21 | www.scouts.org.ar", 
    margin
  );

  let y = 45;

  drawCenteredText(doc, "DECLARACIÓN JURADA PARA PARTICIPACIÓN DE", y, 11, 'bold');
  drawCenteredText(doc, "JÓVENES MAYORES DE 18 AÑOS EN", y + 5, 11, 'bold');
  drawCenteredText(doc, "SALIDAS – ACANTONAMIENTOS – CAMPAMENTOS", y + 10, 11, 'bold');
  
  y += 22;

  const nombreScout = `${scout.nombre} ${scout.apellido}`.toUpperCase();
  const fDesde = datos.fechaDesde ? datos.fechaDesde.split('-').reverse().join('/') : '___/___/___';
  const fHasta = datos.fechaHasta ? datos.fechaHasta.split('-').reverse().join('/') : '___/___/___';

  const cuerpo = `En la localidad de ${datos.localidad || '__________'}, provincia de ${datos.provincia || '__________'}, partido / departamento de ${datos.partido || '__________'}, a los ${new Date().getDate()} días del mes de ${new Date().toLocaleString('es-AR', {month: 'long'})} del año ${new Date().getFullYear()}, yo (1) ${nombreScout} de nacionalidad ${datos.scoutNacionalidad || 'Argentina'}, nacido/a el ${scout.fechaNacimiento || '___/___/_____'} de ${scout.dni || '__________'} DNI, Teléfono: ${scout.telefono || '__________'} y con domicilio en ${datos.scoutDomicilio || '____________________'} siendo mayor de edad, participaré de la SALIDA / ACANTONAMIENTO / CAMPAMENTO (tachar lo que no corresponda). Desde el día ${fDesde} Hasta el día ${fHasta} en el lugar ubicado en ${datos.lugarDestino || '__________'}, ${datos.ubicacionDestino || '__________'}, acompañado de sus educadores/as pertenecientes al Grupo Scout N° 996 Nombre TUPAHUE del Distrito N° 3 de la Zona 8 de Scouts de Argentina Asociación Civil.`;

  y = drawJustifiedParagraph(doc, cuerpo, y, 10, margin, 1.5);

  y += 10;

  doc.setFont("helvetica", "bold");
  doc.text(`Utilizaré el medio de transporte contratado por el Grupo Scout: ${datos.usaTransporteGrupo ? 'SI' : 'NO'}`, margin, y);
  y += 6;
  if (!datos.usaTransporteGrupo) {
    doc.setFont("helvetica", "normal");
    doc.text(`En caso de NO utilizar los transportes contratados por el Grupo Scout:`, margin, y);
    y += 5;
    doc.text(`Medio de transporte a utilizar: ${datos.transportePropio || '____________________'}`, margin, y);
    y += 5;
    doc.text(`Día y horario de llegada: ${datos.horarioLlegada || '__________'}  Día y horario de retiro: ${datos.horarioRetiro || '__________'}`, margin, y);
    y += 5;
    doc.text(`Teléfono Celular para contacto: ${datos.telContacto || '__________'}`, margin, y);
    y += 8;
  } else {
    y += 5;
  }

  const compromisos = `Asimismo, informo que:\n1) Notificaré a mi padre/madre de las actividades que realizaré y el lugar donde se desarrollarán las mismas.\n2) A los efectos de la organización interna de Scouts de Argentina Asociación Civil y evaluar la cobertura de las Pólizas contratadas por esta entidad, daré notificación a mi Jefe/a de Unidad o Jefe/a de Grupo de las actividades a realizar.`;
  y = drawJustifiedParagraph(doc, compromisos, y, 9, margin, 1.4);

  y += 25;
  const datosFirmas = {
    ...datos,
    aclaracionPadre: nombreScout, 
    dniPadre: scout.dni,
    firmaPadre: scout.firma_url || datos.firmaJoven 
  };
  drawSignatures(doc, y, datosFirmas, margin);

  // 🎯 CAJA DE AVAL ORDENADA
  y += 45;
  const recuadroAncho = PAG_ANCHO - (margin * 2);
  doc.setDrawColor(0);
  doc.rect(margin, y, recuadroAncho, 45); // Agrandamos
  doc.setFont("helvetica", "bold");
  doc.text("AVAL DE LOS RESPONSABLES SCOUTS (2)", margin + 5, y + 6);
  doc.setFont("helvetica", "normal");
  doc.text(`Certifico que el/la miembro Beneficiario/a, posee el Legajo Personal completo según el capítulo 4 del Manual General de Normas de SAAC.`, margin + 5, y + 12, { maxWidth: recuadroAncho - 10 });

  // 🎯 Imagen en el medio
  if (scout.firmaDigitalImg) {
    doc.addImage(scout.firmaDigitalImg, 'PNG', margin + 15, y + 16, 35, 14);
  }

  // 🎯 Datos abajo
  doc.text("Firma: ___________________________", margin + 5, y + 34);
  doc.text(`Aclaración: ${scout.educadorAvalista || '___________________________'}`, margin + 85, y + 34);
  doc.text(`DNI: ${scout.educadorDNI || '___________________________'}`, margin + 5, y + 42);
  doc.text("Función en el Grupo Scout: Educador/a Responsable", margin + 85, y + 42);
};