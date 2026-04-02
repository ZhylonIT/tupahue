import { useState, useRef } from 'react';
import { 
  Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, 
  ListItemText, Typography, Divider, Avatar, IconButton, Badge 
} from '@mui/material';
import { 
  EmojiEvents, Groups, AccountBalanceWallet, 
  Description, Logout, PhotoCamera, RocketLaunch 
} from '@mui/icons-material';
import { SidebarHeader } from './SidebarHeader';
import { RAMAS } from '../../constants/ramas';

const DRAWER_WIDTH = 280;

export const SidebarJoven = ({ 
  vistaActual, 
  setVistaActual, 
  user, 
  joven, 
  esRover, 
  onLogout,
  proyectos = [] // Mantenemos la prop para futura implementación de notificaciones
}) => {
  // 1. Referencia para el input de archivo oculto
  const fileInputRef = useRef(null);
  
  // 2. Estado local para previsualizar la foto
  const [previewFoto, setPreviewFoto] = useState(user?.fotoPerfil || null);

  // 3. Lógica de Color y Terminología basada en la rama
  const ramaId = joven?.rama?.toUpperCase() || 'SCOUTS';
  const colorRama = RAMAS[ramaId]?.color || '#0ee2e5';
  
  // Lógica para el nombre del proyecto según rama
  const esLobato = ramaId === 'LOBATOS';
  const labelProyecto = esLobato ? 'Mi Cacería' : 'Mis Proyectos';  

  const menuItems = [
    { id: 'MI_RAMA', label: 'Mi Rama', icon: <Groups /> },
    { id: 'PROGRESION', label: 'Mi Progresión', icon: <EmojiEvents /> },
    { id: 'PROYECTOS', label: labelProyecto, icon: <RocketLaunch /> }, 
  ];

  if (esRover) {
    menuItems.push(
      { id: 'FINANZAS', label: 'Mis Finanzas', icon: <AccountBalanceWallet /> },
      { id: 'DOCUMENTACION', label: 'Mi Documentación', icon: <Description /> }
    );
  }

  // 4. Manejador de selección de imagen
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewFoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const drawerContent = (
    <Box sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column', 
      bgcolor: '#121212', 
      color: 'white',
    }}>
      <SidebarHeader colorRama={colorRama} />
      
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <input
          type="file"
          accept="image/*"
          hidden
          ref={fileInputRef}
          onChange={handleFileChange}
        />

        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          badgeContent={
            <IconButton 
              size="small"
              sx={{ 
                bgcolor: colorRama, 
                color: 'white',
                '&:hover': { bgcolor: colorRama, transform: 'scale(1.1)' },
                boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
                width: 32, height: 32
              }}
              onClick={() => fileInputRef.current.click()}
            >
              <PhotoCamera sx={{ fontSize: 18 }} />
            </IconButton>
          }
        >
          <Avatar 
            src={previewFoto}
            sx={{ 
              width: 90, height: 90, mx: 'auto', 
              bgcolor: `${colorRama}22`, 
              border: `3px solid ${colorRama}`,
              boxShadow: `0 0 20px ${colorRama}33`,
              fontWeight: 900,
              fontSize: '2rem',
              color: colorRama
            }}
          >
            {user?.nombre?.charAt(0) || 'U'}
          </Avatar>
        </Badge>

        <Typography variant="h6" sx={{ fontWeight: 800, mt: 2, mb: 0.5 }}>
          {user?.nombre} {user?.apellido}
        </Typography>
        <Typography variant="caption" sx={{ color: colorRama, fontWeight: 900, letterSpacing: 1.5, textTransform: 'uppercase' }}>
          {RAMAS[ramaId]?.nombre || 'PROTAGONISTA'}
        </Typography>
      </Box>

      <Divider sx={{ bgcolor: 'rgba(255,255,255,0.05)', mx: 3, my: 2 }} />

      <List sx={{ px: 2, flexGrow: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.id} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              selected={vistaActual === item.id}
              onClick={() => setVistaActual(item.id)}
              sx={{
                borderRadius: '16px',
                py: 1.5,
                transition: '0.3s',
                '&.Mui-selected': {
                  background: `linear-gradient(90deg, ${colorRama}33 0%, ${colorRama}05 100%)`,
                  color: colorRama,
                  '& .MuiListItemIcon-root': { color: colorRama }
                },
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.05)',
                  transform: 'translateX(5px)'
                }
              }}
            >
              <ListItemIcon sx={{ color: 'rgba(255,255,255,0.4)', minWidth: 45 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.label} 
                primaryTypographyProps={{ 
                  fontWeight: 800, 
                  fontSize: '0.9rem',
                  fontFamily: '"Ubuntu", sans-serif'
                }} 
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Box sx={{ p: 2 }}>
        <ListItemButton 
          onClick={onLogout} 
          sx={{ 
            borderRadius: '16px', 
            color: '#ff4d4d',
            '&:hover': { bgcolor: 'rgba(255, 77, 77, 0.1)' }
          }}
        >
          <ListItemIcon><Logout sx={{ color: '#ff4d4d' }} /></ListItemIcon>
          <ListItemText primary="Cerrar Sesión" primaryTypographyProps={{ fontWeight: 800 }} />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Drawer
      variant="permanent"
      sx={{ 
        display: { xs: 'none', sm: 'block' }, 
        '& .MuiDrawer-paper': { 
          width: DRAWER_WIDTH, 
          borderRight: 'none', 
          boxShadow: '15px 0 35px rgba(0,0,0,0.4)' 
        } 
      }}
      open
    >
      {drawerContent}
    </Drawer>
  );
};