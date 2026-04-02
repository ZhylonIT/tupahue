import { Box, Typography } from '@mui/material';

export const SidebarHeader = ({ colorRama }) => {
  return (
    <Box sx={{ 
      p: 3, 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      minHeight: '80px' 
    }}>
      <Typography 
        variant="h5" 
        sx={{ 
          fontWeight: 900, 
          color: colorRama || '#0ee2e5', // Usa el color de la rama o el turquesa por defecto
          letterSpacing: 3,
          fontFamily: '"Ubuntu", sans-serif',
          textShadow: `0 0 20px ${colorRama}44`
        }}
      >
        TUPAHUE
      </Typography>
    </Box>
  );
};