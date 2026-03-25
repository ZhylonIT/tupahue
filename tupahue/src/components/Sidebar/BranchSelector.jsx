import { Box, Typography, Stack, FormControl, Select, MenuItem } from '@mui/material';
import { Lock, Public } from '@mui/icons-material';
import { RAMAS } from '../../constants/ramas.jsx';

export const BranchSelector = ({ 
  open, 
  tienePermisoGlobal, 
  canChangeRama, 
  ramaSeleccionada, 
  onRamaChange, 
  userFuncion 
}) => {
  if (!open) return null;

  return (
    <Box sx={{ px: 2, mb: 4 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ ml: 1, mb: 1 }}>
        <Typography variant="caption" sx={{ color: 'gray', fontWeight: 700, textTransform: 'uppercase' }}>
          {tienePermisoGlobal ? 'Ámbito de Gestión' : 'Rama Activa'}
        </Typography>
        {!tienePermisoGlobal && <Lock sx={{ fontSize: 14, color: 'gray' }} />}
      </Stack>

      {(tienePermisoGlobal || canChangeRama) ? (
        <FormControl fullWidth size="small">
          <Select
            value={ramaSeleccionada?.toUpperCase() || 'TODAS'}
            onChange={(e) => onRamaChange(e.target.value)}
            sx={{
              color: 'white', bgcolor: 'rgba(255, 255, 255, 0.05)', borderRadius: 2,
              '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' }
            }}
          >
            <MenuItem value="TODAS">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 'bold' }}>
                <Public sx={{ fontSize: 18 }} /> TODO EL GRUPO
              </Box>
            </MenuItem>
            {Object.values(RAMAS).map((r) => (
              <MenuItem key={r.id} value={r.id.toUpperCase()}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: r.color }} /> {r.nombre}
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ) : (
        <Box 
          sx={{ 
            display: 'flex', alignItems: 'center', gap: 1, px: 1.5, py: 1, 
            bgcolor: 'rgba(255, 255, 255, 0.05)', borderRadius: 2, color: 'white'
          }}
        >
          <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: RAMAS[userFuncion.toUpperCase()]?.color || '#ccc' }} /> 
          <Typography sx={{ fontSize: '0.875rem' }}>
            {RAMAS[userFuncion.toUpperCase()]?.nombre || 'Rama'}
          </Typography>
        </Box>
      )}
    </Box>
  );
};