import React, { useState, useEffect } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, TextField, Typography, Stack, Box, Divider, 
  MenuItem, Avatar, Grid 
} from '@mui/material';
import { TaskAlt, Star, AssignmentTurnedIn } from '@mui/icons-material';

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
    if (!evaluacion.trim()) return alert("Por favor, escribí la evaluación del equipo.");
    
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
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 5 } }}>
      <DialogTitle sx={{ bgcolor: '#1a1a1a', color: 'white', py: 3 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar sx={{ bgcolor: '#4caf50' }}><AssignmentTurnedIn /></Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>Finalizar {term}</Typography>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>{proyecto?.titulo}</Typography>
          </Box>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ p: 4, mt: 2 }}>
        <Stack spacing={3}>
          <Box sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 3, border: '1px solid #eee' }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, display: 'block' }}>INICIADO</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  {proyecto?.ultimaModificacion ? new Date(proyecto.ultimaModificacion).toLocaleDateString() : '---'}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, display: 'block' }}>FINALIZADO</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>{fechaHoy}</Typography>
              </Grid>
            </Grid>
          </Box>

          <TextField
            select fullWidth label="Grado de cumplimiento del sueño"
            value={logro} onChange={(e) => setLogro(e.target.value)}
            variant="filled" sx={{ '& .MuiFilledInput-root': { borderRadius: 2 } }}
          >
            <MenuItem value="TOTAL">¡Objetivo cumplido totalmente!</MenuItem>
            <MenuItem value="PARCIAL">Objetivo cumplido parcialmente</MenuItem>
            <MenuItem value="CAMBIO">Tuvimos que cambiar el rumbo</MenuItem>
          </TextField>

          <TextField
            fullWidth multiline rows={5}
            label="Evaluación del Equipo"
            placeholder="¿Qué aprendieron? ¿Qué fue lo que más les gustó de esta aventura?"
            value={evaluacion}
            onChange={(e) => setEvaluacion(e.target.value)}
            variant="outlined"
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 3, bgcolor: '#fcfcfc' }}>
        <Button onClick={onClose} sx={{ fontWeight: 800, color: 'text.secondary' }}>Cancelar</Button>
        <Button 
          variant="contained" 
          color="success" 
          startIcon={<Star />}
          onClick={handleFinalizar}
          sx={{ borderRadius: 3, fontWeight: 900, px: 4 }}
        >
          Confirmar y Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};