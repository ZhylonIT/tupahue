import { useState } from 'react';
import { Box, Stepper, Step, StepLabel, Button, Divider, Stack, Typography, Paper, Chip } from '@mui/material';
import { Save, ChevronLeft, ChevronRight, Public } from '@mui/icons-material';

import { PasoEstructura } from '../pasos/Estructura';
import { PasoProgresiones } from '../pasos/progresiones';
import { PasoPlanilla } from '../pasos/planilla';
import { generarPDFPlanificacion } from '../../../../services/pdfPlanificacion';

// 🎯 Recibimos scouts, adultos (educadores) y handlers del motor global
export const PlanificacionEditor = ({ ramaId, onSaveSuccess, scouts, adultos, handlers }) => {
  const [activeStep, setActiveStep] = useState(0);
  
  const [datosPlan, setDatosPlan] = useState({
    fechaActividad: new Date().toISOString().slice(0, 10),
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

  const esVistaGlobal = ramaId?.toUpperCase() === 'TODAS';

  // Definición de pasos según la vista (Global o por Rama)
  const STEPS = esVistaGlobal
    ? ['Diagnóstico Global', 'Planificación de Jornada']
    : ['Diagnóstico y Estructura', 'Progresión y Pases', 'Planificación de Jornada'];

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleFinalizar = () => {
    // 1. Generamos el PDF para descarga inmediata
    generarPDFPlanificacion(datosPlan, ramaId);
    
    // 2. Ejecutamos el guardado en Supabase a través del hook usePlanificaciones
    if (onSaveSuccess) {
      onSaveSuccess(datosPlan);
    }
  };

  const renderStepContent = () => {    
    // 🎯 Empaquetamos todas las props necesarias para los sub-componentes (pasos)
    const stepProps = { 
      ramaId, 
      data: datosPlan, 
      setData: setDatosPlan, 
      scouts,   // Para nómina y progresiones
      adultos,  // Para responsables en la planilla
      handlers  // Para agendar eventos en el calendario
    };

    if (esVistaGlobal) {
      switch (activeStep) {
        case 0: return <PasoEstructura {...stepProps} />;
        case 1: return <PasoPlanilla {...stepProps} />;
        default: return null;
      }
    } else {
      switch (activeStep) {
        case 0: return <PasoEstructura {...stepProps} />;
        case 1: return <PasoProgresiones {...stepProps} />;
        case 2: return <PasoPlanilla {...stepProps} />;
        default: return null;
      }
    }
  };

  return (
    <Paper elevation={0} sx={{ p: { xs: 2, md: 5 }, borderRadius: 5, border: '1px solid #e0e0e0' }}>
      
      {/* Cabecera del Editor */}
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

      {/* Indicador de Pasos */}
      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 5 }}>
        {STEPS.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Contenido Dinámico del Paso */}
      <Box sx={{ minHeight: 400 }}>
        {renderStepContent()}
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Botonera de Navegación */}
      <Stack direction="row" justifyContent="space-between">
        <Button 
          disabled={activeStep === 0} 
          onClick={handleBack} 
          startIcon={<ChevronLeft />} 
          variant="outlined"
          sx={{ borderRadius: 2, fontWeight: 700 }}
        >
          Anterior
        </Button>
        
        {activeStep < STEPS.length - 1 ? (
          <Button 
            variant="contained" 
            onClick={handleNext} 
            endIcon={<ChevronRight />}
            sx={{ borderRadius: 2, fontWeight: 700, px: 4 }}
          >
            Continuar
          </Button>
        ) : (
          <Button 
            variant="contained" 
            color="success" 
            onClick={handleFinalizar} 
            startIcon={<Save />} 
            sx={{ px: 4, fontWeight: 900, borderRadius: 2 }}
          >
            Finalizar y Guardar en Nube
          </Button>
        )}
      </Stack>
    </Paper>
  );
};