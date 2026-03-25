import { 
  TableContainer, Table, TableHead, TableRow, TableCell, 
  TableBody, Paper, Chip, IconButton 
} from '@mui/material';
import { EditNote } from '@mui/icons-material';

export const ScoutProgressTable = ({ scouts, etapas, onEvaluar }) => {
  return (
    <TableContainer component={Paper} sx={{ borderRadius: 4, boxShadow: 'none', border: '1px solid #eee' }}>
      <Table size="small">
        <TableHead sx={{ bgcolor: '#fafafa' }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 700, py: 2 }}>Protagonista</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Equipo</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Etapa Actual</TableCell>
            <TableCell align="right" sx={{ fontWeight: 700, pr: 3 }}>Acción</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {scouts.map((scout) => {
            const etapa = etapas.find(e => e.id === scout.etapa) || etapas[0];
            return (
              <TableRow key={scout.id} hover>
                <TableCell sx={{ fontWeight: 600, py: 1.5 }}>
                  {scout.apellido.toUpperCase()}, {scout.nombre}
                </TableCell>
                <TableCell>{scout.equipo || '-'}</TableCell>
                <TableCell>
                  <Chip 
                    label={etapa.nombre} 
                    size="small" 
                    sx={{ 
                      bgcolor: `${etapa.color}15`, 
                      color: etapa.color, 
                      fontWeight: 700, 
                      border: `1px solid ${etapa.color}`,
                      fontSize: '0.75rem'
                    }} 
                  />
                </TableCell>
                <TableCell align="right" sx={{ pr: 2 }}>
                  <IconButton 
                    size="small" 
                    onClick={() => onEvaluar(scout)}
                    sx={{ color: '#5A189A' }}
                  >
                    <EditNote />
                  </IconButton>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};