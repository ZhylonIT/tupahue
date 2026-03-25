import { useState } from 'react';
import { Box, Stack, Tooltip, Avatar, Typography, Menu, MenuItem, ListItemIcon, Divider } from '@mui/material';
import { FUNCIONES } from '../../constants/auth.jsx';

export const UserFooter = ({ open, userFuncion, config, getRoleIcon, getCargoLabel, onSelectRol }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  const handleOpen = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleRoleClick = (func) => {
    onSelectRol(func);
    handleClose();
  };

  return (
    <Box sx={{ mt: 'auto', p: 2, bgcolor: 'rgba(0,0,0,0.2)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <Stack direction="row" spacing={open ? 2 : 0} alignItems="center" justifyContent={open ? 'initial' : 'center'}>
        <Tooltip title="Cambiar Rol" placement="right">
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
            <Typography variant="body2" sx={{ fontWeight: 800, color: 'white' }}>Arturo</Typography>
            <Typography variant="caption" sx={{ color: config.color, display: 'block', fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase' }}>
              {getCargoLabel(userFuncion)}
            </Typography>
          </Box>
        )}
      </Stack>

      <Menu
        anchorEl={anchorEl} open={openMenu} onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }} 
        transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        PaperProps={{ sx: { bgcolor: '#262626', color: 'white', minWidth: 230, '& .MuiMenuItem-root': { fontSize: '0.85rem', py: 1.5 } } }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="caption" sx={{ color: 'gray', fontWeight: 900, textTransform: 'uppercase' }}>
            Cambiar Función
          </Typography>
        </Box>
        <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
        {Object.values(FUNCIONES).filter(f => !f.startsWith('PROTAGONISTA_')).map((func) => (
          <MenuItem key={func} selected={userFuncion === func} onClick={() => handleRoleClick(func)}>
            <ListItemIcon sx={{ color: 'inherit', minWidth: 35 }}>{getRoleIcon(func)}</ListItemIcon>
            {getCargoLabel(func)}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};