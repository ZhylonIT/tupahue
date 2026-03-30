import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, TextField, MenuItem, Grid, ToggleButtonGroup, ToggleButton,
  InputAdornment, Autocomplete, Typography, Box, Stack, Chip 
} from '@mui/material';
import { useState, useEffect } from 'react';
import { CATEGORIAS_FINANZAS } from '../../../constants/finanzas';
import { People, AttachMoney, Today, LocalOffer, CalendarMonth, Landscape } from '@mui/icons-material';

const MESES_OPCIONES = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

const FieldLabel = ({ icon, label }) => (
  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1, color: 'text.secondary' }}>
    {icon}<Typography variant="caption" sx={{ fontWeight: 800 }}>{label}</Typography>
  </Stack>
);

export const MovimientoModal = ({ open, onClose, onSave, nomina = [], eventosConfig = [] }) => {
  const initialState = {
    concepto: '', monto: '', tipo: 'egreso', categoria: '',
    eventoTipoId: '', fecha: new Date().toISOString().split('T')[0],
    scoutId: null, mesesPagos: []
  };

  const [formData, setFormData] = useState(initialState);

  useEffect(() => { if (!open) setFormData(initialState); }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!formData.concepto || !formData.monto || !formData.categoria) return;
    if (formData.categoria === 'evento' && !formData.eventoTipoId) return;
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 900 }}>Registrar Movimiento</DialogTitle>
      <DialogContent dividers sx={{ py: 3, bgcolor: '#fbfbff' }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <FieldLabel icon={<AttachMoney />} label="TIPO" />
            <ToggleButtonGroup value={formData.tipo} exclusive onChange={(e, v) => v && setFormData({...initialState, tipo: v, fecha: formData.fecha})} fullWidth>
              <ToggleButton value="ingreso">INGRESO</ToggleButton>
              <ToggleButton value="egreso">EGRESO</ToggleButton>
            </ToggleButtonGroup>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FieldLabel icon={<Today />} label="FECHA" />
            <TextField name="fecha" type="date" fullWidth value={formData.fecha} onChange={handleChange} />
          </Grid>
          <Grid item xs={12}>
            <FieldLabel icon={<LocalOffer />} label="CATEGORÍA" />
            <TextField select name="categoria" fullWidth value={formData.categoria} onChange={handleChange} label="Seleccionar...">
              {(formData.tipo === 'ingreso' ? CATEGORIAS_FINANZAS.INGRESOS : CATEGORIAS_FINANZAS.EGRESOS).map(cat => (
                <MenuItem key={cat.id} value={cat.id}>{cat.label}</MenuItem>
              ))}
            </TextField>
          </Grid>

          {formData.tipo === 'ingreso' && (
            <>
              {formData.categoria === 'evento' && (
                <Grid item xs={12}>
                  <FieldLabel icon={<Landscape />} label="¿QUÉ EVENTO ES?" />
                  <TextField select name="eventoTipoId" fullWidth value={formData.eventoTipoId} onChange={handleChange}>
                    {eventosConfig.map(ev => <MenuItem key={ev.id} value={ev.id}>{ev.nombre}</MenuItem>)}
                  </TextField>
                </Grid>
              )}
              <Grid item xs={12}>
                <FieldLabel icon={<People />} label="VINCULAR JOVEN" />
                <Autocomplete
                  options={nomina}
                  getOptionLabel={opt => `${opt.apellido}, ${opt.nombre}`}
                  onChange={(e, v) => {
                    const evNom = eventosConfig.find(ev => ev.id === formData.eventoTipoId)?.nombre || 'Evento';
                    setFormData(prev => ({ 
                      ...prev, scoutId: v ? v.id : null,
                      concepto: v ? `${prev.categoria === 'evento' ? 'Pago ' + evNom : 'Pago Cuota'} - ${v.apellido}` : prev.concepto
                    }));
                  }}
                  renderInput={params => <TextField {...params} label="Buscar..." />}
                />
              </Grid>
              {formData.categoria === 'cuota' && (
                <Grid item xs={12}>
                  <FieldLabel icon={<CalendarMonth />} label="MESES" />
                  <Autocomplete multiple options={MESES_OPCIONES} value={formData.mesesPagos} onChange={(e, v) => setFormData({...formData, mesesPagos: v})} renderTags={(v, getTagProps) => v.map((opt, i) => <Chip label={opt} {...getTagProps({ i })} size="small" />)} renderInput={params => <TextField {...params} />} />
                </Grid>
              )}
            </>
          )}
          <Grid item xs={12}><TextField name="concepto" label="Concepto" fullWidth value={formData.concepto} onChange={handleChange} /></Grid>
          <Grid item xs={12}><TextField name="monto" label="Monto" type="number" fullWidth value={formData.monto} onChange={handleChange} InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }} /></Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>CANCELAR</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={!formData.concepto || !formData.monto}>GUARDAR</Button>
      </DialogActions>
    </Dialog>
  );
};