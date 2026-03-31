import { useState, useEffect } from 'react';
import { Box, Typography, TextField, Grid, Button, Paper, Stack, Dialog, DialogTitle, DialogContent, DialogActions, Divider } from '@mui/material';
import { Print, Save } from '@mui/icons-material';
import { FichaSalidasCercanasTemplate } from './FichaSalidasCercanasTemplate';

export const FichaSalidasCercanasForm = ({ open, onClose, scout, onSave }) => {
  // Precargamos datos de otras fichas si existen para ahorrarle tiempo al usuario
  const dm = scout?.datosMedicos || {};
  const dp = scout?.datosPersonales || {};
  const ds = scout?.datosSalidas || {};

  const fechaActual = new Date();

  const [formData, setFormData] = useState({
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGuardar = () => {
    onSave({ ...scout, datosSalidas: formData });
  };

  const handlePrint = () => {
    window.print();
  };

  if (!scout) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ bgcolor: '#00838f', color: 'white', fontWeight: 'bold' }}>
        Autorización de Salidas Cercanas - {scout.nombre} {scout.apellido}
      </DialogTitle>
      
      <DialogContent sx={{ p: 3, bgcolor: '#f8f9fa' }} className="no-print">
        <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
          Verificá que los datos autocompletados sean correctos. Esta autorización tiene validez por todo el año scout en curso.
        </Typography>

        <Grid container spacing={3}>
          {/* LUGAR Y FECHA */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle2" fontWeight="bold" color="primary" mb={1}>Lugar y Fecha de Emisión</Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField label="Localidad" size="small" name="localidad" value={formData.localidad} onChange={handleChange} fullWidth />
                <TextField label="Partido/Departamento" size="small" name="partido" value={formData.partido} onChange={handleChange} fullWidth />
                <TextField label="Provincia" size="small" name="provincia" value={formData.provincia} onChange={handleChange} fullWidth />
              </Stack>
            </Paper>
          </Grid>

          {/* DATOS DEL ADULTO RESPONSABLE */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, height: '100%' }}>
              <Typography variant="subtitle2" fontWeight="bold" color="primary" mb={1}>Datos del Adulto que Autoriza</Typography>
              <Stack spacing={2}>
                <TextField label="Nombre y Apellido" size="small" name="tutorNombre" value={formData.tutorNombre} onChange={handleChange} fullWidth />
                <Stack direction="row" spacing={2}>
                  <TextField label="DNI" size="small" name="tutorDni" value={formData.tutorDni} onChange={handleChange} fullWidth />
                  <TextField label="Vínculo (Ej: Madre)" size="small" name="tutorVinculo" value={formData.tutorVinculo} onChange={handleChange} fullWidth />
                </Stack>
                <Stack direction="row" spacing={2}>
                  <TextField label="Fecha Nacimiento" size="small" name="tutorNacimiento" value={formData.tutorNacimiento} onChange={handleChange} placeholder="DD/MM/AAAA" fullWidth />
                  <TextField label="Nacionalidad" size="small" name="tutorNacionalidad" value={formData.tutorNacionalidad} onChange={handleChange} fullWidth />
                </Stack>
                <TextField label="Domicilio" size="small" name="tutorDomicilio" value={formData.tutorDomicilio} onChange={handleChange} fullWidth />
                <TextField label="Teléfono" size="small" name="tutorTelefono" value={formData.tutorTelefono} onChange={handleChange} fullWidth />
              </Stack>
            </Paper>
          </Grid>

          {/* DATOS DEL MENOR Y RANGO */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, height: '100%' }}>
              <Typography variant="subtitle2" fontWeight="bold" color="primary" mb={1}>Datos del Menor y Actividad</Typography>
              <Stack spacing={2}>
                <TextField label="Nacionalidad del Beneficiario" size="small" name="scoutNacionalidad" value={formData.scoutNacionalidad} onChange={handleChange} fullWidth />
                <TextField label="Domicilio del Beneficiario" size="small" name="scoutDomicilio" value={formData.scoutDomicilio} onChange={handleChange} fullWidth />
                
                <Divider sx={{ my: 1 }} />
                
                <Typography variant="body2" color="textSecondary">
                  Indique el rango máximo en kilómetros a la redonda desde la sede del Grupo Scout para actividades de medio día.
                </Typography>
                <TextField label="Rango máximo de distancia" size="small" name="rangoDistancia" value={formData.rangoDistancia} onChange={handleChange} placeholder="Ej: 5 km" fullWidth sx={{ bgcolor: '#e0f7fa' }} />
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3, className: 'no-print' }}>
        <Button onClick={onClose} color="inherit" sx={{ fontWeight: 'bold' }}>Cancelar</Button>
        <Button variant="contained" onClick={handleGuardar} startIcon={<Save />} sx={{ bgcolor: '#00838f', fontWeight: 'bold' }}>
          Guardar Datos
        </Button>
        <Button variant="outlined" onClick={handlePrint} startIcon={<Print />} color="info" sx={{ fontWeight: 'bold' }}>
          Imprimir / Generar PDF
        </Button>
      </DialogActions>

      {/* ÁREA DE IMPRESIÓN */}
      <Box className="area-imprimible" sx={{ display: 'none' }}>
        <FichaSalidasCercanasTemplate scout={scout} datos={formData} />
      </Box>

      {/* REGLAS DE IMPRESIÓN EXTREMAS */}
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