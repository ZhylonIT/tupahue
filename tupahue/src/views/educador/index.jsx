import { DashboardView } from './DashboardView';
import { NominaView } from './nomina/NominaView';
import { ProgresionView } from './progresion/ProgresionView';
import { CalendarioView } from './calendario/CalendarioView';
import { DocumentosView } from './documentos/DocumentosView';
import { PlanificacionesView } from './planificaciones/PlanificacionesView'; 
// Importación de la nueva vista de Noticias
import { NoticiasView } from './noticias/NoticiasView'; 
import { Box } from '@mui/material';

export const EducadorMainView = ({ 
  vistaActual, 
  setVistaActual, 
  setRamaActiva, 
  ramaActiva, 
  scouts, 
  eventos, 
  handlers,
  userFuncion 
}) => {
  
  // Lógica de filtrado por rama (se mantiene para las vistas que lo requieren)
  const scoutsFiltrados = scouts?.filter(s => {
    if (ramaActiva === 'TODAS') return true;
    const ramaScout = s.rama || ""; 
    return ramaScout.toUpperCase() === (ramaActiva?.toUpperCase() || "");
  }) || [];

  const commonProps = { 
    ramaId: ramaActiva,
    userFuncion: userFuncion 
  };

  // El switch decide qué componente renderizar en el área principal del Dashboard
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
      return (
        <ProgresionView 
          scouts={scoutsFiltrados} 
          setRamaActiva={setRamaActiva} 
          {...commonProps} 
          onUpdateEtapa={handlers.handleUpdateEtapa} 
          onPaseDeRama={handlers.handlePaseDeRama} 
        />
      );

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

    // --- VISTA DE PRENSA Y NOTICIAS ---
    case 'NOTICIAS':
      return <NoticiasView {...commonProps} />;

    // Caso por defecto: vuelve al Dashboard inicial
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