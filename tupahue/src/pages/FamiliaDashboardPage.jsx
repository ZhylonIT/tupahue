import { useState, useMemo } from 'react';
import { Box, CssBaseline, Toolbar, Typography, Paper, CircularProgress } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { SidebarFamilia } from '../components/Sidebar/SidebarFamilia';
import { useDashboard } from '../hooks/useDashboard';
import { MisHijosView } from '../views/familia/MisHijosView';
import { FinanzasView } from '../views/familia/FinanzasView';
import { DocumentacionView } from '../views/familia/DocumentacionView';
import { ProgresionFamiliaView } from '../views/familia/ProgresionFamiliaView';

export const FamiliaDashboardPage = () => {
  const { user, logout, userFuncion } = useAuth();
  const [vistaActual, setVistaActual] = useState('MIS_HIJOS');
  const [hijoSeleccionadoId, setHijoSeleccionadoId] = useState(null);

  // El hook trae los datos. 
  // 💡 Si useDashboard tiene un "loading" interno, provocará el flicker del CircularProgress
  const state = useDashboard(user, [], [], userFuncion);

  // Estabilizamos el hijo activo para evitar re-renders innecesarios
  const hijoActivo = useMemo(() => {   
    if (!state.scouts || state.scouts.length === 0) return null;
    
    const encontrado = state.scouts.find(h => h.id === hijoSeleccionadoId);
    if (encontrado) return encontrado;   
    
    return state.scouts[0];   
  }, [hijoSeleccionadoId, state.scouts]);

  if (!user) return null;

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f8f9fa', minHeight: '100vh' }}>
      <CssBaseline />
      <SidebarFamilia 
        vistaActual={vistaActual} 
        setVistaActual={setVistaActual} 
        onLogout={logout} 
        user={user} 
      />

      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: { xs: 2, sm: 4 }, 
          width: { sm: `calc(100% - 280px)` }, 
          mt: { xs: 8, sm: 0 },
          // 🎯 Evitamos que el scroll salte al inicio en cada refresh
          position: 'relative' 
        }}
      >
        <Toolbar sx={{ display: { xs: 'block', sm: 'none' } }} />

        {/* 💡 OPTIMIZACIÓN: Si state.loading es true pero YA TENEMOS scouts, 
           no mostramos el CircularProgress global para evitar el "pantallazo blanco".
           Solo lo mostramos en la carga inicial.
        */}
        {state.loading && state.scouts.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {vistaActual === 'MIS_HIJOS' && (
              <MisHijosView
                hijosVinculados={state.scouts}
                onVincular={(dni) => state.handlers.handleVincularHijo(dni, user.id)}
                onSelectHijo={(hijo) => { 
                  setHijoSeleccionadoId(hijo.id); 
                  setVistaActual('FINANZAS'); 
                }}
              />
            )}

            {vistaActual === 'FINANZAS' && <FinanzasView hijo={hijoActivo} />}

            {vistaActual === 'DOCUMENTACION' && (
              <DocumentacionView 
                hijo={hijoActivo} 
                onUpdateScout={state.handleSaveScout} 
              />
            )}

            {vistaActual === 'PROGRESION' && (
              <Box sx={{ animation: 'fadeIn 0.3s' }}>
                {hijoActivo ? (
                  <ProgresionFamiliaView hijo={hijoActivo} />
                ) : (
                  <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Typography color="textSecondary">Seleccioná un hijo para ver su progresión.</Typography>
                  </Paper>
                )}
              </Box>
            )}
          </>
        )}
      </Box>
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </Box>
  );
};