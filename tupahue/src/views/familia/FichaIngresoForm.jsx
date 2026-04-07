import { useState, useEffect } from 'react';
import { 
  Box, Typography, TextField, Grid, Button, Paper, 
  Stack, Dialog, DialogTitle, DialogContent, DialogActions, 
  Divider, CircularProgress, Alert 
} from '@mui/material';
import { Save, Visibility, CheckCircle } from '@mui/icons-material';
import { generarFichaIngresoPDF } from '../../services/pdfService';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../context/AuthContext';

export const FichaIngresoForm = ({ open, onClose, scout, onSave }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const fechaActual = new Date();

  const [formData, setFormData] = useState({
    localidad: 'Ituzaingó', provincia: 'Buenos Aires', partido: 'Ituzaingó',
    dia: String(fechaActual.getDate()), mes: meses[fechaActual.getMonth()], anio: String(fechaActual.getFullYear()),
    tutorNombre: '', tutorNacimiento: '', tutorNacionalidad: 'Argentina', tutorDni: '',
    tutorDomicilio: '', tutorTelefono: '', tutorVinculo: 'Padre/Madre',
    scoutNacionalidad: 'Argentina', scoutDomicilio: '',
    aclaracionTenencia: ''
  });

  useEffect(() => {
    if (open && scout) {
      const di = scout.datosIngreso || {};
      const dp = scout.datosPersonales || {};
      const dm = scout.datosMedicos || {};

      setFormData({
        localidad: di.localidad || 'Ituzaingó',
        provincia: di.provincia || 'Buenos Aires',
        partido: di.partido || 'Ituzaingó',
        dia: di.dia || String(fechaActual.getDate()),
        mes: di.mes || meses[fechaActual.getMonth()],
        anio: di.anio || String(fechaActual.getFullYear()),
        tutorNombre: di.tutorNombre || dp.tutor1Nombre || '',
        tutorNacimiento: di.tutorNacimiento || '',
        tutorNacionalidad: di.tutorNacionalidad || 'Argentina',
        tutorDni: di.tutorDni || dp.tutor1Dni || '',
        tutorDomicilio: di.tutorDomicilio || dm.domicilio || '',
        tutorTelefono: di.tutorTelefono || dm.telEmergencia1 || dp.tutor1Tel || '',
        tutorVinculo: di.tutorVinculo || dp.tutor1Vinculo || 'Padre/Madre',
        scoutNacionalidad: di.scoutNacionalidad || dp.nacionalidad || 'Argentina',
        scoutDomicilio: di.scoutDomicilio || dm.domicilio || '',
        aclaracionTenencia: di.aclaracionTenencia || ''
      });
      setSuccess(false);
    }
  }, [open, scout]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (success) setSuccess(false);
  };

  const handleGuardar = async () => {
    setLoading(true);
    try {
      const datosConFirma = { ...formData, firmaPadre: user?.firma_url };
      const pibeActualizado = { ...scout, datosIngreso: datosConFirma };

      // Generar PDF y subir al Storage
      const pdfBlob = await generarFichaIngresoPDF(pibeActualizado, true);
      const filePath = `${scout.id}/ingreso_menores/ingreso_menores.pdf`;
      
      await supabase.storage.from('documentos').upload(filePath, pdfBlob, {
        contentType: 'application/pdf', upsert: true 
      });

      await onSave(pibeActualizado);
      setSuccess(true);
    } catch (error) {
      console.error(error);
      alert("Error al guardar la inscripción.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerPDF = () => {
    const scoutTemp = { ...scout, datosIngreso: { ...formData, firmaPadre: user?.firma_url } };
    generarFichaIngresoPDF(scoutTemp, false);
  };

  if (!scout) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ bgcolor: '#2e7d32', color: 'white', fontWeight: '900', py: 2 }}>
        Ficha de Ingreso a la Asociación: {scout.nombre}
      </DialogTitle>
      
      <DialogContent sx={{ p: 4, bgcolor: '#f8f9fa' }}>
        {success && (
          <Alert severity="success" sx={{ mb: 3, borderRadius: 2, fontWeight: 800 }}>
            ¡Inscripción guardada! El documento PDF ha sido generado y vinculado al legajo.
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e0e0e0' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#2e7d32', mb: 2 }}>📍 Lugar y Fecha</Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField label="Localidad" size="small" name="localidad" value={formData.localidad} onChange={handleChange} fullWidth />
                <TextField label="Partido" size="small" name="partido" value={formData.partido} onChange={handleChange} fullWidth />
                <Stack direction="row" spacing={1}>
                  <TextField label="Día" size="small" name="dia" value={formData.dia} onChange={handleChange} sx={{ width: 70 }} />
                  <TextField label="Mes" size="small" name="mes" value={formData.mes} onChange={handleChange} sx={{ width: 120 }} />
                  <TextField label="Año" size="small" name="anio" value={formData.anio} onChange={handleChange} sx={{ width: 90 }} />
                </Stack>
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ p: 3, height: '100%', borderRadius: 3, border: '1px solid #e0e0e0' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#2e7d32', mb: 2 }}>Datos del Tutor</Typography>
              <Stack spacing={2}>
                <TextField label="Nombre Completo" size="small" name="tutorNombre" value={formData.tutorNombre} onChange={handleChange} fullWidth />
                <TextField label="DNI" size="small" name="tutorDni" value={formData.tutorDni} onChange={handleChange} fullWidth />
                <TextField label="Nacimiento" size="small" name="tutorNacimiento" value={formData.tutorNacimiento} onChange={handleChange} fullWidth />
                <TextField label="Domicilio" size="small" name="tutorDomicilio" value={formData.tutorDomicilio} onChange={handleChange} fullWidth />
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ p: 3, height: '100%', borderRadius: 3, border: '1px solid #e0e0e0' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#2e7d32', mb: 2 }}>Aclaraciones de Tenencia</Typography>
              <TextField 
                placeholder="Si corresponde, aclare situación judicial sobre la tenencia..."
                size="small" name="aclaracionTenencia" value={formData.aclaracionTenencia} 
                onChange={handleChange} multiline rows={6} fullWidth 
              />
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3, bgcolor: '#f8f9fa' }}>
        <Button onClick={onClose} sx={{ fontWeight: 800, color: 'text.secondary', mr: 'auto' }}>Cerrar</Button>
        <Button variant="outlined" onClick={handleVerPDF} startIcon={<Visibility />} color="success" sx={{ fontWeight: 800, borderRadius: 2 }}>Ver PDF</Button>
        <Button 
          variant="contained" onClick={handleGuardar} disabled={loading || success}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Save />} 
          sx={{ bgcolor: '#2e7d32', fontWeight: 900, px: 4, borderRadius: 2 }}
        >
          {loading ? 'Generando...' : 'Guardar e Inscribir'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};