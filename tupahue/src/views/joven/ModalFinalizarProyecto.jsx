import React, { useState, useEffect } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, TextField, Typography, Stack, Box, Divider, 
  MenuItem, Avatar, Grid, Paper, 
  Alert // 🎯 NUEVO: Importamos Alert para evitar el ReferenceError
} from '@mui/material';
import { TaskAlt, Star, AssignmentTurnedIn, Celebration, Insights } from '@mui/icons-material';

export const ModalFinalizarProyecto = ({ open, onClose, proyecto, onConfirm, term }) => {
  const [evaluacion, setEvaluacion] = useState('');
  const [logro, setLogro] = useState('TOTAL');
  const fechaHoy = new Date().toLocaleDateString();

  useEffect(() => {
    if (open) {
      setEvaluacion('');
      setLogro('TOTAL');
    }
  }, [open]);

  const handleFinalizar = () => {
    if (!evaluacion.trim()) {
      return alert(`Por favor, escribí la evaluación de la ${term}. ¡Es importante saber qué aprendieron!`);
    }
    
    onConfirm({
      ...proyecto,
      estado: 'FINALIZADO',
      evaluacionJoven: evaluacion,
      nivelLogro: logro,
      fechaFinalizacion: new Date().toISOString(),
      vistoPorJoven: true 
    });
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth 
      PaperProps={{ 
        sx: { 
          borderRadius: 6,
          overflow: 'hidden'
        } 
      }}
    >
      {/* CABECERA CELEBRATORIA */}
      <DialogTitle sx={{ bgcolor: '#1a1a1a', color: 'white', py: 3 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar 
            sx={{ 
              bgcolor: '#4caf50', 
              width: 56, 
              height: 56,
              boxShadow: '0 4px 10px rgba(76, 175, 80, 0.4)'
            }}
          >
            <Celebration sx={{ fontSize: 32 }} />
          </Avatar>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 900 }}>¡Misión Cumplida!</Typography>
            <Typography variant="body2" sx={{ opacity: 0.8, fontWeight: 500 }}>
              Finalizando {term}: {proyecto?.titulo}
            </Typography>
          </Box>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ p: 4 }}>
        <Stack spacing={4} sx={{ mt: 1 }}>
          
          {/* RESUMEN DE TIEMPOS */}
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 4, bgcolor: '#f8fafc', borderStyle: 'dashed' }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 900, display: 'block', textTransform: 'uppercase', letterSpacing: 1 }}>Iniciada el</Typography>
                <Typography variant="body1" sx={{ fontWeight: 700 }}>
                  {proyecto?.ultimaModificacion ? new Date(proyecto.ultimaModificacion).toLocaleDateString() : '---'}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 900, display: 'block', textTransform: 'uppercase', letterSpacing: 1 }}>Cerrada el</Typography>
                <Typography variant="body1" sx={{ fontWeight: 700 }}>{fechaHoy}</Typography>
              </Grid>
            </Grid>
          </Paper>

          {/* NIVEL DE LOGRO */}
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Insights color="primary" sx={{ fontSize: 20 }} /> ¿Cómo resultó el sueño?
            </Typography>
            <TextField
              select 
              fullWidth 
              value={logro} 
              onChange={(e) => setLogro(e.target.value)}
              variant="filled" 
              InputProps={{ disableUnderline: true, sx: { borderRadius: 3, fontWeight: 700 } }}
            >
              <MenuItem value="TOTAL" sx={{ fontWeight: 600 }}>🌟 ¡Objetivo cumplido totalmente!</MenuItem>
              <MenuItem value="PARCIAL" sx={{ fontWeight: 600 }}>🛠️ Objetivo cumplido parcialmente</MenuItem>
              <MenuItem value="CAMBIO" sx={{ fontWeight: 600 }}>🔄 Tuvimos que cambiar el rumbo</MenuItem>
            </TextField>
          </Box>

          {/* EVALUACIÓN CUALITATIVA */}
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
              <TaskAlt color="primary" sx={{ fontSize: 20 }} /> Evaluación del Equipo
            </Typography>
            <TextField
              fullWidth 
              multiline 
              rows={4}
              placeholder="¿Qué aprendieron en esta aventura? ¿Qué fue lo más desafiante?"
              value={evaluacion}
              onChange={(e) => setEvaluacion(e.target.value)}
              variant="outlined"
              sx={{ 
                '& .MuiOutlinedInput-root': { 
                  borderRadius: 4,
                  bgcolor: '#fcfcfc',
                  fontSize: '0.95rem'
                } 
              }}
            />
          </Box>

          {/* 🎯 EL COMPONENTE QUE DABA ERROR (Ya funciona porque arriba lo importamos) */}
          <Alert severity="success" sx={{ borderRadius: 3, fontWeight: 600 }}>
            Al finalizar, esta {term} pasará al historial de la Rama para que siempre puedan recordarla.
          </Alert>
        </Stack>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 3, bgcolor: '#f8fafc' }}>
        <Button 
          onClick={onClose} 
          sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'none' }}
        >
          Todavía no, volver
        </Button>
        <Button 
          variant="contained" 
          color="success" 
          startIcon={<Star />}
          onClick={handleFinalizar}
          sx={{ 
            borderRadius: 3, 
            fontWeight: 900, 
            px: 4, 
            py: 1,
            textTransform: 'none',
            boxShadow: '0 4px 14px rgba(76, 175, 80, 0.4)'
          }}
        >
          Confirmar y Guardar Logro
        </Button>
      </DialogActions>
    </Dialog>
  );
};