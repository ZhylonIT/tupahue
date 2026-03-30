import { useState } from 'react';
import { Box, CssBaseline, Toolbar, Typography, Paper } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { SidebarFamilia } from '../components/Sidebar/SidebarFamilia';

export const FamiliaDashboardPage = () => {
  const { user, logout } = useAuth();
  
  // Estado para controlar qué sección del menú está viendo el padre
  const [vistaActual, setVistaActual] = useState('MIS_HIJOS');

  // ELIMINAMOS el `if (!user) <Navigate...>` de acá. 
  // La protección real la maneja el <ProtectedRoute> en Tupahue.jsx
  
  // Pequeña protección visual mientras carga el contexto
  if (!user) return null; 

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f8f9fa', minHeight: '100vh' }}>
      <CssBaseline />

      {/* Menú Lateral Aislado */}
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
          transition: 'width 0.3s'
        }}
      >
        <Toolbar sx={{ display: { xs: 'block', sm: 'none' } }} />

        {/* --- ENRUTADOR INTERNO DE VISTAS --- */}
        {vistaActual === 'MIS_HIJOS' && (
          <Box sx={{ animation: 'fadeIn 0.3s' }}>
            <Typography variant="h4" sx={{ fontWeight: 900, mb: 2 }}>Mis Hijos</Typography>
            <Paper sx={{ p: 4, borderRadius: 3 }}>
               <Typography color="textSecondary">Acá vamos a construir el buscador de DNI y la lista de los chicos vinculados.</Typography>
            </Paper>
          </Box>
        )}

        {vistaActual === 'FINANZAS' && (
          <Box sx={{ animation: 'fadeIn 0.3s' }}>
            <Typography variant="h4" sx={{ fontWeight: 900, mb: 2 }}>Cuotas y Recibos</Typography>
            <Paper sx={{ p: 4, borderRadius: 3 }}>
               <Typography color="textSecondary">Acá vamos a construir la tabla de pagos y descargas de PDF.</Typography>
            </Paper>
          </Box>
        )}

        {vistaActual === 'DOCUMENTACION' && (
          <Box sx={{ animation: 'fadeIn 0.3s' }}>
            <Typography variant="h4" sx={{ fontWeight: 900, mb: 2 }}>Documentación</Typography>
            <Paper sx={{ p: 4, borderRadius: 3 }}>
               <Typography color="textSecondary">Acá vamos a gestionar Fichas Médicas y Autorizaciones.</Typography>
            </Paper>
          </Box>
        )}

        {vistaActual === 'PROGRESION' && (
          <Box sx={{ animation: 'fadeIn 0.3s' }}>
            <Typography variant="h4" sx={{ fontWeight: 900, mb: 2 }}>Progresión Scout</Typography>
            <Paper sx={{ p: 4, borderRadius: 3 }}>
               <Typography color="textSecondary">Acá vamos a mostrar cómo avanza el chico en su etapa.</Typography>
            </Paper>
          </Box>
        )}
        
      </Box>
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </Box>
  );
};