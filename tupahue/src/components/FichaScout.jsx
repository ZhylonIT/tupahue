import { 
  Dialog, DialogTitle, DialogContent, Box, Typography, Grid, 
  Avatar, Divider, Stack, IconButton, Button, Paper, Alert 
} from '@mui/material';
import { 
  Close, LocalHospital, Phone, Home, Assignment, 
  HistoryEdu, CheckCircle 
} from '@mui/icons-material';

export const FichaScout = ({ open, onClose, scout, onAvalarIngreso }) => {
  if (!scout) return null;

  // Extraemos datos existentes cargados por la familia
  const dm = scout.datosMedicos || {};
  const dp = scout.datosPersonales || {};
  
  // Lógica de visualización del banner de aval
  const tieneIngresoPendiente = scout.documentos?.includes('ingreso_menores') && !scout.avaladoPorEducadores;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth scroll="paper">
      <DialogTitle sx={{ m: 0, p: 2, bgcolor: '#f5f5f5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar sx={{ bgcolor: '#5A189A', width: 50, height: 50 }}>
            {scout.apellido?.charAt(0) || scout.nombre?.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight={800}>{scout.apellido}, {scout.nombre}</Typography>
            <Typography variant="caption" color="text.secondary">DNI: {scout.dni} • Rama: {scout.rama}</Typography>
          </Box>
        </Stack>
        <IconButton onClick={onClose}><Close /></IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 3 }}>
        
        {/* BANNER DE AVAL */}
        {tieneIngresoPendiente && (
          <Alert 
            severity="warning" 
            variant="filled"
            icon={<HistoryEdu />}
            action={
              <Button color="inherit" size="small" variant="outlined" onClick={() => onAvalarIngreso(scout.id)} sx={{ fontWeight: 'bold' }}>
                AVALAR AHORA
              </Button>
            }
            sx={{ mb: 3, borderRadius: 3 }}
          >
            Autorización de Ingreso pendiente de aval por educador.
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* INFORMACIÓN DE SALUD */}
          <Grid item xs={12} md={6}>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, height: '100%' }}>
              <Typography variant="subtitle2" color="primary" fontWeight={800} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocalHospital fontSize="small" /> Información de Salud
              </Typography>
              <Divider sx={{ mb: 1 }} />
              <Stack spacing={1}>
                <Box>
                  <Typography variant="caption" color="text.secondary">Alergias:</Typography>
                  <Typography variant="body2" fontWeight={700} color={dm.alergia ? "error" : "success.main"}>
                    {dm.alergia ? `SÍ: ${dm.cualAlergia}` : 'No declara'}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Obra Social / Prepaga:</Typography>
                  <Typography variant="body2">{dm.obraSocial || 'No especificada'}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Contacto de Emergencia:</Typography>
                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Phone sx={{ fontSize: 14 }} /> {dm.telEmergencia1} ({dm.personaEmergencia1})
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>

          {/* RESPONSABLES LEGALES - CORREGIDO SIMETRÍA */}
          <Grid item xs={12} md={6}>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, height: '100%' }}>
              <Typography variant="subtitle2" color="primary" fontWeight={800} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Assignment fontSize="small" /> Responsables Legales
              </Typography>
              <Divider sx={{ mb: 1 }} />
              <Stack spacing={2}>
                {/* Tutor 1 */}
                <Box>
                  <Typography variant="body2" fontWeight={700}>{dp.tutor1Nombre || 'No cargado'}</Typography>
                  <Typography variant="caption" display="block" color="text.secondary">
                    {dp.tutor1Vinculo} • DNI: {dp.tutor1Dni}
                  </Typography>
                  {dp.tutor1Tel && (
                    <Typography variant="caption" sx={{ color: '#2e7d32', fontWeight: 'bold', mt: 0.5, display: 'block' }}>
                      WhatsApp/Tel: {dp.tutor1Tel}
                    </Typography>
                  )}
                </Box>

                {/* Tutor 2 - Ahora con la misma lógica que el Tutor 1 */}
                {dp.tutor2Nombre && (
                  <Box>
                    <Divider sx={{ my: 1, borderStyle: 'dashed' }} />
                    <Typography variant="body2" fontWeight={700}>{dp.tutor2Nombre}</Typography>
                    <Typography variant="caption" display="block" color="text.secondary">
                      {dp.tutor2Vinculo} • DNI: {dp.tutor2Dni}
                    </Typography>
                    {dp.tutor2Tel && (
                      <Typography variant="caption" sx={{ color: '#2e7d32', fontWeight: 'bold', mt: 0.5, display: 'block' }}>
                        WhatsApp/Tel: {dp.tutor2Tel}
                      </Typography>
                    )}
                  </Box>
                )}
              </Stack>
            </Paper>
          </Grid>

          {/* DOMICILIO */}
          <Grid item xs={12}>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
              <Typography variant="subtitle2" color="primary" fontWeight={800} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Home fontSize="small" /> Domicilio Declarado
              </Typography>
              <Divider sx={{ mb: 1 }} />
              <Typography variant="body2">
                {dm.domicilio || 'No especificado en Ficha Médica'}
              </Typography>
            </Paper>
          </Grid>

          {/* LOG DE AVAL */}
          {scout.avaladoPorEducadores && (
            <Grid item xs={12}>
              <Box sx={{ p: 2, bgcolor: '#e8f5e9', borderRadius: 2, border: '1px solid #c8e6c9', display: 'flex', alignItems: 'center', gap: 2 }}>
                <CheckCircle sx={{ color: '#2e7d32' }} />
                <Box>
                  <Typography variant="caption" sx={{ color: '#2e7d32', fontWeight: 'bold', display: 'block' }}>
                    AVALADO POR EDUCADORES
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Firmado por {scout.educadorAvalista} el {scout.fechaAval}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          )}
        </Grid>
      </DialogContent>
    </Dialog>
  );
};