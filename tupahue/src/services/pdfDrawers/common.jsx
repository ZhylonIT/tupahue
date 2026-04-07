import jsPDF from 'jspdf';
import logoSAAC from '../../assets/images/Logo_SAAC.png';

export const PAG_ANCHO = 210; 
export const PAG_ALTO = 297;  
export const CENTRO_X = 105;  
export const MARGEN_BASE = 20; 

export const drawCenteredText = (doc, text, y, fontSize, fontType = 'normal') => {
  doc.setFontSize(fontSize);
  doc.setFont("helvetica", fontType);
  doc.text(text, CENTRO_X, y, { align: "center" });
};

export const drawJustifiedParagraph = (doc, text, y, fontSize, margin = MARGEN_BASE, lineHeightFactor = 1.5) => {
  doc.setFontSize(fontSize);
  doc.setFont("helvetica", "normal");
  const anchoImprimible = PAG_ANCHO - (margin * 2);
  const lineas = doc.splitTextToSize(text, anchoImprimible);
  doc.text(lineas, margin, y, { 
    align: "justify", lineHeightFactor: lineHeightFactor, maxWidth: anchoImprimible 
  });
  const altoLinea = (fontSize * 25.4) / 72;
  return y + (lineas.length * altoLinea * lineHeightFactor);
};

export const drawHeader = (doc, title, subtitle, infoExtra, margin = MARGEN_BASE) => {
  // 🎯 Agregamos el parámetro 'FAST' para comprimir el logo al insertarlo
  try { doc.addImage(logoSAAC, 'PNG', margin, 10, 45, 18, undefined, 'FAST'); } catch (e) {}
  drawCenteredText(doc, title, 15, 14, 'bold');
  drawCenteredText(doc, subtitle, 21, 10, 'normal');
  drawCenteredText(doc, infoExtra, 26, 8, 'normal');
};

export const drawSignatures = (doc, y, data, margin = MARGEN_BASE) => {
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("Declaro bajo juramento que toda la información aportada es verídica.", margin, y);
  
  if (data.firmaPadre) {
    try { 
      // 🎯 Clave: Forzamos formato 'JPEG' y compresión 'FAST' para la firma. 
      // Esto reduce el Base64 gigante a una fracción de su peso.
      doc.addImage(data.firmaPadre, 'JPEG', margin + 5, y + 2, 40, 15, undefined, 'FAST'); 
    } catch (e) {
      console.error("Error firma PDF:", e);
    }
  }
  
  doc.line(margin, y + 18, margin + 65, y + 18);
  doc.setFont("helvetica", "bold");
  doc.text("Firma Adulto Responsable", margin + 10, y + 22);
  
  const datosX = CENTRO_X + 5;
  doc.setFontSize(9);
  doc.text(`Aclaración: ${data.aclaracionPadre || ''}`, datosX, y + 8);
  doc.text(`DNI: ${data.dniPadre || ''}`, datosX, y + 14);
  doc.text(`Fecha: ${data.fechaFirmaPadre || new Date().toLocaleDateString()}`, datosX, y + 20);
};

export const drawSectionTitle = (doc, title, y, margin = MARGEN_BASE) => {
  doc.setFillColor(240, 240, 240);
  const ancho = PAG_ANCHO - (2 * margin);
  doc.rect(margin, y, ancho, 7, 'F');
  doc.rect(margin, y, ancho, 7, 'S');
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text(title, margin + 3, y + 5);
};