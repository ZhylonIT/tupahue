import { useEffect, useState } from 'react';
import { 
  Typography, Paper, Stack, Box, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, 
  TextField, Button, IconButton, Divider, Grid,
  FormControl, Select, MenuItem, Checkbox, ListItemText, OutlinedInput
} from '@mui/material';
import { 
  Add, Delete, AccessTime, Flag, ListAlt, 
  SportsEsports, Construction, Psychology, Save, Edit, Timer, GroupAdd, Autorenew, EventNote, MenuBook 
} from '@mui/icons-material';

// IMPORTACIÓN DE TUS CONSTANTES
import { SENDEROS, AREAS_ROVERS, OBJETIVOS_POR_RAMA } from '../../../../constants/progresion';

export const PasoPlanilla = ({ ramaId, data, setData }) => {

  const [savedSections, setSavedSections] = useState({ obj: false });
  const [savedActivities, setSavedActivities] = useState({});
  // NUEVO: Estado para controlar qué menú desplegable está abierto
  const [openDropdown, setOpenDropdown] = useState(null); 

  // Lógica para detectar qué áreas/senderos mostrar según la rama
  const ramaUpper = ramaId?.toUpperCase() || 'SCOUTS';
  const esRover = ramaUpper === 'ROVERS';
  const areasActivas = esRover ? AREAS_ROVERS : SENDEROS;
  const objetivosDisponibles = OBJETIVOS_POR_RAMA[ramaUpper] || {};

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (!data.listaActividades || data.listaActividades.length === 0) {
      setData(prev => ({ 
        ...prev, 
        listaActividades: [{ id: Date.now(), nombre: '', duracion: '', objetivos: '', objetivosEducativos: {}, descripcion: '', apoyo: '', materiales: '', recupero: '', notas: '' }] 
      }));
    }
  }, []);

  const toggleSection = (section) => {
    setSavedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleActivity = (id) => {
    setSavedActivities(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const agregarBloque = () => {
    const nuevo = { horario: '', actividad: '', responsable: '' };
    setData(prev => ({ ...prev, cronograma: [...(prev.cronograma || []), nuevo] }));
  };

  const editarCronograma = (index, campo, valor) => {
    setData(prev => {
      const copia = [...(prev.cronograma || [])];
      copia[index] = { ...copia[index], [campo]: valor };
      return { ...prev, cronograma: copia };
    });
  };

  const agregarNuevaActividad = () => {
    const nueva = { id: Date.now(), nombre: '', duracion: '', objetivos: '', objetivosEducativos: {}, descripcion: '', apoyo: '', materiales: '', recupero: '', notas: '' };
    setData(prev => ({ ...prev, listaActividades: [...(prev.listaActividades || []), nueva] }));
  };

  const eliminarActividad = (id) => {
    setData(prev => ({ ...prev, listaActividades: prev.listaActividades.filter(a => a.id !== id) }));
  };

  const editarActividad = (id, campo, valor) => {
    setData(prev => ({
      ...prev,
      listaActividades: prev.listaActividades.map(act => 
        act.id === id ? { ...act, [campo]: valor } : act
      )
    }));
  };

  const editarObjetivosEducativos = (id, areaNombre, valoresSeleccionados) => {
    setData(prev => ({
      ...prev,
      listaActividades: prev.listaActividades.map(act => {
        if (act.id === id) {
          return {
            ...act,
            objetivosEducativos: {
              ...(act.objetivosEducativos || {}),
              [areaNombre]: valoresSeleccionados
            }
          };
        }
        return act;
      })
    }));
  };

  const sectionCardStyle = { borderRadius: 4, overflow: 'hidden', bgcolor: 'white', border: '1px solid #eee', mb: 4 };
  const labelStyle = { fontWeight: 900, color: 'primary.main', mb: 1, display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.75rem', textTransform: 'uppercase' };

  return (
    <Box sx={{ maxWidth: '1000px', mx: 'auto', py: 2 }}>
      
      {/* 1. DATOS GENERALES */}
      <Paper elevation={0} sx={sectionCardStyle}>
        <Box sx={{ px: 3, py: 2, display: 'flex', alignItems: 'center', bgcolor: '#fafafa', borderBottom: '1px solid #eee' }}>
          <Stack direction="row" alignItems="center" gap={1.5}>
            <EventNote color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1rem' }}>DATOS DE LA ACTIVIDAD</Typography>
          </Stack>
        </Box>
        <Box sx={{ p: 3 }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
            <TextField 
              label="Fecha" type="date" InputLabelProps={{ shrink: true }}
              value={data.fechaActividad || ''} 
              onChange={(e) => setData(prev => ({...prev, fechaActividad: e.target.value}))} 
              fullWidth variant="outlined" size="small"
            />
            <TextField 
              label="Ciclo de Programa" placeholder="Ej: Ciclo 1" 
              value={data.cicloPrograma || ''} 
              onChange={(e) => setData(prev => ({...prev, cicloPrograma: e.target.value}))} 
              fullWidth variant="outlined" size="small"
            />
            <TextField 
              label="Nombre Actividad" placeholder="Ej: Salida de Rama" 
              value={data.nombreActividad || ''} 
              onChange={(e) => setData(prev => ({...prev, nombreActividad: e.target.value}))} 
              fullWidth variant="outlined" size="small"
            />
          </Stack>
        </Box>
      </Paper>

      {/* 2. OBJETIVOS */}
      <Paper elevation={0} sx={sectionCardStyle}>
        <Box sx={{ px: 3, py: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: '#fafafa', borderBottom: '1px solid #eee' }}>
          <Stack direction="row" alignItems="center" gap={1.5}>
            <Flag color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1rem' }}>OBJETIVOS DE LA JORNADA</Typography>
          </Stack>
        </Box>
        <Box sx={{ p: 3 }}>
          <TextField 
            multiline minRows={2} fullWidth variant="standard" 
            placeholder="¿Qué metas pedagógicas buscamos este sábado?..." 
            value={data.objetivosJornada || ''} 
            onChange={(e) => setData(prev => ({...prev, objetivosJornada: e.target.value}))} 
            disabled={savedSections.obj}
            InputProps={{ disableUnderline: true, sx: { color: savedSections.obj ? 'text.primary' : 'text.secondary' } }} 
          />
          <Divider sx={{ my: 2, borderStyle: 'dashed' }} />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button 
              startIcon={savedSections.obj ? <Edit /> : <Save />} 
              onClick={() => toggleSection('obj')} 
              size="small" 
              variant={savedSections.obj ? "outlined" : "contained"} 
              color="primary" 
              sx={{ borderRadius: 2, fontWeight: 700 }}
            >
              {savedSections.obj ? "Modificar Objetivos" : "Guardar Objetivos"}
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* 3. CRONOGRAMA */}
      <Paper elevation={0} sx={sectionCardStyle}>
        <Box sx={{ px: 3, py: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: '#fafafa', borderBottom: '1px solid #eee' }}>
          <Stack direction="row" alignItems="center" gap={1.5}>
            <AccessTime color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1rem' }}>CRONOGRAMA</Typography>
          </Stack>
          <Button startIcon={<Add />} onClick={agregarBloque} size="small" variant="outlined" sx={{ borderRadius: 2, fontWeight: 700 }}>Agregar Bloque</Button>
        </Box>
        <Box sx={{ p: 2 }}>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 800, color: 'text.disabled', fontSize: '0.7rem' }}>HORA</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: 'text.disabled', fontSize: '0.7rem' }}>ACTIVIDAD</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: 'text.disabled', fontSize: '0.7rem' }}>RESPONSABLE</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {(data.cronograma || []).map((item, i) => (
                  <TableRow key={i} hover>
                    <TableCell sx={{ width: '15%' }}><TextField variant="standard" fullWidth value={item.horario} onChange={(e) => editarCronograma(i, 'horario', e.target.value)} InputProps={{ disableUnderline: true }} placeholder="15:00" /></TableCell>
                    <TableCell sx={{ width: '55%' }}><TextField variant="standard" fullWidth value={item.actividad} onChange={(e) => editarCronograma(i, 'actividad', e.target.value)} InputProps={{ disableUnderline: true, sx: { fontWeight: 600 } }} placeholder="Actividad" /></TableCell>
                    <TableCell sx={{ width: '25%' }}><TextField variant="standard" fullWidth value={item.responsable} onChange={(e) => editarCronograma(i, 'responsable', e.target.value)} InputProps={{ disableUnderline: true }} placeholder="Nombre" /></TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => setData(prev => ({...prev, cronograma: prev.cronograma.filter((_, idx) => idx !== i)}))} color="error" size="small"><Delete fontSize="small"/></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Paper>

      {/* 4. LISTADO DE ACTIVIDADES */}
      <Typography variant="overline" sx={{ px: 1, fontWeight: 900, color: 'text.disabled', mb: 2, display: 'block' }}>
        Fichas de Actividades / Juegos ({data.listaActividades?.length || 0})
      </Typography>

      {(data.listaActividades || []).map((act, index) => {
        const isLocked = savedActivities[act.id];

        return (
          <Paper key={act.id} elevation={0} sx={{ ...sectionCardStyle, borderLeft: '4px solid', borderLeftColor: isLocked ? '#4caf50' : 'primary.main' }}>
            <Box sx={{ px: 3, py: 2, display: 'flex', alignItems: 'center', bgcolor: '#fafafa', borderBottom: '1px solid #eee' }}>
              <Stack direction="row" alignItems="center" gap={1.5}>
                <SportsEsports color={isLocked ? "success" : "primary"} />
                <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '0.9rem', color: isLocked ? 'success.main' : 'inherit' }}>
                  ACTIVIDAD #{index + 1} {isLocked && "(Guardada)"}
                </Typography>
              </Stack>
            </Box>

            <Box sx={{ p: 3 }}>
              <Stack spacing={4}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 4 }}>
                  <Box sx={{ flexGrow: 1 }}> 
                    <Typography sx={labelStyle}>NOMBRE DE LA ACTIVIDAD</Typography>
                    <TextField fullWidth variant="standard" multiline placeholder="Título del juego..." value={act.nombre} onChange={(e) => editarActividad(act.id, 'nombre', e.target.value)} disabled={isLocked} InputProps={{ disableUnderline: true, sx: { fontSize: '1.3rem', fontWeight: 800, lineHeight: 1.2, color: isLocked ? 'text.primary' : 'inherit' } }} />
                  </Box>
                  <Box sx={{ minWidth: '120px', textAlign: 'right' }}>
                    <Typography sx={{ ...labelStyle, justifyContent: 'flex-end', color: 'text.secondary' }}><Timer sx={{fontSize: 14}}/> DURACIÓN</Typography>
                    <TextField variant="standard" placeholder="45 min" value={act.duracion} onChange={(e) => editarActividad(act.id, 'duracion', e.target.value)} disabled={isLocked} InputProps={{ disableUnderline: true, sx: { fontWeight: 700, fontSize: '1rem', textAlign: 'right', color: isLocked ? 'text.primary' : 'inherit' }, inputProps: { style: { textAlign: 'right' } } }} />
                  </Box>
                </Box>

                <Divider sx={{ borderStyle: 'dashed' }} />

                {/* --- OBJETIVOS EDUCATIVOS CON BOTÓN "CONFIRMAR" --- */}
                <Box sx={{ bgcolor: isLocked ? 'transparent' : '#f8f9fa', p: isLocked ? 0 : 2, borderRadius: 2 }}>
                  <Typography sx={labelStyle}><MenuBook sx={{fontSize: 14}}/> OBJETIVOS EDUCATIVOS ({esRover ? 'Áreas de Crecimiento' : 'Senderos'})</Typography>
                  <Grid container spacing={3} sx={{ mt: 0.5 }}>
                    {areasActivas.map(area => {
                      const opcionesArea = objetivosDisponibles[area.id] || [];
                      const seleccionados = act.objetivosEducativos?.[area.nombre] || [];
                      const selectKey = `${act.id}-${area.id}`; // Identificador único para este desplegable
                      
                      if (opcionesArea.length === 0) return null;
                      if (isLocked && seleccionados.length === 0) return null;

                      return (
                        <Grid item xs={12} sm={6} md={esRover ? 4 : 6} key={area.id}>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                            <Typography variant="caption" sx={{ fontWeight: 800, color: area.color || 'primary.main', ml: 0.5 }}>
                              {area.nombre.toUpperCase()}
                            </Typography>
                            
                            <FormControl fullWidth size="small" disabled={isLocked}>
                              <Select
                                multiple
                                displayEmpty
                                open={openDropdown === selectKey}
                                onOpen={() => setOpenDropdown(selectKey)}
                                onClose={() => setOpenDropdown(null)}
                                value={seleccionados}
                                onChange={(e) => editarObjetivosEducativos(act.id, area.nombre, e.target.value)}
                                input={<OutlinedInput sx={{ bgcolor: isLocked ? 'transparent' : 'white' }} />}
                                renderValue={(selected) => {
                                  if (selected.length === 0) {
                                    return <span style={{ color: '#aaa', fontSize: '0.85rem' }}>Seleccionar...</span>;
                                  }
                                  return <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{`${selected.length} objetivo${selected.length > 1 ? 's' : ''}`}</span>;
                                }}
                                // Límite de altura para que el botón siempre se vea abajo
                                MenuProps={{
                                  PaperProps: {
                                    sx: { maxHeight: 350 }
                                  }
                                }}
                              >
                                {opcionesArea.map((obj) => (
                                  <MenuItem key={obj} value={obj} sx={{ whiteSpace: 'normal', mb: 1 }}>
                                    <Checkbox checked={seleccionados.indexOf(obj) > -1} />
                                    <ListItemText primary={obj} primaryTypographyProps={{ fontSize: '0.85rem', lineHeight: 1.2 }} />
                                  </MenuItem>
                                ))}
                                
                                {/* BOTÓN DE CONFIRMAR AL FINAL DEL MENÚ */}
                                <Box sx={{ 
                                  position: 'sticky', 
                                  bottom: 0, 
                                  bgcolor: 'background.paper', 
                                  pt: 1, pb: 1, px: 2, 
                                  borderTop: '1px solid #eee', 
                                  zIndex: 1,
                                  display: 'flex',
                                  justifyContent: 'flex-end'
                                }}>
                                  <Button 
                                    variant="contained" 
                                    size="small" 
                                    onClick={() => setOpenDropdown(null)}
                                    sx={{ fontWeight: 700, borderRadius: 2 }}
                                  >
                                    Confirmar
                                  </Button>
                                </Box>
                              </Select>
                            </FormControl>
                          </Box>
                        </Grid>
                      );
                    })}
                  </Grid>
                </Box>

                <Box>
                  <Typography sx={labelStyle}><Flag sx={{fontSize: 14}}/> OBJETIVOS DEL JUEGO / DINÁMICA</Typography>
                  <TextField multiline fullWidth variant="standard" placeholder="¿Qué buscamos lograr con esta dinámica?..." value={act.objetivos} onChange={(e) => editarActividad(act.id, 'objetivos', e.target.value)} disabled={isLocked} InputProps={{ disableUnderline: true, sx: { color: isLocked ? 'text.primary' : 'inherit' } }} />
                </Box>

                <Box>
                  <Typography sx={labelStyle}><Psychology sx={{fontSize: 14}}/> DESARROLLO Y DINÁMICA</Typography>
                  <TextField multiline minRows={4} fullWidth variant="standard" placeholder="Explicación detallada..." value={act.descripcion} onChange={(e) => editarActividad(act.id, 'descripcion', e.target.value)} disabled={isLocked} InputProps={{ disableUnderline: true, sx: { lineHeight: 1.7, bgcolor: isLocked ? 'transparent' : '#fcfcfc', p: isLocked ? 0 : 2, borderRadius: 2, border: isLocked ? 'none' : '1px solid #f0f0f0', color: isLocked ? 'text.primary' : 'inherit' } }} />
                </Box>

                <Stack spacing={3}>
                  <Box>
                    <Typography sx={labelStyle}><GroupAdd sx={{fontSize: 14}}/> ADULTOS RESPONSABLES / APOYO</Typography>
                    <TextField multiline fullWidth variant="standard" placeholder="Roles de los educadores..." value={act.apoyo} onChange={(e) => editarActividad(act.id, 'apoyo', e.target.value)} disabled={isLocked} InputProps={{ disableUnderline: true, sx: { borderBottom: isLocked ? 'none' : '1px solid #eee', pb: 1, color: isLocked ? 'text.primary' : 'inherit' } }} />
                  </Box>
                  <Box>
                    <Typography sx={labelStyle}><Construction sx={{fontSize: 14}}/> MATERIALES Y RECURSOS</Typography>
                    <TextField multiline fullWidth variant="standard" placeholder="Lista de materiales..." value={act.materiales} onChange={(e) => editarActividad(act.id, 'materiales', e.target.value)} disabled={isLocked} InputProps={{ disableUnderline: true, sx: { borderBottom: isLocked ? 'none' : '1px solid #eee', pb: 1, color: isLocked ? 'text.primary' : 'inherit' } }} />
                  </Box>
                  <Box>
                    <Typography sx={labelStyle}><Autorenew sx={{fontSize: 14}}/> RECUPERO / CIERRE</Typography>
                    <TextField multiline fullWidth variant="standard" placeholder="Reflexión final..." value={act.recupero} onChange={(e) => editarActividad(act.id, 'recupero', e.target.value)} disabled={isLocked} InputProps={{ disableUnderline: true, sx: { borderBottom: isLocked ? 'none' : '1px solid #eee', pb: 1, color: isLocked ? 'text.primary' : 'inherit' } }} />
                  </Box>
                </Stack>

                <Box sx={{ bgcolor: isLocked ? '#fff' : '#fff8f0', p: 2.5, borderRadius: 3, border: isLocked ? '1px solid #eee' : '1px solid #ffe8cc' }}>
                  <Typography sx={{ ...labelStyle, color: isLocked ? 'text.secondary' : '#e67e22' }}><ListAlt sx={{fontSize: 14}}/> RIESGOS Y OBSERVACIONES</Typography>
                  <TextField multiline fullWidth variant="standard" placeholder="Seguridad..." value={act.notas} onChange={(e) => editarActividad(act.id, 'notas', e.target.value)} disabled={isLocked} InputProps={{ disableUnderline: true, sx: { fontSize: '0.95rem', color: isLocked ? 'text.primary' : 'inherit' } }} />
                </Box>
              </Stack>

              <Divider sx={{ my: 3, borderStyle: 'dashed' }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                {data.listaActividades.length > 1 && !isLocked && (
                  <Button color="error" variant="outlined" startIcon={<Delete />} onClick={() => eliminarActividad(act.id)} size="small" sx={{ borderRadius: 2, fontWeight: 700 }}>
                    Eliminar Ficha
                  </Button>
                )}
                <Button 
                  startIcon={isLocked ? <Edit /> : <Save />} 
                  onClick={() => toggleActivity(act.id)} 
                  size="small" 
                  variant={isLocked ? "outlined" : "contained"} 
                  color="primary" 
                  sx={{ borderRadius: 2, fontWeight: 700 }}
                >
                  {isLocked ? "Modificar Ficha" : "Guardar Ficha"}
                </Button>
              </Box>
            </Box>
          </Paper>
        );
      })}

      <Button fullWidth variant="dashed" startIcon={<Add />} onClick={agregarNuevaActividad} sx={{ py: 3, borderRadius: 4, border: '2px dashed #ccc', color: 'text.secondary', textTransform: 'none', fontWeight: 700, '&:hover': { border: '2px dashed', borderColor: 'primary.main', bgcolor: 'rgba(0,0,0,0.02)' } }}>
        Añadir otra Actividad / Juego
      </Button>

    </Box>
  );
};