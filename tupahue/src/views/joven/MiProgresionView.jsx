import { useState, useEffect } from 'react';
import { 
  Box, Typography, Grid, Paper, Stack, 
  Avatar, Chip, Container, Button, TextField, IconButton,
  List, ListItem, ListItemText, Checkbox, Divider,
  Dialog, DialogTitle, DialogContent, DialogActions, Tooltip,
  CircularProgress
} from '@mui/material';
import { 
  EmojiEvents, Flag, TipsAndUpdates, 
  CheckCircle, Lock, Edit, Save, Psychology, 
  AddCircle, Lightbulb, TrendingUp, Close
} from '@mui/icons-material';

import { supabase } from '../../lib/supabaseClient'; // 🎯 Importamos supabase
import { RAMAS } from '../../constants/ramas';
import { SENDEROS, AREAS_ROVERS, OBJETIVOS_POR_RAMA } from '../../constants/progresion';

export const MiProgresionView = ({ joven }) => {
  const ramaId = joven?.rama?.toUpperCase() || 'SCOUTS';
  const CONFIG_RAMA = RAMAS[ramaId] || RAMAS.SCOUTS;
  const isRover = ramaId === 'ROVERS';
  
  const etapas = CONFIG_RAMA.etapas || [];
  const etapaActualId = joven?.etapa || (etapas[0]?.id);
  const etapaActualInfo = etapas.find(e => e.id === etapaActualId) || etapas[0];
  
  const indexEtapa = etapas.findIndex(e => e.id === etapaActualId);

  // --- ESTADOS ---
  const [openSelector, setOpenSelector] = useState(false);
  const [editandoVision, setEditandoVision] = useState(false);
  const [isSaving, setIsSaving] = useState(false); // 🎯 Estado de guardado

  const [visiones, setVisiones] = useState({
    corto: "",
    mediano: "",
    largo: ""
  });
  const [misMetas, setMisMetas] = useState([]);

  // 🎯 EFECTO DE SINCRONIZACIÓN (Vital para el Dev Switch)
  useEffect(() => {
    if (joven) {
      setVisiones({
        corto: joven.visionCorto || "",
        mediano: joven.visionMediano || "",
        largo: joven.visionLargo || ""
      });
      setMisMetas(joven.metasPP || []);
    }
  }, [joven]);

  const categorias = isRover ? AREAS_ROVERS : SENDEROS;
  const objetivosOficiales = OBJETIVOS_POR_RAMA[ramaId] || {};

  const getLogoEtapa = (id) => `/assets/images/progresiones/logo${id?.replace('_', '')}.png`;

  // 🎯 FUNCIÓN PARA GUARDAR EN SUPABASE
  const guardarCambiosProgresion = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('scouts')
        .update({
          visionCorto: visiones.corto,
          visionMediano: visiones.mediano,
          visionLargo: visiones.largo,
          metasPP: misMetas,
          ultimaModificacion: new Date()
        })
        .eq('id', joven.id);

      if (error) throw error;
      setEditandoVision(false);
      alert("¡Tu Plan Personal se ha guardado correctamente!");
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Hubo un error al sincronizar con la nube.");
    } finally {
      setIsSaving(false);
    }
  };

  const toggleMeta = (texto, catId) => {
    const existe = misMetas.find(m => m.texto === texto);
    if (existe) {
      setMisMetas(misMetas.filter(m => m.texto !== texto));
    } else {
      const catObj = categorias.find(c => c.id === catId);
      setMisMetas([...misMetas, { 
        texto, 
        area: catObj?.nombre || 'General', 
        color: catObj?.color || CONFIG_RAMA.color, 
        completada: false 
      }]);
    }
  };

  const handleToggleCheckMeta = (idx) => {
    const nuevasMetas = [...misMetas];
    nuevasMetas[idx].completada = !nuevasMetas[idx].completada;
    setMisMetas(nuevasMetas);
    // Guardamos automáticamente al marcar una meta como completada
    setTimeout(guardarCambiosProgresion, 500); 
  };

  if (!joven) return null;

  return (
    <Container maxWidth="xl" sx={{ py: 3, animation: 'fadeIn 0.6s ease-out' }}>
      
      {/* 1. BANNER PRINCIPAL */}
      <Paper 
        elevation={12} 
        sx={{ 
          p: { xs: 4, md: 5 }, 
          borderRadius: 6, 
          mb: 5, 
          background: `linear-gradient(135deg, ${CONFIG_RAMA.color} 0%, #1a1a1a 100%)`, 
          color: 'white', 
          position: 'relative', 
          overflow: 'hidden', 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' }, 
          alignItems: 'center', 
          gap: 4,
          boxShadow: `0 15px 40px ${CONFIG_RAMA.color}40`
        }}
      >
        <Avatar 
          src={getLogoEtapa(etapaActualId)} 
          sx={{ 
            width: { xs: 120, md: 150 }, 
            height: { xs: 120, md: 150 }, 
            bgcolor: 'rgba(255,255,255,0.1)', 
            border: '4px solid rgba(255,255,255,0.2)', 
            zIndex: 2,
            backdropFilter: 'blur(5px)'
          }}
        >
          <EmojiEvents sx={{ fontSize: 80, color: 'rgba(255,255,255,0.7)' }} />
        </Avatar>
        <Box sx={{ flexGrow: 1, zIndex: 2, textAlign: { xs: 'center', md: 'left' } }}>
          <Typography variant="overline" sx={{ fontWeight: 900, letterSpacing: 4, opacity: 0.8, display: 'block', mb: 0.5 }}>
            CAMINO {CONFIG_RAMA.nombre.toUpperCase()}
          </Typography>
          <Typography variant="h2" sx={{ fontWeight: 900, lineHeight: 1.1, mb: 2, textShadow: '0 4px 10px rgba(0,0,0,0.3)' }}>
            Etapa {etapaActualInfo.nombre}
          </Typography>
          <Chip 
            icon={<TrendingUp sx={{ color: `${CONFIG_RAMA.color} !important` }} />} 
            label="Plan Personal Activo" 
            sx={{ bgcolor: 'white', color: CONFIG_RAMA.color, fontWeight: 800, px: 1, boxShadow: 2 }} 
          />
        </Box>
      </Paper>

      {/* 2. ETAPAS DE RAMA */}
      <Box sx={{ mb: 6 }}>
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: `${CONFIG_RAMA.color}15`, color: CONFIG_RAMA.color, width: 45, height: 45 }}>
            <Flag />
          </Avatar>
          <Typography variant="h5" sx={{ fontWeight: 900, color: '#2d3748' }}>Tu Progresión</Typography>
        </Box>
        <Grid container spacing={3}>
          {etapas.map((et, index) => {
            const esCompletada = index < indexEtapa;
            const esLaActual = index === indexEtapa;
            return (
              <Grid item xs={12} sm={6} md={3} key={et.id}>
                <Paper 
                  elevation={esLaActual ? 8 : 1} 
                  sx={{ 
                    p: 4, borderRadius: 5, display: 'flex', flexDirection: 'column', 
                    alignItems: 'center', textAlign: 'center', gap: 2, position: 'relative',
                    overflow: 'hidden', border: esLaActual ? 'none' : '1px solid #edf2f7', 
                    background: esLaActual ? `linear-gradient(180deg, white 0%, ${CONFIG_RAMA.color}08 100%)` : '#fff', 
                    height: '100%', transform: esLaActual ? 'translateY(-4px)' : 'none', transition: 'all 0.3s'
                  }}
                >
                  {esLaActual && <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 5, bgcolor: CONFIG_RAMA.color }} />}
                  <Avatar 
                    src={getLogoEtapa(et.id)} 
                    sx={{ 
                      width: 64, height: 64, 
                      filter: index > indexEtapa ? 'grayscale(1) opacity(0.2)' : 'none',
                      bgcolor: esCompletada ? `${CONFIG_RAMA.color}22` : '#f0f4f8',
                      color: esCompletada ? CONFIG_RAMA.color : '#a0aec0'
                    }}
                  >
                    {esCompletada ? <CheckCircle fontSize="large" /> : <Lock />}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 900, color: index > indexEtapa ? '#a0aec0' : '#2d3748', mb: 0.5 }}>
                      {et.nombre}
                    </Typography>
                    <Chip 
                      size="small"
                      label={esLaActual ? 'TRABAJANDO AQUÍ' : esCompletada ? 'LOGRADA' : 'PENDIENTE'}
                      sx={{ 
                        fontWeight: 800, fontSize: '0.7rem',
                        bgcolor: esLaActual ? CONFIG_RAMA.color : esCompletada ? '#e6fffa' : '#edf2f7',
                        color: esLaActual ? 'white' : esCompletada ? '#38b2ac' : '#a0aec0',
                      }}
                    />
                  </Box>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Box>

      <Grid container spacing={4}>
        {/* 3. VISIÓN PERSONAL */}
        <Grid item xs={12} lg={4}>
          <Paper elevation={2} sx={{ p: 4, borderRadius: 6, borderTop: `6px solid ${CONFIG_RAMA.color}`, height: '100%', bgcolor: '#fff' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 900, display: 'flex', alignItems: 'center', gap: 1.5, color: '#2d3748' }}>
                <Psychology sx={{ color: CONFIG_RAMA.color }} /> Proyección Personal
              </Typography>
              <Tooltip title={editandoVision ? "Guardar mi visión" : "Editar mi visión"}>
                <IconButton 
                  disabled={isSaving}
                  onClick={editandoVision ? guardarCambiosProgresion : () => setEditandoVision(true)} 
                  sx={{ bgcolor: `${CONFIG_RAMA.color}15`, color: CONFIG_RAMA.color, '&:hover': { bgcolor: `${CONFIG_RAMA.color}30` } }}
                >
                  {isSaving ? <CircularProgress size={20} color="inherit" /> : editandoVision ? <Save /> : <Edit />}
                </IconButton>
              </Tooltip>
            </Stack>
            
            <Stack spacing={4}>
              {['corto', 'mediano', 'largo'].map((plazo) => (
                <Box key={plazo} sx={{ position: 'relative' }}>
                  <Typography variant="overline" sx={{ fontWeight: 900, color: CONFIG_RAMA.color, display: 'block', mb: 1, letterSpacing: 1.5 }}>
                    A {plazo} plazo
                  </Typography>
                  {editandoVision ? (
                    <TextField 
                      fullWidth multiline rows={2} 
                      variant="filled"
                      value={visiones[plazo]} 
                      onChange={(e) => setVisiones({...visiones, [plazo]: e.target.value})} 
                      InputProps={{ disableUnderline: true, sx: { borderRadius: 3, bgcolor: '#f7fafc', fontWeight: 500 } }}
                    />
                  ) : (
                    <Box sx={{ p: 2, bgcolor: '#f7fafc', borderRadius: 3, borderLeft: `3px solid ${CONFIG_RAMA.color}40` }}>
                      <Typography variant="body2" sx={{ color: '#4a5568', fontStyle: 'italic', fontWeight: 500, lineHeight: 1.6 }}>
                        "{visiones[plazo] || "Sin definir..."}"
                      </Typography>
                    </Box>
                  )}
                </Box>
              ))}
            </Stack>
          </Paper>
        </Grid>

        {/* 4. PLAN DE ACCIÓN */}
        <Grid item xs={12} lg={8}>
          <Paper elevation={2} sx={{ p: { xs: 3, md: 5 }, borderRadius: 6, height: '100%', bgcolor: '#fff' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 900, display: 'flex', alignItems: 'center', gap: 1.5, color: '#2d3748', mb: 0.5 }}>
                  <TipsAndUpdates sx={{ color: CONFIG_RAMA.color }} /> Plan de Acción
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                  Metas seleccionadas de los {isRover ? 'Áreas' : 'Senderos'}.
                </Typography>
              </Box>
              <Button 
                variant="contained" 
                onClick={() => setOpenSelector(true)} 
                startIcon={<AddCircle />} 
                sx={{ bgcolor: CONFIG_RAMA.color, borderRadius: 3, fontWeight: 800, textTransform: 'none', px: 3, boxShadow: `0 4px 14px ${CONFIG_RAMA.color}60` }}
              >
                Elegir Metas
              </Button>
            </Stack>

            <List sx={{ minHeight: 250 }}>
              {misMetas.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 8, px: 2, border: '2px dashed #e2e8f0', borderRadius: 4, bgcolor: '#f7fafc' }}>
                  <Lightbulb sx={{ fontSize: 60, color: '#cbd5e0', mb: 2 }} />
                  <Typography variant="h6" sx={{ color: '#718096', fontWeight: 800 }}>Aún no hay metas activas</Typography>
                  <Typography variant="body2" sx={{ color: '#a0aec0' }}>Hacé clic en "Elegir Metas" para comenzar.</Typography>
                </Box>
              ) : (
                misMetas.map((obj, idx) => (
                  <ListItem 
                    key={idx} 
                    sx={{ 
                      mb: 2.5, bgcolor: obj.completada ? '#f0fff4' : '#fff', borderRadius: 4, 
                      border: '1px solid', borderColor: obj.completada ? '#c6f6d5' : '#e2e8f0',
                      borderLeft: `6px solid ${obj.completada ? '#48bb78' : obj.color}`,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.02)', transition: '0.2s',
                      '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }
                    }}
                  >
                    <Checkbox 
                      checked={obj.completada} 
                      onChange={() => handleToggleCheckMeta(idx)} 
                      sx={{ color: '#cbd5e0', '&.Mui-checked': { color: '#48bb78' } }}
                    />
                    <ListItemText 
                      primary={obj.texto} 
                      secondary={obj.area} 
                      primaryTypographyProps={{ 
                        fontWeight: 700, color: obj.completada ? '#718096' : '#2d3748',
                        style: { textDecoration: obj.completada ? 'line-through' : 'none' } 
                      }} 
                      secondaryTypographyProps={{ 
                        fontWeight: 900, color: obj.completada ? '#48bb78' : obj.color, 
                        fontSize: '0.75rem', mt: 0.5, textTransform: 'uppercase', letterSpacing: 1
                      }} 
                    />
                  </ListItem>
                ))
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* MODAL SELECTOR */}
      <Dialog open={openSelector} onClose={() => setOpenSelector(false)} fullWidth maxWidth="md" PaperProps={{ sx: { borderRadius: 4 } }}>
        <DialogTitle sx={{ fontWeight: 900, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#f7fafc', borderBottom: '1px solid #edf2f7' }}>
          Elegir Metas Oficiales
          <IconButton onClick={() => setOpenSelector(false)}><Close /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: { xs: 2, md: 4 } }}>
          {categorias.map((cat) => (
            <Box key={cat.id} sx={{ mb: 5 }}>
              <Typography variant="h6" sx={{ fontWeight: 900, color: cat.color, display: 'flex', alignItems: 'center', gap: 1.5, mb: 3, borderBottom: `2px solid ${cat.color}22`, pb: 1 }}>
                {cat.nombre}
              </Typography>
              <Grid container spacing={2}>
                {objetivosOficiales[cat.id]?.map((texto, i) => {
                  const ya = misMetas.find(m => m.texto === texto);
                  return (
                    <Grid item xs={12} key={i}>
                      <Paper 
                        onClick={() => toggleMeta(texto, cat.id)} 
                        sx={{ 
                          p: 2.5, cursor: 'pointer', borderRadius: 3, border: '2px solid', 
                          borderColor: ya ? cat.color : '#edf2f7', 
                          bgcolor: ya ? `${cat.color}08` : '#fff',
                        }}
                      >
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Checkbox checked={!!ya} sx={{ color: '#cbd5e0', '&.Mui-checked': { color: cat.color } }} />
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>{texto}</Typography>
                        </Stack>
                      </Paper>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          ))}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={() => { setOpenSelector(false); guardarCambiosProgresion(); }} 
            variant="contained" 
            sx={{ bgcolor: CONFIG_RAMA.color, borderRadius: 3, px: 5, fontWeight: 800 }}
          >
            Sincronizar Plan Personal
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};