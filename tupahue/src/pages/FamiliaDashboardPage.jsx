import { useState, useMemo, useEffect } from 'react';
import { Box, CssBaseline, Toolbar, Typography, Paper, CircularProgress } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { Sidebar } from '../components/Sidebar/Sidebar'; 
import { useDashboard } from '../hooks/useDashboard';
import { MisHijosView } from '../views/familia/MisHijosView';
import { FinanzasView } from '../views/familia/FinanzasView';
import { DocumentacionView } from '../views/familia/DocumentacionView';
import { ProgresionFamiliaView } from '../views/familia/ProgresionFamiliaView';
import { ROLES } from '../constants/auth.jsx'; // 🎯 Importante para forzar el rol

export const FamiliaDashboardPage = () => {
  const { user } = useAuth();
  
  // 🎯 Sincronizamos con el estado del hook para evitar duplicidad
  // Forzamos ROLES.FAMILIA para que el hook filtre por padre_id sin importar el cargo del usuario
  const state = useDashboard(user, [], [], ROLES.FAMILIA);

  const [hijoSeleccionadoId, setHijoSeleccionadoId] = useState(null);

  // 🎯 Reparación de hijoActivo: Si no hay selección, el primero de la lista es Máximo
  const hijoActivo = useMemo(() => {   
    if (!state.scouts || state.scouts.length === 0) return null;
    const encontrado = state.scouts.find(h => h.id === hijoSeleccionadoId);
    return encontrado || state.scouts[0];   
  }, [hijoSeleccionadoId, state.scouts]);

  // Si el hook está en 'DASHBOARD' (default), en familia lo tratamos como 'MIS_HIJOS'
  const vistaReal = state.vistaActual === 'DASHBOARD' ? 'MIS_HIJOS' : state.vistaActual;

  if (!user) return null;

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f8f9fa', minHeight: '100vh' }}>
      <CssBaseline />
      
      <Sidebar 
        vistaActual={vistaReal} 
        setVistaActual={state.setVistaActual} 
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
            <CircularProgress sx={{ color: '#5A189A' }} />
          </Box>
        ) : (
          <Box sx={{ animation: 'fadeIn 0.3s' }}>
            {/* 🎯 Switch de Vistas Reparado */}
            {vistaReal === 'MIS_HIJOS' && (
              <MisHijosView
                hijosVinculados={state.scouts}
                onVincular={(dni) => state.handlers.handleVincularHijo(dni, user.id)}
                onSelectHijo={(hijo) => { 
                  setHijoSeleccionadoId(hijo.id); 
                  state.setVistaActual('FINANZAS'); 
                }}
              />
            )}

            {vistaReal === 'FINANZAS' && (
              hijoActivo ? <FinanzasView hijo={hijoActivo} /> : <NoHijoPlaceholder />
            )}

            {vistaReal === 'DOCUMENTACION' && (
              hijoActivo ? (
                <DocumentacionView 
                  hijo={hijoActivo} 
                  onUpdateScout={state.handleSaveScout} 
                />
              ) : <NoHijoPlaceholder />
            )}

            {vistaReal === 'PROGRESION' && (
              hijoActivo ? (
                <ProgresionFamiliaView hijo={hijoActivo} />
              ) : <NoHijoPlaceholder />
            )}
          </Box>
        )}
      </Box>
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </Box>
  );
};

// Componente auxiliar para cuando no hay datos cargados
const NoHijoPlaceholder = () => (
  <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 4 }}>
    <Typography color="textSecondary">No se encontró información del beneficiario.</Typography>
  </Paper>
);

export default FamiliaDashboardPage;