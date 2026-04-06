import { useState, useEffect } from 'react';
import { 
  Modal, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Stack, 
  MenuItem, 
  FormHelperText,
  IconButton
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { TIPOS_EVENTO } from '../../../constants/eventos';
import { RAMAS } from '../../../constants/ramas';

// 🎯 IMPORTANTE: El "export const" debe estar aquí para que CalendarioView lo encuentre
export const EventoModal = ({ open, onClose, onSave, evento, configRama, esVistaGlobal }) => {
  
  const initialState = { 
    titulo: '', 
    fecha: '', 
    hora: '', 
    lugar: '', 
    tipo: esVistaGlobal ? 'GRUPAL' : 'RAMA', 
    rama: esVistaGlobal ? 'TODAS' : (configRama?.nombre?.toUpperCase() || 'CAMINANTES'), 
    descripcion: '' 
  };

  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (evento) {
      setForm(evento);
    } else {
      setForm(initialState);
    }
    setErrors({});
  }, [evento, open, esVistaGlobal, configRama]); 

  const isFormValid = form.titulo.trim() !== '' && form.fecha !== '';

  const handleSubmit = () => {
    if (!isFormValid) {
      setErrors({
        titulo: form.titulo.trim() === '',
        fecha: form.fecha === ''
      });
      return;
    }

    const tipoInfo = TIPOS_EVENTO.find(t => t.id === form.tipo);
    const colorFinal = form.tipo === 'RAMA' ? (RAMAS[form.rama]?.color || configRama.color) : (tipoInfo?.color || '#5A189A');
    
    onSave(evento?.id, { 
      ...form, 
      color: colorFinal,
      rama: form.tipo === 'GRUPAL' ? 'TODAS' : (form.rama || configRama.nombre?.toUpperCase())
    });
    
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="modal-evento-titulo">
      <Box sx={{ 
        position: 'absolute', 
        top: '50%', 
        left: '50%', 
        transform: 'translate(-50%, -50%)', 
        width: { xs: '95%', sm: 480 }, 
        bgcolor: 'background.paper', 
        borderRadius: 5, 
        p: 4, 
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        outline: 'none'
      }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Typography id="modal-evento-titulo" variant="h5" sx={{ fontWeight: 900 }}>
            {evento ? 'Editar Actividad' : (esVistaGlobal ? 'Nuevo Evento Grupal' : 'Nueva Actividad')}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <Close fontSize="small" />
          </IconButton>
        </Stack>
        
        <Stack spacing={2.5}>
          <TextField 
            label="¿Qué vamos a hacer? *" 
            fullWidth 
            error={errors.titulo}
            helperText={errors.titulo ? "El nombre es obligatorio" : ""}
            value={form.titulo} 
            onChange={(e) => setForm({...form, titulo: e.target.value})} 
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
          />
          
          <Stack direction="row" spacing={2}>
            <TextField 
              label="Fecha *" 
              type="date" 
              fullWidth 
              error={errors.fecha}
              InputLabelProps={{ shrink: true }} 
              value={form.fecha} 
              onChange={(e) => setForm({...form, fecha: e.target.value})} 
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
            />
            <TextField 
              label="Hora" 
              placeholder="14:30" 
              fullWidth 
              value={form.hora} 
              onChange={(e) => setForm({...form, hora: e.target.value})} 
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
            />
          </Stack>

          <TextField 
            label="Lugar" 
            fullWidth 
            value={form.lugar} 
            onChange={(e) => setForm({...form, lugar: e.target.value})} 
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
          />

          <TextField 
            select 
            label="Ámbito" 
            fullWidth 
            value={form.tipo} 
            onChange={(e) => setForm({...form, tipo: e.target.value})}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
          >
            {TIPOS_EVENTO.map((t) => (
              <MenuItem key={t.id} value={t.id}>
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <Box sx={{ 
                    width: 12, height: 12, borderRadius: '50%', 
                    background: t.id === 'RAMA' ? configRama.color : t.color 
                  }} />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{t.label}</Typography>
                </Stack>
              </MenuItem>
            ))}
          </TextField>

          <TextField 
            label="Notas" 
            multiline 
            rows={3} 
            fullWidth 
            value={form.descripcion} 
            onChange={(e) => setForm({...form, descripcion: e.target.value})} 
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
          />

          <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
            <Button fullWidth variant="text" onClick={onClose} sx={{ fontWeight: 800 }}>
              Cancelar
            </Button>
            <Button 
              fullWidth variant="contained" 
              onClick={handleSubmit} 
              disabled={!isFormValid}
              sx={{ bgcolor: configRama.color, fontWeight: 900, borderRadius: 3, py: 1.5 }}
            >
              {evento ? 'Actualizar' : 'Programar'}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
};