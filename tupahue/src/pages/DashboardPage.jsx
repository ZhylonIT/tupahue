import { useMemo } from 'react'; 
import { Box, CssBaseline, Toolbar } from '@mui/material';
import { ROLES, FUNCIONES } from '../constants/auth.jsx';
import { Sidebar } from '../components/Sidebar/Sidebar'; 
import { DashboardModals } from '../components/DashboardModals'; 
import { EducadorMainView } from '../views/educador';
import { useDashboard } from '../hooks/useDashboard';
import { useAuth } from '../context/AuthContext';

export const DashboardPage = () => {  
  const { user, userFuncion } = useAuth();

  const puedeCambiarRama = useMemo(() => {
    return userFuncion === FUNCIONES.JEFE_GRUPO || userFuncion === FUNCIONES.ASISTENTE_PROG;
  }, [userFuncion]);

  const state = useDashboard(user, [], [], userFuncion);

  if (!user) return null;

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f8f9fa', minHeight: '100vh' }}>
      <CssBaseline />
      
      {/* 🔄 Sidebar Universal configurado para Educador */}
      <Sidebar 
        ramaSeleccionada={state.ramaActiva} 
        onRamaChange={state.setRamaActiva} 
        vistaActual={state.vistaActual}
        setVistaActual={state.setVistaActual}         
        canChangeRama={puedeCambiarRama} 
      />

      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: { xs: 2, sm: 4 }, 
          width: { sm: `calc(100% - 280px)` }, 
          mt: { xs: 8, sm: 0 },
          transition: 'all 0.3s'
        }}
      >
        <Toolbar sx={{ display: { xs: 'block', sm: 'none' } }} />
        
        {(user.role === ROLES.EDUCADOR || user.role === 'ADMIN') && (
          <EducadorMainView 
            vistaActual={state.vistaActual}
            setVistaActual={state.setVistaActual} 
            setRamaActiva={state.setRamaActiva}
            ramaActiva={state.ramaActiva}
            scouts={state.scouts}
            eventos={state.eventos}
            proyectos={state.proyectos} 
            handlers={state.handlers}
            userFuncion={userFuncion} 
          />
        )}
        
        <DashboardModals state={state} handleSaveScout={state.handleSaveScout} />
      </Box>
    </Box>
  );
};

export default DashboardPage;