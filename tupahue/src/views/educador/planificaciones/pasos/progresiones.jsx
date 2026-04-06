import { useEffect, useState, useMemo } from 'react';
import { 
  Typography, Paper, Stack, Box, 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Chip, Button, Avatar,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Divider, Grid
} from '@mui/material';
import { Assessment, NorthEast, Event, Group, Person, ContactPage } from '@mui/icons-material';

import { RAMAS } from '../../../../constants/ramas';

// 🎯 Recibimos 'scouts' y 'handlers' desde el Editor
export const PasoProgresiones = ({ ramaId, data, setData, scouts, handlers }) => {
  
  const idBusqueda = ramaId?.toUpperCase() || 'SCOUTS';
  const CONFIG_RAMA = RAMAS[idBusqueda];
  const etapasDefinidas = CONFIG_RAMA?.etapas || [];

  const [modalPaseOpen, setModalPaseOpen] = useState(false);
  const [scoutPase, setScoutPase] = useState(null);
  const [fechaPase, setFechaPase] = useState('');

  const [fichaOpen, setFichaOpen] = useState(false);
  const [scoutFicha, setScoutFicha] = useState(null);

  // 🎯 FILTRADO REAL: Usamos la prop 'scouts' en lugar de localStorage
  const protagonistasRama = useMemo(() => {
    if (!scouts) return [];
    return scouts.filter(s => s.rama?.toString().toUpperCase() === idBusqueda);
  }, [scouts, idBusqueda]);

  const protagonistasPorEtapa = useMemo(() => {
    return etapasDefinidas.reduce((acc, etapa) => {
      acc[etapa.id] = protagonistasRama.filter(p => 
        p.etapa === etapa.id || (!p.etapa && etapa.id === etapasDefinidas[0].id)
      );
      return acc;
    }, {});
  }, [protagonistasRama, etapasDefinidas]);

  useEffect(() => {
    if (protagonistasRama.length > 0) {
      const datosParaPDF = protagonistasRama.map(p => {
        const etapaObj = etapasDefinidas.find(e => e.id === p.etapa) || etapasDefinidas[0];
        return {
          nombre: `${p.nombre} ${p.apellido}`,
          progresion: etapaObj ? etapaObj.nombre.toUpperCase() : 'INICIAL'
        };
      });

      // Solo actualizamos si hay cambios reales para evitar bucles infinitos
      if (!data.progresiones || JSON.stringify(data.progresiones) !== JSON.stringify(datosParaPDF)) {
        setData(prev => ({ ...prev, progresiones: datosParaPDF }));
      }
    }
  }, [protagonistasRama, etapasDefinidas, data.progresiones, setData]);

  const handleAbrirModalPase = (scout) => {
    setScoutPase(scout);
    setFechaPase(''); 
    setModalPaseOpen(true);
  };

  const handleConfirmarPase = async () => {
    if (!fechaPase) {
      alert("Por favor, seleccioná una fecha para el pase.");
      return;
    }

    // 🎯 SINCRONIZACIÓN CON SUPABASE:
    // Usamos el handler que ya sabe guardar en la base de datos
    try {
      if (handlers?.handleAddEvento) {
        await handlers.handleAddEvento({
          titulo: `Pase de Rama: ${scoutPase.nombre} ${scoutPase.apellido}`,
          fecha: fechaPase,
          tipo: 'GRUPAL', 
          color: '#5A189A', 
          descripcion: `Se agendó el pase de rama del protagonista ${scoutPase.nombre} ${scoutPase.apellido} hacia su nueva etapa.`
        });
        alert(`¡Éxito! El pase de ${scoutPase.nombre} fue agendado en el Calendario Grupal de Supabase.`);
      } else {
        throw new Error("No se encontró el controlador de eventos.");
      }
    } catch (error) {
      alert("Error al agendar el pase: " + error.message);
    }
    
    setModalPaseOpen(false);
    setScoutPase(null);
  };

  const handleAbrirFicha = (scout) => {
    setScoutFicha(scout);
    setFichaOpen(true);
  };

  const sectionCardStyle = { borderRadius: 4, overflow: 'hidden', bgcolor: 'white', border: '1px solid #eee', mb: 4 };

  return (
    <Box sx={{ maxWidth: '1000px', mx: 'auto', py: 2 }}>
      
      {/* SECCIÓN 1: DETALLE DE PROGRESIÓN POR ETAPA */}
      <Paper elevation={0} sx={sectionCardStyle}>
        <Box sx={{ px: 3, py: 2, display: 'flex', alignItems: 'center', gap: 1.5, bgcolor: '#fafafa', borderBottom: '1px solid #eee' }}>
          <Assessment color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1rem' }}>
            DETALLE DE PROGRESIÓN POR ETAPA
          </Typography>
        </Box>
        
        <Box sx={{ p: 3 }}>
          {protagonistasRama.length > 0 ? (
            <Stack spacing={3}>
              {etapasDefinidas.map((etapa) => (
                <Box key={etapa.id}>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 900, color: CONFIG_RAMA?.color || 'primary.main' }}>
                      {etapa.nombre.toUpperCase()}
                    </Typography>
                    <Chip 
                      label={`${protagonistasPorEtapa[etapa.id].length} protagonistas`} 
                      size="small" 
                      sx={{ fontWeight: 700, height: 20, fontSize: '0.65rem' }} 
                    />
                  </Stack>

                  <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 3, border: '1px solid #f0f0f0' }}>
                    <Table size="small">
                      <TableBody>
                        {protagonistasPorEtapa[etapa.id].length > 0 ? (
                          protagonistasPorEtapa[etapa.id].map((p, i) => (
                            <TableRow key={i} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                              <TableCell sx={{ width: 50 }}>
                                <Avatar sx={{ width: 28, height: 28, bgcolor: '#f0f4f8', color: 'primary.main' }}>
                                  <Person sx={{ fontSize: '1.2rem' }} />
                                </Avatar>
                              </TableCell>
                              <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>
                                {p.nombre} {p.apellido}
                              </TableCell>
                              <TableCell sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
                                {p.equipo || p.patrulla || 'Sin equipo'}
                              </TableCell>
                              <TableCell align="right">
                                <Button 
                                  size="small" 
                                  onClick={() => handleAbrirFicha(p)}
                                  startIcon={<ContactPage sx={{ fontSize: 16 }} />}
                                  sx={{ textTransform: 'none', fontWeight: 700 }}
                                >
                                  Ver Ficha
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={4} align="center" sx={{ py: 2, color: 'text.disabled', fontStyle: 'italic', fontSize: '0.8rem' }}>
                              No hay chicos en esta etapa actualmente.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              ))}
            </Stack>
          ) : (
            <Stack alignItems="center" spacing={2} sx={{ py: 6 }}>
              <Group sx={{ fontSize: 40, color: 'text.disabled' }} />
              <Typography variant="body2" color="text.secondary">No hay datos en la nómina.</Typography>
            </Stack>
          )}
        </Box>
      </Paper>

      {/* SECCIÓN 2: PRÓXIMOS PASES DE RAMA */}
      <Paper elevation={0} sx={sectionCardStyle}>
        <Box sx={{ px: 3, py: 2, display: 'flex', alignItems: 'center', gap: 1.5, bgcolor: '#fafafa', borderBottom: '1px solid #eee' }}>
          <NorthEast color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1rem' }}>
            PRÓXIMOS PASES DE RAMA
          </Typography>
        </Box>
        
        <Box sx={{ p: 3 }}>
          <TableContainer sx={{ borderRadius: 3, border: '1px solid #eee' }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: '#fcfcfc' }}>
                  <TableCell sx={{ fontWeight: 800, color: 'text.disabled', fontSize: '0.75rem' }}>PROTAGONISTA</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: 'text.disabled', fontSize: '0.75rem' }}>ESTADO</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 800, color: 'text.disabled', fontSize: '0.75rem' }}>GESTIÓN</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {protagonistasRama.filter(p => p.etapa === etapasDefinidas[etapasDefinidas.length - 1]?.id).length > 0 ? (
                  protagonistasRama
                    .filter(p => p.etapa === etapasDefinidas[etapasDefinidas.length - 1]?.id)
                    .map((joven, i) => (
                      <TableRow key={i} hover>
                        <TableCell sx={{ fontWeight: 700 }}>{joven.nombre} {joven.apellido}</TableCell>
                        <TableCell>
                          <Chip label="Última Etapa" size="small" variant="contained" color="secondary" sx={{ fontWeight: 800, fontSize: '0.65rem' }} />
                        </TableCell>
                        <TableCell align="center">
                          <Button 
                            size="small" 
                            startIcon={<Event />} 
                            variant="outlined" 
                            onClick={() => handleAbrirModalPase(joven)} 
                            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}
                          >
                            Agendar Pase
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} align="center" sx={{ py: 4, color: 'text.disabled' }}>
                      <Typography variant="body2">No se detectaron pases inminentes.</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Paper>

      {/* MODAL DE FECHA PARA EL CALENDARIO (PASE) */}
      <Dialog open={modalPaseOpen} onClose={() => setModalPaseOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 800, pb: 1 }}>
          Agendar Pase de Rama
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Seleccioná la fecha en la que <strong>{scoutPase?.nombre} {scoutPase?.apellido}</strong> realizará su pase. Esto se agendará automáticamente en el calendario grupal.
          </Typography>
          <TextField
            fullWidth
            type="date"
            label="Fecha del Pase"
            InputLabelProps={{ shrink: true }}
            value={fechaPase}
            onChange={(e) => setFechaPase(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setModalPaseOpen(false)} sx={{ fontWeight: 700, color: 'text.secondary' }}>
            Cancelar
          </Button>
          <Button onClick={handleConfirmarPase} variant="contained" sx={{ bgcolor: '#5A189A', '&:hover': { bgcolor: '#3b0f66' }, fontWeight: 700, borderRadius: 2 }}>
            Confirmar en Calendario
          </Button>
        </DialogActions>
      </Dialog>

      {/* MODAL DE FICHA RESUMEN DEL JOVEN */}
      <Dialog open={fichaOpen} onClose={() => setFichaOpen(false)} maxWidth="sm" fullWidth>
        {scoutFicha && (
          <>
            <DialogTitle sx={{ 
              fontWeight: 900, 
              bgcolor: CONFIG_RAMA?.color || 'primary.main', 
              color: 'white', 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1.5 
            }}>
              <ContactPage />
              Ficha Resumen del Protagonista
            </DialogTitle>
            <DialogContent sx={{ mt: 3 }}>
              <Stack spacing={3}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Avatar sx={{ 
                    width: 72, height: 72, 
                    bgcolor: CONFIG_RAMA?.color || 'primary.main', 
                    fontSize: '2rem',
                    boxShadow: 2
                  }}>
                    {scoutFicha.nombre?.charAt(0)}{scoutFicha.apellido?.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 900, color: 'text.primary' }}>
                      {scoutFicha.nombre} {scoutFicha.apellido}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 1 }}>
                      {idBusqueda} • {scoutFicha.equipo || scoutFicha.patrulla || 'Sin equipo asignado'}
                    </Typography>
                  </Box>
                </Box>
                
                <Divider sx={{ borderStyle: 'dashed' }} />
                
                <Grid container spacing={3}>
                  <Grid item xs={6}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.disabled' }}>ETAPA ACTUAL</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 700, color: CONFIG_RAMA?.color || 'primary.main' }}>
                      {etapasDefinidas.find(e => e.id === scoutFicha.etapa)?.nombre.toUpperCase() || 'INICIAL'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.disabled' }}>D.N.I.</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>{scoutFicha.dni || 'No registrado'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.disabled' }}>FECHA DE NACIMIENTO</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>{scoutFicha.fechaNacimiento || 'No registrada'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.disabled' }}>TELÉFONO / CONTACTO</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>{scoutFicha.celular || 'No registrado'}</Typography>
                  </Grid>
                </Grid>
              </Stack>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 3 }}>
              <Button onClick={() => setFichaOpen(false)} variant="outlined" color="inherit" sx={{ fontWeight: 700, borderRadius: 2 }}>
                Cerrar Ficha
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

    </Box>
  );
};