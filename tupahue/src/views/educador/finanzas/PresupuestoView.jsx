import { useState, useMemo, useEffect } from 'react';
import { 
  Box, Typography, Grid, Paper, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, TextField, Button, Stack, Divider, IconButton 
} from '@mui/material';
import { 
  AccountBalance, Edit, Add, DeleteOutline, CheckCircle, Download 
} from '@mui/icons-material';
import { CATEGORIAS_FINANZAS } from '../../../constants/finanzas';
import { useFinanzas } from '../../../hooks/useFinanzas';

const VIOLETA_SCOUT = '#5A189A';

const INITIAL_STATE = {
  secciones: [
    { id: 1, titulo: "Gastos Cocina, Higiene y Seguridad", items: [] },
    { id: 2, titulo: "Gastos Materiales Rama / Educadores", items: [] },
    { id: 3, titulo: "Presupuesto Participativo", items: [] }
  ],
  config: { scouts: 40, meses: 9 }
};

export const PresupuestoView = () => {
  const { movimientos } = useFinanzas();
  const [editando, setEditando] = useState(false);

  // --- ESTADO CON VALIDACIÓN ---
  const [prevision, setPrevision] = useState(() => {
    try {
      const save = localStorage.getItem('tupahue_prevision_2025');
      if (!save) return INITIAL_STATE;
      const parsed = JSON.parse(save);
      if (!parsed.secciones || !Array.isArray(parsed.secciones)) return INITIAL_STATE;
      return parsed;
    } catch (e) {
      return INITIAL_STATE;
    }
  });

  useEffect(() => {
    localStorage.setItem('tupahue_prevision_2025', JSON.stringify(prevision));
  }, [prevision]);

  // --- FUNCIONES DE EDICIÓN ---
  const agregarItem = (seccionId) => {
    setPrevision(prev => ({
      ...prev,
      secciones: prev.secciones.map(sec => 
        sec.id === seccionId 
          ? { ...sec, items: [...sec.items, { id: Date.now(), nombre: '', catVinculada: '', montoPlan: 0 }] }
          : sec
      )
    }));
  };

  const eliminarItem = (seccionId, itemId) => {
    setPrevision(prev => ({
      ...prev,
      secciones: prev.secciones.map(sec => 
        sec.id === seccionId 
          ? { ...sec, items: sec.items.filter(i => i.id !== itemId) }
          : sec
      )
    }));
  };

  const actualizarItem = (seccionId, itemId, campo, valor) => {
    setPrevision(prev => ({
      ...prev,
      secciones: prev.secciones.map(sec => 
        sec.id === seccionId 
          ? { ...sec, items: sec.items.map(i => i.id === itemId ? { ...i, [campo]: valor } : i) }
          : sec
      )
    }));
  };

  // --- CÁLCULOS DINÁMICOS ---
  const resumen = useMemo(() => {
    let totalPlan = 0;
    let totalReal = 0;

    const seccionesProcesadas = (prevision.secciones || []).map(sec => {
      const itemsProcesados = (sec.items || []).map(item => {
        const ejecutado = movimientos
          .filter(m => m.tipo === 'egreso' && m.categoria === item.catVinculada)
          .reduce((acc, m) => acc + Number(m.monto), 0);
        
        totalPlan += Number(item.montoPlan || 0);
        totalReal += ejecutado;

        return { ...item, ejecutado };
      });
      return { ...sec, items: itemsProcesados };
    });

    const cuotaAnual = totalPlan / (prevision.config?.scouts || 1);
    const cuotaMensual = cuotaAnual / (prevision.config?.meses || 1);

    return { seccionesProcesadas, totalPlan, totalReal, cuotaMensual };
  }, [movimientos, prevision]);

  // --- 👇 FUNCIÓN DE EXPORTACIÓN RECUPERADA ---
  const exportarExcel = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "SECCION;ITEM;PREVISION;EJECUTADO;DESVIO\n";
    
    resumen.seccionesProcesadas.forEach(sec => {
      sec.items.forEach(item => {
        const desvio = Number(item.montoPlan) - item.ejecutado;
        csvContent += `${sec.titulo};${item.nombre || 'Sin nombre'};${item.montoPlan};${item.ejecutado};${desvio}\n`;
      });
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Presupuesto_Tupahue_2025.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900 }}>Presupuesto y balance</Typography>
          <Typography variant="body1" color="text.secondary">Armado de presupuesto y balance automatico.</Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <Button variant="outlined" startIcon={<Download />} onClick={exportarExcel} disabled={editando}>
            Exportar Excel
          </Button>
          {!editando ? (
            <Button variant="contained" startIcon={<Edit />} onClick={() => setEditando(true)} sx={{ bgcolor: VIOLETA_SCOUT }}>
              Modificar Presupuesto
            </Button>
          ) : (
            <Button variant="contained" color="success" startIcon={<CheckCircle />} onClick={() => setEditando(false)}>
              Guardar Cambios
            </Button>
          )}
        </Stack>
      </Stack>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Stack spacing={4}>
            {resumen.seccionesProcesadas.map(sec => (
              <Paper key={sec.id} elevation={0} sx={{ borderRadius: 3, border: '1px solid #eee', overflow: 'hidden' }}>
                <Box sx={{ p: 2, bgcolor: '#f8f9fa', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 900 }}>{sec.titulo}</Typography>
                  {editando && (
                    <Button size="small" startIcon={<Add />} onClick={() => agregarItem(sec.id)}>Agregar Item</Button>
                  )}
                </Box>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 800 }}>Descripción / Material</TableCell>
                        <TableCell sx={{ fontWeight: 800 }}>Cat. Caja</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 800 }}>Previsión ($)</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 800 }}>Ejecutado ($)</TableCell>
                        {editando && <TableCell align="center"></TableCell>}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {sec.items.map(item => (
                        <TableRow key={item.id} hover>
                          <TableCell>
                            {editando ? (
                              <TextField variant="standard" fullWidth value={item.nombre} onChange={(e) => actualizarItem(sec.id, item.id, 'nombre', e.target.value)} />
                            ) : (
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>{item.nombre || 'Sin nombre'}</Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            {editando ? (
                              <TextField select variant="standard" fullWidth value={item.catVinculada} onChange={(e) => actualizarItem(sec.id, item.id, 'catVinculada', e.target.value)} SelectProps={{ native: true }}>
                                <option value="">(Sin vincular)</option>
                                {CATEGORIAS_FINANZAS.EGRESOS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                              </TextField>
                            ) : (
                              <Typography variant="caption" color="text.secondary">
                                {CATEGORIAS_FINANZAS.EGRESOS.find(c => c.id === item.catVinculada)?.label || '-'}
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell align="right">
                            {editando ? (
                              <TextField type="number" variant="standard" sx={{ width: 80 }} value={item.montoPlan} onChange={(e) => actualizarItem(sec.id, item.id, 'montoPlan', e.target.value)} />
                            ) : (
                              <Typography variant="body2" sx={{ fontWeight: 700 }}>${Number(item.montoPlan).toLocaleString()}</Typography>
                            )}
                          </TableCell>
                          <TableCell align="right" sx={{ fontWeight: 900, color: item.ejecutado > item.montoPlan ? '#d32f2f' : '#2e7d32' }}>
                            ${item.ejecutado.toLocaleString()}
                          </TableCell>
                          {editando && (
                            <TableCell align="center">
                              <IconButton size="small" color="error" onClick={() => eliminarItem(sec.id, item.id)}><DeleteOutline fontSize="small" /></IconButton>
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            ))}
          </Stack>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: `2px solid ${VIOLETA_SCOUT}`, position: 'sticky', top: 20 }}>
            <Typography variant="h6" sx={{ fontWeight: 900, mb: 3 }}>Análisis de Cuota</Typography>
            <Stack spacing={3}>
              <Box>
                <Typography variant="overline" color="text.secondary">Gasto Total Previsto</Typography>
                <Typography variant="h5" sx={{ fontWeight: 900 }}>${resumen.totalPlan.toLocaleString()}</Typography>
              </Box>
              <Divider />
              <Stack direction="row" spacing={2}>
                <TextField label="Protagonistas" type="number" size="small" value={prevision.config.scouts} onChange={(e) => setPrevision({...prevision, config: {...prevision.config, scouts: Number(e.target.value)}})} />
                <TextField label="Meses" type="number" size="small" value={prevision.config.meses} onChange={(e) => setPrevision({...prevision, config: {...prevision.config, meses: Number(e.target.value)}})} />
              </Stack>
              <Box sx={{ bgcolor: '#fff5f5', p: 2, borderRadius: 2, border: '1px solid #feb2b2', textAlign: 'center' }}>
                <Typography variant="overline" sx={{ fontWeight: 900, color: '#c53030' }}>CUOTA MENSUAL SUGERIDA</Typography>
                <Typography variant="h4" sx={{ fontWeight: 900, color: '#c53030' }}>
                  ${Math.round(resumen.cuotaMensual).toLocaleString()}
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};