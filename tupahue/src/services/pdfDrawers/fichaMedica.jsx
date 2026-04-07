import logoSAAC from '../../assets/images/Logo_SAAC.png';

export const drawFichaMedicaPage = (doc, scout, dm, inputMargin) => {
  // 🎯 CORRECCIÓN CRÍTICA: Ignoramos el margen de 20mm de common.js.
  // Forzamos 10mm para que la matemática de las dos columnas cierre perfecto.
  const margin = 10; 
  const w = 190; // Ancho total imprimible (210 - 20)
  const colW = 95; // Mitad exacta
  const halfColW = 47.5; // Cuarto exacto para DNI, Zona, etc.
  const col1X = margin; // Inicia en 10
  const col2X = margin + colW; // Inicia en 105 exacto

  // --- HELPERS PARA IMITAR MATERIAL UI GRID ---
  const rowCheck = (label, value, x, y, width, bgColor = null) => {
    if (bgColor) {
        doc.setFillColor(...bgColor);
        doc.rect(x, y, width, 5.5, 'FD');
    } else {
        doc.setDrawColor(0); 
        doc.rect(x, y, width, 5.5);
    }
    doc.setFont("helvetica", "normal"); doc.setFontSize(8);
    doc.text(label, x + 2, y + 4);
    doc.setFont("helvetica", "bold");
    doc.text(value ? 'SI' : 'NO', x + width - 8, y + 4);
  };

  const rowText = (label, value, x, y, width) => {
    doc.setDrawColor(0); doc.rect(x, y, width, 5.5);
    doc.setFont("helvetica", "normal"); doc.setFontSize(8);
    doc.text(label, x + 2, y + 4);
    if (value) {
       doc.setFont("helvetica", "bold");
       const lw = doc.getTextWidth(label + " ");
       doc.text(String(value), x + lw + 2, y + 4, { maxWidth: width - lw - 3 });
    }
  };

  // 1. ENCABEZADO
  try { doc.addImage(logoSAAC, 'PNG', margin, margin, 45, 15, undefined, 'FAST'); } catch (e) {}
  
  doc.setFont("helvetica", "bold"); doc.setFontSize(12);
  doc.text("FORMULARIO DE INFORMACIÓN DE SALUD", 105, 13, { align: "center" });
  doc.setFontSize(9); doc.setFont("helvetica", "normal");
  doc.text("Planilla Versión: 01-25", 105, 18, { align: "center" });
  doc.setFontSize(8);
  doc.text("www.scouts.org.ar", 105, 22, { align: "center" });
  
  doc.setFillColor(245, 245, 245);
  doc.rect(55, 24, 100, 10, 'FD');
  doc.setFont("helvetica", "bold"); doc.setFontSize(8);
  doc.text("DECLARACIÓN JURADA DE SALUD", 105, 28, { align: "center" });
  doc.setFont("helvetica", "normal"); doc.setFontSize(6.5);
  doc.text("Los Datos consignados en la presente tienen carácter de declaración jurada por el firmante", 105, 32, { align: "center" });

  // 2. DATOS PERSONALES
  let y = 38;
  rowText("Apellido:", scout.apellido?.toUpperCase(), col1X, y, colW);
  rowText("Nombre:", scout.nombre, col2X, y, colW);
  
  y += 5.5;
  rowText("Fecha de nacimiento:", scout.fechaNacimiento || scout.fecha_nacimiento, col1X, y, colW);
  rowText("De haber realizado un control médico indique fecha:", dm.fechaControl, col2X, y, colW);
  
  y += 5.5;
  rowText("D.N.I:", scout.dni, col1X, y, halfColW);
  rowText("N° Zona:", "8", col1X + halfColW, y, halfColW);
  rowText("N° Distrito:", "3", col2X, y, halfColW);
  rowText("N° Grupo:", "996", col2X + halfColW, y, halfColW);
  
  y += 5.5;
  rowText("Domicilio:", dm.domicilio, col1X, y, w);
  
  y += 5.5;
  rowText("Teléfono para Emergencia 1:", dm.telEmergencia1, col1X, y, colW);
  rowText("Teléfono para Emergencia 2:", dm.telEmergencia2, col2X, y, colW);

  y += 9;
  doc.setFontSize(7.5);
  doc.text("La información que Ud. se dispone a llenar y que acompañará a su hijo/a o a usted durante todas las actividades, contempla una serie de datos y antecedentes que orientarán al personal de salud actuante en caso de necesidad.", margin, y, { maxWidth: w, align: "justify" });

  // 3. GRILLAS
  y += 6;
  const startColsY = y;

  // --- COLUMNA IZQ ---
  doc.setFont("helvetica", "bold"); doc.setFontSize(8);
  doc.text("Conteste las siguientes situaciones (Indicar con SI o NO)", col1X, y);
  
  let yIzq = y + 2;
  const situaciones = [
    ["Tiene hemorragias nasales", dm.hemorragias], ["Sangran sus encías al cepillarse", dm.encias],
    ["Tiene dolor de cabeza", dm.dolorCabeza], ["Sufre presión alta", dm.presionAlta],
    ["Sufre presión baja", dm.presionBaja], ["Recibió transfusiones de sangre", dm.transfusiones],
    ["Ha tenido convulsiones", dm.convulsiones], ["Tuvo cirugías en el último año", dm.cirugias],
    ["Tuvo internaciones en el último año", dm.internaciones], ["Realiza actividad física", dm.actividadFisica],
    ["Puede realizar cualquier actividad física", dm.cualquierActividad]
  ];
  situaciones.forEach(s => { rowCheck(s[0], s[1], col1X, yIzq, colW); yIzq += 5.5; });

  yIzq += 2;
  doc.rect(col1X, yIzq, colW, 12);
  doc.setFont("helvetica", "normal"); doc.setFontSize(7.5);
  doc.text("Si su respuesta fue NO especifique debajo:", col1X + 2, yIzq + 4);
  doc.setFont("helvetica", "bold"); doc.setFontSize(8);
  doc.text(dm.motivoNoActividad || '', col1X + 2, yIzq + 9, { maxWidth: colW - 4 });

  yIzq += 17;
  doc.setFont("helvetica", "bold"); doc.setFontSize(8);
  doc.text("Vacunas | Ultima Dosis", col1X, yIzq);
  yIzq += 2;
  rowText("Quintuple:", dm.vacunaQuintuple, col1X, yIzq, colW); yIzq += 5.5;
  rowText("Triple Bacteriana Celular:", dm.vacunaTripleCelular, col1X, yIzq, colW); yIzq += 5.5;
  rowText("Triple Bacteriana Acelular:", dm.vacunaTripleAcelular, col1X, yIzq, colW); yIzq += 5.5;
  rowText("Doble Bacteriana:", dm.vacunaDoble, col1X, yIzq, colW); yIzq += 5.5;
  rowCheck("Calendario de vacunación completo", dm.calendarioCompleto, col1X, yIzq, colW); yIzq += 5.5;
  rowCheck("No tiene las vacunas mencionadas", dm.noTieneVacunas, col1X, yIzq, colW); yIzq += 5.5;
  rowCheck("No sabe/no contesta", dm.noSabeVacunas, col1X, yIzq, colW);

  // --- COLUMNA DER ---
  let yDer = startColsY + 2;
  rowText("Grupo Sanguíneo:", dm.grupoSanguineo, col2X, yDer, halfColW);
  rowText("Factor RH:", dm.factorRh, col2X + halfColW, yDer, halfColW);
  yDer += 5.5;
  rowText("Peso (Kg):", dm.peso, col2X, yDer, halfColW);
  rowText("Talla (m):", dm.talla, col2X + halfColW, yDer, halfColW);
  
  yDer += 8;
  const clinica = [
    ["¿Toma alguna medicación? SI/NO ¿Cuál?", dm.medicacion ? `SI - ${dm.cualMedicacion}` : 'NO'],
    ["¿Padece alguna enfermedad crónica? SI/NO ¿Cuál?", dm.cronica ? `SI - ${dm.cualCronica}` : 'NO'],
    ["¿Requiere tratamiento? SI/NO ¿Cuál?", dm.tratamiento ? `SI - ${dm.cualTratamiento}` : 'NO'],
    ["¿Tiene CUD?", dm.cud ? 'SI' : 'NO'],
    ["¿Sufre alguna alergia? SI/NO ¿Cuál?", dm.alergia ? `SI - ${dm.cualAlergia}` : 'NO'],
    ["¿Está anticoagulado? SI/NO ¿Droga?", dm.anticoagulado ? `SI - ${dm.drogaAnticoagulante}` : 'NO'],
    ["¿Sigue régimen dietario especial? SI/NO", dm.dieta ? `SI - ${dm.cualDieta}` : 'NO'],
    ["¿Ha tenido ataques de pánico? Frecuencia", dm.panico ? `SI - ${dm.frecuenciaPanico}` : 'NO'],
    ["¿Diagnóstico de salud mental? SI/NO ¿Cuál?", dm.saludMental ? `SI - ${dm.cualSaludMental}` : 'NO'],
    ["Recibe tratamiento SI/NO ¿Cuál?", dm.tratamientoMental ? `SI - ${dm.cualTratamientoMental}` : 'NO'],
    ["¿Tiene algún miedo excesivo o fobia?", dm.fobia ? 'SI' : 'NO']
  ];
  clinica.forEach(c => { rowText(c[0], c[1], col2X, yDer, colW); yDer += 5.5; });

  yDer += 2;
  rowCheck("¿Adjunta certificado de aptitud médica?", dm.adjuntaCertificado, col2X, yDer, colW, [245, 245, 245]);
  yDer += 5.5;
  rowCheck("¿Desea que un educador se comunique?", dm.hablarEducador, col2X, yDer, colW, [245, 245, 245]);

  // 4. OBRA SOCIAL
  y = Math.max(yIzq, yDer + 5.5) + 6;
  rowText("Obra Social o Prepaga:", dm.obraSocial, col1X, y, w);
  y += 5.5;
  rowText("Credencial N°:", dm.nroCredencial, col1X, y, colW);
  rowText("Tel. Emergencia Obra Social:", dm.telObraSocial, col2X, y, colW);

  // 5. FIRMA
  y += 10;
  doc.setFont("helvetica", "normal"); doc.setFontSize(7.5);
  doc.text("Declaro bajo juramento que toda la información aquí aportada es verídica y de sufrir alguna modificación de los datos o de hechos nuevos, asumo el compromiso de informarla a la brevedad.", margin, y, { maxWidth: w, align: "justify" });

  y += 15;
  if (dm.firmaPadre) {
    try { doc.addImage(dm.firmaPadre, 'JPEG', margin + 15, y - 8, 40, 15, undefined, 'FAST'); } catch (e) {}
  }
  doc.setDrawColor(0);
  doc.line(margin, y + 8, margin + 70, y + 8);
  doc.setFont("helvetica", "bold"); doc.setFontSize(7);
  doc.text("Firma Adulto/Madre/Padre/Tutor", margin + 15, y + 12);

  const colFirmaDer = 120;
  rowText("Aclaración:", dm.aclaracionPadre, colFirmaDer, y - 8, 80);
  rowText("DNI:", dm.dniPadre, colFirmaDer, y - 2.5, 80);
  rowText("Fecha:", dm.fechaFirmaPadre || new Date().toLocaleDateString('es-AR'), colFirmaDer, y + 3, 80);
};