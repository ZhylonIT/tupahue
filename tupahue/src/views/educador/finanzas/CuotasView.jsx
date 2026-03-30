import { useState, useMemo } from 'react';
import { 
  Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Typography, Box, Chip, Tooltip, Stack, Tabs, Tab, TextField, MenuItem, 
  IconButton, Button, Dialog, DialogTitle, DialogContent, DialogActions, Divider
} from '@mui/material';
import { 
  CheckCircle, RadioButtonUnchecked, CreditCard, Landscape, 
  Settings, Add, DeleteOutline, FilterList 
} from '@mui/icons-material';
import { useFinanzas } from '../../../hooks/useFinanzas';
import { RAMAS } from '../../../constants/ramas'; // Asegúrate de que la ruta sea correcta

const VIOLETA_SCOUT = '#5A189A';
const MESES_MAP = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
const MESES = MESES_MAP.map((m, i) => ({ id: i, label: m.slice(0,3) }));

export const CuotasView = ({ nomina = [] }) => {
  const { movimientos, eventosConfig = [], agregarEventoConfig, eliminarEventoConfig } = useFinanzas();
  
  // --- ESTADOS ---
  const [tabActual, setTabActual] = useState(0);
  const [ramaFiltrada, setRamaFiltrada] = useState('TODAS');
  const [eventoSeleccionado, setEventoSeleccionado] = useState('');
  const [configOpen, setConfigOpen] = useState(false);
  const [nuevoEv, setNuevoEv] = useState({ nombre: '', costo: '' });

  // --- LÓGICA DE FILTRADO ---
  const nominaFiltrada = useMemo(() => {
    return nomina.filter(s => {
      if (ramaFiltrada === 'TODAS') return true;
      return s.rama === ramaFiltrada;
    });
  }, [nomina, ramaFiltrada]);

  // --- MANEJADORES ---
  const handleGuardarEvento = () => {
    if (!nuevoEv.nombre.trim() || !nuevoEv.costo) return;
    agregarEventoConfig({ ...nuevoEv, id: Date.now().toString() });
    setNuevoEv({ nombre: '', costo: '' });
  };

  const obtenerEstadoCuota = (scoutId, mesInd) => {
    const nomMes = MESES_MAP[mesInd];
    const pagos = movimientos.filter(m => 
      m.scoutId === scoutId && 
      m.categoria === 'cuota' && 
      (m.mesesPagos?.includes(nomMes) || new Date(m.fecha).getMonth() === mesInd)
    );
    
    if (pagos.length > 0) {
      const total = pagos.reduce((acc, m) => acc + (Number(m.monto) / (m.mesesPagos?.length || 1)), 0);
      return { pagado: true, monto: Math.round(total) };
    }
    return { pagado: false };
  };

  const obtenerEstadoCampamento = (scoutId) => {
    const ev = eventosConfig.find(e => e.id === eventoSeleccionado);
    if (!ev) return { estado: 'SIN_SELECCION', monto: 0, falta: 0 };
    
    const pagos = movimientos.filter(m => 
      m.scoutId === scoutId && 
      m.categoria === 'evento' && 
      m.eventoTipoId === ev.id
    );
    
    const total = pagos.reduce((acc, m) => acc + Number(m.monto), 0);
    const costo = Number(ev.costo);
    
    if (total <= 0) return { estado: 'SIN_PAGOS', monto: 0, falta: costo };
    return { 
      estado: total >= costo ? 'PAGO_TOTAL' : 'PAGO_PARCIAL', 
      monto: total, 
      falta: costo > total ? costo - total : 0 
    };
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Typography variant="h4" sx={{ fontWeight: 900, mb: 1 }}>Control de Ingresos</Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>Seguimiento detallado de cuotas y eventos especiales.</Typography>

      {/* --- BARRA DE FILTROS Y TABS --- */}
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Tabs 
          value={tabActual} 
          onChange={(e, v) => setTabActual(v)}
          sx={{ 
            '& .MuiTabs-indicator': { bgcolor: VIOLETA_SCOUT },
            '& .Mui-selected': { color: VIOLETA_SCOUT, fontWeight: 900 }
          }}
        >
          <Tab icon={<CreditCard />} label="Cuotas Mensuales" iconPosition="start" />
          <Tab icon={<Landscape />} label="Campamentos / Eventos" iconPosition="start" />
        </Tabs>

        <TextField
          select
          size="small"
          label="Filtrar por Rama"
          value={ramaFiltrada}
          onChange={(e) => setRamaFiltrada(e.target.value)}
          sx={{ minWidth: 200 }}
          InputProps={{ startAdornment: <FilterList sx={{ mr: 1, color: 'text.secondary' }} /> }}
        >
          <MenuItem value="TODAS">Todas las Ramas</MenuItem>
          {Object.keys(RAMAS).map(r => (
            <MenuItem key={r} value={r}>{RAMAS[r].nombre}</MenuItem>
          ))}
        </TextField>
      </Stack>

      {/* --- VISTA DE CUOTAS --- */}
      {tabActual === 0 && (
        <TableContainer component={Paper} sx={{ borderRadius: 4, border: '1px solid #eee', boxShadow: 'none' }}>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 900, bgcolor: '#f8f9fa' }}>Joven</TableCell>
                <TableCell sx={{ fontWeight: 900, bgcolor: '#f8f9fa' }}>Rama</TableCell>
                {MESES.map(m => (
                  <TableCell key={m.id} align="center" sx={{ fontWeight: 900, bgcolor: '#f8f9fa' }}>{m.label}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {nominaFiltrada.map(s => (
                <TableRow key={s.id} hover>
                  <TableCell sx={{ fontWeight: 700 }}>{s.apellido}, {s.nombre}</TableCell>
                  <TableCell>
                    <Chip 
                      label={s.rama} 
                      size="small" 
                      sx={{ 
                        fontSize: '10px', fontWeight: 900, 
                        bgcolor: RAMAS[s.rama?.toUpperCase()]?.color + '20',
                        color: RAMAS[s.rama?.toUpperCase()]?.color 
                      }} 
                    />
                  </TableCell>
                  {MESES.map(m => {
                    const est = obtenerEstadoCuota(s.id, m.id);
                    return (
                      <TableCell key={m.id} align="center">
                        {est.pagado ? (
                          <Tooltip title={`Pagado: $${est.monto}`} arrow>
                            <CheckCircle sx={{ color: '#2e7d32' }} />
                          </Tooltip>
                        ) : (
                          <RadioButtonUnchecked sx={{ color: '#ddd' }} />
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* --- VISTA DE CAMPAMENTOS --- */}
      {tabActual === 1 && (
        <Box>
          <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
            <TextField 
              select 
              size="small" 
              label="Seleccionar Evento" 
              value={eventoSeleccionado} 
              onChange={e => setEventoSeleccionado(e.target.value)} 
              sx={{ minWidth: 250 }}
            >
              {eventosConfig.length === 0 && <MenuItem disabled>No hay eventos configurados</MenuItem>}
              {eventosConfig.map(ev => <MenuItem key={ev.id} value={ev.id}>{ev.nombre} (${ev.costo})</MenuItem>)}
            </TextField>
            <Button 
              startIcon={<Settings />} 
              variant="outlined" 
              onClick={() => setConfigOpen(true)}
              sx={{ borderRadius: 2 }}
            >
              Configurar Precios
            </Button>
          </Stack>

          <TableContainer component={Paper} sx={{ borderRadius: 4, border: '1px solid #eee', boxShadow: 'none' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f8f9fa' }}>
                  <TableCell sx={{ fontWeight: 900 }}>Joven</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 900 }}>Estado de Pago</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 900 }}>Monto Abonado</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 900 }}>Saldo Restante</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {nominaFiltrada.map(s => {
                  const res = obtenerEstadoCampamento(s.id);
                  return (
                    <TableRow key={s.id} hover>
                      <TableCell sx={{ fontWeight: 700 }}>{s.apellido}, {s.nombre}</TableCell>
                      <TableCell align="center">
                        {res.estado === 'PAGO_TOTAL' ? (
                          <Chip label="SALDADO" color="success" size="small" sx={{ fontWeight: 800 }} />
                        ) : res.estado === 'PAGO_PARCIAL' ? (
                          <Chip label="ENTREGA" color="warning" size="small" sx={{ fontWeight: 800 }} />
                        ) : (
                          <Typography variant="caption" color="text.disabled">Sin registros</Typography>
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" sx={{ fontWeight: 800 }}>${res.monto.toLocaleString()}</Typography>
                      </TableCell>
                      <TableCell align="right">
                        {res.falta > 0 ? (
                          <Typography variant="body2" sx={{ fontWeight: 800, color: '#d32f2f' }}>
                            -${res.falta.toLocaleString()}
                          </Typography>
                        ) : (
                          <CheckCircle sx={{ color: '#2e7d32', fontSize: 18 }} />
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* --- DIALOGO DE CONFIGURACIÓN --- */}
      <Dialog open={configOpen} onClose={() => setConfigOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 900, bgcolor: VIOLETA_SCOUT, color: 'white' }}>Gestión de Precios</DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Stack spacing={2} sx={{ mb: 3, pt: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>Crear nuevo evento:</Typography>
            <TextField 
              label="Nombre (Ej: Campa de Verano)" 
              fullWidth 
              size="small" 
              value={nuevoEv.nombre} 
              onChange={e => setNuevoEv({...nuevoEv, nombre: e.target.value})} 
            />
            <TextField 
              label="Costo Total" 
              type="number" 
              fullWidth 
              size="small" 
              value={nuevoEv.costo} 
              onChange={e => setNuevoEv({...nuevoEv, costo: e.target.value})} 
            />
            <Button 
              variant="contained" 
              fullWidth 
              onClick={handleGuardarEvento} 
              startIcon={<Add />}
              sx={{ bgcolor: VIOLETA_SCOUT }}
            >
              Agregar Evento
            </Button>
          </Stack>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 800 }}>Eventos Activos:</Typography>
          <Table size="small">
            <TableBody>
              {eventosConfig.map(ev => (
                <TableRow key={ev.id}>
                  <TableCell sx={{ fontWeight: 600 }}>{ev.nombre}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 800 }}>${ev.costo}</TableCell>
                  <TableCell align="right">
                    <IconButton color="error" size="small" onClick={() => eliminarEventoConfig(ev.id)}>
                      <DeleteOutline fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfigOpen(false)} sx={{ fontWeight: 800 }}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};