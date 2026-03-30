import { useState } from 'react';
import { Box, Stack, Tooltip, Avatar, Typography, Menu, MenuItem, ListItemIcon, Divider, IconButton } from '@mui/material';
import { 
  Settings, 
  ExitToApp, 
  CheckCircle 
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

export const UserFooter = ({ open, userFuncion, config, getRoleIcon, getCargoLabel, onRoleSwitched }) => {
  const { user, logout, switchRole, availableFunciones } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  const handleOpen = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleRoleClick = (func) => {
    switchRole(func); // Cambia el contexto global
    
    // Ejecutamos el callback para que el Sidebar resetee la rama si es necesario
    if (onRoleSwitched) {
      onRoleSwitched(func);
    }
    
    handleClose(); // 👈 CORRECCIÓN 1: Cerramos el menú inmediatamente
  };

  const handleLogoutClick = () => {
    handleClose();
    logout();
  };

  return (
    <Box sx={{ mt: 'auto', p: 2, bgcolor: 'rgba(0,0,0,0.2)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <Stack direction="row" spacing={open ? 2 : 0} alignItems="center" justifyContent={open ? 'initial' : 'center'}>
        <Tooltip title="Opciones de Usuario" placement="right">
          <Avatar 
            onClick={handleOpen}
            sx={{ 
              bgcolor: config.color, width: 36, height: 36, color: '#fff', cursor: 'pointer', 
              transition: 'all 0.2s', '&:hover': { transform: 'scale(1.1)', boxShadow: `0 0 12px ${config.color}` } 
            }}
          >
            {getRoleIcon(userFuncion)}
          </Avatar>
        </Tooltip>
        
        {open && (
          <Box sx={{ overflow: 'hidden', flexGrow: 1, cursor: 'pointer' }} onClick={handleOpen}>
            <Typography variant="body2" sx={{ fontWeight: 800, color: 'white', lineHeight: 1.2 }}>
              {user?.nombre || 'Usuario'}
            </Typography>
            <Typography variant="caption" sx={{ color: config.color, display: 'block', fontWeight: 700, fontSize: '0.65rem', textTransform: 'uppercase' }}>
              {getCargoLabel(userFuncion)}
            </Typography>
          </Box>
        )}

        {open && (
          <IconButton size="small" onClick={handleOpen} sx={{ color: 'rgba(255,255,255,0.5)' }}>
            <Settings fontSize="small" />
          </IconButton>
        )}
      </Stack>

      <Menu
        anchorEl={anchorEl} 
        open={openMenu} 
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }} 
        transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        PaperProps={{ 
          sx: { 
            bgcolor: '#262626', 
            color: 'white', 
            minWidth: 250, 
            borderRadius: 3,
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
            '& .MuiMenuItem-root': { fontSize: '0.85rem', py: 1.2 } 
          } 
        }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="caption" sx={{ color: 'gray', fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1 }}>
            Funciones Disponibles
          </Typography>
        </Box>
        
        {availableFunciones.map((func) => (
          <MenuItem 
            key={func} 
            selected={userFuncion === func} 
            onClick={() => handleRoleClick(func)}
            sx={{ mx: 1, borderRadius: 2, mb: 0.5 }}
          >
            <ListItemIcon sx={{ color: userFuncion === func ? config.color : 'inherit', minWidth: 35 }}>
              {userFuncion === func ? <CheckCircle sx={{ fontSize: 18, color: config.color }} /> : getRoleIcon(func)}
            </ListItemIcon>
            <Typography sx={{ fontWeight: userFuncion === func ? 800 : 400 }}>
              {getCargoLabel(func)}
            </Typography>
          </MenuItem>
        ))}

        <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)', my: 1 }} />

        <MenuItem onClick={() => { alert("Próximamente: Configuración"); handleClose(); }} sx={{ mx: 1, borderRadius: 2 }}>
          <ListItemIcon sx={{ color: 'inherit', minWidth: 35 }}><Settings fontSize="small" /></ListItemIcon>
          Configuración del Perfil
        </MenuItem>

        <MenuItem onClick={handleLogoutClick} sx={{ mx: 1, borderRadius: 2, color: '#ff5252' }}>
          <ListItemIcon sx={{ color: '#ff5252', minWidth: 35 }}><ExitToApp fontSize="small" /></ListItemIcon>
          Cerrar Sesión
        </MenuItem>
      </Menu>
    </Box>
  );
};