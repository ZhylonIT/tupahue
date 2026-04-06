import { useState, useEffect } from 'react';
import { 
  Box, Typography, TextField, Grid, Button, Paper, 
  Stack, Dialog, DialogTitle, DialogContent, DialogActions, Divider 
} from '@mui/material';
import { Print, Save } from '@mui/icons-material';
import { FichaIngresoTemplate } from './FichaIngresoTemplate';

export const FichaIngresoForm = ({ open, onClose, scout, onSave }) => {
  
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

  // 🎯 Sincronización e Inteligencia de Precarga
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
    }
  }, [open, scout]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGuardar = () => {
    // 🎯 Enviamos la actualización al DocumentacionView
    onSave({ 
      ...scout, 
      datosIngreso: formData 
    });
    onClose();
  };

  const handlePrint = () => {
    window.print();
  };

  if (!scout) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ bgcolor: '#2e7d32', color: 'white', fontWeight: '900', py: 2 }}>
        Ficha de Ingreso a la Asociación: {scout.nombre}
      </DialogTitle>
      
      <DialogContent sx={{ p: 4, bgcolor: '#f8f9fa' }} className="no-print">
        <Typography variant="body2" color="textSecondary" sx={{ mb: 4, fontWeight: 500 }}>
          Este documento se completa por única vez. Los datos vertidos tienen carácter de declaración jurada y deben ser validados por los educadores.
        </Typography>

        <Grid container spacing={3}>
          {/* LUGAR Y FECHA */}
          <Grid item xs={12}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e0e0e0' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#2e7d32', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                📍 Lugar y Fecha de Emisión
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField label="Localidad" size="small" name="localidad" value={formData.localidad} onChange={handleChange} fullWidth />
                <TextField label="Partido" size="small" name="partido" value={formData.partido} onChange={handleChange} fullWidth />
                <TextField label="Provincia" size="small" name="provincia" value={formData.provincia} onChange={handleChange} fullWidth />
                <Stack direction="row" spacing={1}>
                  <TextField label="Día" size="small" name="dia" value={formData.dia} onChange={handleChange} sx={{ width: '70px' }} />
                  <TextField label="Mes" size="small" name="mes" value={formData.mes} onChange={handleChange} sx={{ width: '120px' }} />
                  <TextField label="Año" size="small" name="anio" value={formData.anio} onChange={handleChange} sx={{ width: '90px' }} />
                </Stack>
              </Stack>
            </Paper>
          </Grid>

          {/* DATOS TUTOR */}
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ p: 3, height: '100%', borderRadius: 3, border: '1px solid #e0e0e0' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#2e7d32', mb: 2 }}>Datos del Adulto que Autoriza</Typography>
              <Stack spacing={2}>
                <TextField label="Nombre y Apellido" size="small" name="tutorNombre" value={formData.tutorNombre} onChange={handleChange} fullWidth />
                <Stack direction="row" spacing={2}>
                  <TextField label="DNI" size="small" name="tutorDni" value={formData.tutorDni} onChange={handleChange} fullWidth />
                  <TextField label="Vínculo" size="small" name="tutorVinculo" value={formData.tutorVinculo} onChange={handleChange} fullWidth />
                </Stack>
                <Stack direction="row" spacing={2}>
                  <TextField label="Nacimiento" size="small" name="tutorNacimiento" value={formData.tutorNacimiento} onChange={handleChange} placeholder="DD/MM/AAAA" fullWidth />
                  <TextField label="Nacionalidad" size="small" name="tutorNacionalidad" value={formData.tutorNacionalidad} onChange={handleChange} fullWidth />
                </Stack>
                <TextField label="Domicilio" size="small" name="tutorDomicilio" value={formData.tutorDomicilio} onChange={handleChange} fullWidth />
                <TextField label="Teléfono" size="small" name="tutorTelefono" value={formData.tutorTelefono} onChange={handleChange} fullWidth />
              </Stack>
            </Paper>
          </Grid>

          {/* DATOS BENEFICIARIO */}
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ p: 3, height: '100%', borderRadius: 3, border: '1px solid #e0e0e0' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#2e7d32', mb: 2 }}>Información del Protagonista</Typography>
              <Stack spacing={2}>
                <TextField label="Nacionalidad" size="small" name="scoutNacionalidad" value={formData.scoutNacionalidad} onChange={handleChange} fullWidth />
                <TextField label="Domicilio Actual" size="small" name="scoutDomicilio" value={formData.scoutDomicilio} onChange={handleChange} fullWidth />
                
                <Divider sx={{ my: 1 }} />
                
                <Typography variant="caption" sx={{ color: 'error.main', fontWeight: 800 }}>
                  Aclaración Tenencia / Guarda Legal
                </Typography>
                <TextField 
                  placeholder="Si corresponde, aclare situación judicial sobre la tenencia..."
                  size="small" 
                  name="aclaracionTenencia" 
                  value={formData.aclaracionTenencia} 
                  onChange={handleChange} 
                  multiline rows={4} 
                  fullWidth 
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: '#fff' } }}
                />
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3, bgcolor: '#f8f9fa' }} className="no-print">
        <Button onClick={onClose} sx={{ fontWeight: 800, color: 'text.secondary' }}>Cancelar</Button>
        <Button 
          variant="contained" 
          onClick={handleGuardar} 
          startIcon={<Save />} 
          sx={{ bgcolor: '#2e7d32', fontWeight: 900, px: 4, borderRadius: 2, '&:hover': { bgcolor: '#1b5e20' } }}
        >
          Guardar e Inscribir
        </Button>
        <Button 
          variant="outlined" 
          onClick={handlePrint} 
          startIcon={<Print />} 
          color="success" 
          sx={{ fontWeight: 800, borderRadius: 2 }}
        >
          Imprimir Formulario
        </Button>
      </DialogActions>

      {/* ÁREA DE IMPRESIÓN */}
      <Box className="area-imprimible" sx={{ display: 'none' }}>
        <FichaIngresoTemplate scout={scout} datos={formData} />
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