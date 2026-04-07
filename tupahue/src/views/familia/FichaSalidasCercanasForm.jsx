import { useState, useEffect } from 'react';
import { 
  Box, Typography, TextField, Grid, Button, Paper, 
  Stack, Dialog, DialogTitle, DialogContent, DialogActions, Divider, CircularProgress, Alert 
} from '@mui/material';
import { Save, Print, CheckCircle, PictureAsPdf, LocationOn, VerifiedUser } from '@mui/icons-material';
import { FichaSalidasCercanasTemplate } from './FichaSalidasCercanasTemplate';
import { useAuth } from '../../context/AuthContext';
// 🎯 CORRECCIÓN: Ahora importa desde el nuevo orquestador modular
import { generarSalidasCercanasPDF } from '../../services/pdfService'; 
import { supabase } from '../../lib/supabaseClient';

export const FichaSalidasCercanasForm = ({ open, onClose, scout, onSave }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const fechaActual = new Date();

  const [formData, setFormData] = useState({
    localidad: 'Ituzaingó', provincia: 'Buenos Aires', partido: 'Ituzaingó',
    dia: String(fechaActual.getDate()).padStart(2, '0'),
    mes: String(fechaActual.getMonth() + 1).padStart(2, '0'),
    anio: String(fechaActual.getFullYear()),
    tutorNombre: '', tutorDni: '', tutorNacionalidad: 'Argentina', tutorNacimiento: '',
    tutorDomicilio: '', tutorTelefono: '', tutorVinculo: 'Padre/Madre',
    scoutNacionalidad: 'Argentina', scoutDomicilio: '',
    rangoDistancia: '5 km'
  });

  useEffect(() => {
    if (open && scout) {
      setSuccess(false);
      const ds = scout.datosSalidas || {};
      const dp = scout.datosPersonales || {};
      const dm = scout.datosMedicos || {};

      setFormData({
        localidad: ds.localidad || 'Ituzaingó',
        provincia: ds.provincia || 'Buenos Aires',
        partido: ds.partido || 'Ituzaingó',
        dia: ds.dia || String(fechaActual.getDate()).padStart(2, '0'),
        mes: ds.mes || String(fechaActual.getMonth() + 1).padStart(2, '0'),
        anio: ds.anio || String(fechaActual.getFullYear()),
        
        tutorNombre: `${user?.nombre} ${user?.apellido}`,
        tutorDni: user?.dni || '',
        tutorNacionalidad: ds.tutorNacionalidad || 'Argentina',
        tutorNacimiento: user?.fecha_nacimiento || '',
        tutorDomicilio: user?.direccion || dm.domicilio || '',
        tutorTelefono: user?.telefono || dp.tutor1Tel || '',
        tutorVinculo: ds.tutorVinculo || dp.tutor1Vinculo || 'Padre/Madre',

        scoutNacionalidad: dp.nacionalidad || ds.scoutNacionalidad || 'Argentina',
        scoutDomicilio: dm.domicilio || ds.scoutDomicilio || '',
        rangoDistancia: ds.rangoDistancia || '5 km'
      });
    }
  }, [open, scout, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (success) setSuccess(false);
  };

  const handleGuardar = async () => {
    setLoading(true);
    try {
      const datosFinales = {
        ...formData,
        firmaPadre: user?.firma_url,
        aclaracionPadre: `${user?.nombre} ${user?.apellido}`,
        dniPadre: user?.dni,
        fechaFirmaPadre: new Date().toLocaleDateString('es-AR')
      };

      const scoutActualizado = { ...scout, datosSalidas: datosFinales };

      const pdfBlob = await generarSalidasCercanasPDF(scoutActualizado, true);
      
      const filePath = `${scout.id}/salidas_cercanas/salidas_cercanas.pdf`;
      await supabase.storage.from('documentos').upload(filePath, pdfBlob, {
        contentType: 'application/pdf',
        upsert: true 
      });

      await onSave(scoutActualizado);
      setSuccess(true);
    } catch (error) {
      console.error(error);
      alert("Error al procesar la autorización.");
    } finally {
      setLoading(false);
    }
  };

  if (!scout) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ bgcolor: '#00838f', color: 'white', fontWeight: '900', py: 2 }}>
        Autorización de Salidas Cercanas: {scout.nombre}
      </DialogTitle>
      
      <DialogContent sx={{ p: 4, bgcolor: '#f8f9fa' }} className="no-print">
        {success && (
          <Alert severity="success" icon={<CheckCircle />} sx={{ mb: 3, borderRadius: 3, fontWeight: 800 }}>
            ¡Autorización guardada y PDF actualizado para los educadores!
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e0e0e0' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#00838f', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOn fontSize="small" /> 1. Lugar y Fecha del Documento
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField label="Localidad" size="small" name="localidad" value={formData.localidad} onChange={handleChange} fullWidth />
                <Stack direction="row" spacing={1}>
                  <TextField label="Día" size="small" name="dia" value={formData.dia} onChange={handleChange} sx={{ width: '70px' }} />
                  <TextField label="Mes" size="small" name="mes" value={formData.mes} onChange={handleChange} sx={{ width: '70px' }} />
                  <TextField label="Año" size="small" name="anio" value={formData.anio} onChange={handleChange} sx={{ width: '90px' }} />
                </Stack>
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ p: 3, height: '100%', borderRadius: 3, border: '1px solid #e0e0e0', bgcolor: '#e0f2f1' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#00838f', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                <VerifiedUser fontSize="small" /> 2. Adulto Responsable (Tú)
              </Typography>
              <Typography variant="caption" sx={{ display: 'block', mb: 2 }}>Datos sincronizados con tu perfil.</Typography>
              <Stack spacing={2}>
                <TextField label="Nombre y Apellido" size="small" value={formData.tutorNombre} disabled fullWidth />
                <TextField label="Vínculo" size="small" name="tutorVinculo" value={formData.tutorVinculo} onChange={handleChange} fullWidth />
                <TextField label="DNI" size="small" value={formData.tutorDni} disabled fullWidth />
                <TextField label="Domicilio" size="small" value={formData.tutorDomicilio} disabled fullWidth />
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ p: 3, height: '100%', borderRadius: 3, border: '1px solid #e0e0e0' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#00838f', mb: 2 }}>3. Alcance de la Autorización</Typography>
              <Stack spacing={2}>
                <TextField label="Rango de distancia (Ej: 5 km)" size="small" name="rangoDistancia" value={formData.rangoDistancia} onChange={handleChange} fullWidth sx={{ bgcolor: 'white' }} />
                <Typography variant="caption" color="textSecondary">
                  Permite al educador llevar al joven a plazas o actividades locales sin pernocte.
                </Typography>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3, bgcolor: '#f8f9fa' }} className="no-print">
        <Button onClick={onClose} disabled={loading} sx={{ fontWeight: 800 }}>Cerrar</Button>
        <Button 
          variant="contained" 
          onClick={handleGuardar} 
          disabled={loading || success}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : (success ? <CheckCircle /> : <Save />)} 
          sx={{ bgcolor: success ? '#4caf50' : '#00838f', fontWeight: 900, px: 4, borderRadius: 2 }}
        >
          {loading ? 'Guardando...' : (success ? '¡Guardado!' : 'Guardar y Generar PDF')}
        </Button>
        <Button variant="outlined" onClick={() => generarSalidasCercanasPDF(scout)} startIcon={<PictureAsPdf />} color="error" disabled={loading} sx={{ fontWeight: 800, borderRadius: 2 }}>
          Ver PDF
        </Button>
      </DialogActions>
    </Dialog>
  );
};