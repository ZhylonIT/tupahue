import { useState } from 'react';
import { Box, Typography, Paper, TextField, Button, Avatar, Stack, Grid, IconButton, Alert, CircularProgress } from '@mui/material';
import { AddBox, ArrowForwardIos, PersonSearch } from '@mui/icons-material';

export const MisHijosView = ({ hijosVinculados = [], onVincular, onSelectHijo }) => {
  const [dniBusqueda, setDniBusqueda] = useState('');
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });

  const handleVincular = async () => {
    setMensaje({ texto: '', tipo: '' });
    const dniLimpio = dniBusqueda.trim();
    if (!dniLimpio) return;

    setLoading(true);
    try {
      // Llamamos a la función que actualiza la DB
      const nombreHijo = await onVincular(dniLimpio);
      setMensaje({ texto: `¡${nombreHijo} vinculado correctamente!`, tipo: 'success' });
      setDniBusqueda('');
    } catch (error) {
      setMensaje({ texto: error.message || 'Error al vincular.', tipo: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ animation: 'fadeIn 0.3s', maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" sx={{ fontWeight: 900, mb: 1 }}>Mis Hijos</Typography>
      <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
        Gestioná los beneficiarios vinculados a tu cuenta institucional.
      </Typography>

      <Paper sx={{ p: 3, borderRadius: 4, mb: 4, border: '1px solid #e1bee7' }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700, color: '#5A189A' }}>
              Vincular por DNI
            </Typography>
            <TextField 
              fullWidth size="small" placeholder="Ingrese el DNI del joven..." 
              value={dniBusqueda} onChange={(e) => setDniBusqueda(e.target.value)}
              disabled={loading}
              onKeyPress={(e) => e.key === 'Enter' && handleVincular()}
            />
          </Box>
          <Button 
            variant="contained" 
            onClick={handleVincular} 
            disabled={loading || !dniBusqueda}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <AddBox />} 
            sx={{ mt: 3, bgcolor: '#5A189A', fontWeight: 700 }}
          >
            {loading ? 'Buscando...' : 'Vincular'}
          </Button>
        </Stack>
        {mensaje.texto && <Alert severity={mensaje.tipo} sx={{ mt: 2, borderRadius: 2, fontWeight: 600 }}>{mensaje.texto}</Alert>}
      </Paper>

      <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Tus Beneficiarios</Typography>
      
      {hijosVinculados.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 4, border: '2px dashed #ccc', bgcolor: 'transparent' }}>
          <PersonSearch sx={{ fontSize: 50, color: '#ccc', mb: 2 }} />
          <Typography color="textSecondary" sx={{ fontWeight: 600 }}>No tenés hijos vinculados a esta cuenta.</Typography>
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {hijosVinculados.map((hijo) => (
            <Grid item xs={12} key={hijo.id}>
              <Paper 
                onClick={() => onSelectHijo && onSelectHijo(hijo)}
                sx={{ 
                  p: 2.5, borderRadius: 3, transition: '0.2s', border: '1px solid #eee',
                  '&:hover': { 
                    boxShadow: '0 8px 24px rgba(90, 24, 154, 0.1)', 
                    transform: 'translateX(5px)', 
                    cursor: 'pointer',
                    borderColor: '#5A189A'
                  }
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar sx={{ bgcolor: '#5A189A', fontWeight: 900 }}>{hijo.nombre[0]}</Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                      {hijo.nombre} {hijo.apellido}
                    </Typography>
                    <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 600 }}>
                      DNI: {hijo.dni} • Rama {hijo.rama}
                    </Typography>
                  </Box>
                  <IconButton size="small" sx={{ color: '#5A189A' }}>
                    <ArrowForwardIos fontSize="small" />
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