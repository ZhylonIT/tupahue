import { useState } from 'react';
import { Box, Typography, TextField, Grid, Button, Paper, Stack, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Print, Save } from '@mui/icons-material';
import { FichaUsoImagenTemplate } from './FichaUsoImagenTemplate';

export const FichaUsoImagenForm = ({ open, onClose, scout, onSave }) => {
  // Precargamos datos de otras fichas para ahorrar tiempo
  const dp = scout?.datosPersonales || {};
  const dm = scout?.datosMedicos || {};
  const ds = scout?.datosSalidas || {};
  const di = scout?.datosImagen || {};

  const fechaActual = new Date();

  const [formData, setFormData] = useState({
    anio: di.anio || String(fechaActual.getFullYear()),
    tutorNombre: di.tutorNombre || ds.tutorNombre || dp.tutor1Nombre || '',
    tutorDni: di.tutorDni || ds.tutorDni || dp.tutor1Dni || '',
    tutorDomicilio: di.tutorDomicilio || ds.tutorDomicilio || dm.domicilio || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGuardar = () => {
    onSave({ ...scout, datosImagen: formData });
  };

  const handlePrint = () => {
    window.print();
  };

  if (!scout) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ bgcolor: '#e65100', color: 'white', fontWeight: 'bold' }}>
        Autorización Uso de Imagen - {scout.nombre} {scout.apellido}
      </DialogTitle>
      
      <DialogContent sx={{ p: 3, bgcolor: '#f8f9fa' }} className="no-print">
        <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
          Verificá los datos del adulto responsable. Al guardar, se generará la declaración jurada oficial para autorizar el uso de imágenes en actividades del año en curso.
        </Typography>

        <Paper sx={{ p: 3 }}>
          <Typography variant="subtitle2" fontWeight="bold" color="primary" mb={2}>Datos de la Autorización</Typography>
          <Stack spacing={2}>
            <TextField label="Año de vigencia" size="small" name="anio" value={formData.anio} onChange={handleChange} fullWidth />
            <TextField label="Nombre y Apellido del Adulto Responsable" size="small" name="tutorNombre" value={formData.tutorNombre} onChange={handleChange} fullWidth />
            <TextField label="DNI del Adulto" size="small" name="tutorDni" value={formData.tutorDni} onChange={handleChange} fullWidth />
            <TextField label="Domicilio Completo (Calle, Ciudad, Provincia)" size="small" name="tutorDomicilio" value={formData.tutorDomicilio} onChange={handleChange} fullWidth multiline rows={2} />
          </Stack>
        </Paper>
      </DialogContent>

      <DialogActions sx={{ p: 3, className: 'no-print' }}>
        <Button onClick={onClose} color="inherit" sx={{ fontWeight: 'bold' }}>Cancelar</Button>
        <Button variant="contained" onClick={handleGuardar} startIcon={<Save />} sx={{ bgcolor: '#e65100', fontWeight: 'bold' }}>
          Guardar Datos
        </Button>
        <Button variant="outlined" onClick={handlePrint} startIcon={<Print />} color="info" sx={{ fontWeight: 'bold' }}>
          Imprimir / Generar PDF
        </Button>
      </DialogActions>

      {/* ÁREA DE IMPRESIÓN */}
      <Box className="area-imprimible" sx={{ display: 'none' }}>
        <FichaUsoImagenTemplate scout={scout} datos={formData} />
      </Box>

      {/* REGLAS DE IMPRESIÓN */}
      <style>
        {`
          @media print {
            @page { margin: 0; size: A4 portrait; }
            html, body { margin: 0 !important; padding: 0 !important; overflow: hidden !important; height: 100vh !important; background-color: white !important; }
            body * { visibility: hidden; }
            .no-print { display: none !important; }
            .area-imprimible { display: block !important; position: fixed !important; top: 0 !important; left: 0 !important; width: 100vw !important; height: 100vh !important; margin: 0 !important; padding: 0 !important; z-index: 99999 !important; }
            .area-imprimible, .area-imprimible * { visibility: visible; }
          }
        `}
      </style>
    </Dialog>
  );
};