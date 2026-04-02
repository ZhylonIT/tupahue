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
import { AdultosView } from './adultos/AdultosView';
// 👇 IMPORTAMOS LA NUEVA VISTA DE REVISIÓN
import { RevisionProyectosView } from './proyectos/RevisionProyectosView';
import { Box } from '@mui/material';

export const EducadorMainView = ({ 
  vistaActual, 
  setVistaActual, 
  setRamaActiva, 
  ramaActiva, 
  scouts, 
  eventos, 
  proyectos = [], // 👈 AGREGADO: Recibimos los proyectos del state global
  handlers,
  userFuncion 
}) => {
  
  // Lógica de filtrado por rama para beneficiarios
  const scoutsFiltrados = scouts?.filter(s => {
    if (ramaActiva === 'TODAS') return true;
    const ramaScout = s.rama || ""; 
    return ramaScout.toUpperCase() === (ramaActiva?.toUpperCase() || "");
  }) || [];

  const commonProps = { 
    ramaId: ramaActiva,
    userFuncion: userFuncion 
  };

  const esVistaGlobal = ramaActiva === 'TODAS';

  switch (vistaActual) {
    case 'DASHBOARD': 
      return (
        <DashboardView 
          scouts={scoutsFiltrados} 
          eventos={eventos} 
          proyectos={proyectos} // 👈 Pasamos proyectos para la alerta del banner
          setVistaActual={setVistaActual}
          {...commonProps} 
        />
      );
    
    case 'NOMINA': 
    case 'NOMINA_GLOBAL': 
      return (
        <NominaView 
          scouts={esVistaGlobal ? scouts : scoutsFiltrados} 
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

    // 👇 NUEVO CASO: REVISIÓN DE PROYECTOS (CACERÍAS / EMPRESAS)
    case 'REVISION_PROYECTOS':
      return (
        <RevisionProyectosView 
          proyectos={proyectos} 
          onReview={handlers.handleReviewProyecto}
          esVistaGlobal={esVistaGlobal}
          {...commonProps} 
        />
      );

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

    case 'ADULTOS':
      return <AdultosView {...commonProps} />;

    default: 
      return (
        <DashboardView 
          scouts={scoutsFiltrados} 
          eventos={eventos} 
          proyectos={proyectos}
          setVistaActual={setVistaActual}
          {...commonProps} 
        />
      );
  }
};