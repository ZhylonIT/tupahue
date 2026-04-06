import { Box, Typography, Tabs, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Stack, IconButton, Tooltip, Chip } from '@mui/material';
import { AddCircle, History, Description, Download, Delete, Public } from '@mui/icons-material';

import { PlanificacionEditor } from './components/PlanificacionEditor';
import { generarPDFPlanificacion } from '../../../services/pdfPlanificacion';
import { RAMAS } from '../../../constants/ramas';
import { usePlanificaciones } from './UsePlanificaciones';

export const PlanificacionesView = ({ ramaId = 'CAMINANTES', scouts, adultos }) => {
  
  const {
    tabValue,
    setTabValue,
    historial,
    esVistaGlobal,
    guardarPlanificacion,
    eliminarPlanificacion
  } = usePlanificaciones(ramaId);

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 1, md: 3 }, mb: 8 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 900, color: '#1a237e' }}>
          {esVistaGlobal ? 'Gestión de Programa Global' : 'Gestión de Planificaciones'} 
          {esVistaGlobal ? <Public sx={{ verticalAlign: 'middle', ml: 1 }} /> : <Description sx={{ verticalAlign: 'middle', ml: 1 }} />}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {esVistaGlobal 
            ? 'Supervisión pedagógica y eventos de grupo • Grupo Scout Tupahue' 
            : 'Centro de recursos pedagógicos • Grupo Scout Tupahue'}
        </Typography>
      </Box>

      <Tabs value={tabValue} onChange={(e, val) => setTabValue(val)} sx={{ mb: 4, borderBottom: 1, borderColor: 'divider' }}>
        <Tab icon={<AddCircle />} label={esVistaGlobal ? "Planificar Evento Grupal" : "Nueva Planificación"} iconPosition="start" />
        <Tab icon={<History />} label={esVistaGlobal ? "Auditoría de Grupo" : "Historial de Rama"} iconPosition="start" />
      </Tabs>

      {tabValue === 0 ? (
        <PlanificacionEditor 
          key={ramaId} 
          ramaId={ramaId} 
          onSaveSuccess={guardarPlanificacion} 
          scouts={scouts}
          adultos={adultos} // 🎯 NUEVO: Pasamos adultos al editor
        />
      ) : (
        <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 4, border: '1px solid #e0e0e0' }}>
          <Table>
            <TableHead sx={{ bgcolor: '#f8f9fa' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 800 }}>FECHA</TableCell>
                {esVistaGlobal && <TableCell sx={{ fontWeight: 800 }}>RAMA / ORIGEN</TableCell>}
                <TableCell sx={{ fontWeight: 800 }}>ACTIVIDAD</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>CICLO DE PROGRAMA</TableCell>
                <TableCell align="center" sx={{ fontWeight: 800 }}>ACCIONES</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {historial.length === 0 && (
                <TableRow>
                  <TableCell colSpan={esVistaGlobal ? 5 : 4} align="center" sx={{ py: 4, color: 'text.secondary', fontStyle: 'italic' }}>
                    No hay planificaciones guardadas aún {esVistaGlobal ? 'en el grupo' : 'para esta rama'}.
                  </TableCell>
                </TableRow>
              )}
              {historial.map((row) => {
                const infoRama = row.ramaOrigen === 'TODAS' 
                  ? { nombre: 'GLOBAL GRUPO', color: '#5A189A' } 
                  : (RAMAS[row.ramaOrigen] || { nombre: row.ramaOrigen, color: 'primary.main' });
                
                return (
                  <TableRow key={row.id} hover>
                    <TableCell sx={{ fontWeight: 600 }}>{row.fecha}</TableCell>
                    {esVistaGlobal && (
                      <TableCell>
                        <Chip label={infoRama.nombre} size="small" sx={{ fontWeight: 800, bgcolor: infoRama.color, color: 'white', fontSize: '0.7rem' }} />
                      </TableCell>
                    )}
                    <TableCell sx={{ fontWeight: 700, color: esVistaGlobal ? infoRama.color : 'primary.main' }}>{row.nombre}</TableCell>
                    <TableCell><Chip label={row.ciclo} size="small" variant="outlined" sx={{ fontWeight: 700 }}/></TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <Tooltip title="Descargar PDF">
                          <IconButton sx={{ color: '#d32f2f' }} size="small" onClick={() => generarPDFPlanificacion(row.datos, esVistaGlobal ? row.ramaOrigen : ramaId)}>
                            <Download />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar del historial">
                          <IconButton color="error" size="small" onClick={() => eliminarPlanificacion(row.id, row.ramaOrigen)}>
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};