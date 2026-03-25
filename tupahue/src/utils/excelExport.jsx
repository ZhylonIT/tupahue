import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export const exportarNominaOficial = async (seleccionados, configRama, esVistaGlobal) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Nómina Oficial');
  
  // Estilo de bordes para toda la tabla
  const styleBorder = { 
    top: { style: 'thin' }, 
    left: { style: 'thin' }, 
    bottom: { style: 'thin' }, 
    right: { style: 'thin' } 
  };

  // 1. Títulos y Encabezados de Identificación
  worksheet.mergeCells('B1:F1');
  const mainTitle = worksheet.getCell('B1');
  mainTitle.value = 'NÓMINA DE PARTICIPANTES EN SALIDAS, ACANTONAMIENTOS Y/O CAMPAMENTOS';
  mainTitle.font = { bold: true, size: 11 };
  mainTitle.alignment = { horizontal: 'center', vertical: 'middle' };

  // Fila de Rama y Fecha
  worksheet.getCell('A3').value = 'RAMA';
  worksheet.getCell('A4').value = esVistaGlobal ? 'VARIAS' : configRama.nombre.toUpperCase();
  worksheet.getCell('E3').value = 'FECHA';
  worksheet.getCell('E4').value = new Date().toLocaleDateString();
  
  // Datos del Grupo (Tupahue 996 - D3 - Z8)
  worksheet.mergeCells('A5:F5');
  const groupData = worksheet.getCell('A5');
  groupData.value = 'Grupo-distrito-zona: Tupahue (996) - Distrito 3 - Zona 8';
  groupData.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'F2F2F2' } };
  groupData.font = { bold: true, size: 10 };

  // 2. Cabecera de la Tabla de Protagonistas
  const headerRow = worksheet.getRow(9);
  headerRow.values = ['N°', 'NOMBRE Y APELLIDO', 'FECHA DE NAC.', 'DNI', 'RELIGIÓN', 'CATEGORÍA'];
  
  headerRow.eachCell((c) => {
    c.font = { bold: true, color: { argb: 'FFFFFF' } };
    c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '2c3e50' } };
    c.alignment = { horizontal: 'center', vertical: 'middle' };
    c.border = styleBorder;
  });

  // 3. Carga de los Protagonistas seleccionados
  seleccionados.forEach((s, i) => {
    const row = worksheet.addRow([
      i + 1,
      `${s.apellido.toUpperCase()}, ${s.nombre}`,
      s.fechaNacimiento || '',
      s.dni,
      'CATÓLICA',
      'PROTAGONISTA'
    ]);

    row.eachCell((c) => {
      c.border = styleBorder;
      c.alignment = { horizontal: 'center', vertical: 'middle' };
      c.font = { size: 10 };
    });
  });

  // Ajuste de anchos de columna para que se vea prolijo
  worksheet.columns = [
    { width: 6 },  // N°
    { width: 35 }, // Nombre
    { width: 15 }, // Fecha Nac
    { width: 15 }, // DNI
    { width: 15 }, // Religión
    { width: 20 }  // Categoría
  ];

  // 4. Generación y descarga del archivo
  try {
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `Nomina_Oficial_${configRama.nombre.replace(/\s+/g, '_')}.xlsx`);
  } catch (error) {
    console.error("Error crítico al generar el Excel:", error);
    alert("No se pudo generar el archivo. Por favor, revisa la consola.");
  }
};