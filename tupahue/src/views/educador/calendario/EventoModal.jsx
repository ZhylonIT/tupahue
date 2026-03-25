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

export const EventoModal = ({ open, onClose, onSave, evento, configRama, esVistaGlobal }) => {
  // Estado inicial dinámico: si es vista global arranca como Grupal, si no como de Rama
  const initialState = { 
    titulo: '', 
    fecha: '', 
    hora: '', 
    lugar: '', 
    tipo: esVistaGlobal ? 'GRUPAL' : 'RAMA', 
    descripcion: '' 
  };

  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});

  // Efecto para cargar datos si se está editando o limpiar si es nuevo
  useEffect(() => {
    if (evento) {
      setForm(evento);
    } else {
      setForm(initialState);
    }
    setErrors({});
  }, [evento, open, esVistaGlobal]); // Agregado esVistaGlobal a las dependencias

  // Validación: Título y Fecha son obligatorios
  const isFormValid = form.titulo.trim() !== '' && form.fecha !== '';

  const handleSubmit = () => {
    if (!isFormValid) {
      setErrors({
        titulo: form.titulo.trim() === '',
        fecha: form.fecha === ''
      });
      return;
    }

    // Buscamos la info del tipo para asignar el color correcto antes de guardar
    const tipoInfo = TIPOS_EVENTO.find(t => t.id === form.tipo);
    // Si el tipo es 'RAMA', usamos el color de la rama seleccionada (o el del grupo si estamos en vista global y lo fuerzan)
    const colorFinal = tipoInfo.id === 'RAMA' ? configRama.color : tipoInfo.color;
    
    onSave(evento?.id, { ...form, color: colorFinal });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="modal-evento-titulo">
      <Box sx={{ 
        position: 'absolute', 
        top: '50%', 
        left: '50%', 
        transform: 'translate(-50%, -50%)', 
        width: { xs: '95%', sm: 450 }, 
        bgcolor: 'background.paper', 
        borderRadius: 4, 
        p: 4, 
        boxShadow: 24,
        outline: 'none'
      }}>
        {/* Cabecera con botón de cerrar X */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Typography id="modal-evento-titulo" variant="h6" sx={{ fontWeight: 800 }}>
            {evento ? 'Editar Actividad' : (esVistaGlobal ? 'Nuevo Evento Grupal' : 'Nueva Actividad')}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Stack>
        
        <Stack spacing={2.5}>
          {/* Título */}
          <TextField 
            label="Título de la actividad *" 
            fullWidth 
            error={errors.titulo}
            helperText={errors.titulo ? "El título es obligatorio" : ""}
            value={form.titulo} 
            onChange={(e) => {
              setForm({...form, titulo: e.target.value});
              if (errors.titulo) setErrors({...errors, titulo: false});
            }} 
          />
          
          {/* Fecha y Hora */}
          <Stack direction="row" spacing={2}>
            <TextField 
              label="Fecha *" 
              type="date" 
              fullWidth 
              error={errors.fecha}
              InputLabelProps={{ shrink: true }} 
              value={form.fecha} 
              onChange={(e) => {
                setForm({...form, fecha: e.target.value});
                if (errors.fecha) setErrors({...errors, fecha: false});
              }} 
            />
            <TextField 
              label="Hora" 
              placeholder="Ej: 14:30" 
              fullWidth 
              value={form.hora} 
              onChange={(e) => setForm({...form, hora: e.target.value})} 
            />
          </Stack>

          {/* Lugar */}
          <TextField 
            label="Lugar de encuentro" 
            placeholder="Ej: Patio del Grupo / Zoom"
            fullWidth 
            value={form.lugar} 
            onChange={(e) => setForm({...form, lugar: e.target.value})} 
          />

          {/* Selector de Ámbito */}
          <TextField 
            select 
            label="Ámbito del evento" 
            fullWidth 
            value={form.tipo} 
            onChange={(e) => setForm({...form, tipo: e.target.value})}
          >
            {TIPOS_EVENTO.map((t) => (
              <MenuItem key={t.id} value={t.id}>
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <Box sx={{ 
                    width: 14, 
                    height: 14, 
                    borderRadius: '50%', 
                    background: t.id === 'RAMA' ? configRama.color : t.color, 
                    border: '1px solid #ddd' 
                  }} />
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>{t.label}</Typography>
                </Stack>
              </MenuItem>
            ))}
          </TextField>

          {/* Descripción */}
          <TextField 
            label="Notas / Material necesario" 
            multiline 
            rows={2} 
            fullWidth 
            value={form.descripcion} 
            onChange={(e) => setForm({...form, descripcion: e.target.value})} 
          />

          {/* Botonera Inferior */}
          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <Button 
              fullWidth 
              variant="outlined" 
              onClick={onClose}
              sx={{ 
                color: 'text.secondary', 
                borderColor: '#ddd', 
                fontWeight: 700, 
                borderRadius: 2,
                textTransform: 'none',
                '&:hover': { borderColor: '#bbb', bgcolor: '#f5f5f5' }
              }}
            >
              Cancelar
            </Button>

            <Button 
              fullWidth
              variant="contained" 
              onClick={handleSubmit} 
              disabled={!isFormValid}
              sx={{ 
                bgcolor: configRama.color, 
                fontWeight: 700, 
                borderRadius: 2,
                textTransform: 'none',
                '&:hover': { bgcolor: configRama.color, opacity: 0.9 }
              }}
            >
              {evento ? 'Guardar Cambios' : 'Programar'}
            </Button>
          </Stack>

          {!isFormValid && (
            <FormHelperText sx={{ textAlign: 'center', fontWeight: 600 }}>
              * Los campos con asterisco son obligatorios
            </FormHelperText>
          )}
        </Stack>
      </Box>
    </Modal>
  );
};