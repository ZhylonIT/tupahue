import { useState, useEffect } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, Box, Typography, Grid, 
  Avatar, Stack, IconButton, Button, Paper, 
  CircularProgress, List, ListItem, ListItemIcon, ListItemText
} from '@mui/material';
import { 
  Close, HistoryEdu, VerifiedUser, 
  ErrorOutline, CheckCircle
} from '@mui/icons-material';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext'; 

const NOMBRES_DOCUMENTOS = {
  ingreso_menores: 'Autorización de Ingreso (<18)',
  ddjj_campamento_mayor: 'DDJJ Participación (>18)',
  fotocopias_dni: 'DNI (Padres e Hijo)',
  partida_nacimiento: 'Partida de Nacimiento',
  ficha_medica: 'Ficha Médica',
  ficha_personales: 'Datos Personales',
  salidas_cercanas: 'Salidas Cercanas',
  uso_imagen: 'Uso de Imagen',
  auto_campamento_menor: 'Última Salida/Campamento'
};

export const FichaScout = ({ open, onClose, scout, onAvalarIngreso }) => {
  const { user } = useAuth(); 
  const [archivosReales, setArchivosReales] = useState([]);
  const [loadingFiles, setLoadingFiles] = useState(false);

  useEffect(() => {
    if (open && scout?.id) {
      checkStorageFiles();
    }
  }, [open, scout]);

  const checkStorageFiles = async () => {
    setLoadingFiles(true);
    try {
      const { data: carpetas, error } = await supabase.storage.from('documentos').list(scout.id);
      if (error) throw error;
      const idsExistentes = carpetas?.map(c => c.name) || [];
      setArchivosReales(idsExistentes);
    } catch (e) {
      console.error("Error validando archivos en Storage:", e);
    } finally {
      setLoadingFiles(false);
    }
  };

  if (!scout) return null;

  const dm = scout.datosMedicos || {};

  // 🎯 LÓGICA ESTRICTA BASADA EN LA FUNCIÓN (Corregido para leer Array 'funciones')
  const esJefe = Array.isArray(user?.funciones) ? user.funciones.some(f => f.includes('JEFE')) : false;
  
  const tieneIngreso = archivosReales.includes('ingreso_menores');
  const tieneOtrosDocs = ['salidas_cercanas', 'auto_campamento_menor', 'ddjj_campamento_mayor'].some(id => archivosReales.includes(id));

  const faltaJefe = tieneIngreso && !scout.aval_jefe_firma;
  const faltaEdu = (tieneIngreso && !scout.aval_educador_firma) || (tieneOtrosDocs && !scout.firmaDigitalImg);

  let mostrarBannerAval = false;
  let mensajeDinamico = "";
  let botonAvalarHabilitado = false;

  if (faltaJefe || faltaEdu) {
    mostrarBannerAval = true;
    
    if (esJefe) {
      if (faltaJefe && faltaEdu) { mensajeDinamico = "Faltan firmas de Jefe de Grupo y Educador."; botonAvalarHabilitado = true; }
      else if (faltaJefe) { mensajeDinamico = "Falta tu firma como Jefe de Grupo."; botonAvalarHabilitado = true; }
      else if (faltaEdu) { mensajeDinamico = "A la espera de la firma del Educador de Rama."; botonAvalarHabilitado = false; }
    } else {
      if (faltaJefe && faltaEdu) { mensajeDinamico = "Faltan firmas de Jefe de Grupo y Educador."; botonAvalarHabilitado = true; }
      else if (faltaEdu) { mensajeDinamico = "Falta tu firma de Aval."; botonAvalarHabilitado = true; }
      else if (faltaJefe) { mensajeDinamico = "A la espera de la firma del Jefe de Grupo."; botonAvalarHabilitado = false; }
    }
  }

  const estaCompletamenteAvalado = scout.avaladoPorEducadores || (!faltaJefe && !faltaEdu && (tieneIngreso || tieneOtrosDocs));

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth scroll="paper" PaperProps={{ sx: { borderRadius: 4, backgroundImage: 'none' } }}>
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
        
        {mostrarBannerAval && (
          <Paper elevation={0} sx={{ mb: 3, p: 2.5, borderRadius: 3, bgcolor: '#fff4e5', border: '2px dashed #ffa726', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 4px 12px rgba(255, 167, 38, 0.1)' }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Box sx={{ bgcolor: '#ffa726', p: 1, borderRadius: '50%', display: 'flex' }}><HistoryEdu sx={{ color: 'white' }} /></Box>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#663c00' }}>
                  AVAL DE DOCUMENTACIÓN PENDIENTE
                </Typography>
                <Typography variant="caption" sx={{ color: '#663c00', display: 'block' }}>
                  {mensajeDinamico}
                </Typography>
              </Box>
            </Stack>
            {botonAvalarHabilitado && (
              <Button variant="contained" size="small" onClick={() => onAvalarIngreso(scout)} sx={{ bgcolor: '#ef6c00', fontWeight: 900, px: 3, borderRadius: 2, '&:hover': { bgcolor: '#e65100' } }}>
                AVALAR AHORA
              </Button>
            )}
          </Paper>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, bgcolor: '#fcfcfc' }}>
              <Typography variant="caption" sx={{ fontWeight: 900, color: 'text.secondary', display: 'block', mb: 1.5, textTransform: 'uppercase', letterSpacing: 1 }}>
                Checklist de Archivos
              </Typography>
              {loadingFiles ? (
                <Box sx={{ textAlign: 'center', py: 2 }}><CircularProgress size={20} /></Box>
              ) : (
                <List dense sx={{ p: 0 }}>
                  {Object.entries(NOMBRES_DOCUMENTOS).map(([id, nombre]) => {
                    const existe = archivosReales.includes(id);
                    return (
                      <ListItem key={id} sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 30 }}>
                          {existe ? <CheckCircle sx={{ fontSize: 18, color: '#4caf50' }} /> : <ErrorOutline sx={{ fontSize: 18, color: '#bdbdbd' }} />}
                        </ListItemIcon>
                        <ListItemText primary={nombre} primaryTypographyProps={{ variant: 'caption', fontWeight: existe ? 700 : 500, color: existe ? 'text.primary' : 'text.disabled' }} />
                      </ListItem>
                    );
                  })}
                </List>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12} md={8}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                 <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, borderLeft: '4px solid #c62828' }}>
                    <Typography variant="caption" sx={{ fontWeight: 900, color: '#c62828', display: 'block', mb: 0.5 }}>ALERGIAS</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>{dm.alergia ? dm.cualAlergia : 'Sin alergias declaradas'}</Typography>
                 </Paper>
              </Grid>
              <Grid item xs={12} sm={6}>
                 <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, borderLeft: '4px solid #1565c0' }}>
                    <Typography variant="caption" sx={{ fontWeight: 900, color: '#1565c0', display: 'block', mb: 0.5 }}>EMERGENCIA</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>{dm.telEmergencia1 || 'No cargado'}</Typography>
                 </Paper>
              </Grid>
              
              <Grid item xs={12}>
                {dm.firmaPadre && (
                  <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, display: 'flex', alignItems: 'center', gap: 2, borderStyle: 'dashed' }}>
                    <Box sx={{ bgcolor: '#eee', p: 0.5, borderRadius: 1 }}><img src={dm.firmaPadre} alt="Firma" style={{ maxHeight: 40, maxWidth: 100, mixBlendMode: 'multiply' }} /></Box>
                    <Box>
                      <Typography variant="caption" sx={{ fontWeight: 900, display: 'block', color: 'text.secondary' }}>DDJJ SALUD FIRMADA POR:</Typography>
                      <Typography variant="caption" sx={{ fontWeight: 700 }}>{dm.aclaracionPadre} ({dm.fechaFirmaPadre})</Typography>
                    </Box>
                  </Paper>
                )}
              </Grid>
            </Grid>
          </Grid>

          {estaCompletamenteAvalado && (
            <Grid item xs={12}>
              <Paper sx={{ p: 2.5, bgcolor: '#f1f8e9', border: '2px solid #81c784', borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <Stack direction="row" spacing={3} alignItems="center">
                  <VerifiedUser sx={{ color: '#2e7d32', fontSize: 35 }} />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle2" sx={{ color: '#2e7d32', fontWeight: 900, letterSpacing: 0.5 }}>LEGAJO AVALADO POR EL GRUPO</Typography>
                    <Typography variant="caption" display="block">El documento cuenta con todos los avales registrados. {scout.fechaAval}</Typography>
                  </Box>

                  {(scout.aval_educador_firma || scout.firmaDigitalImg) && (
                    <Box sx={{ textAlign: 'center', borderRight: scout.aval_jefe_firma ? '1px solid #ccc' : 'none', pr: scout.aval_jefe_firma ? 2 : 0 }}>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block' }}>Educador/a</Typography>
                      <img src={scout.aval_educador_firma || scout.firmaDigitalImg} style={{ maxHeight: 40, filter: 'grayscale(1) contrast(1.2)' }} alt="Sello Aval Educador" />
                      <Typography variant="caption" sx={{ display: 'block', fontSize: '0.65rem' }}>{scout.aval_educador_aclaracion || scout.educadorAvalista}</Typography>
                    </Box>
                  )}

                  {scout.aval_jefe_firma && (
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block' }}>Jefe de Grupo</Typography>
                      <img src={scout.aval_jefe_firma} style={{ maxHeight: 40, filter: 'grayscale(1) contrast(1.2)' }} alt="Sello Aval Jefe" />
                      <Typography variant="caption" sx={{ display: 'block', fontSize: '0.65rem' }}>{scout.aval_jefe_aclaracion}</Typography>
                    </Box>
                  )}
                </Stack>
              </Paper>
            </Grid>
          )}
        </Grid>
      </DialogContent>
    </Dialog>
  );
};