import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { supabase } from '../lib/supabaseClient';

/**
 * Crea un archivo .ZIP descargando todos los documentos desde Supabase
 */
export const descargarZipLegajos = async (listaScouts, nombreZip = "Legajos_Tupahue") => {
  const zip = new JSZip();

  const tareas = listaScouts.map(async (scout) => {
    // Creamos la carpeta del joven
    const carpetaJoven = zip.folder(`${scout.apellido}_${scout.nombre}`);

    if (scout.documentos && scout.documentos.length > 0) {
      for (const docId of scout.documentos) {
        try {
          let filePath = "";

          // 🎯 LÓGICA DE DESCARGA: Mismo criterio que en DocumentosView
          if (docId === 'ficha_medica' || docId === 'ficha_personales') {
            filePath = `${scout.id}/${docId}/${docId}.pdf`;
          } else {
            // Buscamos el adjunto más reciente en la carpeta
            const folderPath = `${scout.id}/${docId}`;
            const { data: fileList } = await supabase.storage.from('documentos').list(folderPath);
            const archivoReal = fileList?.find(f => f.name !== '.emptyFolderPlaceholder');
            if (archivoReal) filePath = `${folderPath}/${archivoReal.name}`;
          }

          if (filePath) {
            // Descargamos el BLOB físico desde Supabase
            const { data: blob, error } = await supabase.storage
              .from('documentos')
              .download(filePath);

            if (!error && blob) {
              const extension = filePath.split('.').pop();
              carpetaJoven.file(`${docId}.${extension}`, blob);
            }
          }
        } catch (err) {
          console.error(`Error procesando ZIP para ${docId} de ${scout.nombre}:`, err);
        }
      }
    }
  });

  // Esperamos que todas las promesas de descarga terminen
  await Promise.all(tareas);

  // Generamos y guardamos el ZIP final
  const content = await zip.generateAsync({ type: "blob" });
  saveAs(content, `${nombreZip}.zip`);
};  