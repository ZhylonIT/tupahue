import { useMemo } from 'react'; // 👈 AGREGADO: Importación necesaria de React
import { Box, CssBaseline, Toolbar } from '@mui/material';
import { ROLES, FUNCIONES } from '../constants/auth.jsx';
import { Sidebar } from '../components/Sidebar/Sidebar'; 
import { DashboardModals } from '../components/DashboardModals'; 
import { EducadorMainView } from '../views/educador';
import { useDashboard } from '../hooks/useDashboard';
import { useAuth } from '../context/AuthContext';

export const DashboardPage = () => {  
  // 1. Consumimos el contexto real
  const { user, userFuncion, logout } = useAuth();

  // 2. REGLA DE NEGOCIO ESTRICTA (Verificada):
  // Solo estas dos funciones específicas pueden cambiar el ámbito de rama.
  // Los asistentes técnicos (Adm, Adultos, Com) deben quedar bloqueados en 'TODAS'.
  const puedeCambiarRama = useMemo(() => {
    return userFuncion === FUNCIONES.JEFE_GRUPO || userFuncion === FUNCIONES.ASISTENTE_PROG;
  }, [userFuncion]);

  // 3. Hook con lógica reactiva usando los datos del contexto
  const state = useDashboard(user, [], [], userFuncion);

  // Protección de renderizado
  if (!user) return null;

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f8f9fa', minHeight: '100vh' }}>
      <CssBaseline />
      
      {/* SIDEBAR: Enviamos canChangeRama estrictamente calculado */}
      <Sidebar 
        ramaSeleccionada={state.ramaActiva} 
        onRamaChange={state.setRamaActiva} 
        vistaActual={state.vistaActual}
        setVistaActual={state.setVistaActual}        
        canChangeRama={puedeCambiarRama} // 👈 PROP CLAVE
        userFuncion={userFuncion}
        onLogout={logout}
      />

      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: { xs: 2, sm: 4 }, 
          width: { sm: `calc(100% - 280px)` }, 
          mt: { xs: 8, sm: 0 },
          transition: 'width 0.3s'
        }}
      >
        <Toolbar sx={{ display: { xs: 'block', sm: 'none' } }} />
        
        {user.rol === ROLES.EDUCADOR && (
          <EducadorMainView 
            vistaActual={state.vistaActual}
            setVistaActual={state.setVistaActual}
            setRamaActiva={state.setRamaActiva}
            ramaActiva={state.ramaActiva}
            scouts={state.scouts}
            eventos={state.eventos}
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