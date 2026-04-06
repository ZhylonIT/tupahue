import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { generarFichaMedicaPDF } from './pdfGeneradorFichas';
import { supabase } from '../lib/supabaseClient';

/**
 * Crea un archivo .ZIP con toda la documentación de los scouts seleccionados
 */
export const descargarZipLegajos = async (listaScouts, nombreZip = "Legajos_Tupahue") => {
  const zip = new JSZip();

  const tareas = listaScouts.map(async (scout) => {
    // Creamos una subcarpeta por cada joven
    const carpetaJoven = zip.folder(`${scout.apellido}_${scout.nombre}`);

    // 1. Generamos la Ficha Médica Digital (Opción A)
    const pdfMedicaBlob = generarFichaMedicaPDF(scout, true);
    carpetaJoven.file("Ficha_Medica_Digital.pdf", pdfMedicaBlob);

    // 2. Descargamos archivos reales del Storage de Supabase
    if (scout.documentos && scout.documentos.length > 0) {
      for (const docId of scout.documentos) {
        // Solo intentamos bajar del storage los que son archivos físicos (Fotos/PDFs externos)
        if (['fotocopias_dni', 'partida_nacimiento', 'ficha_medica_pdf'].includes(docId)) {
          try {
            const folderPath = `${scout.id}/${docId}`;
            const { data: fileList } = await supabase.storage.from('documentos').list(folderPath);
            
            // Filtramos archivos ocultos o vacíos
            const archivoReal = fileList?.find(f => f.name !== '.emptyFolderPlaceholder');

            if (archivoReal) {
              const { data: blob, error } = await supabase.storage
                .from('documentos')
                .download(`${folderPath}/${archivoReal.name}`);

              if (!error && blob) {
                const extension = archivoReal.name.split('.').pop();
                carpetaJoven.file(`${docId}.${extension}`, blob);
              }
            }
          } catch (err) {
            console.error(`Error al procesar documento ${docId} de ${scout.nombre}:`, err);
          }
        }
      }
    }
  });

  // Esperamos a que todas las descargas y generaciones terminen
  await Promise.all(tareas);

  // Generamos el archivo final
  const content = await zip.generateAsync({ type: "blob" });
  saveAs(content, `${nombreZip}.zip`);
};