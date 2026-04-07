import { useState, useEffect } from 'react';
import { 
  Box, Typography, TextField, Stack, Button, Paper, 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  CircularProgress, Alert 
} from '@mui/material';
import { Visibility, Save, CheckCircle } from '@mui/icons-material';
import { generarUsoImagenPDF } from '../../services/pdfService';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../context/AuthContext';

export const FichaUsoImagenForm = ({ open, onClose, scout, onSave }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    anio: String(new Date().getFullYear()),
    tutorNombre: '',
    tutorDni: '',
    tutorDomicilio: '',
  });

  useEffect(() => {
    if (open && scout) {
      const di = scout.datosImagen || {};
      const dp = scout.datosPersonales || {};
      const dm = scout.datosMedicos || {};
      const ds = scout.datosSalidas || {};

      setFormData({
        anio: di.anio || String(new Date().getFullYear()),
        tutorNombre: di.tutorNombre || dp.tutor1Nombre || ds.tutorNombre || '',
        tutorDni: di.tutorDni || dp.tutor1Dni || ds.tutorDni || '',
        tutorDomicilio: di.tutorDomicilio || dm.domicilio || '',
      });
      setSuccess(false); // Reiniciamos el estado de éxito al abrir
    }
  }, [open, scout]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (success) setSuccess(false);
  };

  const handleGuardar = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);

    try {
      // 1. Inyectamos la firma digital del padre
      const datosConFirma = {
        ...formData,
        firmaPadre: user?.firma_url 
      };

      const pibeActualizado = { ...scout, datosImagen: datosConFirma };

      // 2. Generamos el PDF Vectorial en formato Blob (true = returnBlob)
      const pdfBlob = await generarUsoImagenPDF(pibeActualizado, true);
      
      // 3. Subimos el archivo al Storage de Supabase
      const filePath = `${scout.id}/uso_imagen/uso_imagen.pdf`;
      await supabase.storage.from('documentos').upload(filePath, pdfBlob, {
        contentType: 'application/pdf', 
        upsert: true 
      });

      // 4. Actualizamos la base de datos y notificamos a la vista principal
      await onSave(pibeActualizado);
      setSuccess(true); 
    } catch (error) {
      console.error("Error al guardar Autorización de Imagen:", error);
      alert("Error al guardar la autorización.");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    // Genera el PDF para visualizar/descargar inyectando la firma en tiempo real
    const scoutTemp = { ...scout, datosImagen: { ...formData, firmaPadre: user?.firma_url } };
    generarUsoImagenPDF(scoutTemp, false); 
  };

  if (!scout) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth disableEnforceFocus PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ bgcolor: '#e65100', color: 'white', fontWeight: '900', py: 2 }}>
        Autorización Uso de Imagen: {scout.nombre}
      </DialogTitle>
      
      <DialogContent sx={{ p: 4, bgcolor: '#f8f9fa' }}>
        {success && (
          <Alert severity="success" sx={{ mb: 3, borderRadius: 2, fontWeight: 800 }}>
            ¡Datos guardados con éxito! El documento ha sido generado y subido al legajo digital.
          </Alert>
        )}

        <Typography variant="body2" color="textSecondary" sx={{ mb: 4, fontWeight: 500 }}>
          Al completar esta ficha, autorizás al Grupo Scout a utilizar imágenes de las actividades donde participe {scout.nombre} con fines institucionales y pedagógicos.
        </Typography>

        <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid #e0e0e0' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#e65100', mb: 3, textTransform: 'uppercase', letterSpacing: 1 }}>
            Declaración Jurada de Autoridad
          </Typography>
          
          <Stack spacing={3}>
            <TextField 
              label="Año de vigencia" 
              size="small" 
              name="anio" 
              value={formData.anio} 
              onChange={handleChange} 
              fullWidth 
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            
            <TextField 
              label="Nombre y Apellido del Tutor" 
              size="small" 
              name="tutorNombre" 
              value={formData.tutorNombre} 
              onChange={handleChange} 
              fullWidth 
              helperText="Tal como figura en el DNI"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            
            <TextField 
              label="DNI del Tutor" 
              size="small" 
              name="tutorDni" 
              value={formData.tutorDni} 
              onChange={handleChange} 
              fullWidth 
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            
            <TextField 
              label="Domicilio del Tutor" 
              size="small" 
              name="tutorDomicilio" 
              value={formData.tutorDomicilio} 
              onChange={handleChange} 
              fullWidth 
              multiline 
              rows={2} 
              placeholder="Calle, Número, Localidad..."
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
          </Stack>
        </Paper>
      </DialogContent>

      <DialogActions sx={{ p: 3, bgcolor: '#f8f9fa' }}>
        <Button onClick={onClose} sx={{ fontWeight: 900, color: 'text.secondary', mr: 'auto' }}>
          Cerrar
        </Button>
        
        <Button 
          variant="outlined" 
          onClick={handlePrint} 
          startIcon={<Visibility />} 
          color="warning" 
          sx={{ fontWeight: 800, borderRadius: 2 }}
        >
          Ver Documento
        </Button>

        <Button 
          variant="contained" 
          onClick={handleGuardar} 
          disabled={loading || success}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : (success ? <CheckCircle /> : <Save />)} 
          sx={{ bgcolor: success ? '#4caf50' : '#e65100', fontWeight: 900, px: 4, borderRadius: 2, '&:hover': { bgcolor: '#bf4300' } }}
        >
          {loading ? 'Generando PDF...' : (success ? '¡Guardado!' : 'Guardar y Generar')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};