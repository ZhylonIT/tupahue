import { Box, CssBaseline, Toolbar } from '@mui/material';
import { ROLES, FUNCIONES } from '../constants/auth.jsx';
import { Sidebar } from '../components/Sidebar/Sidebar'; 
import { DashboardModals } from '../components/DashboardModals'; 
import { EducadorMainView } from '../views/educador';
import { useDashboard } from '../hooks/useDashboard';
import { useLocalStorage } from '../hooks/useLocalStorage';

// Mantenemos tu usuario de prueba para desarrollo
const USER_TEST = { nombre: "Arturo", rol: ROLES.EDUCADOR, funcion: FUNCIONES.JEFE_GRUPO };

export const DashboardPage = () => {  
  // 1. Estado para el switch de roles (Persistente con LocalStorage)
  const [funcionSimulada, setFuncionSimulada] = useLocalStorage('tupahue_funcion_simulada', USER_TEST.funcion);

  // 2. Hook con lógica reactiva según la función simulada
  const state = useDashboard(USER_TEST, [], [], funcionSimulada);

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f8f9fa', minHeight: '100vh' }}>
      <CssBaseline />
      
      {/* SIDEBAR: Maneja la navegación y el cambio de funciones */}
      <Sidebar 
        ramaSeleccionada={state.ramaActiva} 
        onRamaChange={state.setRamaActiva} 
        vistaActual={state.vistaActual}
        setVistaActual={state.setVistaActual}        
        canChangeRama={state.esAdminORamaUniversal}
        userFuncion={funcionSimulada}
        onFuncionChange={setFuncionSimulada}
      />

      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: { xs: 2, sm: 4 }, 
          // Ajuste dinámico de ancho según sidebar
          width: { sm: `calc(100% - 280px)` }, 
          mt: { xs: 8, sm: 0 },
          transition: 'width 0.3s'
        }}
      >
        {/* Toolbar para compensar el AppBar en mobile si existiera */}
        <Toolbar sx={{ display: { xs: 'block', sm: 'none' } }} />
        
        {/* Renderizado de la vista principal del Educador */}
        {USER_TEST.rol === ROLES.EDUCADOR && (
          <EducadorMainView 
            vistaActual={state.vistaActual}
            setVistaActual={state.setVistaActual}
            setRamaActiva={state.setRamaActiva}
            ramaActiva={state.ramaActiva}
            scouts={state.scouts}
            eventos={state.eventos}
            handlers={state.handlers}
            userFuncion={funcionSimulada} 
          />
        )}
        
        {/* Modales globales de la plataforma */}
        <DashboardModals state={state} handleSaveScout={state.handleSaveScout} />
      </Box>
    </Box>
  );
};

export default DashboardPage;