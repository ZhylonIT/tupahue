import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Stack, IconButton, Tooltip } from '@mui/material';
import { Visibility, Download, Delete } from '@mui/icons-material';

export const PlanificacionHistorial = ({ historial }) => (
  <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 4, border: '1px solid #e0e0e0' }}>
    <Table>
      <TableHead sx={{ bgcolor: '#f8f9fa' }}>
        <TableRow>
          <TableCell sx={{ fontWeight: 800 }}>FECHA</TableCell>
          <TableCell sx={{ fontWeight: 800 }}>ACTIVIDAD</TableCell>
          <TableCell sx={{ fontWeight: 800 }}>RESPONSABLE</TableCell>
          <TableCell align="center" sx={{ fontWeight: 800 }}>ACCIONES</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {historial.map((row) => (
          <TableRow key={row.id} hover>
            <TableCell>{row.fecha}</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>{row.nombre}</TableCell>
            <TableCell>{row.responsable}</TableCell>
            <TableCell align="center">
              <Stack direction="row" spacing={1} justifyContent="center">
                <Tooltip title="Ver"><IconButton color="primary" size="small"><Visibility /></IconButton></Tooltip>
                <Tooltip title="PDF"><IconButton sx={{ color: '#d32f2f' }} size="small"><Download /></IconButton></Tooltip>
                <IconButton color="error" size="small"><Delete /></IconButton>
              </Stack>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);