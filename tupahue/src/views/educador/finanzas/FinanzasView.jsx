import { useState, useMemo } from 'react';
import { 
  Box, Grid, Paper, Typography, Button, Stack, 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Chip, IconButton, TextField, MenuItem,
  InputAdornment, Dialog, DialogContent, DialogActions 
} from '@mui/material';
import { 
  AddCircleOutline, 
  TrendingUp, 
  TrendingDown, 
  AccountBalanceWallet,
  DeleteOutline,
  FilterList,
  Search,
  Receipt // Icono para el recibo
} from '@mui/icons-material';

import { useFinanzas } from '../../../hooks/useFinanzas';
import { CATEGORIAS_FINANZAS } from '../../../constants/finanzas';
import { MovimientoModal } from './MovimientoModal';
import { ResumenFiltrado } from './ResumenFiltrado';
import { ReciboTemplate } from './ReciboTemplate';

const VIOLETA_SCOUT = '#5A189A';

const MESES_FILTRO = [
  { id: 'TODOS', label: 'Todos los meses' },
  { id: 0, label: 'Enero' }, { id: 1, label: 'Febrero' }, { id: 2, label: 'Marzo' },
  { id: 3, label: 'Abril' }, { id: 4, label: 'Mayo' }, { id: 5, label: 'Junio' },
  { id: 6, label: 'Julio' }, { id: 7, label: 'Agosto' }, { id: 8, label: 'Septiembre' },
  { id: 9, label: 'Octubre' }, { id: 10, label: 'Noviembre' }, { id: 11, label: 'Diciembre' }
];

export const FinanzasView = ({ scouts = [] }) => {
  const { 
    movimientos = [], 
    totalIngresos, 
    totalEgresos, 
    saldoCaja, 
    agregarMovimiento, 
    eliminarMovimiento,
    eventosConfig = []
  } = useFinanzas();

  // --- ESTADOS DE UI ---
  const [modalOpen, setModalOpen] = useState(false);
  const [reciboOpen, setReciboOpen] = useState(false);
  const [datosRecibo, setDatosRecibo] = useState(null);

  // --- ESTADOS DE FILTRO ---
  const [filtroMes, setFiltroMes] = useState('TODOS');
  const [filtroCategoria, setFiltroCategoria] = useState('TODAS');
  const [busqueda, setBusqueda] = useState('');

  // --- LÓGICA DE FILTRADO ---
  const movimientosFiltrados = useMemo(() => {
    return movimientos.filter(mov => {
      const fechaMov = new Date(mov.fecha);
      const coincideMes = filtroMes === 'TODOS' || fechaMov.getMonth() === filtroMes;
      const coincideCat = filtroCategoria === 'TODAS' || mov.categoria === filtroCategoria;
      const coincideBusqueda = mov.concepto.toLowerCase().includes(busqueda.toLowerCase());
      return coincideMes && coincideCat && coincideBusqueda;
    });
  }, [movimientos, filtroMes, filtroCategoria, busqueda]);

  const getCategoriaInfo = (id, tipo) => {
    const lista = tipo === 'ingreso' ? CATEGORIAS_FINANZAS.INGRESOS : CATEGORIAS_FINANZAS.EGRESOS;
    return lista.find(c => c.id === id) || { label: 'Otros', color: '#757575' };
  };

  // --- MANEJO DE RECIBOS ---
  const handleAbrirRecibo = (mov) => {
    const scoutEncontrado = scouts.find(s => s.id === mov.scoutId);
    const eventoEncontrado = eventosConfig.find(e => e.id === mov.eventoTipoId);
    setDatosRecibo({ movimiento: mov, scout: scoutEncontrado, evento: eventoEncontrado });
    setReciboOpen(true);
  };

  const imprimirRecibo = () => {
    window.print();
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      
      {/* CABECERA */}
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" sx={{ mb: 4 }} spacing={2}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: '#333' }}>Libro de Caja</Typography>
          <Typography variant="body1" color="text.secondary">Gestión de ingresos y egresos del grupo.</Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<AddCircleOutline />}
          onClick={() => setModalOpen(true)}
          sx={{ bgcolor: VIOLETA_SCOUT, fontWeight: 'bold', borderRadius: 2, px: 3, height: 48 }}
        >
          Nuevo Movimiento
        </Button>
      </Stack>

      {/* TOTALES GENERALES */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}><StatCard label="Saldo en Caja" value={saldoCaja} icon={<AccountBalanceWallet />} color={VIOLETA_SCOUT} /></Grid>
        <Grid item xs={12} sm={4}><StatCard label="Total Ingresos" value={totalIngresos} icon={<TrendingUp />} color="#2e7d32" /></Grid>
        <Grid item xs={12} sm={4}><StatCard label="Total Egresos" value={totalEgresos} icon={<TrendingDown />} color="#d32f2f" /></Grid>
      </Grid>

      {/* FILTROS */}
      <Paper elevation={0} sx={{ p: 2, mb: 2, borderRadius: 3, border: '1px solid #eee', bgcolor: '#f8f9fa' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={3}>
            <TextField select fullWidth size="small" label="Mes" value={filtroMes} onChange={(e) => setFiltroMes(e.target.value)}>
              {MESES_FILTRO.map(mes => <MenuItem key={mes.id} value={mes.id}>{mes.label}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField select fullWidth size="small" label="Categoría" value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)}>
              <MenuItem value="TODAS">Todas las categorías</MenuItem>
              {[...CATEGORIAS_FINANZAS.INGRESOS, ...CATEGORIAS_FINANZAS.EGRESOS].map(cat => (
                <MenuItem key={cat.id} value={cat.id}>{cat.label}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={5}>
            <TextField fullWidth size="small" placeholder="Buscar..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
              InputProps={{ startAdornment: (<InputAdornment position="start"><Search fontSize="small" /></InputAdornment>) }}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* RESUMEN DINÁMICO (CALCULADORA AUTOMÁTICA) */}
      <ResumenFiltrado movimientos={movimientosFiltrados} />

      {/* TABLA PRINCIPAL */}
      <Paper elevation={0} sx={{ borderRadius: 4, border: '1px solid #eee', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: '55vh' }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 800, bgcolor: '#f5f5f5' }}>Fecha</TableCell>
                <TableCell sx={{ fontWeight: 800, bgcolor: '#f5f5f5' }}>Concepto</TableCell>
                <TableCell sx={{ fontWeight: 800, bgcolor: '#f5f5f5' }}>Categoría</TableCell>
                <TableCell sx={{ fontWeight: 800, bgcolor: '#f5f5f5' }} align="right">Monto</TableCell>
                <TableCell sx={{ fontWeight: 800, bgcolor: '#f5f5f5' }} align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {movimientosFiltrados.length === 0 ? (
                <TableRow><TableCell colSpan={5} align="center" sx={{ py: 10 }}><Typography color="text.secondary">No se encontraron registros.</Typography></TableCell></TableRow>
              ) : (
                movimientosFiltrados.map((mov) => {
                  const cat = getCategoriaInfo(mov.categoria, mov.tipo);
                  const ev = (eventosConfig || []).find(e => e.id === mov.eventoTipoId);
                  
                  return (
                    <TableRow key={mov.id} hover>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>{mov.fecha}</TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>{mov.concepto}</Typography>
                        <Stack direction="row" spacing={1}>
                          {ev && <Typography variant="caption" sx={{ color: '#0288d1', fontWeight: 700 }}>🏔️ {ev.nombre}</Typography>}
                          {mov.mesesPagos?.length > 0 && <Typography variant="caption" sx={{ color: VIOLETA_SCOUT, fontWeight: 700 }}>📌 {mov.mesesPagos.join(', ')}</Typography>}
                        </Stack>
                      </TableCell>
                      <TableCell><Chip label={cat.label} size="small" sx={{ bgcolor: `${cat.color}15`, color: cat.color, fontWeight: 800, fontSize: '0.65rem' }} /></TableCell>
                      <TableCell align="right" sx={{ fontWeight: 900, color: mov.tipo === 'ingreso' ? '#2e7d32' : '#d32f2f' }}>
                        ${Number(mov.monto).toLocaleString('es-AR')}
                      </TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={1} justifyContent="center">
                          {mov.tipo === 'ingreso' && (
                            <IconButton color="primary" size="small" onClick={() => handleAbrirRecibo(mov)}>
                              <Receipt fontSize="small" />
                            </IconButton>
                          )}
                          <IconButton color="error" size="small" onClick={() => eliminarMovimiento(mov.id)}>
                            <DeleteOutline fontSize="small" />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* MODAL PARA EL REGISTRO (INGRESOS/EGRESOS) */}
      <MovimientoModal 
        open={modalOpen} 
        onClose={() => setModalOpen(false)} 
        onSave={agregarMovimiento} 
        nomina={scouts} 
        eventosConfig={eventosConfig || []} 
      />

      {/* MODAL PARA PREVISUALIZAR E IMPRIMIR RECIBO */}
      <Dialog open={reciboOpen} onClose={() => setReciboOpen(false)} maxWidth="md" fullWidth>
        <DialogContent sx={{ bgcolor: '#f5f5f5', p: 4 }}>
          {/* Este div id es clave para el CSS de impresión */}
          <div id="seccion-imprimible">
            <ReciboTemplate 
              movimiento={datosRecibo?.movimiento} 
              scout={datosRecibo?.scout} 
              evento={datosRecibo?.evento} 
            />
          </div>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setReciboOpen(false)} sx={{ fontWeight: 'bold' }}>Cerrar</Button>
          <Button variant="contained" startIcon={<Receipt />} onClick={imprimirRecibo} sx={{ bgcolor: VIOLETA_SCOUT, fontWeight: 'bold' }}>
            Imprimir Recibo
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

// Componente Auxiliar para las tarjetas de totales
const StatCard = ({ label, value, icon, color }) => (
  <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid #e0e0e0' }}>
    <Stack direction="row" spacing={2} alignItems="center">
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 48, height: 48, borderRadius: 2, bgcolor: `${color}15`, color: color }}>{icon}</Box>
      <Box>
        <Typography variant="overline" sx={{ fontWeight: 800, color: 'text.secondary', lineHeight: 1 }}>{label}</Typography>
        <Typography variant="h5" sx={{ fontWeight: 900 }}>${Number(value).toLocaleString('es-AR')}</Typography>
      </Box>
    </Stack>
  </Paper>
);