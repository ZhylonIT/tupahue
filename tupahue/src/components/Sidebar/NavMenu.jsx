import { List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';

export const NavMenu = ({ open, items, vistaActual, setVistaActual, config }) => {
  return (
    <List sx={{ px: 1 }}>
      {items.map((item) => (
        <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
          <ListItemButton
            onClick={() => setVistaActual(item.vista)}
            selected={vistaActual === item.vista}
            sx={{
              minHeight: 48,
              justifyContent: open ? 'initial' : 'center',
              borderRadius: 2,
              transition: 'all 0.2s ease',
              '&.Mui-selected': { 
                bgcolor: config.fondo, 
                '& .MuiListItemIcon-root, & .MuiListItemText-primary': { 
                  color: config.color, 
                  fontWeight: 800 
                } 
              },
              '&:hover': { 
                bgcolor: 'rgba(255,255,255,0.05)',
                '& .MuiListItemIcon-root': { color: config.color }
              }
            }}
          >
            <ListItemIcon 
              sx={{ 
                minWidth: 0, 
                mr: open ? 2 : 'auto', 
                color: vistaActual === item.vista ? config.color : 'rgba(255,255,255,0.7)',
                transition: 'color 0.2s'
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.label} 
              sx={{ 
                opacity: open ? 1 : 0, 
                '& .MuiTypography-root': { fontSize: '0.85rem', letterSpacing: '0.3px' } 
              }} 
            />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
};