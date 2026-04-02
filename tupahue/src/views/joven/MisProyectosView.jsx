import React, { useState } from 'react';
import { 
  Box, Typography, Card, CardContent, Stepper, Step, StepLabel, 
  Button, TextField, Paper, Chip, Divider, Stack, Grid,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Avatar, IconButton, Alert, Tooltip, Container
} from '@mui/material';
import { 
  RocketLaunch, FactCheck, Save, Send, Construction, 
  AddCircle, Visibility, Edit, Message,
  History, Download, DeleteOutline, WarningAmber, TaskAlt
} from '@mui/icons-material';

import { generarPDFProyecto } from '../../services/pdfProyectos';
import { RAMAS } from '../../constants/ramas';
import { ModalFinalizarProyecto } from './ModalFinalizarProyecto';

const PASOS = [
  { label: 'El Sueño', desc: 'La idea principal' },
  { label: 'Diagnóstico', desc: '¿Qué tenemos?' },
  { label: 'Organización', desc: '¿Cómo lo hacemos?' },
  { label: 'Revisión', desc: 'Factibilidad' }
];

export const MisProyectosView = ({ joven, proyectos = [], onSave, onDelete, onMarkAsSeen }) => {
  const [modoEdicion, setModoEdicion] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [proyectoParaFinalizar, setProyectoParaFinalizar] = useState(null);

  const ramaId = joven?.rama?.toUpperCase() || 'SCOUTS';
  const CONFIG_RAMA = RAMAS[ramaId] || RAMAS.SCOUTS;
  const esLobato = ramaId === 'LOBATOS';
  const term = esLobato ? 'Cacería' : 'Proyecto';
  const subTerm = esLobato ? 'Seisena' : (ramaId === 'SCOUTS' ? 'Patrulla' : 'Equipo');

  const misProyectos = proyectos.filter(p => p.equipo === joven?.equipo && p.rama === joven?.rama);

  const [form, setForm] = useState({
    titulo: '', objetivos: '', diagnostico: '', tareas: '',
    estado: 'BORRADOR', equipo: joven?.equipo, rama: joven?.rama
  });

  const esSoloLectura = ['PENDIENTE', 'ACTIVO', 'FINALIZADO'].includes(form.estado);

  const handleNuevo = () => {
    setForm({ titulo: '', objetivos: '', diagnostico: '', tareas: '', estado: 'BORRADOR', equipo: joven?.equipo, rama: joven?.rama });
    setActiveStep(0);
    setModoEdicion(true);
  };

  const handleEditar = (proy) => {
    setForm(proy);
    setActiveStep(0);
    setModoEdicion(true);
    if (proy.vistoPorJoven === false && onMarkAsSeen) onMarkAsSeen(proy.id);
  };

  const handleLocalSave = (status = 'BORRADOR') => {
    onSave({ ...form, estado: status, ultimaModificacion: new Date() });
    setModoEdicion(false);
    if (status === 'PENDIENTE') alert(`¡${term} enviada a revisión!`);
  };

  const handleConfirmarFinalizacion = (proyectoActualizado) => {
    onSave(proyectoActualizado);
    setProyectoParaFinalizar(null);
    setModoEdicion(false);
  };

  const getStatusColor = (estado) => {
    switch (estado) {
      case 'ACTIVO': return 'success';
      case 'FINALIZADO': return 'info';
      case 'PENDIENTE': return 'warning';
      case 'OBSERVADO': return 'secondary';
      case 'RECHAZADO': return 'error';
      default: return 'default';
    }
  };

  if (!modoEdicion) {
    return (
      <Container maxWidth="xl" sx={{ py: 3, animation: 'fadeIn 0.6s ease-out' }}>
        <Paper 
          elevation={12} 
          sx={{ 
            p: { xs: 4, md: 5 }, borderRadius: 6, mb: 5, 
            background: `linear-gradient(135deg, ${CONFIG_RAMA.color} 0%, #1a1a1a 100%)`, 
            color: 'white', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, 
            alignItems: 'center', gap: 4, boxShadow: `0 15px 40px ${CONFIG_RAMA.color}40`
          }}
        >
          <Avatar sx={{ width: { xs: 80, md: 100 }, height: { xs: 80, md: 100 }, bgcolor: 'rgba(255,255,255,0.1)', border: '3px solid rgba(255,255,255,0.3)' }}>
            <RocketLaunch sx={{ fontSize: { xs: 40, md: 60 } }} />
          </Avatar>
          <Box sx={{ flexGrow: 1, textAlign: { xs: 'center', md: 'left' } }}>
            <Typography variant="overline" sx={{ fontWeight: 900, letterSpacing: 4, opacity: 0.8 }}>GESTIÓN DE PROGRAMA</Typography>
            <Typography variant="h2" sx={{ fontWeight: 900, mb: 1, textTransform: 'uppercase' }}>{term}s de {subTerm}</Typography>
            <Typography variant="h6" sx={{ opacity: 0.8, fontWeight: 500 }}>{subTerm} {joven?.equipo}</Typography>
          </Box>
          <Button variant="contained" size="large" startIcon={<AddCircle />} onClick={handleNuevo} sx={{ bgcolor: 'white', color: 'black', fontWeight: 900, borderRadius: 4, px: 4 }}>
            Nueva {term}
          </Button>
        </Paper>

        <TableContainer component={Paper} elevation={4} sx={{ borderRadius: 5, overflow: 'hidden' }}>
          <Table>
            <TableHead sx={{ bgcolor: '#1a1a1a' }}>
              <TableRow>
                <TableCell sx={{ color: 'white', fontWeight: 800 }}>TÍTULO</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 800 }}>ESTADO</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 800 }}>MODIFICADO</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 800 }} align="center">ACCIONES</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {misProyectos.map((proy) => {
                const proyReadOnly = proy.estado !== 'BORRADOR' && proy.estado !== 'OBSERVADO';
                return (
                  <TableRow key={proy.id} hover>
                    <TableCell sx={{ fontWeight: 700 }}>{proy.titulo}</TableCell>
                    <TableCell>
                      <Chip label={proy.estado} color={getStatusColor(proy.estado)} sx={{ fontWeight: 900, borderRadius: 2 }} />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 500, color: '#64748b' }}>
                      {new Date(proy.ultimaModificacion).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <Button 
                          variant="outlined" size="small" 
                          startIcon={proyReadOnly ? <Visibility /> : <Edit />}
                          onClick={() => handleEditar(proy)}
                          sx={{ borderRadius: 2, fontWeight: 800, color: CONFIG_RAMA.color, borderColor: CONFIG_RAMA.color }}
                        >
                          {proyReadOnly ? 'Ver' : 'Editar'}
                        </Button>
                        {proy.estado === 'ACTIVO' && (
                          <Tooltip title={`Finalizar ${term}`}>
                            <IconButton color="success" onClick={() => setProyectoParaFinalizar(proy)}>
                              <TaskAlt />
                            </IconButton>
                          </Tooltip>
                        )}
                        <Tooltip title="Descargar PDF">
                          <IconButton color="primary" onClick={() => generarPDFProyecto(proy, joven)}>
                            <Download />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                          <IconButton color="error" onClick={() => onDelete(proy.id)}>
                            <DeleteOutline />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        <ModalFinalizarProyecto 
          open={Boolean(proyectoParaFinalizar)} 
          onClose={() => setProyectoParaFinalizar(null)}
          proyecto={proyectoParaFinalizar}
          onConfirm={handleConfirmarFinalizacion}
          term={term}
        />
      </Container>
    );
  }

  // --- VISTA DE EDITOR (STEPPER) ---
  return (
    <Container maxWidth="xl" sx={{ py: 3, animation: 'fadeIn 0.4s ease-out' }}>
      <Button onClick={() => setModoEdicion(false)} sx={{ mb: 3, fontWeight: 800, color: '#64748b' }}>← Volver</Button>
      <Card elevation={6} sx={{ borderRadius: 6, overflow: 'hidden' }}>
        <Box sx={{ bgcolor: CONFIG_RAMA.color, p: 1 }} />
        <CardContent sx={{ p: { xs: 3, md: 6 } }}>
          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 8 }}>
            {PASOS.map((paso) => (
              <Step key={paso.label}><StepLabel><Typography variant="subtitle2" sx={{ fontWeight: 800 }}>{paso.label}</Typography></StepLabel></Step>
            ))}
          </Stepper>

          <Box sx={{ minHeight: 350 }}>
            {activeStep === 0 && (
              <Stack spacing={4}>
                <TextField fullWidth label="Nombre" variant="filled" value={form.titulo} onChange={(e) => setForm({...form, titulo: e.target.value})} InputProps={{ readOnly: esSoloLectura, disableUnderline: true, sx: { borderRadius: 3, fontWeight: 800 } }} />
                <TextField fullWidth multiline rows={6} label="¿Qué soñamos?" variant="filled" value={form.objetivos} onChange={(e) => setForm({...form, objetivos: e.target.value})} InputProps={{ readOnly: esSoloLectura, disableUnderline: true, sx: { borderRadius: 3 } }} />
              </Stack>
            )}
            {activeStep === 1 && <TextField fullWidth multiline rows={10} label="Recursos" variant="filled" value={form.diagnostico} onChange={(e) => setForm({...form, diagnostico: e.target.value})} InputProps={{ readOnly: esSoloLectura, disableUnderline: true, sx: { borderRadius: 3 } }} />}
            {activeStep === 2 && <TextField fullWidth multiline rows={10} label="Tareas" variant="filled" value={form.tareas} onChange={(e) => setForm({...form, tareas: e.target.value})} InputProps={{ readOnly: esSoloLectura, disableUnderline: true, sx: { borderRadius: 3 } }} />}
            {activeStep === 3 && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <FactCheck sx={{ fontSize: 100, color: CONFIG_RAMA.color, mb: 2, opacity: 0.8 }} />
                <Typography variant="h3" sx={{ fontWeight: 900, mb: 2 }}>{form.estado}</Typography>
                {form.estado === 'FINALIZADO' && (
                  <Paper variant="outlined" sx={{ mt: 3, p: 3, borderRadius: 4, bgcolor: '#f0f9ff', textAlign: 'left' }}>
                    <Typography variant="h6" color="primary" sx={{ fontWeight: 900 }}>Evaluación Final:</Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}>"{form.evaluacionJoven}"</Typography>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="caption" sx={{ fontWeight: 800 }}>Logro: {form.nivelLogro}</Typography>
                  </Paper>
                )}
              </Box>
            )}
          </Box>

          <Divider sx={{ my: 6 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button disabled={activeStep === 0} onClick={() => setActiveStep(activeStep - 1)} sx={{ fontWeight: 800 }}>Atrás</Button>
            <Box sx={{ display: 'flex', gap: 2 }}>
              {esSoloLectura ? (
                <Button variant="contained" disabled={activeStep === 3} onClick={() => setActiveStep(activeStep + 1)} sx={{ borderRadius: 3, px: 4, bgcolor: CONFIG_RAMA.color }}>Siguiente</Button>
              ) : (
                <>
                  <Button variant="text" startIcon={<Save />} onClick={() => handleLocalSave('BORRADOR')} sx={{ fontWeight: 800, color: '#64748b' }}>Guardar Borrador</Button>
                  <Button variant="contained" color="warning" endIcon={<Send />} onClick={() => (activeStep === 3 ? handleLocalSave('PENDIENTE') : setActiveStep(activeStep + 1))} sx={{ borderRadius: 3, px: 6 }}>
                    {activeStep === 3 ? 'Enviar a Revisión' : 'Siguiente'}
                  </Button>
                </>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};