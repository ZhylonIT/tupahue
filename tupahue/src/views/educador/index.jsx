import { useState, useMemo } from 'react'; // 🎯 Agregamos useState y useMemo
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
import { RevisionProyectosView } from './proyectos/RevisionProyectosView';
import { Box } from '@mui/material';

// Vistas de Familia
import { MisHijosView } from '../familia/MisHijosView';
import { FinanzasView as FinanzasFamiliaView } from '../familia/FinanzasView';
import { DocumentacionView as DocumentacionFamiliaView } from '../familia/DocumentacionView';
import { ProgresionFamiliaView } from '../familia/ProgresionFamiliaView';

import { ROLES } from '../../constants/auth';

export const EducadorMainView = ({ 
  vistaActual, 
  setVistaActual, 
  setRamaActiva, 
  ramaActiva, 
  scouts, 
  adultos, 
  eventos, 
  proyectos = [], 
  handlers,
  userFuncion,
  user // 🎯 Recibimos el user para tener el ID del padre
}) => {
  
  // 🎯 ESTADO PARA GESTIONAR EL HIJO SELECCIONADO EN MODO FAMILIA
  const [hijoSeleccionadoId, setHijoSeleccionadoId] = useState(null);

  // Derivamos el hijo activo de la lista de scouts (que en modo familia ya vienen filtrados por padre_id)
  const hijoActivo = useMemo(() => {
    if (userFuncion !== ROLES.FAMILIA || !scouts || scouts.length === 0) return null;
    const encontrado = scouts.find(h => h.id === hijoSeleccionadoId);
    return encontrado || scouts[0]; // Por defecto toma al primero (Máximo)
  }, [hijoSeleccionadoId, scouts, userFuncion]);

  // 🎯 FILTRADO RIGUROSO POR RAMA (Para vista de Educador)
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
      // 🎯 Reparación: Si el educador cambia a "Familia", el dashboard es "Mis Hijos"
      if (userFuncion === ROLES.FAMILIA) {
        return (
          <MisHijosView 
            hijosVinculados={scouts} 
            onVincular={(dni) => handlers.handleVincularHijo(dni, user.id)}
            onSelectHijo={(hijo) => {
              setHijoSeleccionadoId(hijo.id);
              setVistaActual('FINANZAS'); // Navegación automática al seleccionar
            }}
          />
        );
      }
      return (
        <DashboardView 
          scouts={scoutsFiltrados} 
          eventos={eventos} 
          proyectos={proyectos} 
          setVistaActual={setVistaActual}
          {...commonProps} 
        />
      );

    case 'MIS_HIJOS':
      return (
        <MisHijosView 
          hijosVinculados={scouts} 
          onVincular={(dni) => handlers.handleVincularHijo(dni, user.id)}
          onSelectHijo={(hijo) => {
            setHijoSeleccionadoId(hijo.id);
            setVistaActual('FINANZAS');
          }}
        />
      );
    
    case 'DOCUMENTACION':
      // 🎯 Reparación: Pasamos el hijo activo
      if (userFuncion === ROLES.FAMILIA) return <DocumentacionFamiliaView hijo={hijoActivo} />;
      return <Box>Vista no disponible para este cargo.</Box>;
    
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
      // 🎯 Reparación: Pasamos el hijo activo a la vista de familia
      if (userFuncion === ROLES.FAMILIA) return <ProgresionFamiliaView hijo={hijoActivo} />;
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
      return (
        <PlanificacionesView 
          ramaId={ramaActiva} 
          {...commonProps} 
          scouts={esVistaGlobal ? scouts : scoutsFiltrados} 
          adultos={adultos} 
        />
      );

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
      return (
        <DocumentosView 
          scouts={scoutsFiltrados} 
          {...commonProps} 
          onUpdateScout={handlers.handleUpdateEtapa} 
        />
      );

    case 'NOTICIAS':
      return <NoticiasView {...commonProps} />;

    case 'FINANZAS':
      // 🎯 Reparación: Pasamos el hijo activo a la vista de familia
      if (userFuncion === ROLES.FAMILIA) return <FinanzasFamiliaView hijo={hijoActivo} />;
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

export default EducadorMainView;