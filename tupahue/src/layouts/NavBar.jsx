import { useEffect, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  IconButton,
  Divider
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import LoginIcon from '@mui/icons-material/Login'; // Icono para el login
import { NavLink } from 'react-router-dom';
import { CintasPanuelo } from '../components/CintasPanuelos';
import logoTupahue from '../assets/images/logo.png';

const VIOLETA_SCOUT = '#5A189A';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Ítems de navegación actualizados
  const navItems = [
    { label: 'Inicio', path: '/' },
    { label: 'Historia', path: '/historia' },
    { label: '¿Qué hacemos?', path: '/que-hacemos' },
    { label: 'Ramas', path: '/ramas' },
    { label: 'Contacto', path: '/contacto' },
  ];

  const socialLinks = [
    { icon: <InstagramIcon />, url: 'https://www.instagram.com/grupotupahue/?hl=es', color: '#E1306C' },
    { icon: <FacebookIcon />, url: 'https://www.facebook.com/grupotupahue/?locale=es_LA', color: '#4267B2' },
    { icon: <WhatsAppIcon />, url: 'https://chat.whatsapp.com/CLwLHvggsVZ9fwqSjnnCSv', color: '#25D366' },
  ];

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          bgcolor: isScrolled ? 'rgba(255, 255, 255, 0.2)' : 'white', 
          backdropFilter: isScrolled ? 'blur(15px)' : 'none',
          WebkitBackdropFilter: isScrolled ? 'blur(15px)' : 'none',
          color: '#333',
          transition: 'all 0.5s ease',
          boxShadow: isScrolled ? 'none' : '0 2px 10px rgba(0,0,0,0.1)',
        }}
        elevation={0}
      >
        <Container maxWidth={false} sx={{ px: { xs: 2, md: 4 } }}>
          <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
            
            {/* LOGO + TEXTO */}
            <Box
              component={NavLink}
              to="/"
              sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', gap: 1.5 }}
            >
              <Box
                component="img"
                src={logoTupahue}
                alt="Logo Tupahue"
                sx={{
                  height: { xs: 50, md: 70 },
                  width: 'auto',
                  transition: '0.3s'
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  fontFamily: 'Ubuntu',
                  fontWeight: 700,
                  color: VIOLETA_SCOUT,
                  fontSize: { xs: '1.3rem', md: '1.7rem' },
                }}
              >
                TUPAHUE
              </Typography>
            </Box>

            {/* MENÚ DESKTOP */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
              {navItems.map((item) => (
                <Button
                  key={item.label}
                  component={NavLink}
                  to={item.path}
                  sx={{
                    mx: 1,
                    color: '#333',
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 600,
                    transition: '0.2s',
                    '&:hover': { color: VIOLETA_SCOUT },
                    '&.active': {
                      color: VIOLETA_SCOUT,
                      borderBottom: `3px solid ${VIOLETA_SCOUT}`,
                      mb: '-3px',
                    }
                  }}
                >
                  {item.label}
                </Button>
              ))}

              <Divider orientation="vertical" flexItem sx={{ mx: 2, my: 1.5, bgcolor: '#ddd' }} />

              {/* BOTÓN LOGIN */}
              <Button
                component={NavLink}
                to="/login"
                variant="outlined"
                startIcon={<LoginIcon />}
                sx={{
                  mr: 2,
                  borderRadius: 2,
                  borderColor: VIOLETA_SCOUT,
                  color: VIOLETA_SCOUT,
                  fontWeight: 'bold',
                  '&:hover': {
                    bgcolor: VIOLETA_SCOUT,
                    color: 'white',
                    borderColor: VIOLETA_SCOUT
                  },
                  '&.active': {
                    bgcolor: VIOLETA_SCOUT,
                    color: 'white'
                  }
                }}
              >
                Ingresar
              </Button>

              <Box sx={{ display: 'flex', gap: 0.5 }}>
                {socialLinks.map((social, index) => (
                  <IconButton
                    key={index}
                    component="a"
                    href={social.url}
                    target="_blank"
                    sx={{
                      color: '#666',
                      '&:hover': { color: social.color, transform: 'scale(1.1)' },
                      transition: '0.3s'
                    }}
                  >
                    {social.icon}
                  </IconButton>
                ))}
              </Box>
            </Box>

            <IconButton
              onClick={handleDrawerToggle}
              sx={{ display: { md: 'none' }, color: VIOLETA_SCOUT }}
            >
              <MenuIcon fontSize="large" />
            </IconButton>
          </Toolbar>
        </Container>

        <Box sx={{ width: '100%' }}>
          <CintasPanuelo />
        </Box>
      </AppBar>

      {/* Aquí iría tu Drawer para móvil, recordá agregar el link a /login y /que-hacemos allí también si lo usás */}
    </>
  );
};