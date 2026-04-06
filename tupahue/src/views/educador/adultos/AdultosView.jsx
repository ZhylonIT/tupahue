import React, { useState, useMemo } from 'react';
import { 
  Box, Typography, Grid, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Chip, Avatar, Stack, 
  Button, IconButton, Dialog, DialogTitle, DialogContent, 
  TextField, MenuItem, Tabs, Tab, Checkbox, Select, FormControl, 
  InputLabel, OutlinedInput, DialogActions, ListItemText, ListSubheader,
  LinearProgress, Tooltip, Divider
} from '@mui/material';
import { 
  School, Add, DeleteOutline, Save, Close, Badge, 
  CheckBox as CheckBoxIcon, CheckCircle, Insights, Print
} from '@mui/icons-material';
import { useAdultos } from '../../../hooks/useAdultos';
import { FUNCIONES } from '../../../constants/auth';
import { EXPERIENCIAS_FORMACION } from '../../../constants/adultos';

const VIOLETA_SCOUT = '#5A189A';

const ProgresoFormacion = ({ adulto }) => {
  // 🎯 Detectamos las ramas desde sus funciones
  const funcionesRama = (adulto.funciones || []).filter(f => ['LOBATOS', 'SCOUTS', 'CAMINANTES', 'ROVERS'].includes(f));
  const experienciasRama = funcionesRama.flatMap(r => EXPERIENCIAS_FORMACION.POR_RAMA[r] || []);
  
  const totalExperiencias = EXPERIENCIAS_FORMACION.COMUNES.length + experienciasRama.length;
  const completadas = (adulto.formacion || []).length;
  const porcentaje = totalExperiencias > 0 ? (completadas / totalExperiencias) * 100 : 0;

  let nivelLabel = "Inicial";
  let colorNivel = "#9e9e9e";
  if (porcentaje > 80) { nivelLabel = "Avanzado"; colorNivel = "#2e7d32"; }
  else if (porcentaje > 30) { nivelLabel = "Intermedio"; colorNivel = "#1976d2"; }

  return (
    <Box sx={{ minWidth: 150 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
        <Typography variant="caption" sx={{ fontWeight: 800, color: colorNivel }}>{nivelLabel}</Typography>
        <Typography variant="caption" color="text.secondary">{completadas}/{totalExperiencias}</Typography>
      </Stack>
      <LinearProgress variant="determinate" value={porcentaje} sx={{ height: 6, borderRadius: 5, bgcolor: '#eee', '& .MuiLinearProgress-bar': { bgcolor: colorNivel } }} />
    </Box>
  );
};

export const AdultosView = () => {
  const { adultos, loading, agregarAdulto, eliminarAdulto, actualizarFormacion, actualizarPlanDesempeño } = useAdultos();
  const [openAlta, setOpenAlta] = useState(false);
  const [adultoSeleccionado, setAdultoSeleccionado] = useState(null);
  const [openSelect, setOpenSelect] = useState(false);
  const [nuevoAdulto, setNuevoAdulto] = useState({ nombre: '', apellido: '', dni: '', funciones: [] });

  const handleAlta = () => {
    if (!nuevoAdulto.nombre || !nuevoAdulto.dni || nuevoAdulto.funciones.length === 0) {
        alert("Faltan datos obligatorios");
        return;
    }
    // 🎯 Quitamos la key 'ramas' para no romper el esquema de Supabase
    agregarAdulto({ ...nuevoAdulto }); 
    setOpenAlta(false);
    setNuevoAdulto({ nombre: '', apellido: '', dni: '', funciones: [] });
  };

  if (loading) return <Box sx={{ p: 4 }}><LinearProgress /></Box>;

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900 }}>Gestión de Adultos</Typography>
          <Typography variant="body1" color="text.secondary">Seguimiento técnico y formación SNF 2025.</Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />} onClick={() => setOpenAlta(true)} sx={{ bgcolor: VIOLETA_SCOUT, borderRadius: 2, fontWeight: 'bold' }}>
          Nuevo Educador
        </Button>
      </Stack>

      <TableContainer component={Paper} sx={{ borderRadius: 4, border: '1px solid #eee', boxShadow: 'none' }}>
        <Table>
          <TableHead sx={{ bgcolor: '#f8f9fa' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 800 }}>Educador / DNI</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Funciones</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Progreso SNF</TableCell>
              <TableCell align="right" sx={{ fontWeight: 800 }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {adultos.map((edu) => (
              <TableRow key={edu.id} hover>
                <TableCell>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: VIOLETA_SCOUT, fontWeight: 900 }}>{edu.nombre ? edu.nombre[0] : 'A'}</Avatar>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>{edu.apellido}, {edu.nombre}</Typography>
                      <Typography variant="caption" color="text.secondary">DNI: {edu.dni}</Typography>
                    </Box>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={0.5} flexWrap="wrap">
                    {(edu.funciones || []).map(f => (
                      <Chip key={f} label={f} size="small" sx={{ fontWeight: 700, fontSize: '10px' }} />
                    ))}
                  </Stack>
                </TableCell>
                <TableCell><ProgresoFormacion adulto={edu} /></TableCell>
                <TableCell align="right">
                  <Tooltip title="Analizar Formación">
                    <Button size="small" variant="contained" startIcon={<Insights />} onClick={() => setAdultoSeleccionado(edu)} sx={{ bgcolor: VIOLETA_SCOUT, borderRadius: 2 }}>
                      Analizar
                    </Button>
                  </Tooltip>
                  <IconButton color="error" sx={{ ml: 1 }} onClick={() => eliminarAdulto(edu.id)}><DeleteOutline /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openAlta} onClose={() => setOpenAlta(false)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 900 }}>Alta de Educador</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Nombre" fullWidth size="small" value={nuevoAdulto.nombre} onChange={e => setNuevoAdulto({...nuevoAdulto, nombre: e.target.value})} />
            <TextField label="Apellido" fullWidth size="small" value={nuevoAdulto.apellido} onChange={e => setNuevoAdulto({...nuevoAdulto, apellido: e.target.value})} />
            <TextField label="DNI" fullWidth size="small" value={nuevoAdulto.dni} onChange={e => setNuevoAdulto({...nuevoAdulto, dni: e.target.value})} />
            <FormControl fullWidth size="small">
              <InputLabel>Funciones / Ramas</InputLabel>
              <Select
                multiple open={openSelect} onOpen={() => setOpenSelect(true)} onClose={() => setOpenSelect(false)}
                value={nuevoAdulto.funciones} onChange={(e) => setNuevoAdulto({...nuevoAdulto, funciones: e.target.value})}
                input={<OutlinedInput label="Funciones / Ramas" />}
                renderValue={(selected) => <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>{selected.map((v) => <Chip key={v} label={v} size="small" />)}</Box>}
              >
                <ListSubheader sx={{ bgcolor: 'white', py: 1 }}>
                    <Button fullWidth variant="contained" size="small" startIcon={<CheckCircle />} onClick={(e) => { e.stopPropagation(); setOpenSelect(false); }} sx={{ bgcolor: VIOLETA_SCOUT }}>Confirmar</Button>
                </ListSubheader>
                {Object.keys(FUNCIONES).map((f) => (
                  <MenuItem key={f} value={f}>
                    <Checkbox checked={nuevoAdulto.funciones.indexOf(f) > -1} sx={{ color: VIOLETA_SCOUT }} />
                    <ListItemText primary={f} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setOpenAlta(false)}>Cancelar</Button>
            <Button variant="contained" onClick={handleAlta} sx={{ bgcolor: VIOLETA_SCOUT }}>Finalizar Alta</Button>
        </DialogActions>
      </Dialog>

      {adultoSeleccionado && (
        <LegajoModal 
          adulto={adultoSeleccionado} 
          onClose={() => setAdultoSeleccionado(null)} 
          actualizarFormacion={actualizarFormacion}
          actualizarPlanDesempeño={actualizarPlanDesempeño}
        />
      )}
    </Box>
  );
};

const LegajoModal = ({ adulto, onClose, actualizarFormacion, actualizarPlanDesempeño }) => {
  const [tab, setTab] = useState(0);
  const [plan, setPlan] = useState({
    acuerdos: adulto.planDesempeño?.acuerdos || '',
    objetivos: adulto.planDesempeño?.objetivos || ''
  });

  const [formacionLocal, setFormacionLocal] = useState(adulto.formacion || []);

  const handleToggleFormacion = (expId) => {
    actualizarFormacion(adulto.id, expId);
    setFormacionLocal(prev => prev.includes(expId) ? prev.filter(id => id !== expId) : [...prev, expId]);
  };

  const handleSavePlan = () => {
    actualizarPlanDesempeño(adulto.id, plan);
    alert("Plan guardado en el sistema.");
  };

  const experienciasFiltradas = useMemo(() => {
    // 🎯 Detectamos las ramas desde sus funciones
    const funcionesRama = (adulto.funciones || []).filter(f => ['LOBATOS', 'SCOUTS', 'CAMINANTES', 'ROVERS'].includes(f));
    const todas = [
      ...EXPERIENCIAS_FORMACION.COMUNES,
      ...funcionesRama.flatMap(r => EXPERIENCIAS_FORMACION.POR_RAMA[r] || [])
    ];
    return {
      basico: todas.filter(e => e.nivel === 1),
      intermedio: todas.filter(e => e.nivel === 2),
      avanzado: todas.filter(e => e.nivel === 3)
    };
  }, [adulto.funciones]);

  const handlePrint = () => { window.print(); };

  const renderNivel = (titulo, lista, color) => (
    <Box sx={{ mb: 4 }}>
      <Typography variant="overline" sx={{ fontWeight: 900, color: color, mb: 2, display: 'block', fontSize: '0.75rem' }}>{titulo}</Typography>
      <Grid container spacing={1.5}>
        {lista.map((exp) => {
          const hecho = formacionLocal.includes(exp.id);
          return (
            <Grid item xs={12} sm={6} key={exp.id}>
              <Paper 
                elevation={0} onClick={() => handleToggleFormacion(exp.id)}
                sx={{ 
                  p: 2, borderRadius: 3, border: hecho ? `2px solid ${color}` : '1px solid #eee',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 2,
                  bgcolor: hecho ? `${color}10` : 'white'
                }}
              >
                {hecho ? <CheckBoxIcon sx={{ color: color }} /> : <Box sx={{ width: 24, height: 24, border: '2px solid #ddd', borderRadius: 1 }} />}
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1.2 }}>{exp.nombre}</Typography>
                  <Typography variant="caption" color="text.secondary">{exp.tipo}</Typography>
                </Box>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );

  return (
    <Dialog open={true} onClose={onClose} fullWidth maxWidth="md" scroll="paper">
      <DialogTitle sx={{ p: 0 }} className="no-print">
        <Box sx={{ bgcolor: VIOLETA_SCOUT, color: 'white', p: 3 }}>
          <Stack direction="row" justifyContent="space-between">
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 900 }}>{adulto.apellido}, {adulto.nombre}</Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>DNI: {adulto.dni} • SNF 2025</Typography>
            </Box>
            <IconButton onClick={onClose} sx={{ color: 'white' }}><Close /></IconButton>
          </Stack>
        </Box>
        <Tabs value={tab} onChange={(e, v) => setTab(v)} variant="fullWidth">
          <Tab icon={<School fontSize="small" />} label="FORMACIÓN" />
          <Tab icon={<Badge fontSize="small" />} label="PLAN DE DESEMPEÑO" />
        </Tabs>
      </DialogTitle>
      
      <DialogContent sx={{ p: 3, bgcolor: '#fbfbfb' }} className="print-area">
        <Box sx={{ display: 'none', '@media print': { display: 'block', mb: 4 } }}>
            <Typography variant="h4" textAlign="center" sx={{ fontWeight: 900, mb: 1 }}>PLAN DE DESEMPEÑO ADULTO</Typography>
            <Typography variant="h6" textAlign="center" gutterBottom>Grupo Scout Tupahue • SNF 2025</Typography>
            <Divider sx={{ my: 2 }} />
            <Typography><strong>Educador:</strong> {adulto.apellido}, {adulto.nombre}</Typography>
            <Typography><strong>DNI:</strong> {adulto.dni}</Typography>
            <Typography><strong>Funciones:</strong> {adulto.funciones?.join(', ')}</Typography>
            <Divider sx={{ my: 2 }} />
        </Box>

        {tab === 0 && (
          <Box sx={{ mt: 2 }}>
            {renderNivel("NIVEL 1: ETAPA BÁSICA", experienciasFiltradas.basico, "#9e9e9e")}
            <Divider sx={{ my: 3 }} />
            {renderNivel("NIVEL 2: ETAPA INTERMEDIA", experienciasFiltradas.intermedio, "#1976d2")}
            <Divider sx={{ my: 3 }} />
            {renderNivel("NIVEL 3: ETAPA AVANZADA", experienciasFiltradas.avanzado, "#2e7d32")}
          </Box>
        )}

        {tab === 1 && (
          <Stack spacing={3} sx={{ mt: 2 }}>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, '@media print': { border: 'none', p: 0 } }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1 }}>Acuerdos de Gestión y Cargo</Typography>
              <TextField multiline rows={4} fullWidth value={plan.acuerdos} onChange={(e) => setPlan({...plan, acuerdos: e.target.value})} className="no-print" />
              <Typography sx={{ display: 'none', '@media print': { display: 'block', whiteSpace: 'pre-wrap' } }}>{plan.acuerdos}</Typography>
            </Paper>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, '@media print': { border: 'none', p: 0 } }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1 }}>Objetivos de Formación</Typography>
              <TextField multiline rows={4} fullWidth value={plan.objetivos} onChange={(e) => setPlan({...plan, objetivos: e.target.value})} className="no-print" />
              <Typography sx={{ display: 'none', '@media print': { display: 'block', whiteSpace: 'pre-wrap' } }}>{plan.objetivos}</Typography>
            </Paper>

            <Box sx={{ display: 'none', '@media print': { display: 'block', mt: 8 } }}>
                <Grid container spacing={8}>
                    <Grid item xs={6} textAlign="center">
                        <Box sx={{ borderTop: '1px solid black', mt: 4, pt: 1 }}>Firma Educador</Box>
                    </Grid>
                    <Grid item xs={6} textAlign="center">
                        <Box sx={{ borderTop: '1px solid black', mt: 4, pt: 1 }}>Firma AGA / Jefe Grupo</Box>
                    </Grid>
                </Grid>
            </Box>

            <Stack direction="row" spacing={2} justifyContent="center" className="no-print">
                <Button variant="contained" startIcon={<Save />} onClick={handleSavePlan} sx={{ bgcolor: VIOLETA_SCOUT }}>Guardar</Button>
                <Button variant="outlined" startIcon={<Print />} onClick={handlePrint}>Imprimir para Firma</Button>
            </Stack>
          </Stack>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2 }} className="no-print">
          <Button onClick={onClose} variant="outlined">Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
};