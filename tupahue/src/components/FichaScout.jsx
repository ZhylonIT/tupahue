import { useState, useEffect } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, Box, Typography, Grid, 
  Avatar, Divider, Stack, IconButton, Button, Paper, Alert, 
  CircularProgress, List, ListItem, ListItemIcon, ListItemText
} from '@mui/material';
import { 
  Close, LocalHospital, Assignment, 
  HistoryEdu, VerifiedUser, LocationOn, 
  InsertDriveFile, ErrorOutline, CheckCircle
} from '@mui/icons-material';
import { supabase } from '../lib/supabaseClient';

const NOMBRES_DOCUMENTOS = {
  ingreso_menores: 'Autorización de Ingreso',
  fotocopias_dni: 'DNI (Padres e Hijo)',
  partida_nacimiento: 'Partida de Nacimiento',
  ficha_medica: 'Ficha Médica',
  ficha_personales: 'Datos Personales',
  salidas_cercanas: 'Salidas Cercanas',
  uso_imagen: 'Uso de Imagen',
  auto_campamento_menor: 'Última Salida/Campamento'
};

export const FichaScout = ({ open, onClose, scout, onAvalarIngreso }) => {
  const [archivosReales, setArchivosReales] = useState([]);
  const [loadingFiles, setLoadingFiles] = useState(false);

  // 🎯 Lógica de "Vida": Verificamos qué hay realmente en el Storage al abrir
  useEffect(() => {
    if (open && scout) {
      checkStorageFiles();
    }
  }, [open, scout]);

  const checkStorageFiles = async () => {
    setLoadingFiles(true);
    try {
      // Listamos la carpeta raíz del scout para ver qué subcarpetas tienen archivos
      const { data: carpetas } = await supabase.storage.from('documentos').list(scout.id);
      // Guardamos solo los IDs de los documentos que tienen al menos un archivo dentro
      const idsExistentes = carpetas?.map(c => c.name) || [];
      setArchivosReales(idsExistentes);
    } catch (e) {
      console.error("Error validando archivos:", e);
    } finally {
      setLoadingFiles(false);
    }
  };

  if (!scout) return null;

  const dm = scout.datosMedicos || {};
  const dp = scout.datosPersonales || {};
  const ds = scout.datosSalidas || {}; 
  
  // 🎯 El aval se requiere si tiene la ficha de ingreso pero el educador no firmó aún
  const tieneIngresoEnStorage = archivosReales.includes('ingreso_menores');
  const requiereAval = tieneIngresoEnStorage && !scout.avaladoPorEducadores;

  return (
    <Dialog 
      open={open} onClose={onClose} maxWidth="md" fullWidth scroll="paper" 
      PaperProps={{ sx: { borderRadius: 4 } }}
    >
      <DialogTitle sx={{ m: 0, p: 2, bgcolor: '#f8f9fa', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee' }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar sx={{ bgcolor: '#5A189A', width: 55, height: 55, fontWeight: 900 }}>
            {scout.apellido?.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 900, lineHeight: 1.2 }}>
              {scout.apellido?.toUpperCase()}, {scout.nombre}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
              DNI: {scout.dni} • Rama: <Box component="span" sx={{ color: '#5A189A' }}>{scout.rama?.toUpperCase()}</Box>
            </Typography>
          </Box>
        </Stack>
        <IconButton onClick={onClose}><Close /></IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        
        {/* 🎯 PUNTO 3: MEJORA ESTÉTICA AVISO DE AVAL */}
        {requiereAval && (
          <Paper 
            elevation={0}
            sx={{ 
              mb: 3, p: 2, borderRadius: 3, 
              bgcolor: '#fff4e5', border: '2px dashed #ffa726',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between'
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Box sx={{ bgcolor: '#ffa726', p: 1, borderRadius: '50%', display: 'flex' }}>
                <HistoryEdu sx={{ color: 'white' }} />
              </Box>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#663c00' }}>
                  AVAL PENDIENTE
                </Typography>
                <Typography variant="caption" sx={{ color: '#663c00' }}>
                  La familia ya cargó la autorización de ingreso. Revisá los datos y avalá el legajo.
                </Typography>
              </Box>
            </Stack>
            <Button 
              variant="contained" size="small"
              onClick={() => onAvalarIngreso(scout)}
              sx={{ bgcolor: '#ef6c00', fontWeight: 900, '&:hover': { bgcolor: '#e65100' } }}
            >
              AVALAR AHORA
            </Button>
          </Paper>
        )}

        <Grid container spacing={3}>
          {/* ESTADO DOCUMENTAL REAL */}
          <Grid item xs={12} md={4}>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, bgcolor: '#fcfcfc' }}>
              <Typography variant="caption" sx={{ fontWeight: 900, color: 'text.secondary', display: 'block', mb: 1.5, textTransform: 'uppercase' }}>
                Checklist Digital
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
                        <ListItemText 
                          primary={nombre} 
                          primaryTypographyProps={{ variant: 'caption', fontWeight: existe ? 700 : 500, color: existe ? 'text.primary' : 'text.disabled' }} 
                        />
                      </ListItem>
                    );
                  })}
                </List>
              )}
            </Paper>
          </Grid>

          {/* DATOS MÉDICOS */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                 <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, borderLeft: '4px solid #c62828' }}>
                    <Typography variant="caption" sx={{ fontWeight: 900, color: '#c62828' }}>ALERGIAS</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {dm.alergia ? dm.cualAlergia : 'Sin alergias declaradas'}
                    </Typography>
                 </Paper>
              </Grid>
              <Grid item xs={12} sm={6}>
                 <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, borderLeft: '4px solid #1565c0' }}>
                    <Typography variant="caption" sx={{ fontWeight: 900, color: '#1565c0' }}>EMERGENCIA</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>{dm.telEmergencia1}</Typography>
                 </Paper>
              </Grid>
              
              {/* FIRMA DE SALUD */}
              <Grid item xs={12}>
                {dm.firmaPadre && (
                  <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <img src={dm.firmaPadre} alt="Firma" style={{ maxHeight: 40, maxWidth: 100 }} />
                    <Box>
                      <Typography variant="caption" sx={{ fontWeight: 900, display: 'block' }}>DDJJ SALUD FIRMADA POR:</Typography>
                      <Typography variant="caption">{dm.aclaracionPadre} ({dm.fechaFirmaPadre})</Typography>
                    </Box>
                  </Paper>
                )}
              </Grid>
            </Grid>
          </Grid>

          {/* AVAL FINALIZADO */}
          {scout.avaladoPorEducadores && (
            <Grid item xs={12}>
              <Paper sx={{ p: 2.5, bgcolor: '#f1f8e9', border: '2px solid #81c784', borderRadius: 3 }}>
                <Stack direction="row" spacing={3} alignItems="center">
                  <VerifiedUser sx={{ color: '#2e7d32', fontSize: 35 }} />
                  <Box>
                    <Typography variant="subtitle2" sx={{ color: '#2e7d32', fontWeight: 900 }}>LEGAJO AVALADO POR EL GRUPO</Typography>
                    <Typography variant="caption" display="block">Avalista: <b>{scout.educadorAvalista}</b> • {scout.fechaAval}</Typography>
                  </Box>
                  <Box sx={{ ml: 'auto' }}>
                    <img src={scout.firmaDigitalImg} style={{ maxHeight: 45, filter: 'grayscale(1)' }} />
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