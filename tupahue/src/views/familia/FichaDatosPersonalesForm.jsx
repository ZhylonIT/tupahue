import { useState, useEffect } from 'react';
import { 
  Box, Typography, TextField, Grid, Button, Paper, 
  Stack, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress, Alert 
} from '@mui/material';
import { 
  Save, AccountCircle, People, VerifiedUser, PictureAsPdf, CheckCircle 
} from '@mui/icons-material';
import { FichaDatosPersonalesTemplate } from './FichaDatosPersonalesTemplate';
import { useAuth } from '../../context/AuthContext';
// 🎯 CAMBIO DE IMPORT: Usamos el nuevo service modular
import { generarFichaPersonalesPDF } from '../../services/pdfService';
import { supabase } from '../../lib/supabaseClient';

export const FichaDatosPersonalesForm = ({ open, onClose, scout, onSave }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const defaultPersonales = {
    nacionalidad: '', escuela: '', grado: '', religion: '', 
    tutor1Nombre: '', tutor1Dni: '', tutor1Vinculo: '', tutor1Tel: '', tutor1Email: '', tutor1Ocupacion: '',
    tutor2Nombre: '', tutor2Dni: '', tutor2Vinculo: '', tutor2Tel: '', tutor2Email: '', tutor2Ocupacion: '',
    personasAutorizadas: ''
  };

  const [formData, setFormData] = useState(defaultPersonales);

  useEffect(() => {
    if (open) {
      setSuccess(false);
      const infoTutor1 = {
        tutor1Nombre: `${user?.nombre} ${user?.apellido}`,
        tutor1Dni: user?.dni || '',
        tutor1Tel: user?.telefono || '',
        tutor1Email: user?.email || '',
        tutor1Ocupacion: user?.ocupacion || '',
        tutor1Vinculo: scout?.datosPersonales?.tutor1Vinculo || 'Padre/Madre'
      };

      if (scout?.datosPersonales) {
        setFormData({ ...defaultPersonales, ...scout.datosPersonales, ...infoTutor1 });
      } else {
        setFormData({ ...defaultPersonales, ...infoTutor1 });
      }
    }
  }, [scout, open, user]);

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

      const scoutActualizado = { ...scout, datosPersonales: datosFinales };

      // 1. Generamos el Blob del PDF profesional (una sola página)
      const pdfBlob = await generarFichaPersonalesPDF(scoutActualizado, true);
      
      // 2. Subimos al Storage
      const filePath = `${scout.id}/ficha_personales/ficha_personales.pdf`;
      const { error: storageError } = await supabase.storage
        .from('documentos')
        .upload(filePath, pdfBlob, {
          contentType: 'application/pdf',
          upsert: true 
        });

      if (storageError) throw storageError;

      // 3. Guardamos los datos en la tabla
      await onSave(scoutActualizado);
      
      setSuccess(true);
    } catch (error) {
      console.error(error);
      alert("Error al procesar el legajo.");
    } finally {
      setLoading(false);
    }
  };

  if (!scout) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ bgcolor: '#005b96', color: 'white', fontWeight: '900', py: 2 }}>
        Ficha de Datos Personales: {scout.nombre} {scout.apellido}
      </DialogTitle>
      
      <DialogContent sx={{ p: 4, bgcolor: '#f8f9fa' }} className="no-print">
        {success && (
          <Alert 
            severity="success" 
            icon={<CheckCircle />}
            sx={{ mb: 3, borderRadius: 3, fontWeight: 800, border: '1px solid #4caf50' }}
          >
            ¡Formulario guardado con éxito! El PDF para el educador ha sido actualizado.
          </Alert>
        )}
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper elevation={0} sx={{ p: 3, height: '100%', borderRadius: 4, border: '1px solid #e0e0e0' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#005b96', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <AccountCircle fontSize="small" /> 1. Datos del Joven
              </Typography>
              <Stack spacing={2}>
                <TextField label="Nacionalidad" size="small" name="nacionalidad" value={formData.nacionalidad} onChange={handleChange} fullWidth />
                <TextField label="Religión" size="small" name="religion" value={formData.religion} onChange={handleChange} fullWidth />
                <TextField label="Escuela" size="small" name="escuela" value={formData.escuela} onChange={handleChange} fullWidth />
                <TextField label="Año/Grado" size="small" name="grado" value={formData.grado} onChange={handleChange} fullWidth />
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper elevation={0} sx={{ p: 3, height: '100%', borderRadius: 4, border: '1px solid #e0e0e0', bgcolor: '#f1f8ff' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#005b96', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                <VerifiedUser fontSize="small" /> 2. Responsable 1
              </Typography>
              <Stack spacing={2}>
                <TextField label="Nombre" size="small" value={formData.tutor1Nombre} disabled fullWidth />
                <TextField label="Vínculo" size="small" name="tutor1Vinculo" value={formData.tutor1Vinculo} onChange={handleChange} fullWidth />
                <TextField label="Ocupación" size="small" value={formData.tutor1Ocupacion || 'No cargada'} disabled fullWidth />
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper elevation={0} sx={{ p: 3, height: '100%', borderRadius: 4, border: '1px solid #e0e0e0' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#005b96', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <People fontSize="small" /> 3. Responsable 2
              </Typography>
              <Stack spacing={2}>
                <TextField label="Nombre" size="small" name="tutor2Nombre" value={formData.tutor2Nombre} onChange={handleChange} fullWidth />
                <TextField label="DNI" size="small" name="tutor2Dni" value={formData.tutor2Dni} onChange={handleChange} fullWidth />
                <TextField label="Ocupación" size="small" name="tutor2Ocupacion" value={formData.tutor2Ocupacion} onChange={handleChange} fullWidth />
                <TextField label="Celular" size="small" name="tutor2Tel" value={formData.tutor2Tel} onChange={handleChange} fullWidth />
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #ffccbc', bgcolor: '#fff5f2' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1, color: '#d84315' }}>Autorizaciones de retiro</Typography>
              <TextField label="Otras personas autorizadas" size="small" name="personasAutorizadas" value={formData.personasAutorizadas} onChange={handleChange} fullWidth multiline rows={2} />
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3, bgcolor: '#f8f9fa' }} className="no-print">
        <Button onClick={onClose} disabled={loading} sx={{ fontWeight: 700 }}>Cerrar</Button>
        <Button 
          variant="contained" 
          onClick={handleGuardar} 
          disabled={loading || success}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : (success ? <CheckCircle /> : <Save />)} 
          sx={{ 
            bgcolor: success ? '#4caf50' : '#005b96', 
            fontWeight: 900, px: 4, borderRadius: 2,
            '&:hover': { bgcolor: success ? '#45a049' : '#004a7a' }
          }}
        >
          {loading ? 'Guardando...' : (success ? '¡Guardado!' : 'Guardar Cambios')}
        </Button>
        <Button 
          variant="outlined" 
          onClick={() => generarFichaPersonalesPDF(scout)} 
          startIcon={<PictureAsPdf />} 
          color="error" 
          disabled={loading}
          sx={{ fontWeight: 900, borderRadius: 2 }}
        >
          Bajar PDF Local
        </Button>
      </DialogActions>
    </Dialog>
  );
};