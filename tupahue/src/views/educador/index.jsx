import { useState, useMemo } from 'react';
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
import { PerfilView } from '../PerfilView';
import { Box } from '@mui/material';

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
  user,
  handleSaveScout 
}) => {
  
  const [hijoSeleccionadoId, setHijoSeleccionadoId] = useState(null);

  const hijoActivo = useMemo(() => {
    if (userFuncion !== ROLES.FAMILIA || !scouts || scouts.length === 0) return null;
    const encontrado = scouts.find(h => h.id === hijoSeleccionadoId);
    return encontrado || scouts[0]; 
  }, [hijoSeleccionadoId, scouts, userFuncion]);

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
    case 'PERFIL': return <PerfilView />;

    case 'DASHBOARD': 
      if (userFuncion === ROLES.FAMILIA) {
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
      }
      return <DashboardView scouts={scoutsFiltrados} eventos={eventos} proyectos={proyectos} setVistaActual={setVistaActual} {...commonProps} />;

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
      if (userFuncion === ROLES.FAMILIA) return <DocumentacionFamiliaView hijo={hijoActivo} onUpdateScout={handleSaveScout} />;
      return <Box sx={{ p: 3 }}>Vista de Documentos Educador</Box>;
    
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
      return <PlanificacionesView ramaId={ramaActiva} {...commonProps} scouts={esVistaGlobal ? scouts : scoutsFiltrados} adultos={adultos} />;

    case 'REVISION_PROYECTOS':
      return <RevisionProyectosView proyectos={proyectos} onReview={handlers.handleReviewProyecto} esVistaGlobal={esVistaGlobal} {...commonProps} />;

    case 'CALENDARIO':
      return <CalendarioView eventos={eventos} {...commonProps} onAddEvento={handlers.handleAddEvento} onDeleteEvento={handlers.handleDeleteEvento} />;

    case 'DOCUMENTOS': 
      return (
        <DocumentosView 
          scouts={scoutsFiltrados} 
          {...commonProps} 
          onUpdateScout={handleSaveScout} // 🎯 CORREGIDO: Usamos la función de guardado directo
        />
      );

    case 'NOTICIAS': return <NoticiasView {...commonProps} />;
    case 'FINANZAS':
      if (userFuncion === ROLES.FAMILIA) return <FinanzasFamiliaView hijo={hijoActivo} />;
      return <FinanzasView scouts={scouts} {...commonProps} />;
    case 'CUOTAS': return <CuotasView nomina={scouts} {...commonProps} />;
    case 'PRESUPUESTO': return <PresupuestoView />;
    case 'ADULTOS': return <AdultosView {...commonProps} />;

    default: return <DashboardView scouts={scoutsFiltrados} eventos={eventos} proyectos={proyectos} setVistaActual={setVistaActual} {...commonProps} />;
  }
};

export default EducadorMainView;