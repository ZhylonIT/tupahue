import { useMemo } from 'react';
import { Box, Paper, Stack, Typography, Divider } from '@mui/material';
import { Calculate } from '@mui/icons-material';

const VIOLETA_SCOUT = '#5A189A';

export const ResumenFiltrado = ({ movimientos = [] }) => {
  // Realizamos los cálculos aquí para no ensuciar la vista principal
  const totales = useMemo(() => {
    const ing = movimientos
      .filter(m => m.tipo === 'ingreso')
      .reduce((acc, m) => acc + Number(m.monto), 0);
    
    const egr = movimientos
      .filter(m => m.tipo === 'egreso')
      .reduce((acc, m) => acc + Number(m.monto), 0);

    return { ingresos: ing, egresos: egr, balance: ing - egr };
  }, [movimientos]);

  // Si no hay movimientos, no mostramos la barra para no ocupar espacio
  if (movimientos.length === 0) return null;

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 2, 
        mb: 3, 
        borderRadius: 3, 
        bgcolor: `${VIOLETA_SCOUT}08`, 
        border: `1px dashed ${VIOLETA_SCOUT}40` 
      }}
    >
      <Stack 
        direction={{ xs: 'column', sm: 'row' }} 
        spacing={4} 
        justifyContent="center" 
        alignItems="center"
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <Calculate sx={{ color: VIOLETA_SCOUT, fontSize: 20 }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.secondary' }}>
            RESULTADOS DEL FILTRO:
          </Typography>
        </Stack>

        <Box>
          <Typography variant="caption" color="text.secondary">Ingresos: </Typography>
          <Typography variant="subtitle2" component="span" sx={{ fontWeight: 900, color: '#2e7d32' }}>
            +${totales.ingresos.toLocaleString('es-AR')}
          </Typography>
        </Box>

        <Box>
          <Typography variant="caption" color="text.secondary">Egresos: </Typography>
          <Typography variant="subtitle2" component="span" sx={{ fontWeight: 900, color: '#d32f2f' }}>
            -${totales.egresos.toLocaleString('es-AR')}
          </Typography>
        </Box>

        <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />

        <Box>
          <Typography variant="caption" color="text.secondary">Balance Parcial: </Typography>
          <Typography 
            variant="subtitle2" 
            component="span" 
            sx={{ 
              fontWeight: 900, 
              color: totales.balance >= 0 ? '#2e7d32' : '#d32f2f' 
            }}
          >
            ${totales.balance.toLocaleString('es-AR')}
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
};