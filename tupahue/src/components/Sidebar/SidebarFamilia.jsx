import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography, Divider, Button, Paper } from '@mui/material';
import { FamilyRestroom, ReceiptLong, FolderShared, TrendingUp, Logout } from '@mui/icons-material';
import logoTupahue from '../../assets/images/logo.png';
import { NavLink } from 'react-router-dom';

const drawerWidth = 280;

export const SidebarFamilia = ({ vistaActual, setVistaActual, onLogout, user }) => {
  // Las secciones que va a tener el padre
  const menuItems = [
    { id: 'MIS_HIJOS', label: 'Mis Hijos', icon: <FamilyRestroom /> },
    { id: 'FINANZAS', label: 'Cuotas y Recibos', icon: <ReceiptLong /> },
    { id: 'DOCUMENTACION', label: 'Documentación', icon: <FolderShared /> },
    { id: 'PROGRESION', label: 'Progresión Scout', icon: <TrendingUp /> },
  ];

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Toolbar sx={{ my: 2, display: 'flex', justifyContent: 'center' }}>
        <Box component={NavLink} to="/" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <Box component="img" src={logoTupahue} alt="Logo" sx={{ height: 60 }} />
        </Box>
      </Toolbar>
      <Divider sx={{ mb: 2 }} />

      <List sx={{ flexGrow: 1, px: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.id} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              selected={vistaActual === item.id}
              onClick={() => setVistaActual(item.id)}
              sx={{
                borderRadius: 2,
                '&.Mui-selected': { 
                  bgcolor: '#5A189A', 
                  color: 'white', 
                  '&:hover': { bgcolor: '#4a148c' } 
                },
                '&.Mui-selected .MuiListItemIcon-root': { color: 'white' }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: vistaActual === item.id ? 'white' : 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: vistaActual === item.id ? 700 : 500 }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Box sx={{ p: 2 }}>
        <Paper sx={{ p: 2, bgcolor: '#f3e5f5', borderRadius: 3, mb: 2, textAlign: 'center', border: '1px solid #e1bee7' }}>
          <Typography variant="subtitle2" fontWeight="bold" color="#5A189A">
            {user?.nombre} {user?.apellido}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            Portal de Familia
          </Typography>
        </Paper>
        <Button 
          fullWidth 
          variant="outlined" 
          color="error" 
          startIcon={<Logout />} 
          onClick={onLogout} 
          sx={{ borderRadius: 2 }}
        >
          Cerrar Sesión
        </Button>
      </Box>
    </Box>
  );

  return (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: 'none', sm: 'block' },
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { 
          width: drawerWidth, 
          boxSizing: 'border-box', 
          borderRight: 'none', 
          boxShadow: '2px 0 8px rgba(0,0,0,0.05)' 
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};