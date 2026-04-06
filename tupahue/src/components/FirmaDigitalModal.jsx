import { useState, useRef, useEffect } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, Box, Typography, Stack, Tabs, Tab, IconButton
} from '@mui/material';
import { Gesture, UploadFile, Delete, Close } from '@mui/icons-material';

export const FirmaDigitalModal = ({ open, onClose, onConfirm, user, titulo = "Configuración de Firma Digital" }) => {
  const [tab, setTab] = useState(0); // 0: Dibujar, 1: Subir
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [imgPreview, setImgPreview] = useState(null);

  useEffect(() => {
    if (open) {
      setImgPreview(user?.firma_url || null);
      if (tab === 0) handleClear();
    }
  }, [open, user, tab]);

  // --- Lógica de Dibujo ---
  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { offsetX: 0, offsetY: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      offsetX: clientX - rect.left,
      offsetY: clientY - rect.top
    };
  };

  const startDrawing = (e) => {
    const { offsetX, offsetY } = getCoordinates(e);
    const ctx = canvasRef.current.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = getCoordinates(e);
    const ctx = canvasRef.current.getContext('2d');
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.strokeStyle = '#000';
    }
  };

  // --- Lógica de Carga de Archivo ---
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImgPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    let firmaFinal = null;
    
    if (tab === 0) {
      const canvas = canvasRef.current;
      // Convertimos el dibujo a imagen
      firmaFinal = canvas.toDataURL('image/png');
    } else {
      firmaFinal = imgPreview;
    }

    if (!firmaFinal) {
      alert("Por favor, dibuja tu firma o sube un archivo.");
      return;
    }

    // Enviamos solo la imagen de la firma
    onConfirm({ firmaImg: firmaFinal });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ bgcolor: '#f8f9fa', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Gesture color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>{titulo}</Typography>
        </Stack>
        <IconButton onClick={onClose} size="small"><Close /></IconButton>
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
          {user?.nombre} {user?.apellido}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Esta firma se estampará en los documentos oficiales. Asegurate de que sea clara y representativa.
        </Typography>

        <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ mb: 2 }}>
          <Tab icon={<Gesture />} label="Dibujar" sx={{ fontWeight: 700 }} />
          <Tab icon={<UploadFile />} label="Subir Imagen" sx={{ fontWeight: 700 }} />
        </Tabs>

        {tab === 0 ? (
          <Box sx={{ border: '2px dashed #ccc', borderRadius: 2, bgcolor: '#fff', touchAction: 'none', position: 'relative' }}>
            <canvas
              ref={canvasRef}
              width={500}
              height={200}
              style={{ width: '100%', height: '200px', cursor: 'crosshair' }}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={() => setIsDrawing(false)}
              onMouseLeave={() => setIsDrawing(false)}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={() => setIsDrawing(false)}
            />
            <Button size="small" onClick={handleClear} startIcon={<Delete />} color="error" sx={{ position: 'absolute', bottom: 5, right: 5 }}>
              Limpiar
            </Button>
          </Box>
        ) : (
          <Box sx={{ border: '2px dashed #ccc', borderRadius: 2, p: 3, textAlign: 'center', bgcolor: '#fdfdfd' }}>
            {imgPreview ? (
              <Stack alignItems="center" spacing={2}>
                <img src={imgPreview} alt="Firma" style={{ maxHeight: '150px', maxWidth: '100%', objectFit: 'contain' }} />
                <Button variant="outlined" color="error" size="small" onClick={() => setImgPreview(null)}>Cambiar imagen</Button>
              </Stack>
            ) : (
              <Button component="label" variant="contained" startIcon={<UploadFile />}>
                Seleccionar Firma (PNG/JPG)
                <input type="file" hidden accept="image/*" onChange={handleFileChange} />
              </Button>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, bgcolor: '#f8f9fa', borderTop: '1px solid #eee' }}>
        <Button onClick={onClose} color="inherit" sx={{ fontWeight: 700 }}>Cancelar</Button>
        <Button onClick={handleSave} variant="contained" sx={{ fontWeight: 900, px: 4, borderRadius: 2 }}>
          Guardar Firma
        </Button>
      </DialogActions>
    </Dialog>
  );
};