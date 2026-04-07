import jsPDF from 'jspdf';
import { MARGEN_BASE } from './pdfDrawers/common';
import { drawFichaMedicaPage } from './pdfDrawers/fichaMedica';
import { drawFichaPersonalesPage } from './pdfDrawers/fichaPersonales';
import { drawSalidasCercanasPage } from './pdfDrawers/salidasCercanas';

// 🎯 Configuración para PDFs livianos y vectoriales
const pdfConfig = {
  orientation: 'p',
  unit: 'mm',
  format: 'a4',
  compress: true 
};

// --- GENERADOR: FICHA MÉDICA ---
export const generarFichaMedicaPDF = (scout, returnBlob = false) => {
  const doc = new jsPDF(pdfConfig);
  // Usamos el scout.datosMedicos completo que tiene la firma inyectada
  drawFichaMedicaPage(doc, scout, scout.datosMedicos || {}, MARGEN_BASE);
  
  if (returnBlob) return doc.output('blob');
  doc.save(`FichaMedica_${scout.apellido}_${scout.nombre}.pdf`);
};

// --- GENERADOR: FICHA DATOS PERSONALES ---
export const generarFichaPersonalesPDF = (scout, returnBlob = false) => {
  const doc = new jsPDF(pdfConfig);
  drawFichaPersonalesPage(doc, scout, scout.datosPersonales || {}, MARGEN_BASE);
  
  if (returnBlob) return doc.output('blob');
  doc.save(`FichaPersonales_${scout.apellido}_${scout.nombre}.pdf`);
};

// --- GENERADOR: SALIDAS CERCANAS ---
export const generarSalidasCercanasPDF = (scout, returnBlob = false) => {
  const doc = new jsPDF(pdfConfig);
  drawSalidasCercanasPage(doc, scout, scout.datosSalidas || {}, MARGEN_BASE);
  
  if (returnBlob) return doc.output('blob');
  doc.save(`AutorizacionSalidas_${scout.apellido}_${scout.nombre}.pdf`);
};