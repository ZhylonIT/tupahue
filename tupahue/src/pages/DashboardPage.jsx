import { Box, CssBaseline, Toolbar } from '@mui/material';
import { ROLES, FUNCIONES } from '../constants/auth.jsx';
// Importamos la CARPETA del Sidebar (React buscará el index.js o Sidebar.jsx allí)
import { Sidebar } from '../components/Sidebar/Sidebar'; 
import { DashboardModals } from '../components/DashboardModals'; 
import { EducadorMainView } from '../views/educador';
import { useDashboard } from '../hooks/useDashboard';
// NUEVO: Importamos useLocalStorage para que el rol sobreviva al F5
import { useLocalStorage } from '../hooks/useLocalStorage';

const USER_TEST = { nombre: "Arturo", rol: ROLES.EDUCADOR, funcion: FUNCIONES.JEFE_GRUPO };

export const DashboardPage = () => {  
  // 1. Estado para el switch de roles (Persistente con LocalStorage)
  const [funcionSimulada, setFuncionSimulada] = useLocalStorage('tupahue_funcion_simulada', USER_TEST.funcion);

  // 2. IMPORTANTE: Pasamos funcionSimulada al hook para que los permisos sean reactivos
  const state = useDashboard(USER_TEST, [], [], funcionSimulada);

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f8f9fa', minHeight: '100vh' }}>
      <CssBaseline />
      
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
          // El ancho se ajusta automáticamente
          width: { sm: `calc(100% - 280px)` }, 
          mt: { xs: 8, sm: 0 },
          transition: 'width 0.3s'
        }}
      >
        <Toolbar sx={{ display: { xs: 'block', sm: 'none' } }} />
        
        {/* Renderizado de la vista principal */}
        {USER_TEST.rol === ROLES.EDUCADOR && (
          <EducadorMainView 
            vistaActual={state.vistaActual}
            setVistaActual={state.setVistaActual} /* <--- AGREGADO AQUÍ */
            setRamaActiva={state.setRamaActiva} /* <--- AGREGADO AHORA */
            ramaActiva={state.ramaActiva}
            scouts={state.scouts}
            eventos={state.eventos}
            handlers={state.handlers}
            userFuncion={funcionSimulada} 
          />
        )}
        
        {/* Modales de Carga/Edición */}
        <DashboardModals state={state} handleSaveScout={state.handleSaveScout} />
      </Box>
    </Box>
  );
};

export default DashboardPage;