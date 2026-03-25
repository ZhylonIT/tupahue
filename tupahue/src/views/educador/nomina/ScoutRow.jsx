import { TableRow, TableCell, Stack, Avatar, Typography, Chip, Switch, Tooltip, IconButton, Box } from '@mui/material';
import { CheckCircleOutline, Person, Group, Visibility, Edit, Delete } from '@mui/icons-material';
import { RAMAS } from '../../../constants/ramas';

export const ScoutRow = ({ scout, esVistaGlobal, onToggle, onEdit, onVer, onDelete }) => {
  // Fallback seguro por si el scout no tiene rama asignada
  const ramaKey = scout.rama ? scout.rama.toUpperCase() : '';
  const ramaInfo = RAMAS[ramaKey] || { color: '#9e9e9e', nombre: scout.rama || 'Sin Rama' };

  return (
    <TableRow hover>
      <TableCell>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar sx={{ bgcolor: scout.presente ? `${ramaInfo.color}20` : '#f0f0f0', border: `2px solid ${scout.presente ? ramaInfo.color : '#e0e0e0'}` }}>
            {scout.presente ? <CheckCircleOutline sx={{ color: ramaInfo.color }} /> : <Person sx={{ color: '#999' }} />}
          </Avatar>
          <Box>
            <Typography sx={{ fontWeight: 700 }}>{scout.apellido?.toUpperCase()}, {scout.nombre}</Typography>
            <Typography variant="caption" sx={{ color: scout.fichaEntregada ? 'green' : 'error.main', fontWeight: 700 }}>
                {scout.fichaEntregada ? 'Ficha al día' : 'Sin Ficha'}
            </Typography>
          </Box>
        </Stack>
      </TableCell>
      
      {/* Columna condicional para Vista Global con los colores de la rama */}
      {esVistaGlobal && (
        <TableCell>
          <Chip 
            label={ramaInfo.nombre} 
            size="small" 
            sx={{ 
              bgcolor: ramaInfo.color !== '#9e9e9e' ? ramaInfo.color : '#e0e0e0', 
              color: ramaInfo.color !== '#9e9e9e' ? 'white' : 'text.primary',
              fontWeight: 700 
            }} 
          />
        </TableCell>
      )}
      
      <TableCell sx={{ fontWeight: 500 }}>{scout.dni || '-'}</TableCell>
      <TableCell>
        <Chip icon={<Group />} label={scout.equipo || scout.patrulla || 'S/E'} size="small" variant="outlined" />
      </TableCell>
      <TableCell align="center">
        <Switch checked={!!scout.presente} onChange={onToggle} color="primary" />
      </TableCell>
      <TableCell align="right">
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Tooltip title="Ver Ficha Completa">
            <IconButton onClick={() => onVer(scout)} size="small" color="info">
              <Visibility fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Editar Protagonista">
            <IconButton onClick={() => onEdit(scout)} size="small" color="primary">
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Eliminar Protagonista">
            <IconButton onClick={onDelete} size="small" color="error">
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </TableCell>
    </TableRow>
  );
};