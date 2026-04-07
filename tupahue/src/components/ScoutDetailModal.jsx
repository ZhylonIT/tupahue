import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, Grid, Box, Typography, Avatar, Divider, Chip, Stack, Alert 
} from '@mui/material';
import { 
  Person, Badge, Cake, Bloodtype, Group, 
  Phone, MedicalServices, EscalatorWarning, CheckCircle, ErrorOutline,
  FileDownload // 🎯 Nuevo Icono
} from '@mui/icons-material';
import { RAMAS } from '../constants/ramas';
// 🎯 IMPORTAMOS EL SERVICIO OFICIAL
import { generarFichaMedicaPDF, generarFichaPersonalesPDF } from '../services/pdfService';

export const ScoutDetailModal = ({ open, onClose, scout, ramaId }) => {
  if (!scout) return null;

  const idBusqueda = ramaId ? ramaId.toUpperCase() : 'CAMINANTES';
  const CONFIG_RAMA = RAMAS[idBusqueda] || RAMAS.CAMINANTES;
  const dm = scout.datosMedicos || {};
  const dp = scout.datosPersonales || {}; // 🎯 Datos personales para el PDF
  const fichaCompleta = scout.fichaEntregada;

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
      <Box sx={{ bgcolor: CONFIG_RAMA.color, p: 3, color: 'white' }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar sx={{ width: 70, height: 70, bgcolor: 'white', color: CONFIG_RAMA.color, border: '3px solid rgba(255,255,255,0.3)' }}>
            <Person sx={{ fontSize: 40 }} />
          </Avatar>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 900, lineHeight: 1.2 }}>
              {scout.apellido.toUpperCase()}, {scout.nombre}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 600 }}>
              {CONFIG_RAMA.nombre} • {scout.equipo || scout.patrulla || 'Sin Equipo'}
            </Typography>
          </Box>
        </Stack>
      </Box>

      <DialogContent sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {/* Alertas Críticas (Convulsiones, Pánico, CUD) */}
          {(dm.convulsiones || dm.panico || dm.cud) && (
            <Grid item xs={12}>
              <Alert severity="error" sx={{ borderRadius: 3, fontWeight: 700 }}>
                ATENCIÓN: {dm.convulsiones ? 'CONVULSIONES. ' : ''}{dm.panico ? 'PÁNICO. ' : ''}{dm.cud ? 'CUD. ' : ''}
              </Alert>
            </Grid>
          )}

          {/* Datos Personales */}
          <Grid item xs={12}>
            <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 800 }}>Información General</Typography>
            <Stack spacing={1.5} sx={{ mt: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Badge sx={{ color: CONFIG_RAMA.color, fontSize: 20 }} />
                <Typography variant="body2"><strong>DNI:</strong> {scout.dni || 'S/D'}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Cake sx={{ color: CONFIG_RAMA.color, fontSize: 20 }} />
                <Typography variant="body2">
                  <strong>Nacimiento:</strong> {scout.fechaNacimiento || 'S/D'} ({calcularEdad(scout.fechaNacimiento)} años)
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Bloodtype sx={{ color: 'error.main', fontSize: 20 }} />
                <Typography variant="body2"><strong>Grupo Sanguíneo:</strong> {dm.grupoSanguineo} {dm.factorRh}</Typography>
              </Box>
            </Stack>
          </Grid>

          <Grid item xs={12}><Divider /></Grid>

          {/* BOTONES DE DESCARGA OFICIAL SAAC */}
          <Grid item xs={12}>
            <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 800, mb: 1, display: 'block' }}>Descargar Documentación Oficial (SAAC)</Typography>
            <Stack direction="row" spacing={2}>
              <Button 
                fullWidth 
                variant="contained" 
                color="primary" 
                startIcon={<FileDownload />}
                onClick={() => generarFichaMedicaPDF(scout)}
                sx={{ borderRadius: 2, fontWeight: 700, textTransform: 'none' }}
              >
                Ficha Médica
              </Button>
              <Button 
                fullWidth 
                variant="contained" 
                color="secondary" 
                startIcon={<FileDownload />}
                onClick={() => generarFichaPersonalesPDF(scout)}
                sx={{ borderRadius: 2, fontWeight: 700, textTransform: 'none', bgcolor: '#5A189A' }}
              >
                Datos Personales
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3, bgcolor: '#fafafa' }}>
        <Button onClick={onClose} fullWidth variant="outlined" sx={{ borderRadius: 2, fontWeight: 700, color: '#666' }}>
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};