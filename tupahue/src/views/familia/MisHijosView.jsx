import { useState } from 'react';
import { Box, Typography, Paper, TextField, Button, Avatar, Stack, Grid, IconButton, Alert } from '@mui/material';
import { AddBox, ArrowForwardIos, PersonSearch } from '@mui/icons-material';

export const MisHijosView = ({ scoutsSistema = [], hijosVinculados = [], setDnisVinculados, onSelectHijo }) => {
  const [dniBusqueda, setDniBusqueda] = useState('');
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });

  // Nos aseguramos de trabajar siempre con arrays para evitar el error de .length
  const listaHijos = Array.isArray(hijosVinculados) ? hijosVinculados : [];
  const listaSistema = Array.isArray(scoutsSistema) ? scoutsSistema : [];

  const handleVincular = () => {
    setMensaje({ texto: '', tipo: '' });
    const limpio = dniBusqueda.trim();
    if (!limpio) return;

    const encontrado = listaSistema.find(s => String(s.dni) === limpio);

    if (!encontrado) {
      setMensaje({ texto: 'No se encontró el DNI en el sistema.', tipo: 'error' });
      return;
    }

    if (listaHijos.some(h => String(h.dni) === limpio)) {
      setMensaje({ texto: 'Este joven ya está en tu lista.', tipo: 'info' });
      return;
    }

    if (setDnisVinculados) {
      setDnisVinculados(prev => [...(Array.isArray(prev) ? prev : []), limpio]);
      setDniBusqueda('');
      setMensaje({ texto: `¡${encontrado.nombre} vinculado!`, tipo: 'success' });
    }
  };

  return (
    <Box sx={{ animation: 'fadeIn 0.3s', maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" sx={{ fontWeight: 900, mb: 1 }}>Mis Hijos</Typography>
      <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
        Gestioná los beneficiarios vinculados a tu cuenta.
      </Typography>

      <Paper sx={{ p: 3, borderRadius: 4, mb: 4, border: '1px solid #e1bee7' }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700, color: '#5A189A' }}>
              Vincular Hijo/a (DNI)
            </Typography>
            <TextField 
              fullWidth size="small" placeholder="DNI..." 
              value={dniBusqueda} onChange={(e) => setDniBusqueda(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleVincular()}
            />
          </Box>
          <Button variant="contained" onClick={handleVincular} startIcon={<AddBox />} sx={{ mt: 3, bgcolor: '#5A189A' }}>
            Vincular
          </Button>
        </Stack>
        {mensaje.texto && <Alert severity={mensaje.tipo} sx={{ mt: 2, borderRadius: 2 }}>{mensaje.texto}</Alert>}
      </Paper>

      <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Vinculados</Typography>
      
      {listaHijos.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 4, border: '2px dashed #ccc', bgcolor: 'transparent' }}>
          <PersonSearch sx={{ fontSize: 50, color: '#ccc', mb: 2 }} />
          <Typography color="textSecondary">No hay hijos vinculados.</Typography>
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {listaHijos.map((hijo) => (
            <Grid item xs={12} key={hijo.dni || hijo.id}>
              <Paper 
                onClick={() => onSelectHijo && onSelectHijo(hijo)}
                sx={{ 
                  p: 2, borderRadius: 3, transition: '0.2s', border: '1px solid #eee',
                  '&:hover': { 
                    boxShadow: '0 8px 24px rgba(0,0,0,0.08)', 
                    transform: 'translateY(-2px)', 
                    cursor: 'pointer',
                    borderColor: '#5A189A'
                  }
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar sx={{ bgcolor: '#5A189A', fontWeight: 800 }}>{hijo.nombre ? hijo.nombre[0] : '?'}</Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                      {hijo.nombre} {hijo.apellido}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      DNI: {hijo.dni} • Rama: {hijo.rama}
                    </Typography>
                  </Box>
                  <IconButton size="small">
                    <ArrowForwardIos fontSize="inherit" />
                  </IconButton>
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};