import { useEffect, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  IconButton,
  Divider,
  Menu,
  MenuItem,
  Fade,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Collapse,
  Stack
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import LoginIcon from '@mui/icons-material/Login';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { NavLink, useNavigate } from 'react-router-dom';
import { CintasPanuelo } from '../components/CintasPanuelos';
import logoTupahue from '../assets/images/logo.png';

const VIOLETA_SCOUT = '#5A189A';

export const Navbar = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openMobileRamas, setOpenMobileRamas] = useState(false);

  const openRamas = Boolean(anchorEl);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleOpenRamas = (event) => setAnchorEl(event.currentTarget);
  const handleCloseRamas = () => setAnchorEl(null);

  const handleBranchNavigate = (path) => {
    navigate(path);
    handleCloseRamas();
    setMobileOpen(false);
  };

  // 👇 1. Lista antes de Ramas
  const menuPrincipal = [
    { label: 'Inicio', path: '/' },
    { label: 'Noticias', path: '/noticias' },
    { label: '¿Qué hacemos?', path: '/que-hacemos' },
    { label: 'Historia', path: '/historia' },
  ];

  // 👇 2. Lista después de Ramas
  const menuSecundario = [
    { label: 'Contacto', path: '/contacto' },
  ];

  const branches = [
    { label: 'Ver todas', path: '/ramas' },
    { label: 'Lobatos', path: '/ramas/lobatos' },
    { label: 'Scouts', path: '/ramas/scouts' },
    { label: 'Caminantes', path: '/ramas/caminantes' },
    { label: 'Rovers', path: '/ramas/rovers' },
  ];

  // MENU MÓVIL (DRAWER)
  const drawer = (
    <Box sx={{ width: 280, pt: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, color: VIOLETA_SCOUT }}>MENÚ</Typography>
        <IconButton onClick={handleDrawerToggle}><CloseIcon /></IconButton>
      </Box>
      <Divider />

      <List>
        {/* Enlaces Principales */}
        {menuPrincipal.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton component={NavLink} to={item.path} onClick={handleDrawerToggle}>
              <ListItemText primary={item.label} sx={{ '& span': { fontWeight: 600 } }} />
            </ListItemButton>
          </ListItem>
        ))}

        {/* Acordeón de Ramas */}
        <ListItemButton onClick={() => setOpenMobileRamas(!openMobileRamas)}>
          <ListItemText primary="Ramas" sx={{ '& span': { fontWeight: 600 } }} />
          {openMobileRamas ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openMobileRamas} timeout="auto" unmountOnExit>
          <List component="div" disablePadding sx={{ bgcolor: 'rgba(0,0,0,0.02)' }}>
            {branches.map((branch) => (
              <ListItemButton key={branch.label} sx={{ pl: 4 }} onClick={() => handleBranchNavigate(branch.path)}>
                <ListItemText primary={branch.label} />
              </ListItemButton>
            ))}
          </List>
        </Collapse>

        {/* Enlaces Secundarios (Contacto) */}
        {menuSecundario.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton component={NavLink} to={item.path} onClick={handleDrawerToggle}>
              <ListItemText primary={item.label} sx={{ '& span': { fontWeight: 600 } }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ my: 2 }} />

      {/* Botón Ingresar */}
      <Box sx={{ px: 2, mb: 2 }}>
        <Button
          fullWidth variant="contained"
          startIcon={<LoginIcon />}
          onClick={() => handleBranchNavigate('/login')}
          sx={{ bgcolor: VIOLETA_SCOUT, fontWeight: 'bold' }}
        >
          Ingresar
        </Button>
      </Box>

      {/* Redes Sociales */}
      <Box sx={{ px: 2, display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
        <IconButton component="a" href="https://www.instagram.com/grupotupahue/" target="_blank" rel="noopener noreferrer" sx={{ color: '#E1306C' }}>
          <InstagramIcon />
        </IconButton>
        <IconButton component="a" href="https://www.facebook.com/grupotupahue/" target="_blank" rel="noopener noreferrer" sx={{ color: '#4267B2' }}>
          <FacebookIcon />
        </IconButton>
        <IconButton component="a" href="https://chat.whatsapp.com/CLwLHvggsVZ9fwqSjnnCSv" target="_blank" rel="noopener noreferrer" sx={{ color: '#25D366' }}>
          <WhatsAppIcon />
        </IconButton>
      </Box>      
    </Box>
  );

  // MENU ESCRITORIO
  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          bgcolor: isScrolled ? 'rgba(255, 255, 255, 0.95)' : 'white',
          backdropFilter: isScrolled ? 'blur(10px)' : 'none',
          color: '#333',
          transition: 'all 0.5s ease',
          boxShadow: isScrolled ? '0 2px 10px rgba(0,0,0,0.1)' : 'none',
        }}
        elevation={0}
      >
        <Container maxWidth={false} sx={{ px: { xs: 2, md: 4 } }}>
          <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>

            {/* LOGO */}
            <Box component={NavLink} to="/" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', gap: 1.5 }}>
              <Box component="img" src={logoTupahue} alt="Logo" sx={{ height: { xs: 45, md: 70 } }} />
              <Typography variant="h6" sx={{ fontFamily: 'Ubuntu', fontWeight: 700, color: VIOLETA_SCOUT, fontSize: { xs: '1.1rem', md: '1.7rem' } }}>
                TUPAHUE
              </Typography>
            </Box>

            {/* ENLACES ESCRITORIO */}
            <Box sx={{ display: { xs: 'none', lg: 'flex' }, alignItems: 'center' }}>

              {/* 1. Inicio, Noticias, Que Hacemos, Historia */}
              {menuPrincipal.map((item) => (
                <Button key={item.label} component={NavLink} to={item.path} sx={{ mx: 0.5, color: '#333', textTransform: 'none', fontWeight: 600, fontSize: '1rem' }}>
                  {item.label}
                </Button>
              ))}

              {/* 2. Ramas (Dropdown) */}
              <Button onClick={handleOpenRamas} endIcon={<KeyboardArrowDownIcon />} sx={{ mx: 0.5, color: '#333', textTransform: 'none', fontWeight: 600, fontSize: '1rem' }}>
                Ramas
              </Button>
              <Menu anchorEl={anchorEl} open={openRamas} onClose={handleCloseRamas} TransitionComponent={Fade} disableScrollLock sx={{ mt: 1 }}>
                {branches.map((b) => (
                  <MenuItem key={b.label} onClick={() => handleBranchNavigate(b.path)} sx={{ fontWeight: 500 }}>{b.label}</MenuItem>
                ))}
              </Menu>

              {/* 3. Contacto */}
              {menuSecundario.map((item) => (
                <Button key={item.label} component={NavLink} to={item.path} sx={{ mx: 0.5, color: '#333', textTransform: 'none', fontWeight: 600, fontSize: '1rem' }}>
                  {item.label}
                </Button>
              ))}

              <Divider orientation="vertical" flexItem sx={{ mx: 2, my: 1.5 }} />

              {/* 4. Botón Ingresar */}
              <Button component={NavLink} to="/login" variant="outlined" startIcon={<LoginIcon />} sx={{ borderRadius: 2, borderColor: VIOLETA_SCOUT, color: VIOLETA_SCOUT, fontWeight: 'bold', px: 3, mr: 2 }}>
                Ingresar
              </Button>

              {/* 5. Redes Sociales */}
              <Stack direction="row" spacing={0.5}>
                <IconButton component="a" href="https://www.instagram.com/grupotupahue/" target="_blank" rel="noopener noreferrer" size="small" sx={{ color: '#E1306C' }}>
                  <InstagramIcon />
                </IconButton>
                <IconButton component="a" href="https://www.facebook.com/grupotupahue/" target="_blank" rel="noopener noreferrer" size="small" sx={{ color: '#4267B2' }}>
                  <FacebookIcon />
                </IconButton>
                <IconButton component="a" href="https://chat.whatsapp.com/CLwLHvggsVZ9fwqSjnnCSv" target="_blank" rel="noopener noreferrer" size="small" sx={{ color: '#25D366' }}>
                  <WhatsAppIcon />
                </IconButton>
              </Stack>

            </Box>

            {/* BOTÓN HAMBURGUESA (MÓVIL) */}
            <IconButton onClick={handleDrawerToggle} sx={{ display: { lg: 'none' }, color: VIOLETA_SCOUT }}>
              <MenuIcon fontSize="large" />
            </IconButton>
          </Toolbar>
        </Container>
        <Box sx={{ width: '100%' }}><CintasPanuelo /></Box>
      </AppBar>

      {/* DRAWER MÓVIL */}
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', lg: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280 },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};