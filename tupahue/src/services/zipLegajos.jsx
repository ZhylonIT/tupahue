import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { supabase } from '../lib/supabaseClient';

export const descargarZipLegajos = async (listaScouts, nombreZip = "Legajos_Tupahue") => {
  const zip = new JSZip();

  const tareas = listaScouts.map(async (scout) => {
    const carpetaJoven = zip.folder(`${scout.apellido}_${scout.nombre}`);

    if (scout.documentos && scout.documentos.length > 0) {
      for (const docId of scout.documentos) {
        try {
          const folderPath = `${scout.id}/${docId}`;
          const { data: fileList } = await supabase.storage.from('documentos').list(folderPath);
          
          const archivosReales = fileList?.filter(f => f.name !== '.emptyFolderPlaceholder') || [];

          // Iteramos TODOS los archivos de la carpeta (ej. los 6 DNIS)
          for (const file of archivosReales) {
            const filePath = `${folderPath}/${file.name}`;
            const { data: blob, error } = await supabase.storage
              .from('documentos')
              .download(filePath);

            if (!error && blob) {
              // Usamos el nombre original del archivo para que no se pisen
              // pero le ponemos el docId de prefijo para que queden agrupados
              const nombreLimpio = file.name.split('_').slice(1).join('_') || file.name;
              carpetaJoven.file(`${docId}_${nombreLimpio}`, blob);
            }
          }
        } catch (err) {
          console.error(`Error procesando ZIP para ${docId} de ${scout.nombre}:`, err);
        }
      }
    }
  });

  await Promise.all(tareas);
  const content = await zip.generateAsync({ type: "blob" });
  saveAs(content, `${nombreZip}.zip`);
};