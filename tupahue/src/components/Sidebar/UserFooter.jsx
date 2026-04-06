import { useState } from 'react';
import { Box, Stack, Tooltip, Avatar, Typography, Menu, MenuItem, ListItemIcon, Divider, IconButton } from '@mui/material';
import { Settings, ExitToApp, CheckCircle, HistoryEdu } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

export const UserFooter = ({ open, userFuncion, config, getRoleIcon, getCargoLabel, onRoleSwitched, onOpenPerfil }) => {
  const { user, logout, switchRole, availableFunciones } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  const handleOpen = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleRoleClick = (func) => {
    switchRole(func);
    if (onRoleSwitched) onRoleSwitched(func);
    handleClose();
  };

  return (
    <Box sx={{ mt: 'auto', p: 2, bgcolor: 'rgba(0,0,0,0.3)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <Stack direction="row" spacing={open ? 1 : 0} alignItems="center" justifyContent="space-between">
        <Tooltip title="Cambiar Función" placement="right">
          <Avatar 
            onClick={handleOpen}
            sx={{ 
              bgcolor: config.color, width: 32, height: 32, cursor: 'pointer', 
              transition: 'all 0.2s', '&:hover': { transform: 'scale(1.1)' } 
            }}
          >
            {getRoleIcon(userFuncion)}
          </Avatar>
        </Tooltip>

        {open && (
          <Stack direction="row" spacing={1}>
            <Tooltip title="Mi Firma / Perfil">
              <IconButton size="small" onClick={onOpenPerfil} sx={{ color: config.color }}>
                <HistoryEdu fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Cerrar Sesión">
              <IconButton size="small" onClick={logout} sx={{ color: '#ff5252' }}>
                <ExitToApp fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        )}
      </Stack>

      <Menu
        anchorEl={anchorEl} open={openMenu} onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }} 
        transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        PaperProps={{ sx: { bgcolor: '#262626', color: 'white', minWidth: 220, borderRadius: 3 } }}
      >
        <Box sx={{ px: 2, py: 1 }}><Typography variant="caption" sx={{ color: 'gray', fontWeight: 900 }}>MIS FUNCIONES</Typography></Box>
        {availableFunciones.map((func) => (
          <MenuItem key={func} selected={userFuncion === func} onClick={() => handleRoleClick(func)} sx={{ mx: 1, borderRadius: 2 }}>
            <ListItemIcon sx={{ color: userFuncion === func ? config.color : 'inherit', minWidth: 35 }}>
              {userFuncion === func ? <CheckCircle sx={{ fontSize: 18, color: config.color }} /> : getRoleIcon(func)}
            </ListItemIcon>
            <Typography variant="body2" sx={{ fontWeight: userFuncion === func ? 800 : 400 }}>{getCargoLabel(func)}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};