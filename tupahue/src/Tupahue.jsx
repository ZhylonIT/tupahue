import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Navbar } from './layouts/NavBar';
import { HomePage } from './pages/HomePage';
import { HistoriaPage } from './pages/HistoriaPage';
import { RamasPage } from './pages/RamasPage';
import { RamaLobatos } from './pages/RamaLobatos'; 
import { RamaScouts } from './pages/RamaScouts'; 
import { RamaCaminantes } from './pages/RamaCaminantes'; 
import { RamaRovers } from './pages/RamaRovers'; 
import { ContactoPage } from './pages/ContactoPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { FamiliaDashboardPage } from './pages/FamiliaDashboardPage'; 
import { JovenDashboardPage } from './pages/JovenDashboardPage'; 
import { QueHacemosPage } from './pages/QueHacemosPage'; 
import { NoticiasPage } from './pages/NoticiasPage'; 
import { NoticiaDetallePage } from './pages/NoticiaDetallePage'; 
import { CssBaseline, Box, createTheme, ThemeProvider, CircularProgress } from '@mui/material';
import { Footer } from './components/footer';
import { ScrollToTop } from './components/ScrollToTop';

import { AuthProvider, useAuth } from './context/AuthContext';

const theme = createTheme({
  typography: { fontFamily: '"Ubuntu", sans-serif' },
  palette: { primary: { main: '#5A189A' } },
});

// --- 🎯 REDIRECCIONADOR INTELIGENTE POR ROL ---
const DashboardRedirect = () => {
  const { user, authLoading } = useAuth();

  if (authLoading) return null; // El ProtectedRoute ya maneja el loading
  if (!user) return <Navigate to="/login" />;

  // Según el rol en la DB, mandamos a la sub-ruta correcta
  if (user.role === 'ADMIN' || user.role === 'EDUCADOR') {
    return <Navigate to="/dashboard/educador" />;
  }
  if (user.role === 'JOVEN') {
    return <Navigate to="/dashboard/joven" />;
  }
  if (user.role === 'FAMILIA') {
    return <Navigate to="/dashboard/familia" />;
  }

  return <Navigate to="/" />;
};

const ProtectedRoute = ({ children }) => {
  const { user, authLoading } = useAuth();
  
  if (authLoading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: '#f4f7f6' }}>
      <CircularProgress color="primary" />
    </Box>
  );

  if (!user) return <Navigate to="/login" />;
  return children;
};

const LayoutManager = () => {
  const location = useLocation();
  const isDashboard = location.pathname.includes('/dashboard');

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%' }}>
      {!isDashboard && <Navbar />}
      
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          pt: isDashboard ? 0 : { xs: '90px', md: '70px' } 
        }}
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/historia" element={<HistoriaPage />} />          
          <Route path="/que-hacemos" element={<QueHacemosPage />} />          
          <Route path="/ramas" element={<RamasPage />} />
          <Route path="/ramas/lobatos" element={<RamaLobatos />} />
          <Route path="/ramas/scouts" element={<RamaScouts />} />
          <Route path="/ramas/caminantes" element={<RamaCaminantes />} />
          <Route path="/ramas/rovers" element={<RamaRovers />} />          
          <Route path="/noticias" element={<NoticiasPage />} />
          <Route path="/noticias/:id" element={<NoticiaDetallePage />} />
          <Route path="/contacto" element={<ContactoPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* 🎯 Ruta base del dashboard: ahora usa el Redireccionador */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardRedirect /></ProtectedRoute>} />
          
          <Route path="/dashboard/educador" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/dashboard/familia" element={<ProtectedRoute><FamiliaDashboardPage /></ProtectedRoute>} /> 
          <Route path="/dashboard/joven" element={<ProtectedRoute><JovenDashboardPage /></ProtectedRoute>} />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Box>

      {!isDashboard && <Footer />}
    </Box>
  );
};

export const Tupahue = () => (
  <ThemeProvider theme={theme}>
    <AuthProvider>
      <Router>
        <CssBaseline />
        <ScrollToTop />
        <LayoutManager />
      </Router>
    </AuthProvider>
  </ThemeProvider>
);

export default Tupahue;