import { useState, useEffect } from 'react';
import { 
  Box, Typography, TextField, Grid, Button, Paper, 
  Stack, Dialog, DialogTitle, DialogContent, DialogActions, Divider 
} from '@mui/material';
import { Print, Save } from '@mui/icons-material';
import { FichaSalidasCercanasTemplate } from './FichaSalidasCercanasTemplate';

export const FichaSalidasCercanasForm = ({ open, onClose, scout, onSave }) => {
  
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

  // 🎯 Inteligencia de Precarga: Sincronizamos cuando se abre el modal
  useEffect(() => {
    if (open && scout) {
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
        
        tutorNombre: ds.tutorNombre || dp.tutor1Nombre || '',
        tutorDni: ds.tutorDni || dp.tutor1Dni || '',
        tutorNacionalidad: ds.tutorNacionalidad || 'Argentina',
        tutorNacimiento: ds.tutorNacimiento || '',
        tutorDomicilio: ds.tutorDomicilio || dm.domicilio || '',
        tutorTelefono: ds.tutorTelefono || dm.telEmergencia1 || dp.tutor1Tel || '',
        tutorVinculo: ds.tutorVinculo || dp.tutor1Vinculo || 'Padre/Madre',

        scoutNacionalidad: ds.scoutNacionalidad || dp.nacionalidad || 'Argentina',
        scoutDomicilio: ds.scoutDomicilio || dm.domicilio || '',
        rangoDistancia: ds.rangoDistancia || '5 km'
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
      datosSalidas: formData 
    });
    onClose();
  };

  const handlePrint = () => {
    window.print();
  };

  if (!scout) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ bgcolor: '#00838f', color: 'white', fontWeight: '900', py: 2 }}>
        Autorización de Salidas Cercanas: {scout.nombre}
      </DialogTitle>
      
      <DialogContent sx={{ p: 4, bgcolor: '#f8f9fa' }} className="no-print">
        <Typography variant="body2" color="textSecondary" sx={{ mb: 4, fontWeight: 500 }}>
          Esta autorización permite realizar actividades fuera de la sede pero dentro del radio local. Verificá los datos antes de imprimir.
        </Typography>

        <Grid container spacing={3}>
          {/* LUGAR Y FECHA */}
          <Grid item xs={12}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e0e0e0' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#00838f', mb: 2 }}>📍 Lugar y Fecha</Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField label="Localidad" size="small" name="localidad" value={formData.localidad} onChange={handleChange} fullWidth />
                <TextField label="Partido" size="small" name="partido" value={formData.partido} onChange={handleChange} fullWidth />
                <Stack direction="row" spacing={1}>
                  <TextField label="Día" size="small" name="dia" value={formData.dia} onChange={handleChange} sx={{ width: '70px' }} />
                  <TextField label="Mes" size="small" name="mes" value={formData.mes} onChange={handleChange} sx={{ width: '70px' }} />
                  <TextField label="Año" size="small" name="anio" value={formData.anio} onChange={handleChange} sx={{ width: '90px' }} />
                </Stack>
              </Stack>
            </Paper>
          </Grid>

          {/* DATOS ADULTO */}
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ p: 3, height: '100%', borderRadius: 3, border: '1px solid #e0e0e0' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#00838f', mb: 2 }}>Adulto Responsable</Typography>
              <Stack spacing={2}>
                <TextField label="Nombre y Apellido" size="small" name="tutorNombre" value={formData.tutorNombre} onChange={handleChange} fullWidth />
                <Stack direction="row" spacing={2}>
                  <TextField label="DNI" size="small" name="tutorDni" value={formData.tutorDni} onChange={handleChange} fullWidth />
                  <TextField label="Vínculo" size="small" name="tutorVinculo" value={formData.tutorVinculo} onChange={handleChange} fullWidth />
                </Stack>
                <TextField label="Domicilio Actual" size="small" name="tutorDomicilio" value={formData.tutorDomicilio} onChange={handleChange} fullWidth />
                <TextField label="Teléfono" size="small" name="tutorTelefono" value={formData.tutorTelefono} onChange={handleChange} fullWidth />
              </Stack>
            </Paper>
          </Grid>

          {/* DATOS ACTIVIDAD */}
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ p: 3, height: '100%', borderRadius: 3, border: '1px solid #e0e0e0' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#00838f', mb: 2 }}>Alcance de la Autorización</Typography>
              <Stack spacing={2}>
                <TextField label="Nacionalidad del Joven" size="small" name="scoutNacionalidad" value={formData.scoutNacionalidad} onChange={handleChange} fullWidth />
                <TextField label="Domicilio del Joven" size="small" name="scoutDomicilio" value={formData.scoutDomicilio} onChange={handleChange} fullWidth />
                
                <Divider sx={{ my: 1 }} />
                
                <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>
                  Distancia máxima a la redonda desde la sede para actividades de medio día:
                </Typography>
                <TextField 
                  label="Rango de distancia" 
                  size="small" 
                  name="rangoDistancia" 
                  value={formData.rangoDistancia} 
                  onChange={handleChange} 
                  fullWidth 
                  sx={{ bgcolor: '#e0f7fa', '& .MuiOutlinedInput-root': { borderRadius: 2 } }} 
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
          sx={{ bgcolor: '#00838f', fontWeight: 900, px: 4, borderRadius: 2, '&:hover': { bgcolor: '#006064' } }}
        >
          Guardar Autorización
        </Button>
        <Button 
          variant="outlined" 
          onClick={handlePrint} 
          startIcon={<Print />} 
          color="info" 
          sx={{ fontWeight: 800, borderRadius: 2 }}
        >
          Imprimir PDF
        </Button>
      </DialogActions>

      <Box className="area-imprimible" sx={{ display: 'none' }}>
        <FichaSalidasCercanasTemplate scout={scout} datos={formData} />
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