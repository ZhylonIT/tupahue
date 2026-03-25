import { useState, useEffect } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, TextField, Grid, Box, Typography,
  InputAdornment, MenuItem, Select, FormControl, InputLabel
} from '@mui/material';
import { Person, Badge, Cake, Group, CheckCircleOutline, HighlightOff, Star } from '@mui/icons-material';
import { RAMAS } from '../constants/ramas';

export const ScoutForm = ({ open, onClose, onSave, scout, ramaId, scouts = [] }) => {
  const idBusqueda = ramaId?.toUpperCase() || 'CAMINANTES';
  const CONFIG_RAMA = RAMAS[idBusqueda] || RAMAS.CAMINANTES;

  // Lógica de nombres de cargos según la rama
  const esRamaConPatrullas = ['SCOUTS', 'CAMINANTES'].includes(idBusqueda);

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    dni: '',
    fechaNacimiento: '',
    equipo: '',
    funcion: 'Protagonista', // ACTUALIZADO: De Beneficiario a Protagonista
    fichaEntregada: false,
    rama: idBusqueda,
    etapa: CONFIG_RAMA.etapas[0].id
  });

  const dniYaExiste = scouts.some(s => s.dni === formData.dni && s.id !== scout?.id);

  useEffect(() => {
    if (scout) {
      setFormData(scout);
    } else {
      setFormData({
        nombre: '',
        apellido: '',
        dni: '',
        fechaNacimiento: '',
        equipo: '',
        funcion: 'Protagonista', // ACTUALIZADO
        fichaEntregada: false,
        rama: idBusqueda,
        etapa: CONFIG_RAMA.etapas[0].id 
      });
    }
  }, [scout, open, idBusqueda, CONFIG_RAMA]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (dniYaExiste) {
      alert("No se puede guardar: El DNI ya existe en el sistema.");
      return;
    }
    onSave({
      ...formData,
      rama: idBusqueda 
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4, p: 1 } }}>
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ pb: 0 }}>
          <Typography variant="h5" sx={{ fontWeight: 900 }}>
            {scout ? 'Gestionar Miembro' : 'Nuevo Protagonista'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Unidad: <strong style={{ color: CONFIG_RAMA.color }}>{CONFIG_RAMA.nombre}</strong>
          </Typography>
        </DialogTitle>

        <DialogContent>
          <Box sx={{ pt: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Nombre" name="nombre" value={formData.nombre} onChange={handleChange} required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{ color: CONFIG_RAMA.color }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Apellido" name="apellido" value={formData.apellido} onChange={handleChange} required />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField 
                  fullWidth 
                  label="DNI" 
                  name="dni" 
                  value={formData.dni} 
                  onChange={handleChange} 
                  required
                  error={dniYaExiste}
                  helperText={dniYaExiste ? "Este DNI ya está registrado" : ""}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Badge sx={{ color: dniYaExiste ? 'error.main' : CONFIG_RAMA.color }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Fecha de Nacimiento" name="fechaNacimiento" type="date" value={formData.fechaNacimiento} onChange={handleChange} required InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Cake sx={{ color: CONFIG_RAMA.color }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Equipo / Patrulla" name="equipo" value={formData.equipo} onChange={handleChange} placeholder={idBusqueda === 'MANADA' ? "Ej: Seonee" : "Ej: Bruno Racua"}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Group sx={{ color: CONFIG_RAMA.color }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* SELECTOR DE CARGO / FUNCIÓN ACTUALIZADO */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="select-funcion-label">Cargo / Función</InputLabel>
                  <Select
                    labelId="select-funcion-label"
                    name="funcion"
                    value={formData.funcion || 'Protagonista'}
                    label="Cargo / Función"
                    onChange={handleChange}
                    startAdornment={
                      <InputAdornment position="start">
                        <Star sx={{ color: CONFIG_RAMA.color }} />
                      </InputAdornment>
                    }
                  >
                    <MenuItem value="Protagonista">Protagonista</MenuItem>
                    <MenuItem value={esRamaConPatrullas ? "Guía" : "Responsable"}>
                      {esRamaConPatrullas ? "Guía" : "Responsable"}
                    </MenuItem>
                    <MenuItem value={esRamaConPatrullas ? "Subguía" : "Sub-responsable"}>
                      {esRamaConPatrullas ? "Subguía" : "Sub-responsable"}
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ 
                  p: 2, borderRadius: 3, display: 'flex', alignItems: 'center', gap: 2,
                  bgcolor: formData.fichaEntregada ? 'rgba(0, 184, 148, 0.05)' : 'rgba(214, 48, 49, 0.05)',
                  border: `1px solid ${formData.fichaEntregada ? '#c6f6d5' : '#fed7d7'}`,
                  mt: 1
                }}>
                  {formData.fichaEntregada ? (
                    <>
                      <CheckCircleOutline sx={{ color: '#00b894' }} />
                      <Box>
                        <Typography sx={{ fontWeight: 700, color: '#00b894' }}>Ficha Médica Recibida</Typography>
                        <Typography variant="caption" color="text.secondary">Validada por la Secretaría del Grupo Tupahue.</Typography>
                      </Box>
                    </>
                  ) : (
                    <>
                      <HighlightOff sx={{ color: '#d63031' }} />
                      <Box>
                        <Typography sx={{ fontWeight: 700, color: '#d63031' }}>Ficha Médica Pendiente</Typography>
                        <Typography variant="caption" color="text.secondary">El protagonista no puede participar de campamentos sin este documento.</Typography>
                      </Box>
                    </>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button onClick={onClose} color="inherit" sx={{ fontWeight: 700 }}>Cancelar</Button>
          <Button type="submit" variant="contained" disabled={dniYaExiste}
            sx={{ 
              bgcolor: CONFIG_RAMA.color, fontWeight: 800, px: 4, borderRadius: 2,
              '&:hover': { bgcolor: CONFIG_RAMA.color, filter: 'brightness(0.9)' }
            }}
          >
            {scout ? 'Guardar Cambios' : 'Crear Protagonista'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};