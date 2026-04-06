import { Box, Typography, Avatar, Badge, IconButton } from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import { useRef } from 'react';

export const SidebarHeader = ({ open, user, config, getCargoLabel, userFuncion }) => {
  const fileInputRef = useRef(null);

  // Lógica de cambio de foto (Placeholder hasta conectar con Storage)
  const handlePhotoClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  return (
    <Box sx={{ p: 3, textAlign: 'center', transition: 'all 0.3s' }}>
      <input type="file" accept="image/*" hidden ref={fileInputRef} />
      
      <Badge
        overlap="circular"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        invisible={!open}
        badgeContent={
          <IconButton 
            size="small"
            onClick={handlePhotoClick}
            sx={{ 
              bgcolor: config.color, color: 'white',
              '&:hover': { bgcolor: config.color, transform: 'scale(1.1)' },
              width: 28, height: 28, boxShadow: 3
            }}
          >
            <PhotoCamera sx={{ fontSize: 16 }} />
          </IconButton>
        }
      >
        <Avatar 
          src={user?.fotoPerfil}
          sx={{ 
            width: open ? 80 : 40, 
            height: open ? 80 : 40, 
            mx: 'auto', 
            transition: 'all 0.3s',
            bgcolor: `${config.color}22`, 
            border: `3px solid ${config.color}`,
            boxShadow: `0 0 15px ${config.color}33`,
            fontWeight: 900,
            fontSize: open ? '2rem' : '1rem',
            color: config.color
          }}
        >
          {user?.nombre?.charAt(0) || 'U'}
        </Avatar>
      </Badge>

      {open && (
        <Box sx={{ mt: 2, animation: 'fadeIn 0.5s' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'white', lineHeight: 1.2 }}>
            {user?.nombre} {user?.apellido}
          </Typography>
          <Typography variant="caption" sx={{ color: config.color, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1 }}>
            {getCargoLabel(userFuncion)}
          </Typography>
        </Box>
      )}
    </Box>
  );
};