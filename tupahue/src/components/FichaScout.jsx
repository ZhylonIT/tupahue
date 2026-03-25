import { 
  Dialog, DialogContent, DialogTitle, IconButton, Typography, 
  Grid, Box, Avatar, Chip, Divider, Stack, List, ListItem, ListItemText 
} from '@mui/material';
import { 
  Close, Phone, MedicalServices, FamilyRestroom, 
  Cake, Badge, EscalatorWarning, Bloodtype 
} from '@mui/icons-material';

const VIOLETA_SCOUT = '#5A189A';

export const FichaScout = ({ open, onClose, scout }) => {
  if (!scout) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth scroll="body">
      <DialogTitle sx={{ m: 0, p: 2, bgcolor: VIOLETA_SCOUT, color: 'white' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" sx={{ fontWeight: 700 }}>Ficha del Beneficiario</Typography>
          <IconButton onClick={onClose} sx={{ color: 'white' }}><Close /></IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ p: 3, mt: 2 }}>
        <Grid container spacing={4}>
          {/* Columna Izquierda: Foto y Perfil */}
          <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
            <Avatar 
              sx={{ width: 120, height: 120, mx: 'auto', mb: 2, bgcolor: '#9D4EDD', fontSize: '3rem' }}
            >
              {scout.nombre[0]}
            </Avatar>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>{scout.nombre}</Typography>
            <Chip label={scout.patrulla} color="primary" sx={{ mt: 1, fontWeight: 700 }} />
            
            <Box sx={{ mt: 4, textAlign: 'left', bgcolor: '#f8f9fa', p: 2, borderRadius: 2 }}>
              <Stack spacing={1.5}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Badge fontSize="small" color="action" />
                  <Typography variant="body2"><strong>DNI:</strong> {scout.dni}</Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Cake fontSize="small" color="action" />
                  <Typography variant="body2"><strong>Edad:</strong> {scout.edad} años</Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Bloodtype fontSize="small" color="error" />
                  <Typography variant="body2"><strong>Grupo Sanguíneo:</strong> 0+</Typography>
                </Box>
              </Stack>
            </Box>
          </Grid>

          {/* Columna Derecha: Información Crítica */}
          <Grid item xs={12} md={8}>
            {/* CONTACTO DE EMERGENCIA */}
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
              <FamilyRestroom color="primary" /> Contacto de Emergencia
            </Typography>
            <Paper variant="outlined" sx={{ p: 2, mb: 3, borderColor: '#5A189A' }}>
              <Typography variant="body1"><strong>Madre:</strong> Analía Rodríguez</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                <Phone fontSize="inherit" /> +54 9 11 5555-0123
              </Typography>
            </Paper>

            {/* SALUD Y ALERGIAS */}
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
              <MedicalServices color="error" /> Información Médica
            </Typography>
            <Stack spacing={1} sx={{ mb: 3 }}>
              <Box sx={{ p: 1.5, bgcolor: 'rgba(211, 47, 47, 0.05)', borderRadius: 1, borderLeft: '4px solid #d32f2f' }}>
                <Typography variant="body2"><strong>Alergias:</strong> Penicilina, picadura de avispa.</Typography>
              </Box>
              <Box sx={{ p: 1.5, bgcolor: '#f8f9fa', borderRadius: 1 }}>
                <Typography variant="body2"><strong>Obra Social:</strong> OSDE (N° 1234567/01)</Typography>
              </Box>
              <Box sx={{ p: 1.5, bgcolor: '#f8f9fa', borderRadius: 1 }}>
                <Typography variant="body2"><strong>Medicamentos diarios:</strong> Ninguno.</Typography>
              </Box>
            </Stack>

            {/* ADULTOS RESPONSABLES */}
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
              <EscalatorWarning color="primary" /> Adultos Responsables
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText primary="Pedro Pérez (Padre)" secondary="Tel: 11 4444-0987" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Marta Gómez (Abuela)" secondary="Tel: 11 2222-3333" />
              </ListItem>
            </List>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};