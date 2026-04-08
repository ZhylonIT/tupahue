import { useState, useEffect } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, 
  TextField, MenuItem, IconButton, Stack, CircularProgress, Alert, 
  FormControlLabel, Checkbox, Paper, Typography 
} from '@mui/material';
import { Close, Save, Visibility } from '@mui/icons-material';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../context/AuthContext';
// 🎯 CORRECCIÓN: Importamos la función correcta
import { generarDdjjMayoresPDF } from '../../services/pdfService'; 

export const FichaDDJJMayoresForm = ({ open, onClose, scout, onSave }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [datos, setDatos] = useState({
    tipoActividad: 'CAMPAMENTO',
    lugarDestino: '',
    ubicacionDestino: '',
    fechaDesde: '',
    fechaHasta: '',
    localidad: 'Ituzaingó',
    provincia: 'Buenos Aires',
    partido: 'Ituzaingó',
    usaTransporteGrupo: true,
    transportePropio: '',
    horarioLlegada: '',
    horarioRetiro: '',
    telContacto: ''
  });

  useEffect(() => {
    if (scout?.datosEvento) setDatos(prev => ({ ...prev, ...scout.datosEvento }));
    if (open) setSuccess(false);
  }, [scout, open]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDatos(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // 🎯 NUEVO: Función para previsualizar el PDF sin guardar
  const handlePreview = async () => {
    try {
      const datosCompletos = { 
        ...datos, 
        scoutNacionalidad: scout.datosPersonales?.nacionalidad || 'Argentina',
        scoutDomicilio: scout.datosMedicos?.domicilio || '',
        firmaJoven: user?.firma_url, 
        fechaFirmaJoven: new Date().toLocaleDateString('es-AR')
      };
      const tempScout = { ...scout, datosEvento: datosCompletos };
      
      const pdfBlob = await generarDdjjMayoresPDF(tempScout, true);
      const fileURL = URL.createObjectURL(pdfBlob);
      window.open(fileURL, '_blank');
    } catch (error) {
      console.error(error);
      alert("Error al generar la vista previa.");
    }
  };

  const handleGuardar = async () => {
    setLoading(true);
    try {
      const datosCompletos = { 
        ...datos, 
        scoutNacionalidad: scout.datosPersonales?.nacionalidad || 'Argentina',
        scoutDomicilio: scout.datosMedicos?.domicilio || '',
        firmaJoven: user?.firma_url, 
        fechaFirmaJoven: new Date().toLocaleDateString('es-AR')
      };

      const hijoActualizado = { ...scout, datosEvento: datosCompletos };

      // 🎯 CORRECCIÓN: Usamos generarDdjjMayoresPDF
      const pdfBlob = await generarDdjjMayoresPDF(hijoActualizado, true);

      const filePath = `${scout.id}/ddjj_campamento_mayor/ddjj_campamento_mayor.pdf`;
      await supabase.storage.from('documentos').upload(filePath, pdfBlob, {
        contentType: 'application/pdf', upsert: true
      });

      await onSave(hijoActualizado, 'ddjj_campamento_mayor');
      setSuccess(true);
    } catch (error) {
      console.error(error);
      alert("Error al procesar la declaración jurada.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ fontWeight: 900, bgcolor: '#455a64', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        DDJJ Participación Mayores de 18
        <IconButton onClick={onClose} size="small" sx={{ color: 'white' }}><Close /></IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ mt: 2, bgcolor: '#f8f9fa' }}>
        {success && <Alert severity="success" sx={{ mb: 2, fontWeight: 700 }}>¡Declaración jurada guardada y subida!</Alert>}
        
        <Grid container spacing={3} sx={{ pt: 1 }}>
          <Grid item xs={12} md={6}>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 2, color: '#455a64' }}>Información de la Actividad</Typography>
              <Stack spacing={2}>
                <TextField select fullWidth label="Tipo" name="tipoActividad" value={datos.tipoActividad} onChange={handleChange} size="small">
                  <MenuItem value="SALIDA">SALIDA</MenuItem>
                  <MenuItem value="ACANTONAMIENTO">ACANTONAMIENTO</MenuItem>
                  <MenuItem value="CAMPAMENTO">CAMPAMENTO</MenuItem>
                </TextField>
                <TextField fullWidth label="Lugar/Predio" name="lugarDestino" value={datos.lugarDestino} onChange={handleChange} size="small" />
                <TextField fullWidth label="Ubicación" name="ubicacionDestino" value={datos.ubicacionDestino} onChange={handleChange} size="small" />
                <Stack direction="row" spacing={2}>
                  <TextField fullWidth label="Desde" name="fechaDesde" type="date" value={datos.fechaDesde} InputLabelProps={{ shrink: true }} onChange={handleChange} size="small" />
                  <TextField fullWidth label="Hasta" name="fechaHasta" type="date" value={datos.fechaHasta} InputLabelProps={{ shrink: true }} onChange={handleChange} size="small" />
                </Stack>
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, height: '100%' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 2, color: '#455a64' }}>Logística y Transporte</Typography>
              <FormControlLabel
                control={<Checkbox checked={datos.usaTransporteGrupo} onChange={handleChange} name="usaTransporteGrupo" />}
                label={<Typography variant="body2" fontWeight={700}>Uso transporte del Grupo Scout</Typography>}
              />
              
              {!datos.usaTransporteGrupo && (
                <Stack spacing={2} sx={{ mt: 2, p: 2, bgcolor: '#fff3e0', borderRadius: 2 }}>
                  <Typography variant="caption" fontWeight={900} color="#e65100">DETALLE TRANSPORTE PROPIO</Typography>
                  <TextField label="Medio (Auto, Colectivo, etc)" name="transportePropio" value={datos.transportePropio} onChange={handleChange} size="small" fullWidth />
                  <Stack direction="row" spacing={1}>
                    <TextField label="Llegada (Día/Hora)" name="horarioLlegada" value={datos.horarioLlegada} onChange={handleChange} size="small" />
                    <TextField label="Retiro (Día/Hora)" name="horarioRetiro" value={datos.horarioRetiro} onChange={handleChange} size="small" />
                  </Stack>
                  <TextField label="Celular de contacto" name="telContacto" value={datos.telContacto} onChange={handleChange} size="small" fullWidth />
                </Stack>
              )}
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3, bgcolor: '#f8f9fa', justifyContent: 'space-between' }}>
        <Button onClick={onClose} sx={{ fontWeight: 'bold', color: 'text.secondary' }}>Cerrar</Button>
        <Stack direction="row" spacing={2}>
          {/* 🎯 BOTÓN DE PREVISUALIZAR */}
          <Button 
            variant="outlined" 
            startIcon={<Visibility />} 
            onClick={handlePreview}
            disabled={!datos.lugarDestino}
            sx={{ fontWeight: 'bold', color: '#5A189A', borderColor: '#5A189A' }}
          >
            Previsualizar
          </Button>
          <Button 
            variant="contained" 
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Save />} 
            onClick={handleGuardar} 
            disabled={loading || !datos.lugarDestino || success}
            sx={{ bgcolor: '#455a64', fontWeight: 'bold', px: 4 }}
          >
            {loading ? 'Generando...' : 'Firmar y Guardar'}
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};