import { DashboardView } from './DashboardView';
import { NominaView } from './nomina/NominaView';
import { ProgresionView } from './progresion/ProgresionView';
import { CalendarioView } from './calendario/CalendarioView';
import { DocumentosView } from './documentos/DocumentosView';
import { PlanificacionesView } from './planificaciones/PlanificacionesView'; 
import { NoticiasView } from './noticias/NoticiasView'; 
import { FinanzasView } from './finanzas/FinanzasView'; 
import { CuotasView } from './finanzas/CuotasView'; 
import { PresupuestoView } from './finanzas/PresupuestoView'; 
// 👇 IMPORTAMOS LA NUEVA VISTA DE ADULTOS
import { AdultosView } from './adultos/AdultosView';
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
  
  // Lógica de filtrado por rama
  const scoutsFiltrados = scouts?.filter(s => {
    if (ramaActiva === 'TODAS') return true;
    const ramaScout = s.rama || ""; 
    return ramaScout.toUpperCase() === (ramaActiva?.toUpperCase() || "");
  }) || [];

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
    case 'NOMINA_GLOBAL': 
      return (
        <NominaView 
          scouts={ramaActiva === 'TODAS' ? scouts : scoutsFiltrados} 
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

    case 'NOTICIAS':
      return <NoticiasView {...commonProps} />;

    case 'FINANZAS':
      return <FinanzasView scouts={scouts} {...commonProps} />;

    case 'CUOTAS':
      return <CuotasView nomina={scouts} {...commonProps} />;

    case 'PRESUPUESTO':
      return <PresupuestoView />;

    // 👇 NUEVO CASO PARA GESTIÓN DE ADULTOS
    case 'ADULTOS':
      return <AdultosView {...commonProps} />;

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