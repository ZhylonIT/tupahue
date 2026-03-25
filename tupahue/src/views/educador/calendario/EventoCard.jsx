import { Card, CardContent, Typography, Box, IconButton, Stack, Chip, Divider } from '@mui/material';
import { Edit, DeleteOutline, AccessTime, LocationOn } from '@mui/icons-material';
import { TIPOS_EVENTO } from '../../../constants/eventos';

export const EventoCard = ({ evento, configRama, onEdit, onDelete }) => {
  const tipoData = TIPOS_EVENTO.find(t => t.id === evento.tipo) || TIPOS_EVENTO[0];
  const esNacional = evento.tipo === 'NACIONAL';

  return (
    <Card sx={{ borderRadius: 4, position: 'relative', overflow: 'hidden', border: '1px solid #eee', boxShadow: 'none' }}>
      <Box sx={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 6, background: evento.color }} />
      
      <CardContent sx={{ pl: 4 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Box sx={{ flexGrow: 1 }}>
            <Chip 
              label={tipoData.label} 
              size="small" 
              sx={{ 
                mb: 1, fontWeight: 800, fontSize: '0.6rem',
                background: esNacional ? tipoData.color : `${evento.color}15`,
                color: esNacional ? tipoData.textColor : evento.color,
                border: esNacional ? `1px solid #75BDF0` : 'none'
              }} 
            />
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>{evento.titulo}</Typography>
            
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 3 }}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ color: 'text.secondary' }}>
                <AccessTime sx={{ fontSize: 16 }} />
                <Typography variant="body2">{evento.hora || 'Hora a confirmar'}</Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ color: 'text.secondary' }}>
                <LocationOn sx={{ fontSize: 16 }} />
                <Typography variant="body2">{evento.lugar || 'Lugar a confirmar'}</Typography>
              </Stack>
            </Stack>
          </Box>

          <Stack direction="row" spacing={0.5}>
            <IconButton size="small" onClick={onEdit}><Edit fontSize="small" /></IconButton>
            <IconButton size="small" onClick={() => onDelete(evento.id)} color="error"><DeleteOutline fontSize="small" /></IconButton>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};