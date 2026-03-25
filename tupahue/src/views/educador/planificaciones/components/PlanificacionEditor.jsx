import { useState } from 'react';
import { Box, Stepper, Step, StepLabel, Button, Divider, Stack, Typography, Paper, Chip } from '@mui/material';
import { Save, ChevronLeft, ChevronRight, Public } from '@mui/icons-material';

import { PasoEstructura } from '../pasos/Estructura';
import { PasoProgresiones } from '../pasos/progresiones';
import { PasoPlanilla } from '../pasos/planilla';
import { generarPDFPlanificacion } from '../../../../services/pdfPlanificacion';

export const PlanificacionEditor = ({ ramaId, onSaveSuccess }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [datosPlan, setDatosPlan] = useState({
    fechaActividad: new Date().toISOString().slice(0, 10), // Fecha de hoy por defecto
    cicloPrograma: '',
    nombreActividad: '',
    planRama: '',
    diagnostico: '',
    equipos: [],
    pasesAgendados: [],
    progresiones: [],
    objetivosJornada: '',
    cronograma: [],
    listaActividades: [] 
  });

  // 1. Detectamos si es una planificación de todo el Grupo
  const esVistaGlobal = ramaId?.toUpperCase() === 'TODAS';

  // 2. Adaptamos los pasos: El grupo no tiene "Pases" ni "Progresión de insignias" grupal
  const STEPS = esVistaGlobal 
    ? ['Diagnóstico Global', 'Planificación de Jornada'] 
    : ['Diagnóstico y Estructura', 'Progresión y Pases', 'Planificación de Jornada'];

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleFinalizar = () => {
    generarPDFPlanificacion(datosPlan, ramaId);
    if (onSaveSuccess) onSaveSuccess(datosPlan);
  };

  // 3. Renderizamos los componentes correctos según la cantidad de pasos
  const renderStepContent = () => {
    if (esVistaGlobal) {
      switch (activeStep) {
        case 0: return <PasoEstructura ramaId={ramaId} data={datosPlan} setData={setDatosPlan} />;
        case 1: return <PasoPlanilla ramaId={ramaId} data={datosPlan} setData={setDatosPlan} />;
        default: return null;
      }
    } else {
      switch (activeStep) {
        case 0: return <PasoEstructura ramaId={ramaId} data={datosPlan} setData={setDatosPlan} />;
        case 1: return <PasoProgresiones ramaId={ramaId} data={datosPlan} setData={setDatosPlan} />;
        case 2: return <PasoPlanilla ramaId={ramaId} data={datosPlan} setData={setDatosPlan} />;
        default: return null;
      }
    }
  };

  return (
    <Paper elevation={0} sx={{ p: { xs: 2, md: 5 }, borderRadius: 5, border: '1px solid #e0e0e0' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: esVistaGlobal ? '#5A189A' : '#1a237e' }}>
          {STEPS[activeStep]}
        </Typography>
        <Chip 
          icon={esVistaGlobal ? <Public /> : undefined}
          label={esVistaGlobal ? "GRAN JUEGO / EVENTO GRUPAL" : `RAMA: ${ramaId}`} 
          color={esVistaGlobal ? "secondary" : "primary"} 
          sx={{ fontWeight: 700 }} 
        />
      </Stack>

      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 5 }}>
        {STEPS.map((label) => (
          <Step key={label}><StepLabel>{label}</StepLabel></Step>
        ))}
      </Stepper>

      <Box sx={{ minHeight: 400 }}>
        {renderStepContent()}
      </Box>

      <Divider sx={{ my: 3 }} />

      <Stack direction="row" justifyContent="space-between">
        <Button disabled={activeStep === 0} onClick={handleBack} startIcon={<ChevronLeft />} variant="outlined">
          Anterior
        </Button>
        {activeStep < STEPS.length - 1 ? (
          <Button variant="contained" onClick={handleNext} endIcon={<ChevronRight />}>Continuar</Button>
        ) : (
          <Button variant="contained" color="success" onClick={handleFinalizar} startIcon={<Save />} sx={{ px: 4, fontWeight: 'bold' }}>
            Finalizar y Guardar
          </Button>
        )}
      </Stack>
    </Paper>
  );
};