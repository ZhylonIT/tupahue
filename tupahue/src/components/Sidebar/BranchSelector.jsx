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

  // REGLA DE ORO: La condición de "Editable" debe ser canChangeRama.
  // Si canChangeRama es false (Asistentes Técnicos), mostramos el diseño bloqueado.
  const esEditable = canChangeRama;

  return (
    <Box sx={{ px: 2, mb: 4 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ ml: 1, mb: 1 }}>
        <Typography variant="caption" sx={{ color: 'gray', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: 0.5 }}>
          {tienePermisoGlobal ? 'Ámbito de Gestión' : 'Rama Activa'}
        </Typography>
        {/* Mostramos el candado si no puede cambiar la rama */}
        {!esEditable && <Lock sx={{ fontSize: 14, color: 'gray', opacity: 0.5 }} />}
      </Stack>

      {esEditable ? (
        <FormControl fullWidth size="small">
          <Select
            value={ramaSeleccionada?.toUpperCase() || 'TODAS'}
            onChange={(e) => onRamaChange(e.target.value)}
            sx={{
              color: 'white', 
              bgcolor: 'rgba(255, 255, 255, 0.05)', 
              borderRadius: 2,
              fontSize: '0.875rem',
              '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.4)' },
              '& .MuiSvgIcon-root': { color: 'rgba(255,255,255,0.5)' }
            }}
          >
            <MenuItem value="TODAS">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 'bold' }}>
                <Public sx={{ fontSize: 18, color: '#9c27b0' }} /> TODO EL GRUPO
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
        // VISTA BLOQUEADA: Para Asistentes Técnicos o Educadores en su rama única
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            px: 1.5, 
            py: 1.2, 
            bgcolor: 'rgba(255, 255, 255, 0.03)', 
            borderRadius: 2, 
            color: 'rgba(255,255,255,0.8)',
            border: '1px dashed rgba(255,255,255,0.1)'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {ramaSeleccionada?.toUpperCase() === 'TODAS' ? (
              <Public sx={{ fontSize: 18, color: 'rgba(255,255,255,0.5)' }} />
            ) : (
              <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: RAMAS[ramaSeleccionada?.toUpperCase()]?.color || '#ccc' }} />
            )}
            <Typography sx={{ fontSize: '0.875rem', fontWeight: 600 }}>
              {ramaSeleccionada?.toUpperCase() === 'TODAS' ? 'TODO EL GRUPO' : RAMAS[ramaSeleccionada?.toUpperCase()]?.nombre}
            </Typography>
          </Box>
          <Lock sx={{ fontSize: 14, opacity: 0.3 }} />
        </Box>
      )}
    </Box>
  );
};