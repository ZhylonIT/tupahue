import { Grid, Card, CardActionArea, Stack, Avatar, Box, Typography, Chip } from '@mui/material';

export const ScoutProgressCard = ({ scout, configRama, etapas = [], onClick }) => {
  // 1. Defensa: Si etapas llega vacío o undefined, evitamos el .find() que rompe todo
  if (!etapas || etapas.length === 0) {
    return null; 
  }

  // 2. Buscamos la etapa actual
  const etapa = etapas.find(e => e.id === scout.etapa) || etapas[0];
  const IconoEtapa = etapa?.icon;

  return (
    // 3. Cambiamos Grid item por el nuevo estándar de Grid v2 (size)
    <Grid size={{ xs: 12, md: 6 }}>
      <Card sx={{ 
        borderRadius: 4, 
        border: '1px solid #eee', 
        boxShadow: 'none', 
        transition: '0.3s', 
        '&:hover': { boxShadow: '0 4px 20px rgba(0,0,0,0.05)', transform: 'translateY(-2px)' } 
      }}>
        <CardActionArea sx={{ p: 2.5 }} onClick={() => onClick(scout)}>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <Avatar sx={{ bgcolor: configRama?.color || '#ccc' }}>
              {scout.nombre ? scout.nombre[0] : '?'}
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography sx={{ fontWeight: 700 }}>{scout.nombre} {scout.apellido}</Typography>
              <Typography variant="caption" color="text.secondary">{scout.equipo || scout.patrulla || 'Sin Equipo'}</Typography>
            </Box>
            <Chip 
              icon={IconoEtapa ? <IconoEtapa style={{ fontSize: '1.1rem' }} /> : null} 
              label={etapa?.nombre || 'S/E'} 
              size="small" 
              sx={{ 
                bgcolor: etapa?.color ? `${etapa.color}15` : '#eee', 
                color: etapa?.color || 'inherit', 
                fontWeight: 700, 
                border: `1px solid ${etapa?.color || '#ccc'}` 
              }} 
            />
          </Stack>
          <Typography variant="caption" sx={{ fontWeight: 800, color: configRama?.color || 'primary.main', textTransform: 'uppercase' }}>
            Evaluar Progresión
          </Typography>
        </CardActionArea>
      </Card>
    </Grid>
  );
};