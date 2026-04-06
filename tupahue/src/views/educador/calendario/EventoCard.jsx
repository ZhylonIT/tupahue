import { Card, CardContent, Typography, Box, IconButton, Stack, Chip } from '@mui/material';
import { Edit, DeleteOutline, AccessTime, LocationOn, Groups, Public } from '@mui/icons-material';
import { TIPOS_EVENTO } from '../../../constants/eventos';
import { RAMAS } from '../../../constants/ramas';

export const EventoCard = ({ evento, configRama, onEdit, onDelete }) => {
  // 1. Buscamos la data del tipo (Grupal, Rama, Nacional, etc.)
  const tipoData = TIPOS_EVENTO.find(t => t.id === evento.tipo) || TIPOS_EVENTO[0];
  const esNacional = evento.tipo === 'NACIONAL';

  // 2. 🎯 LÓGICA DE ETIQUETA DINÁMICA MEJORADA
  const getLabelDinamico = () => {
    // Si el tipo es 'RAMA', buscamos específicamente qué rama es
    if (evento.tipo === 'RAMA') {
      const ramaKey = evento.rama?.toUpperCase();
      // Si tenemos la rama en las constantes, usamos su nombre. 
      // Si no, usamos el nombre de la rama en la que estamos parados (configRama).
      const nombreRama = RAMAS[ramaKey]?.nombre || configRama?.nombre || 'Rama';
      return `Rama ${nombreRama}`;
    }
    
    // Si es Grupal o Nacional, usamos el label de TIPOS_EVENTO
    return tipoData.label || 'Evento';
  };

  // 3. Color de respaldo por si el evento no tiene color grabado
  const colorFinal = evento.color || configRama?.color || '#5A189A';

  return (
    <Card sx={{ 
      borderRadius: 4, 
      position: 'relative', 
      overflow: 'hidden', 
      border: '1px solid #eee', 
      boxShadow: 'none', 
      mb: 2,
      transition: '0.2s',
      '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }
    }}>
      {/* Barra de color lateral */}
      <Box sx={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 6, background: colorFinal }} />
      
      <CardContent sx={{ pl: 4, py: 2.5 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Box sx={{ flexGrow: 1 }}>
            
            {/* 🎯 EL CHIP QUE AHORA SÍ DEBE DECIR LA RAMA */}
            <Chip 
              icon={evento.tipo === 'GRUPAL' ? <Public sx={{ fontSize: '0.9rem !important' }} /> : <Groups sx={{ fontSize: '0.9rem !important' }} />}
              label={getLabelDinamico()} 
              size="small" 
              sx={{ 
                mb: 1, 
                fontWeight: 900, 
                fontSize: '0.65rem',
                textTransform: 'uppercase',
                letterSpacing: 0.8,
                background: esNacional ? tipoData.color : `${colorFinal}15`,
                color: esNacional ? tipoData.textColor : colorFinal,
                border: esNacional ? `1px solid #75BDF0` : 'none',
                height: 24
              }} 
            />

            <Typography variant="h6" sx={{ fontWeight: 800, mb: 1, color: '#1a1a1a', lineHeight: 1.2 }}>
              {evento.titulo}
            </Typography>
            
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 3 }}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ color: 'text.secondary' }}>
                <AccessTime sx={{ fontSize: 16, opacity: 0.7 }} />
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {evento.hora || 'Hora a confirmar'}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ color: 'text.secondary' }}>
                <LocationOn sx={{ fontSize: 16, opacity: 0.7 }} />
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {evento.lugar || 'Lugar a confirmar'}
                </Typography>
              </Stack>
            </Stack>
          </Box>

          <Stack direction="row" spacing={0.5}>
            <IconButton size="small" onClick={onEdit} sx={{ color: 'text.disabled' }}>
              <Edit fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={() => onDelete(evento.id)} color="error" sx={{ opacity: 0.6 }}>
              <DeleteOutline fontSize="small" />
            </IconButton>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};