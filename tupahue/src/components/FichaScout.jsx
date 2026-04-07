import { 
  Dialog, DialogTitle, DialogContent, Box, Typography, Grid, 
  Avatar, Divider, Stack, IconButton, Button, Paper, Alert 
} from '@mui/material';
import { 
  Close, LocalHospital, Phone, Home, Assignment, 
  HistoryEdu, CheckCircle, VerifiedUser, LocationOn
} from '@mui/icons-material';

export const FichaScout = ({ open, onClose, scout, onAvalarIngreso }) => {
  if (!scout) return null;

  const dm = scout.datosMedicos || {};
  const dp = scout.datosPersonales || {};
  const ds = scout.datosSalidas || {}; 
  const tieneIngresoPendiente = scout.documentos?.includes('ingreso_menores') && !scout.avaladoPorEducadores;

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth 
      scroll="paper" 
      PaperProps={{ sx: { borderRadius: 4, backgroundImage: 'none' } }}
    >
      <DialogTitle sx={{ m: 0, p: 2, bgcolor: '#f8f9fa', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee' }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar sx={{ bgcolor: '#5A189A', width: 55, height: 55, fontWeight: 900, fontSize: '1.5rem' }}>
            {scout.apellido?.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 900, lineHeight: 1.2, color: '#1a1a1a' }}>
              {scout.apellido?.toUpperCase()}, {scout.nombre}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
              DNI: {scout.dni} • Rama: <Box component="span" sx={{ color: '#5A189A' }}>{scout.rama?.toUpperCase()}</Box>
            </Typography>
          </Box>
        </Stack>
        <IconButton onClick={onClose} sx={{ color: '#666' }}><Close /></IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3, bgcolor: '#ffffff' }}>
        {/* BANNER: AVAL PENDIENTE */}
        {tieneIngresoPendiente && (
          <Alert 
            severity="warning" 
            variant="filled"
            icon={<HistoryEdu />}
            action={
              <Button color="inherit" size="small" variant="outlined" onClick={() => onAvalarIngreso(scout.id)} sx={{ fontWeight: 900, borderRadius: 2 }}>
                AVALAR INGRESO
              </Button>
            }
            sx={{ mb: 3, borderRadius: 3, fontWeight: 700, boxShadow: '0 4px 12px rgba(237, 108, 2, 0.2)' }}
          >
            Autorización de ingreso cargada por la familia. Pendiente de aval del educador.
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* BLOQUE 1: SALUD */}
          <Grid item xs={12} md={6}>
            <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3, height: '100%', bgcolor: '#fffcfc', borderColor: '#ffebee' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 1, display: 'flex', alignItems: 'center', gap: 1, color: '#c62828' }}>
                <LocalHospital fontSize="small" /> Información de Salud
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Stack spacing={2}>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Alergias:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 800, color: dm.alergia ? "#d32f2f" : "#2e7d32" }}>
                    {dm.alergia ? `SÍ: ${dm.cualAlergia}` : 'No declara'}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Emergencia:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>{dm.telEmergencia1} ({dm.personaEmergencia1})</Typography>
                </Box>
                
                {dm.firmaPadre && (
                  <Box sx={{ mt: 1, p: 1.5, bgcolor: '#ffffff', border: '1px dashed #ffcdd2', borderRadius: 2 }}>
                    <Typography variant="caption" sx={{ fontSize: '10px', fontWeight: 900, color: '#c62828', display: 'block', mb: 0.5 }}>FIRMA DDJJ SALUD:</Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <img src={dm.firmaPadre} alt="Firma" style={{ maxHeight: 35, maxWidth: 90, filter: 'contrast(1.2)' }} />
                      <Typography variant="caption" sx={{ fontSize: '9px', lineHeight: 1.1, color: '#666' }}>
                        {dm.aclaracionPadre}<br/>{dm.fechaFirmaPadre}
                      </Typography>
                    </Stack>
                  </Box>
                )}
              </Stack>
            </Paper>
          </Grid>

          {/* BLOQUE 2: RESPONSABLES */}
          <Grid item xs={12} md={6}>
            <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3, height: '100%', bgcolor: '#f0f7ff', borderColor: '#e3f2fd' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 1, display: 'flex', alignItems: 'center', gap: 1, color: '#1565c0' }}>
                <Assignment fontSize="small" /> Adultos Responsables
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Stack spacing={2}>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 800 }}>{dp.tutor1Nombre || 'Cargando...'}</Typography>
                  <Typography variant="caption" color="text.secondary" display="block">{dp.tutor1Vinculo} • DNI: {dp.tutor1Dni}</Typography>
                  <Typography variant="caption" sx={{ color: '#1565c0', fontWeight: 800 }}>Tel: {dp.tutor1Tel}</Typography>
                </Box>

                {dp.firmaPadre && (
                  <Box sx={{ p: 1.5, bgcolor: '#ffffff', border: '1px dashed #bbdefb', borderRadius: 2 }}>
                    <Typography variant="caption" sx={{ fontSize: '10px', fontWeight: 900, color: '#1565c0', display: 'block', mb: 0.5 }}>FIRMA DATOS PERSONALES:</Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <img src={dp.firmaPadre} alt="Firma" style={{ maxHeight: 35, maxWidth: 90 }} />
                      <Typography variant="caption" sx={{ fontSize: '9px', lineHeight: 1.1, color: '#666' }}>
                        {dp.aclaracionPadre}<br/>DNI: {dp.dniPadre}
                      </Typography>
                    </Stack>
                  </Box>
                )}
              </Stack>
            </Paper>
          </Grid>

          {/* BLOQUE 3: SALIDAS CERCANAS */}
          <Grid item xs={12}>
            <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3, bgcolor: '#f2fdfd', borderColor: '#b2ebf2' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 1, display: 'flex', alignItems: 'center', gap: 1, color: '#00838f' }}>
                <LocationOn fontSize="small" /> Autorización de Salidas Cercanas
              </Typography>
              <Divider sx={{ mb: 1.5 }} />
              {scout.datosSalidas ? (
                <Stack direction="row" spacing={4} alignItems="center">
                  <Box sx={{ p: 1, bgcolor: 'white', border: '1px solid #b2ebf2', borderRadius: 2, display: 'flex', justifyContent: 'center' }}>
                    {ds.firmaPadre ? (
                      <img src={ds.firmaPadre} alt="Firma Salidas" style={{ maxHeight: 45, maxWidth: 100 }} />
                    ) : <Typography variant="caption" color="text.disabled">Sin firma</Typography>}
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 800, color: '#006064' }}>Rango Autorizado: {ds.rangoDistancia || '5 km'}</Typography>
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                      <b>Vigencia:</b> Año {ds.anio} • <b>Firmado por:</b> {ds.aclaracionPadre}
                    </Typography>
                    <Typography variant="caption" color="text.disabled">Fecha: {ds.dia}/{ds.mes}/{ds.anio}</Typography>
                  </Box>
                </Stack>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                  Pendiente de completar por la familia.
                </Typography>
              )}
            </Paper>
          </Grid>

          {/* BLOQUE 4: AVAL INSTITUCIONAL */}
          {scout.avaladoPorEducadores && (
            <Grid item xs={12}>
              <Paper sx={{ p: 2.5, bgcolor: '#f1f8e9', border: '2px solid #81c784', borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <Stack direction="row" spacing={3} alignItems="center">
                  <VerifiedUser sx={{ color: '#2e7d32', fontSize: 35 }} />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle2" sx={{ color: '#2e7d32', fontWeight: 900, letterSpacing: 0.5 }}>LEGADO AVALADO POR EL GRUPO SCOUT</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                      Certificado oficialmente por: <Box component="span" sx={{ color: '#1b5e20' }}>{scout.educadorAvalista}</Box>
                    </Typography>
                    <Typography variant="caption" display="block" sx={{ fontSize: '10px' }}>
                      Fecha de Aval: {scout.fechaAval} • Registro Interno: SAAC-996-{scout.dni}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center', minWidth: 100 }}>
                    {scout.firmaDigitalImg ? (
                      <img src={scout.firmaDigitalImg} alt="Firma Educador" style={{ maxHeight: 50, filter: 'grayscale(1) contrast(1.5)' }} />
                    ) : (
                      <Typography variant="caption" color="text.disabled">Sello Digital</Typography>
                    )}
                  </Box>
                </Stack>
              </Paper>
            </Grid>
          )}
        </Grid>
      </DialogContent>
    </Dialog>
  );
};