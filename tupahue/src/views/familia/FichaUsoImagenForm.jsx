import { useState, useEffect } from 'react';
import { 
  Box, Typography, TextField, Grid, Button, Paper, 
  Stack, Dialog, DialogTitle, DialogContent, DialogActions 
} from '@mui/material';
import { Print, Save } from '@mui/icons-material';
import { FichaUsoImagenTemplate } from './FichaUsoImagenTemplate';

export const FichaUsoImagenForm = ({ open, onClose, scout, onSave }) => {
  
  const [formData, setFormData] = useState({
    anio: String(new Date().getFullYear()),
    tutorNombre: '',
    tutorDni: '',
    tutorDomicilio: '',
  });

  // 🎯 Lógica de Inteligencia Colectiva: Precargamos datos si están vacíos
  useEffect(() => {
    if (open && scout) {
      const di = scout.datosImagen || {};
      const dp = scout.datosPersonales || {};
      const dm = scout.datosMedicos || {};
      const ds = scout.datosSalidas || {}; // Por si existe ficha de salidas

      setFormData({
        anio: di.anio || String(new Date().getFullYear()),
        // Buscamos el nombre del tutor en orden de prioridad
        tutorNombre: di.tutorNombre || dp.tutor1Nombre || ds.tutorNombre || '',
        // Buscamos el DNI del tutor
        tutorDni: di.tutorDni || dp.tutor1Dni || ds.tutorDni || '',
        // Buscamos el domicilio en la ficha médica o personal
        tutorDomicilio: di.tutorDomicilio || dm.domicilio || '',
      });
    }
  }, [open, scout]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGuardar = () => {
    // 🎯 Mandamos la actualización al DocumentacionView
    onSave({ 
      ...scout, 
      datosImagen: formData 
    });
    onClose();
  };

  const handlePrint = () => {
    window.print();
  };

  if (!scout) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ bgcolor: '#e65100', color: 'white', fontWeight: '900', py: 2 }}>
        Autorización Uso de Imagen: {scout.nombre}
      </DialogTitle>
      
      <DialogContent sx={{ p: 4, bgcolor: '#f8f9fa' }} className="no-print">
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

      <DialogActions sx={{ p: 3, bgcolor: '#f8f9fa' }} className="no-print">
        <Button onClick={onClose} sx={{ fontWeight: 800, color: 'text.secondary' }}>Cancelar</Button>
        <Button 
          variant="contained" 
          onClick={handleGuardar} 
          startIcon={<Save />} 
          sx={{ bgcolor: '#e65100', fontWeight: 900, px: 4, borderRadius: 2, '&:hover': { bgcolor: '#bf4300' } }}
        >
          Guardar Autorización
        </Button>
        <Button 
          variant="outlined" 
          onClick={handlePrint} 
          startIcon={<Print />} 
          color="warning" 
          sx={{ fontWeight: 800, borderRadius: 2 }}
        >
          Imprimir
        </Button>
      </DialogActions>

      {/* ÁREA DE IMPRESIÓN */}
      <Box className="area-imprimible" sx={{ display: 'none' }}>
        <FichaUsoImagenTemplate scout={scout} datos={formData} />
      </Box>

      <style>{`
        @media print {
          @page { margin: 0; size: A4 portrait; }
          body * { visibility: hidden; }
          .no-print { display: none !important; }
          .area-imprimible { display: block !important; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: white; }
          .area-imprimible, .area-imprimible * { visibility: visible; }
        }
      `}</style>
    </Dialog>
  );
};