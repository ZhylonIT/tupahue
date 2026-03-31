import { useState, useMemo } from 'react';
import { Box, CssBaseline, Toolbar, Typography, Paper } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { SidebarFamilia } from '../components/Sidebar/SidebarFamilia';
import { useDashboard } from '../hooks/useDashboard';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { MisHijosView } from '../views/familia/MisHijosView';
import { FinanzasView } from '../views/familia/FinanzasView';
import { DocumentacionView } from '../views/familia/DocumentacionView';
import { ProgresionFamiliaView } from '../views/familia/ProgresionFamiliaView'; // Importación agregada

export const FamiliaDashboardPage = () => {
  const { user, logout, userFuncion } = useAuth();
  const [vistaActual, setVistaActual] = useState('MIS_HIJOS');
  const [hijoSeleccionadoId, setHijoSeleccionadoId] = useState(null);

  const state = useDashboard(user, [], [], userFuncion);
  // Mantenemos tu key exacta 'tupahue_vinculos_familia'
  const [dnisVinculados, setDnisVinculados] = useLocalStorage('tupahue_vinculos_familia', []);

  const hijosVinculadosData = useMemo(() => {
    const listaDnis = Array.isArray(dnisVinculados) ? dnisVinculados : [];
    return state.scouts.filter(s => listaDnis.includes(String(s.dni)));
  }, [state.scouts, dnisVinculados]);

  const hijoActivo = useMemo(() => {
    return hijosVinculadosData.find(h => h.id === hijoSeleccionadoId) || hijosVinculadosData[0];
  }, [hijosVinculadosData, hijoSeleccionadoId]);

  if (!user) return null;

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f8f9fa', minHeight: '100vh' }}>
      <CssBaseline />
      <SidebarFamilia vistaActual={vistaActual} setVistaActual={setVistaActual} onLogout={logout} user={user} />

      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, sm: 4 }, width: { sm: `calc(100% - 280px)` }, mt: { xs: 8, sm: 0 } }}>
        <Toolbar sx={{ display: { xs: 'block', sm: 'none' } }} />

        {vistaActual === 'MIS_HIJOS' && (
          <MisHijosView
            scoutsSistema={state.scouts}
            hijosVinculados={hijosVinculadosData}
            setDnisVinculados={setDnisVinculados}
            // Mantenemos tu lógica de ID y cambio de pestaña a FINANZAS
            onSelectHijo={(id) => { setHijoSeleccionadoId(id); setVistaActual('FINANZAS'); }}
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
      </Box>
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </Box>
  );
};