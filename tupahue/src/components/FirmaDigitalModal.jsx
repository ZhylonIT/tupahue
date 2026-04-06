import { useState, useRef, useEffect } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, Box, Typography, Stack, TextField 
} from '@mui/material';
import { Gesture } from '@mui/icons-material';

// 🎯 IMPORTANTE: El "export" adelante es lo que quita el SyntaxError
export const FirmaDigitalModal = ({ open, onClose, onConfirm, user, titulo = "Firma de Conformidad" }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [aclaracion, setAclaracion] = useState('');
  const [dni, setDni] = useState('');

  useEffect(() => {
    if (open) {
      // Autocompletamos con datos del usuario si existen
      setAclaracion(user ? `${user.nombre} ${user.apellido}` : '');
      setDni(user?.dni || '');
      
      // Limpiamos el canvas al abrir
      setTimeout(() => {
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext('2d');
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.lineWidth = 3;
          ctx.lineCap = 'round';
          ctx.strokeStyle = '#000000';
        }
      }, 150);
    }
  }, [open, user]);

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    if (e.touches && e.touches.length > 0) {
      return {
        offsetX: e.touches[0].clientX - rect.left,
        offsetY: e.touches[0].clientY - rect.top
      };
    }
    return { offsetX: e.nativeEvent.offsetX, offsetY: e.nativeEvent.offsetY };
  };

  const startDrawing = (e) => {
    e.preventDefault();
    const { offsetX, offsetY } = getCoordinates(e);
    const ctx = canvasRef.current.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const { offsetX, offsetY } = getCoordinates(e);
    const ctx = canvasRef.current.getContext('2d');
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
  };

  const stopDrawing = () => setIsDrawing(false);

  const handleClear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleSave = () => {
    if (!aclaracion || !dni) {
      alert("Por favor, completa la aclaración y el DNI.");
      return;
    }
    const canvas = canvasRef.current;
    const firmaBase64 = canvas.toDataURL('image/png');
    onConfirm({ aclaracion, dni, firmaImg: firmaBase64 });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ bgcolor: '#eee', display: 'flex', alignItems: 'center', gap: 1 }}>
        <Gesture /> {titulo}
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        <Box sx={{ border: '1px solid #ccc', borderRadius: 1, bgcolor: '#fff', touchAction: 'none', mb: 1 }}>
          <canvas
            ref={canvasRef}
            width={500}
            height={200}
            style={{ width: '100%', height: '200px', cursor: 'crosshair' }}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
        </Box>
        <Button size="small" onClick={handleClear} color="error" sx={{ mb: 2 }}>Borrar trazo</Button>
        <Stack spacing={2}>
          <TextField label="Aclaración" fullWidth value={aclaracion} onChange={e => setAclaracion(e.target.value)} />
          <TextField label="DNI" fullWidth value={dni} onChange={e => setDni(e.target.value)} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSave} variant="contained">Confirmar Firma</Button>
      </DialogActions>
    </Dialog>
  );
};