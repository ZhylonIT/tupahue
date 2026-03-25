import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, Grid, Box, Typography, Avatar, Divider, Chip, Stack 
} from '@mui/material';
import { 
  Person, Badge, Cake, Bloodtype, Group, 
  Phone, MedicalServices, EscalatorWarning, CheckCircle, ErrorOutline 
} from '@mui/icons-material';
import { RAMAS } from '../constants/ramas';

export const ScoutDetailModal = ({ open, onClose, scout, ramaId }) => {
  if (!scout) return null;

  const idBusqueda = ramaId.toUpperCase();
  const CONFIG_RAMA = RAMAS[idBusqueda] || RAMAS.CAMINANTES;

  // Función para calcular la edad
  const calcularEdad = (fecha) => {
    if (!fecha) return 'S/D';
    const hoy = new Date();
    const cumple = new Date(fecha);
    let edad = hoy.getFullYear() - cumple.getFullYear();
    const m = hoy.getMonth() - cumple.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < cumple.getDate())) edad--;
    return edad;
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{ sx: { borderRadius: 4, overflow: 'hidden' } }}
    >
      {/* Cabecera con color de Rama */}
      <Box sx={{ bgcolor: CONFIG_RAMA.color, p: 3, color: 'white', position: 'relative' }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar sx={{ width: 70, height: 70, bgcolor: 'white', color: CONFIG_RAMA.color, border: '3px solid rgba(255,255,255,0.3)' }}>
            <Person sx={{ fontSize: 40 }} />
          </Avatar>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 900, lineHeight: 1.2 }}>
              {scout.apellido.toUpperCase()}, {scout.nombre}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 600 }}>
              {CONFIG_RAMA.nombre} • {scout.equipo || 'Sin Equipo'}
            </Typography>
          </Box>
        </Stack>
      </Box>

      <DialogContent sx={{ p: 3 }}>
        <Grid container spacing={3}>
          
          {/* Datos Personales */}
          <Grid item xs={12}>
            <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 800 }}>Información General</Typography>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Badge sx={{ color: CONFIG_RAMA.color }} />
                <Typography variant="body1"><strong>DNI:</strong> {scout.dni}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Cake sx={{ color: CONFIG_RAMA.color }} />
                <Typography variant="body1">
                  <strong>Nacimiento:</strong> {scout.fechaNacimiento} ({calcularEdad(scout.fechaNacimiento)} años)
                </Typography>
              </Box>
            </Stack>
          </Grid>

          <Grid item xs={12}><Divider /></Grid>

          {/* FICHA MÉDICA (Datos que vienen del sistema) */}
          <Grid item xs={12}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 800 }}>Ficha Médica</Typography>
              <Chip 
                label={scout.fichaEntregada ? "COMPLETA" : "PENDIENTE"} 
                color={scout.fichaEntregada ? "success" : "error"}
                size="small"
                variant="filled"
                sx={{ fontWeight: 800, fontSize: '0.65rem' }}
              />
            </Stack>

            {scout.fichaEntregada ? (
              <Grid container spacing={2} sx={{ mt: 0.5 }}>
                <Grid item xs={6}>
                  <Box sx={{ p: 1.5, bgcolor: '#f8f9fa', borderRadius: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Bloodtype color="error" />
                    <Box>
                      <Typography variant="caption" display="block" color="text.secondary">Grupo Sanguíneo</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>{scout.sangre || 'A+'}</Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ p: 1.5, bgcolor: '#f8f9fa', borderRadius: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <MedicalServices sx={{ color: '#00b894' }} />
                    <Box>
                      <Typography variant="caption" display="block" color="text.secondary">Alergias</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>Ninguna</Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ p: 1.5, bgcolor: '#fff9db', borderRadius: 2, border: '1px solid #fab005' }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <EscalatorWarning sx={{ color: '#f08c00' }} />
                      <Box>
                        <Typography variant="caption" display="block" color="text.secondary">Contacto de Emergencia</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>Madre: 11 1234-5678</Typography>
                      </Box>
                    </Stack>
                  </Box>
                </Grid>
              </Grid>
            ) : (
              <Box sx={{ p: 3, textAlign: 'center', bgcolor: '#fff5f5', borderRadius: 3, mt: 1 }}>
                <ErrorOutline color="error" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="body2" color="error" sx={{ fontWeight: 600 }}>
                  Atención: La familia aún no ha cargado los datos de salud.
                </Typography>
              </Box>
            )}
          </Grid>

        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3, bgcolor: '#fafafa' }}>
        <Button onClick={onClose} fullWidth variant="outlined" sx={{ borderRadius: 2, fontWeight: 700, borderColor: '#ddd', color: '#666' }}>
          Cerrar Vista
        </Button>
      </DialogActions>
    </Dialog>
  );
};