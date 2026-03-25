import { 
  Box, Typography, Grid, Snackbar, Alert, Stack, 
  ToggleButtonGroup, ToggleButton, TextField, InputAdornment,
  Paper, LinearProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip
} from '@mui/material';
import { ViewModule, ViewList, Search, NorthEast, Assessment } from '@mui/icons-material';

import { RAMAS } from '../../../constants/ramas';
import { SENDEROS, AREAS_ROVERS, OBJETIVOS_POR_RAMA } from '../../../constants/progresion'; 
import { useProgresion } from './UseProgresion'; // IMPORTAMOS EL HOOK

// Sub-componentes locales
import { ScoutProgressCard } from './ScoutProgressCard';
import { ScoutProgressTable } from './ScoutProgressTable';
import { ProgresionModal } from './ProgresionModal';

export const ProgresionView = ({ scouts, onUpdateEtapa, onPaseDeRama, ramaId = 'CAMINANTES', setRamaActiva }) => {
  
  const {
    esVistaGlobal, idBusqueda, CONFIG_RAMA, esRover,
    viewMode, setViewMode,
    filterText, setFilterText,
    scoutSeleccionado, setScoutSeleccionado,
    openSnackbar, setOpenSnackbar,
    scoutsFiltrados, proximosPases,
    tempEtapa, setTempEtapa,
    tempObjetivos, handleToggleObjetivo,
    handleConfirmarCambios, handlePase
  } = useProgresion(scouts, ramaId, onUpdateEtapa, onPaseDeRama);

  // --- RENDERIZADO VISTA GLOBAL (AdP) ---
  if (esVistaGlobal) {
    return (
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 1, md: 3 }, mb: 8 }}>
        <Typography variant="h4" sx={{ fontWeight: 900, color: '#1a237e', mb: 1 }}>Auditoría de Progresión Global</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>Visión panorámica del avance educativo • Grupo Scout Tupahue</Typography>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          {Object.values(RAMAS).map(ramaInfo => {
            const scoutsRama = scouts.filter(s => s.rama?.toUpperCase() === ramaInfo.id);
            return (
              // Corregido a formato Grid v2
              <Grid size={{ xs: 12, md: 6 }} key={ramaInfo.id}>
                <Paper 
                  onClick={() => setRamaActiva && setRamaActiva(ramaInfo.id)}
                  sx={{ 
                    p: 3, borderRadius: 4, borderTop: `6px solid ${ramaInfo.color}`, cursor: 'pointer',
                    transition: '0.2s', '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 }
                  }}>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 900, color: ramaInfo.color }}>{ramaInfo.nombre.toUpperCase()}</Typography>
                    <Chip label={`${scoutsRama.length} jóvenes`} size="small" sx={{ fontWeight: 700 }} />
                  </Stack>
                  <Stack spacing={2}>
                    {ramaInfo.etapas.map(etapa => {
                      const count = scoutsRama.filter(s => s.etapa === etapa.id || (!s.etapa && etapa.id === ramaInfo.etapas[0].id)).length;
                      const porcentaje = scoutsRama.length > 0 ? (count / scoutsRama.length) * 100 : 0;
                      return (
                        <Box key={etapa.id}>
                          <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                            <Typography variant="body2" sx={{ fontWeight: 700 }}>{etapa.nombre}</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 800 }}>{count}</Typography>
                          </Stack>
                          <LinearProgress variant="determinate" value={porcentaje} sx={{ height: 8, borderRadius: 4, '& .MuiLinearProgress-bar': { bgcolor: ramaInfo.color } }} />
                        </Box>
                      );
                    })}
                  </Stack>
                </Paper>
              </Grid>
            );
          })}
        </Grid>

        <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid #eee' }}>
          <Stack direction="row" gap={1.5} sx={{ mb: 3 }}><NorthEast color="error" /><Typography variant="h6" sx={{ fontWeight: 800 }}>CANDIDATOS A PASE DE RAMA</Typography></Stack>
          {proximosPases.length > 0 ? (
            <TableContainer>
              <Table size="small">
                <TableHead><TableRow sx={{ bgcolor: '#fafafa' }}><TableCell>PROTAGONISTA</TableCell><TableCell>RAMA</TableCell><TableCell>ETAPA</TableCell></TableRow></TableHead>
                <TableBody>
                  {proximosPases.map(scout => (
                    <TableRow key={scout.id} hover>
                      <TableCell sx={{ fontWeight: 700 }}>{scout.nombre} {scout.apellido}</TableCell>
                      <TableCell><Chip label={scout.rama} size="small" /></TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>{scout.etapa?.toUpperCase()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body2" color="text.secondary" textAlign="center" py={2}>No hay pases inminentes.</Typography>
          )}
        </Paper>
      </Box>
    );
  }

  // --- RENDERIZADO NORMAL (Educador de Rama) ---
  return (
    <Box>
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="center" spacing={2} sx={{ mb: 4 }}>
        <Box><Typography variant="h5" sx={{ fontWeight: 900 }}>Progresión: {CONFIG_RAMA.nombre}</Typography></Box>
        <Stack direction="row" spacing={2}>
          <TextField 
            size="small" placeholder="Buscar..." value={filterText} onChange={(e) => setFilterText(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment>, sx: { borderRadius: 3, bgcolor: 'white' } }}
          />
          <ToggleButtonGroup value={viewMode} exclusive onChange={(e, next) => next && setViewMode(next)} size="small">
            <ToggleButton value="cards"><ViewModule /></ToggleButton>
            <ToggleButton value="table"><ViewList /></ToggleButton>
          </ToggleButtonGroup>
        </Stack>
      </Stack>

      {viewMode === 'cards' ? (
        <Grid container spacing={3}>
          {scoutsFiltrados.map(scout => (
            <ScoutProgressCard 
              key={scout.id} 
              scout={scout} 
              configRama={CONFIG_RAMA} 
              etapas={CONFIG_RAMA.etapas} // <-- SOLUCIÓN 1
              onClick={setScoutSeleccionado} 
            />
          ))}
        </Grid>
      ) : (
        <ScoutProgressTable 
          scouts={scoutsFiltrados} 
          etapas={CONFIG_RAMA.etapas} 
          onEvaluar={setScoutSeleccionado} 
        />
      )}

      <ProgresionModal 
        open={!!scoutSeleccionado} scout={scoutSeleccionado} onClose={() => setScoutSeleccionado(null)}
        configRama={CONFIG_RAMA} 
        etapas={CONFIG_RAMA.etapas} // <-- SOLUCIÓN 2
        categorias={esRover ? AREAS_ROVERS : SENDEROS}
        objetivosRama={OBJETIVOS_POR_RAMA[idBusqueda] || {}}
        tempEtapa={tempEtapa} setTempEtapa={setTempEtapa} tempObjetivos={tempObjetivos}
        onToggleObjetivo={handleToggleObjetivo} onConfirmar={handleConfirmarCambios} onPase={handlePase}
      />

      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success" sx={{ borderRadius: 2, fontWeight: 600 }}>¡Progresión guardada con éxito!</Alert>
      </Snackbar>
    </Box>
  );
};