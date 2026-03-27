import { useState, useRef, useEffect } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, TextField, MenuItem, Box, Typography, 
  Stack, Tab, Tabs, IconButton, Paper
} from '@mui/material';
import { 
  DeleteOutline, Close, Link as LinkIcon, PhotoCamera 
} from '@mui/icons-material';
import { Editor } from '@tinymce/tinymce-react';

const AZUL_OSCURO = '#1a5276';
const VIOLETA = '#8e44ad';

export const NoticiaForm = ({ open, onClose, noticiaEdit, onSave }) => {
  // Estados para los campos del formulario
  const [tabIndex, setTabIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [tempUrl, setTempUrl] = useState('');
  const [titulo, setTitulo] = useState('');
  const [categoria, setCategoria] = useState('Evento');
  const [estado, setEstado] = useState('Borrador');
  
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);

  // Efecto para cargar datos si estamos editando
  useEffect(() => {
    if (noticiaEdit) {
      setTitulo(noticiaEdit.titulo || '');
      setCategoria(noticiaEdit.categoria || 'Evento');
      setEstado(noticiaEdit.estado || 'Borrador');
      setSelectedImage(noticiaEdit.imagen || null);
    } else {
      // Resetear si es nueva
      setTitulo('');
      setCategoria('Evento');
      setEstado('Borrador');
      setSelectedImage(null);
    }
  }, [noticiaEdit, open]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSelectedImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleLoadUrl = () => {
    if (tempUrl.trim() !== '') {
      setSelectedImage(tempUrl);
      setTempUrl('');
    }
  };

  const handleGuardar = () => {
    if (!titulo.trim()) {
      alert("Por favor, ingresá un título.");
      return;
    }

    const contenidoHtml = editorRef.current ? editorRef.current.getContent() : "";

    const noticiaData = {
      id: noticiaEdit ? noticiaEdit.id : Date.now(),
      titulo,
      categoria,
      estado,
      imagen: selectedImage,
      descripcion: contenidoHtml,
      fecha: noticiaEdit ? noticiaEdit.fecha : new Date().toLocaleDateString('es-AR'),
      autor: "Asistente de Comunicación"
    };

    // Lógica de LocalStorage
    const noticiasGuardadas = JSON.parse(localStorage.getItem('noticias-tupahue') || '[]');
    
    let nuevasNoticias;
    if (noticiaEdit) {
      nuevasNoticias = noticiasGuardadas.map(n => n.id === noticiaEdit.id ? noticiaData : n);
    } else {
      nuevasNoticias = [noticiaData, ...noticiasGuardadas];
    }

    localStorage.setItem('noticias-tupahue', JSON.stringify(nuevasNoticias));
    
    // Ejecutar callback para refrescar la tabla y cerrar
    if (onSave) onSave();
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      fullWidth 
      maxWidth="xl" 
      PaperProps={{ 
        sx: { borderRadius: 4, height: '92vh', maxHeight: '92vh', overflow: 'hidden' } 
      }}
    >
      <DialogTitle component="div" sx={{ p: 1.5, px: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee' }}>
        <Typography variant="h6" component="span" sx={{ fontWeight: 800 }}>
          {noticiaEdit ? 'Editar Noticia' : 'Nueva Noticia'}
        </Typography>
        <IconButton onClick={onClose} size="small"><Close /></IconButton>
      </DialogTitle>

      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden', bgcolor: '#fbfcfd' }}>
        <Box sx={{ width: 320, borderRight: '1px solid #eee', bgcolor: '#fff', overflowY: 'auto', p: 2 }}>
          <Stack spacing={2.5}>
            <Box>
              <Typography variant="caption" sx={{ fontWeight: 800, color: '#999', mb: 1, display: 'block', textTransform: 'uppercase', fontSize: '0.65rem' }}>
                Imagen de Portada
              </Typography>
              <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <Tabs 
                  value={tabIndex} 
                  onChange={(e, v) => setTabIndex(v)} 
                  sx={{ minHeight: 32, borderBottom: '1px solid #eee', '& .MuiTabs-indicator': { bgcolor: VIOLETA } }}
                >
                  <Tab label="PC" sx={{ fontSize: '0.65rem', minHeight: 32, py: 0, fontWeight: 700 }} />
                  <Tab label="URL" sx={{ fontSize: '0.65rem', minHeight: 32, py: 0, fontWeight: 700 }} />
                </Tabs>
                
                <Box sx={{ height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', bgcolor: '#fafafa', p: 1 }}>
                  {selectedImage ? (
                    <>
                      <Box component="img" src={selectedImage} sx={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 1 }} />
                      <IconButton 
                        size="small"
                        onClick={() => setSelectedImage(null)}
                        sx={{ position: 'absolute', top: 5, right: 5, bgcolor: 'rgba(255,255,255,0.9)' }}
                      >
                        <DeleteOutline color="error" fontSize="small" />
                      </IconButton>
                    </>
                  ) : (
                    <Box sx={{ width: '100%', px: 1 }}>
                      {tabIndex === 0 ? (
                        <Button 
                          fullWidth size="small" variant="outlined" 
                          onClick={() => fileInputRef.current.click()} 
                          sx={{ color: VIOLETA, borderColor: VIOLETA, fontWeight: 700, textTransform: 'none', fontSize: '0.7rem' }}
                        >
                          Elegir de mi PC
                        </Button>
                      ) : (
                        <Stack spacing={1}>
                          <TextField 
                            fullWidth size="small" placeholder="https://..." 
                            value={tempUrl} onChange={(e) => setTempUrl(e.target.value)}
                            sx={{ '& .MuiInputBase-input': { fontSize: '0.7rem', py: 0.8 } }}
                          />
                          <Button 
                            variant="contained" size="small" onClick={handleLoadUrl}
                            sx={{ bgcolor: VIOLETA, fontWeight: 700, fontSize: '0.7rem' }}
                          >
                            Cargar
                          </Button>
                        </Stack>
                      )}
                    </Box>
                  )}
                </Box>
              </Paper>
            </Box>

            <Box>
              <Typography variant="caption" sx={{ fontWeight: 800, color: '#999', mb: 1, display: 'block', textTransform: 'uppercase', fontSize: '0.65rem' }}>
                Información
              </Typography>
              <Stack spacing={1.5}>
                <TextField 
                  fullWidth size="small" label="Título" 
                  value={titulo} onChange={(e) => setTitulo(e.target.value)}
                  InputLabelProps={{ shrink: true }} 
                  sx={{ '& .MuiInputBase-input': { fontSize: '0.85rem' } }} 
                />
                <TextField 
                  select fullWidth size="small" label="Categoría" 
                  value={categoria} onChange={(e) => setCategoria(e.target.value)}
                  sx={{ '& .MuiInputBase-input': { fontSize: '0.85rem' } }}
                >
                  <MenuItem value="Evento">Evento</MenuItem>
                  <MenuItem value="Novedad">Novedad</MenuItem>
                  <MenuItem value="Urgente">Urgente</MenuItem>
                </TextField>
                <TextField 
                  select fullWidth size="small" label="Estado" 
                  value={estado} onChange={(e) => setEstado(e.target.value)}
                  sx={{ '& .MuiInputBase-input': { fontSize: '0.85rem' } }}
                >
                  <MenuItem value="Borrador">Borrador</MenuItem>
                  <MenuItem value="Publicado">Publicado</MenuItem>
                </TextField>
              </Stack>
            </Box>
          </Stack>
        </Box>

        <Box sx={{ flex: 1, bgcolor: '#fff', height: '100%' }}>
          <Editor
            apiKey='advsidqgenxeos9qjfbk5bs5d0r1wifrwzx425rjnnuvnx4m' // <--- Colocá acá tu key de TinyMCE
            onInit={(evt, editor) => editorRef.current = editor}
            initialValue={noticiaEdit ? noticiaEdit.descripcion : ""}
            init={{
              height: '100%',
              menubar: 'file edit insert view format table help',
              plugins: ['advlist', 'autolink', 'lists', 'link', 'image', 'preview', 'anchor', 'searchreplace', 'visualblocks', 'fullscreen', 'insertdatetime', 'media', 'table', 'wordcount'],
              toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline forecolor backcolor | alignleft aligncenter alignright | bullist numlist outdent indent | removeformat',
              content_style: `body { font-family: 'Helvetica', Arial, sans-serif; font-size: 15px; padding: 30px; max-width: 800px; margin: 10px auto; background-color: #fff; box-shadow: 0 0 10px rgba(0,0,0,0.1); min-height: 800px; }`,
              language: 'es',
              branding: false,
              promotion: false,
              statusbar: true,
            }}
          />
        </Box>
      </Box>

      <DialogActions sx={{ p: 1.5, px: 3, borderTop: '1px solid #eee', bgcolor: '#fff' }}>
        <Button onClick={onClose} size="small" sx={{ color: '#666', fontWeight: 700, mr: 'auto' }}>DESCARTAR</Button>
        <Button onClick={onClose} size="small" sx={{ color: VIOLETA, fontWeight: 700 }}>CANCELAR</Button>
        <Button 
          variant="contained" 
          onClick={handleGuardar}
          sx={{ bgcolor: AZUL_OSCURO, px: 4, py: 1, borderRadius: 2, fontWeight: 800, fontSize: '0.85rem' }}
        >
          GUARDAR NOTICIA
        </Button>
      </DialogActions>
      <input type="file" hidden ref={fileInputRef} onChange={handleFileChange} accept="image/*" />
    </Dialog>
  );
};