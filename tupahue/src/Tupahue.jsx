import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './layouts/NavBar';
import { HomePage } from './pages/HomePage';
import { HistoriaPage } from './pages/HistoriaPage';
import { RamasPage } from './pages/RamasPage';
import { RamaInfoPublicaPage } from './pages/RamaInfoPublicPage';
import { ContactoPage } from './pages/ContactoPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { CssBaseline, Box, createTheme, ThemeProvider } from '@mui/material';
import { Footer } from './components/footer';
import { ScrollToTop } from './components/ScrollToTop';

const theme = createTheme({
  typography: { fontFamily: '"Ubuntu", sans-serif' },
  palette: { primary: { main: '#5A189A' } },
});

const LayoutManager = () => {
  const location = useLocation();
  const isDashboard = location.pathname.includes('/dashboard');

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%' }}>
      {!isDashboard && <Navbar />}
      <Box component="main" sx={{ flexGrow: 1, pt: isDashboard ? 0 : { xs: '90px', md: '70px' } }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/historia" element={<HistoriaPage />} />
          <Route path="/ramas" element={<RamasPage />} />
          <Route path="/ramas/:rama" element={<RamaInfoPublicaPage />} />
          <Route path="/contacto" element={<ContactoPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard/educador" element={<DashboardPage userRole="educador" />} />
          <Route path="/dashboard/familia" element={<DashboardPage userRole="familia" />} />
          <Route path="/dashboard/joven" element={<DashboardPage userRole="joven" />} />
        </Routes>
      </Box>
      {!isDashboard && <Footer />}
    </Box>
  );
};

export const Tupahue = () => (
  <ThemeProvider theme={theme}>
    <Router>
      <CssBaseline />
      <ScrollToTop />
      <LayoutManager />
    </Router>
  </ThemeProvider>
);

export default Tupahue;