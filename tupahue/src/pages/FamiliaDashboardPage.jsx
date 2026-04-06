import { useState, useMemo } from 'react';
import { Box, CssBaseline, Toolbar, Typography, Paper, CircularProgress } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { Sidebar } from '../components/Sidebar/Sidebar'; // 🔄 Importación Unificada
import { useDashboard } from '../hooks/useDashboard';
import { MisHijosView } from '../views/familia/MisHijosView';
import { FinanzasView } from '../views/familia/FinanzasView';
import { DocumentacionView } from '../views/familia/DocumentacionView';
import { ProgresionFamiliaView } from '../views/familia/ProgresionFamiliaView';

export const FamiliaDashboardPage = () => {
  const { user, userFuncion } = useAuth();
  const [vistaActual, setVistaActual] = useState('MIS_HIJOS');
  const [hijoSeleccionadoId, setHijoSeleccionadoId] = useState(null);

  const state = useDashboard(user, [], [], userFuncion);

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
      
      {/* 🔄 Sidebar Universal configurado para Familia */}
      <Sidebar 
        vistaActual={vistaActual} 
        setVistaActual={setVistaActual} 
        ramaSeleccionada={null}
        onRamaChange={() => {}}
        canChangeRama={false}
      />

      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: { xs: 2, sm: 4 }, 
          width: { sm: `calc(100% - 280px)` }, 
          mt: { xs: 8, sm: 0 },
          position: 'relative' 
        }}
      >
        <Toolbar sx={{ display: { xs: 'block', sm: 'none' } }} />

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