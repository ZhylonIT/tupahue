import { useState, useMemo } from 'react';
import { Box, CssBaseline, Toolbar, Alert, Container, Typography, Paper, FormControl, Select, MenuItem, CircularProgress } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useDashboard } from '../hooks/useDashboard';
import { Sidebar } from '../components/Sidebar/Sidebar';
import { FUNCIONES } from '../constants/auth';

import { MiProgresionView } from '../views/joven/MiProgresionView';
import { MiRamaView } from '../views/joven/MiRamaView';
import { MisFinanzasJovenView } from '../views/joven/MisFinanzasJovenView';
import { MisProyectosView } from '../views/joven/MisProyectosView';
import { DocumentacionView } from '../views/familia/DocumentacionView'; 
import { PerfilView } from '../views/PerfilView'; // 🎯 Importamos el Perfil Global

const DRAWER_WIDTH = 280;

export const JovenDashboardPage = () => {
  const { user, userFuncion } = useAuth();
  const [vistaActual, setVistaActual] = useState('MI_RAMA');
  const [devSelectedDni, setDevSelectedDni] = useState(''); 

  const isDevMode = useMemo(() => {
    return user?.role === 'ADMIN' || userFuncion === FUNCIONES.JEFE_GRUPO;
  }, [user, userFuncion]);

  const state = useDashboard(user, [], [], userFuncion);

  const yo = useMemo(() => {
    if (!state.scouts || state.scouts.length === 0) return null;
    if (isDevMode && devSelectedDni) {
      return state.scouts.find(s => String(s.dni) === String(devSelectedDni));
    }
    const encontrado = state.scouts.find(s => s.user_id === user?.id);
    if (isDevMode && !encontrado) return state.scouts[0];
    return encontrado;
  }, [state.scouts, user?.id, isDevMode, devSelectedDni]);

  if (!user && !isDevMode) return null;

  return (
    <Box sx={{ display: 'flex', bgcolor: '#1a1a1a', minHeight: '100vh' }}>
      <CssBaseline />
      <Sidebar 
        vistaActual={vistaActual} setVistaActual={setVistaActual} 
        ramaSeleccionada={yo?.rama} onRamaChange={() => {}} canChangeRama={false}
      />

      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, sm: 4 }, width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` }, mt: { xs: 8, sm: 0 }, minHeight: '100vh', bgcolor: '#f4f7f6', borderTopLeftRadius: { sm: 30 } }}>
        <Toolbar sx={{ display: { xs: 'block', sm: 'none' } }} />

        {isDevMode && state.scouts && state.scouts.length > 0 && (
          <Paper elevation={3} sx={{ p: 2, mb: 4, bgcolor: '#ff9800', color: 'white', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 900, fontSize: '0.9rem' }}>🛠️ SIMULADOR PARA JEFATURA</Typography>
            <FormControl size="small" sx={{ minWidth: 250, bgcolor: 'white', borderRadius: 2 }}>
              <Select value={yo?.dni || ''} onChange={(e) => setDevSelectedDni(e.target.value)} displayEmpty>
                {state.scouts.map(s => (
                  <MenuItem key={s.id} value={s.dni}>{s.nombre} {s.apellido} ({s.rama?.toUpperCase()})</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Paper>
        )}
        
        {state.loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>
        ) : !yo && !isDevMode && vistaActual !== 'PERFIL' ? ( // 🎯 Permitimos perfil aunque no haya ficha
          <Container maxWidth="md">
            <Alert severity="warning" sx={{ borderRadius: 4, fontWeight: 700, mt: 4 }}>
              Tu usuario no está vinculado a una ficha de beneficiario activa.
            </Alert>
          </Container>
        ) : (
          <Box sx={{ maxWidth: '1200px', mx: 'auto' }}>
            {/* 🎯 GESTIÓN DE VISTAS INCLUYENDO PERFIL */}
            {vistaActual === 'PERFIL' && <PerfilView />}
            
            {vistaActual === 'MI_RAMA' && <MiRamaView joven={yo} eventos={state.eventos} proyectos={state.proyectos} />}
            {vistaActual === 'PROGRESION' && <MiProgresionView joven={yo} />}            
            {vistaActual === 'PROYECTOS' && (
              <MisProyectosView 
                joven={yo} proyectos={state.proyectos} 
                onSave={state.handleSaveProyecto} onDelete={state.handlers.handleDeleteProyecto} 
                onMarkAsSeen={state.handlers.handleMarcarProyectoVisto} 
              />
            )}
            {yo?.rama?.toUpperCase() === 'ROVERS' && (
              <>
                {vistaActual === 'FINANZAS' && <MisFinanzasJovenView joven={yo} />}
                {vistaActual === 'DOCUMENTACION' && <DocumentacionView hijo={yo} />}
              </>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default JovenDashboardPage;