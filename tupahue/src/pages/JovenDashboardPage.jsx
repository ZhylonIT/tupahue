import { useState, useMemo } from 'react';
import { 
  Box, CssBaseline, Toolbar, Alert, Container, Typography, 
  Paper, FormControl, Select, MenuItem 
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useDashboard } from '../hooks/useDashboard';
import { SidebarJoven } from '../components/Sidebar/SidebarJoven';
import { FUNCIONES } from '../constants/auth';

// Vistas del Joven
import { MiProgresionView } from '../views/joven/MiProgresionView';
import { MiRamaView } from '../views/joven/MiRamaView';
import { MisFinanzasJovenView } from '../views/joven/MisFinanzasJovenView';
import { MisProyectosView } from '../views/joven/MisProyectosView';

// Reutilizamos la vista de documentación de familia
import { DocumentacionView } from '../views/familia/DocumentacionView'; 

const DRAWER_WIDTH = 280;

export const JovenDashboardPage = () => {
  const { user, userFuncion, logout } = useAuth();
  
  const [vistaActual, setVistaActual] = useState('MI_RAMA');

  // 🛠️ MODO DESARROLLADOR: Te permite seguir testeando aunque no estés logueado como joven
  const isDevMode = true; 
  const [devSelectedDni, setDevSelectedDni] = useState(''); 

  const state = useDashboard(user, [], [], userFuncion);

  // 🎯 VINCULACIÓN REAL: Buscamos al beneficiario que tenga nuestro user_id
  const yo = useMemo(() => {
    if (!state.scouts || state.scouts.length === 0) return null;
    
    // 1. Si estamos en DEV y usamos el switch naranja:
    if (isDevMode && devSelectedDni) {
      return state.scouts.find(s => String(s.dni) === String(devSelectedDni));
    }

    // 2. LÓGICA DE PRODUCCIÓN: Buscamos el registro en la tabla scouts donde user_id coincida
    const encontrado = state.scouts.find(s => s.user_id === user?.id);
    
    // 3. Fallback de cortesía para DEV (si no encuentra por ID, toma el último)
    if (isDevMode && !encontrado && !devSelectedDni) {
      return state.scouts[state.scouts.length - 1]; 
    }
    
    return encontrado;
  }, [state.scouts, user, isDevMode, devSelectedDni]);

  // Determinamos si es Rover basándonos en los datos reales de la base de datos
  const esRover = yo?.rama?.toUpperCase() === 'ROVERS';

  if (!user && !isDevMode) return null;

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f4f7f6', minHeight: '100vh' }}>
      <CssBaseline />
      
      <SidebarJoven 
        vistaActual={vistaActual} 
        setVistaActual={setVistaActual} 
        user={user || { nombre: 'Invitado', apellido: 'Prueba' }} 
        joven={yo} 
        esRover={esRover} 
        onLogout={logout} 
        proyectos={state.proyectos} 
      />

      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: { xs: 2, sm: 4 }, 
          ml: { sm: `${DRAWER_WIDTH}px` },
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` }, 
          mt: { xs: 8, sm: 0 },
          minHeight: '100vh'
        }}
      >
        <Toolbar sx={{ display: { xs: 'block', sm: 'none' } }} />

        {/* 🛠️ BARRA DE DESARROLLADOR: Aparecerá mientras isDevMode sea true */}
        {isDevMode && state.scouts && state.scouts.length > 0 && (
          <Paper 
            elevation={3} 
            sx={{ 
              p: 2, mb: 4, maxWidth: '1200px', mx: 'auto', 
              bgcolor: '#ff9800', color: 'white', borderRadius: 4, 
              display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' 
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 900, fontSize: '0.9rem' }}>
              🛠️ SIMULADOR DE PERFILES
            </Typography>
            <FormControl size="small" sx={{ minWidth: 250, bgcolor: 'white', borderRadius: 2 }}>
              <Select
                value={yo?.dni || ''}
                onChange={(e) => setDevSelectedDni(e.target.value)}
                displayEmpty
                sx={{ fontWeight: 700 }}
              >
                {state.scouts.map(s => (
                  <MenuItem key={s.id} value={s.dni} sx={{ fontWeight: 600 }}>
                    {s.nombre} {s.apellido} ({s.rama?.toUpperCase()})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Typography variant="caption" sx={{ fontWeight: 700, opacity: 0.9 }}>
              ID logueado: {user?.id || 'Ninguno (Modo Local)'}
            </Typography>
          </Paper>
        )}
        
        {!yo && !isDevMode ? (
          <Container maxWidth="md">
            <Alert severity="warning" sx={{ borderRadius: 4, fontWeight: 700, mt: 4 }}>
              Tu usuario no está vinculado a una ficha de beneficiario activa. 
              Por favor, contactá a un educador para que asocie tu cuenta.
            </Alert>
          </Container>
        ) : (
          <Box sx={{ maxWidth: '1200px', mx: 'auto' }}>
            
            {vistaActual === 'MI_RAMA' && (
              <MiRamaView 
                joven={yo} 
                eventos={state.eventos} 
                proyectos={state.proyectos} 
              />
            )}

            {vistaActual === 'PROGRESION' && (
              <MiProgresionView joven={yo} />
            )}            

            {vistaActual === 'PROYECTOS' && (
              <MisProyectosView 
                joven={yo}
                proyectos={state.proyectos}
                onSave={state.handleSaveProyecto}
                onDelete={state.handlers.handleDeleteProyecto}
                onMarkAsSeen={state.handlers.handleMarcarProyectoVisto}
              />
            )}
            
            {esRover && (
              <>
                {vistaActual === 'FINANZAS' && (
                  <MisFinanzasJovenView joven={yo} />
                )}
                {vistaActual === 'DOCUMENTACION' && (
                  <DocumentacionView hijo={yo} />
                )}
              </>
            )}

            {!vistaActual && (
              <Typography variant="body1" color="text.secondary">
                Seleccioná una opción del menú lateral para ver tu información.
              </Typography>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default JovenDashboardPage;