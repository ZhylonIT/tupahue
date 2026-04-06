import { useState, useRef, useEffect } from 'react';
import { 
  Box, Typography, Paper, Stack, Button, Dialog, DialogTitle, 
  DialogContent, DialogActions, List, ListItem, ListItemText, 
  ListItemIcon, CircularProgress, Alert, IconButton
} from '@mui/material';
import { 
  Visibility, CloudUpload, Delete, InsertDriveFile, AddPhotoAlternate
} from '@mui/icons-material';
import { supabase } from '../../lib/supabaseClient';

const VIOLETA_SCOUT = '#5A189A';

export const GestorArchivosModal = ({ open, onClose, docInfo, scout, onUpdateScout }) => {
  const [archivos, setArchivos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (open && docInfo && scout) {
      fetchArchivos();
    }
  }, [open, docInfo, scout]);

  const getStoragePath = () => `${scout.id}/${docInfo.id}`;

  const fetchArchivos = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const { data, error } = await supabase.storage.from('documentos').list(getStoragePath());
      if (error) throw error;
      
      const validFiles = data ? data.filter(f => f.name !== '.emptyFolderPlaceholder') : [];
      setArchivos(validFiles);

      // Sincronizar estado en la DB de Scouts
      const docsDB = scout.documentos || [];
      const hasFiles = validFiles.length > 0;
      const isMarked = docsDB.includes(docInfo.id);

      if (hasFiles && !isMarked) {
        onUpdateScout({ ...scout, documentos: [...docsDB, docInfo.id] });
      } else if (!hasFiles && isMarked) {
        onUpdateScout({ ...scout, documentos: docsDB.filter(id => id !== docInfo.id) });
      }
    } catch (error) {
      console.error("Error al cargar archivos:", error);
      setErrorMsg("No se pudieron cargar los archivos.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelected = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setErrorMsg('');
    try {
      const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
      const filePath = `${getStoragePath()}/${fileName}`;

      const { error } = await supabase.storage.from('documentos').upload(filePath, file);
      if (error) throw error;
      
      await fetchArchivos();
    } catch (error) {
      console.error("Error subiendo archivo:", error);
      setErrorMsg("Error al subir el archivo.");
    } finally {
      setUploading(false);
      e.target.value = null; 
    }
  };

  const handleDelete = async (fileName) => {
    if (!window.confirm('¿Seguro que querés borrar este archivo?')) return;
    setLoading(true);
    try {
      const filePath = `${getStoragePath()}/${fileName}`;
      const { error } = await supabase.storage.from('documentos').remove([filePath]);
      if (error) throw error;
      await fetchArchivos();
    } catch (error) {
      console.error("Error borrando:", error);
      setErrorMsg("No se pudo borrar el archivo.");
      setLoading(false);
    }
  };

  const handleView = async (fileName) => {
    const filePath = `${getStoragePath()}/${fileName}`;
    const { data } = supabase.storage.from('documentos').getPublicUrl(filePath);
    if (data?.publicUrl) window.open(data.publicUrl, '_blank');
  };

  if (!docInfo) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: 4, p: 1 } }}>
      <DialogTitle sx={{ fontWeight: 800, color: VIOLETA_SCOUT, pb: 1 }}>Gestor de Archivos</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
          {docInfo.nombre} - Podés subir uno o varios archivos.
        </Typography>

        {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}

        <Paper variant="outlined" sx={{ bgcolor: '#fcfcfc', borderRadius: 3, mb: 3 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress size={30} /></Box>
          ) : archivos.length === 0 ? (
            <Box sx={{ textAlign: 'center', p: 4, opacity: 0.6 }}>
              <AddPhotoAlternate sx={{ fontSize: 40, color: 'gray', mb: 1 }} />
              <Typography variant="body2">No hay archivos subidos todavía.</Typography>
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {archivos.map((file, index) => (
                <ListItem key={index} divider={index !== archivos.length - 1}>
                  <ListItemIcon><InsertDriveFile sx={{ color: VIOLETA_SCOUT }} /></ListItemIcon>
                  <ListItemText 
                    primary={file.name.split('_').slice(1).join('_') || file.name} 
                    primaryTypographyProps={{ variant: 'body2', fontWeight: 600, noWrap: true }}
                  />
                  <Stack direction="row" spacing={1}>
                    <IconButton size="small" onClick={() => handleView(file.name)} sx={{ color: 'primary.main' }}>
                      <Visibility fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDelete(file.name)} sx={{ color: 'error.main' }}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </Stack>
                </ListItem>
              ))}
            </List>
          )}
        </Paper>

        <input type="file" hidden ref={fileInputRef} onChange={handleFileSelected} accept=".pdf,image/*" />
        <Button 
          fullWidth variant="outlined" 
          startIcon={uploading ? <CircularProgress size={20} color="inherit" /> : <CloudUpload />}
          onClick={() => fileInputRef.current.click()} disabled={uploading || loading}
          sx={{ borderRadius: 2, py: 1.5, fontWeight: 700, borderColor: VIOLETA_SCOUT, color: VIOLETA_SCOUT }}
        >
          {uploading ? 'Subiendo...' : 'Agregar Archivo'}
        </Button>
      </DialogContent>
      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button onClick={onClose} variant="contained" sx={{ bgcolor: VIOLETA_SCOUT, borderRadius: 2, fontWeight: 700 }}>
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};