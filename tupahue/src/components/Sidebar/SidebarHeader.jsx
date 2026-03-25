import { Box, Typography, IconButton } from '@mui/material';
import { Menu as MenuIcon, ChevronLeft } from '@mui/icons-material';

export const SidebarHeader = ({ open, setOpen, configColor }) => {
  return (
    <Box sx={{ 
      p: 2, 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: open ? 'space-between' : 'center', 
      minHeight: 80 
    }}>
      {open && (
        <Typography variant="h6" sx={{ fontWeight: 900, letterSpacing: 1, color: configColor }}>
          TUPAHUE
        </Typography>
      )}
      <IconButton onClick={() => setOpen(!open)} sx={{ color: 'white' }}>
        {open ? <ChevronLeft /> : <MenuIcon />}
      </IconButton>
    </Box>
  );
};