import { DashboardView } from './DashboardView';
import { NominaView } from './nomina/NominaView';
import { ProgresionView } from './progresion/ProgresionView';
import { CalendarioView } from './calendario/CalendarioView';
import { DocumentosView } from './documentos/DocumentosView';
// --- ÚNICA ADICIÓN DE IMPORT ---
import { PlanificacionesView } from './planificaciones/PlanificacionesView'; 
import { Box, Typography } from '@mui/material';
import { InfoOutlined } from '@mui/icons-material';

export const EducadorMainView = ({ 
  vistaActual, 
  setVistaActual, 
  setRamaActiva, // <-- PASO 2: Recibimos la función acá
  ramaActiva, 
  scouts, 
  eventos, 
  handlers,
  userFuncion 
}) => {
  
  // Lógica de filtrado (MANTENIDA EXACTA)
  const scoutsFiltrados = scouts.filter(s => {
    if (ramaActiva === 'TODAS') return true;
    const ramaScout = s.rama || ""; 
    return ramaScout.toUpperCase() === (ramaActiva?.toUpperCase() || "");
  });

  const commonProps = { 
    ramaId: ramaActiva,
    userFuncion: userFuncion 
  };

  switch (vistaActual) {
    case 'DASHBOARD': 
      return (
        <DashboardView 
          scouts={scoutsFiltrados} 
          eventos={eventos} 
          setVistaActual={setVistaActual}
          {...commonProps} 
        />
      );
    
    case 'NOMINA': 
      return (
        <NominaView 
          scouts={scoutsFiltrados} 
          {...commonProps} 
          onToggleAsistencia={handlers.handleToggleAsistencia}
          onEdit={handlers.handleOpenForm} 
          onVerFicha={handlers.handleOpenDetail} 
          onDelete={handlers.handleDeleteScout}
          onAdd={() => handlers.handleOpenForm(null)} 
        />
      );

    case 'PROGRESION':       
      // ¡ELIMINAMOS EL BLOQUEO AQUÍ! Ahora ProgresionView maneja la vista global sola.
      return (
        <ProgresionView 
          scouts={scoutsFiltrados} 
          setRamaActiva={setRamaActiva} // <-- PASO 2: Se la pasamos a la vista
          {...commonProps} 
          onUpdateEtapa={handlers.handleUpdateEtapa} 
          onPaseDeRama={handlers.handlePaseDeRama} 
        />
      );

    // --- ÚNICA ADICIÓN DE CASE ---
    case 'PLANIFICACIONES':
      return <PlanificacionesView ramaId={ramaActiva} {...commonProps} />;

    case 'CALENDARIO':
      return (
        <CalendarioView 
          eventos={eventos} 
          {...commonProps} 
          onAddEvento={handlers.handleAddEvento}
          onDeleteEvento={handlers.handleDeleteEvento} 
        />
      );

    case 'DOCUMENTOS': 
      return <DocumentosView scouts={scoutsFiltrados} {...commonProps} />;

    default: 
      return (
        <DashboardView 
          scouts={scoutsFiltrados} 
          eventos={eventos} 
          setVistaActual={setVistaActual}
          {...commonProps} 
        />
      );
  }
};