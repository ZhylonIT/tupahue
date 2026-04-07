import jsPDF from 'jspdf';
import { MARGEN_BASE } from './pdfDrawers/common';
import { drawFichaMedicaPage } from './pdfDrawers/fichaMedica';
import { drawFichaPersonalesPage } from './pdfDrawers/fichaPersonales';
import { drawSalidasCercanasPage } from './pdfDrawers/salidasCercanas';
import { drawUsoImagenPage } from './pdfDrawers/usoImagen';
import { drawFichaIngresoPage } from './pdfDrawers/fichaIngreso';
import { drawAutorizacionEventoPage } from './pdfDrawers/autorizacionEvento';
import { drawDdjjMayoresPage } from './pdfDrawers/ddjjMayores'; // 🎯 Importamos el nuevo drawer

const pdfConfig = {
  orientation: 'p',
  unit: 'mm',
  format: 'a4',
  compress: true 
};

// ---FICHA MÉDICA ---
export const generarFichaMedicaPDF = (scout, returnBlob = false) => {
  const doc = new jsPDF(pdfConfig);
  drawFichaMedicaPage(doc, scout, scout.datosMedicos || {}, MARGEN_BASE);
  if (returnBlob) return doc.output('blob');
  doc.save(`FichaMedica_${scout.apellido}_${scout.nombre}.pdf`);
};

// ---FICHA DATOS PERSONALES ---
export const generarFichaPersonalesPDF = (scout, returnBlob = false) => {
  const doc = new jsPDF(pdfConfig);
  drawFichaPersonalesPage(doc, scout, scout.datosPersonales || {}, MARGEN_BASE);
  if (returnBlob) return doc.output('blob');
  doc.save(`FichaPersonales_${scout.apellido}_${scout.nombre}.pdf`);
};

// ---SALIDAS CERCANAS ---
export const generarSalidasCercanasPDF = (scout, returnBlob = false) => {
  const doc = new jsPDF(pdfConfig);
  drawSalidasCercanasPage(doc, scout, scout.datosSalidas || {}, MARGEN_BASE);
  if (returnBlob) return doc.output('blob');
  doc.save(`AutorizacionSalidas_${scout.apellido}_${scout.nombre}.pdf`);
};

// ---USO DE IMAGEN ---
export const generarUsoImagenPDF = (scout, returnBlob = false) => {
  const doc = new jsPDF(pdfConfig);
  drawUsoImagenPage(doc, scout, scout.datosImagen || {}, MARGEN_BASE);
  if (returnBlob) return doc.output('blob');
  doc.save(`AutorizacionImagen_${scout.apellido}_${scout.nombre}.pdf`);
};

// ---FICHA DE INGRESO ---
export const generarFichaIngresoPDF = (scout, returnBlob = false) => {
  const doc = new jsPDF(pdfConfig);
  drawFichaIngresoPage(doc, scout, scout.datosIngreso || {}, MARGEN_BASE);
  if (returnBlob) return doc.output('blob');
  doc.save(`AutorizacionIngreso_${scout.apellido}_${scout.nombre}.pdf`);
};

// ---AUTORIZACIÓN DE EVENTO (MENORES) ---
export const generarAutorizacionEventoPDF = (scout, returnBlob = false) => {
  const doc = new jsPDF(pdfConfig);
  drawAutorizacionEventoPage(doc, scout, scout.datosEvento || {}, MARGEN_BASE);
  if (returnBlob) return doc.output('blob');
  doc.save(`AutorizacionEvento_${scout.apellido}_${scout.nombre}.pdf`);
};

// ---🎯 DECLARACIÓN JURADA MAYORES (ROVERS) ---
export const generarDdjjMayoresPDF = (scout, returnBlob = false) => {
  const doc = new jsPDF(pdfConfig);
  drawDdjjMayoresPage(doc, scout, scout.datosEvento || {}, MARGEN_BASE);
  if (returnBlob) return doc.output('blob');
  doc.save(`DDJJ_Participacion_${scout.apellido}_${scout.nombre}.pdf`);
};