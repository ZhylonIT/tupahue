import { useState } from 'react';
import { Box, Typography, TextField, Grid, Button, Paper, Stack, Dialog, DialogTitle, DialogContent, DialogActions, Divider } from '@mui/material';
import { Print, Save } from '@mui/icons-material';
import { FichaIngresoTemplate } from './FichaIngresoTemplate';

export const FichaIngresoForm = ({ open, onClose, scout, onSave }) => {
  // Aprovechamos todo lo que ya cargó la familia
  const dm = scout?.datosMedicos || {};
  const dp = scout?.datosPersonales || {};
  const ds = scout?.datosSalidas || {};
  const di = scout?.datosIngreso || {};

  const fechaActual = new Date();

  // Mapeamos los meses a texto para que quede mejor en el documento impreso
  const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  const [formData, setFormData] = useState({
    localidad: di.localidad || ds.localidad || 'Ituzaingó',
    provincia: di.provincia || ds.provincia || 'Buenos Aires',
    partido: di.partido || ds.partido || 'Ituzaingó',
    dia: di.dia || ds.dia || String(fechaActual.getDate()),
    mes: di.mes || meses[fechaActual.getMonth()],
    anio: di.anio || ds.anio || String(fechaActual.getFullYear()),
    
    tutorNombre: di.tutorNombre || ds.tutorNombre || dp.tutor1Nombre || '',
    tutorNacimiento: di.tutorNacimiento || ds.tutorNacimiento || '',
    tutorNacionalidad: di.tutorNacionalidad || ds.tutorNacionalidad || 'Argentina',
    tutorDni: di.tutorDni || ds.tutorDni || dp.tutor1Dni || '',
    tutorDomicilio: di.tutorDomicilio || ds.tutorDomicilio || dm.domicilio || '',
    tutorTelefono: di.tutorTelefono || ds.tutorTelefono || dm.telEmergencia1 || dp.tutor1Tel || '',
    tutorVinculo: di.tutorVinculo || ds.tutorVinculo || dp.tutor1Vinculo || 'Padre/Madre',

    scoutNacionalidad: di.scoutNacionalidad || ds.scoutNacionalidad || dp.nacionalidad || 'Argentina',
    scoutDomicilio: di.scoutDomicilio || ds.scoutDomicilio || dm.domicilio || '',
    
    aclaracionTenencia: di.aclaracionTenencia || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGuardar = () => {
    onSave({ ...scout, datosIngreso: formData });
  };

  const handlePrint = () => {
    window.print();
  };

  if (!scout) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ bgcolor: '#2e7d32', color: 'white', fontWeight: 'bold' }}>
        Autorización de Ingreso - {scout.nombre} {scout.apellido}
      </DialogTitle>
      
      <DialogContent sx={{ p: 3, bgcolor: '#f8f9fa' }} className="no-print">
        <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
          Este documento es obligatorio por única vez al ingresar a la Asociación. Completá los datos faltantes y generá el PDF. 
          Recordá que deberá ser firmado ante dos educadores del Grupo que actuarán como testigos.
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
                <TextField label="Día" size="small" name="dia" value={formData.dia} onChange={handleChange} sx={{ width: '80px' }} />
                <TextField label="Mes" size="small" name="mes" value={formData.mes} onChange={handleChange} />
                <TextField label="Año" size="small" name="anio" value={formData.anio} onChange={handleChange} sx={{ width: '100px' }} />
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

          {/* DATOS DEL MENOR Y SITUACIÓN LEGAL */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, height: '100%' }}>
              <Typography variant="subtitle2" fontWeight="bold" color="primary" mb={1}>Datos del Menor y Aclaraciones</Typography>
              <Stack spacing={2}>
                <TextField label="Nacionalidad del Beneficiario" size="small" name="scoutNacionalidad" value={formData.scoutNacionalidad} onChange={handleChange} fullWidth />
                <TextField label="Domicilio del Beneficiario" size="small" name="scoutDomicilio" value={formData.scoutDomicilio} onChange={handleChange} fullWidth />
                
                <Divider sx={{ my: 1 }} />
                
                <Typography variant="body2" color="textSecondary">
                  Si corresponde, aclare la situación judicial sobre la tenencia o guarda definitiva/provisoria del menor. Si ambos padres conviven, dejar en blanco.
                </Typography>
                <TextField 
                  label="Aclaración de tenencia / guarda" 
                  size="small" 
                  name="aclaracionTenencia" 
                  value={formData.aclaracionTenencia} 
                  onChange={handleChange} 
                  multiline rows={3} 
                  fullWidth 
                />
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3, className: 'no-print' }}>
        <Button onClick={onClose} color="inherit" sx={{ fontWeight: 'bold' }}>Cancelar</Button>
        <Button variant="contained" onClick={handleGuardar} startIcon={<Save />} sx={{ bgcolor: '#2e7d32', fontWeight: 'bold' }}>
          Guardar Datos
        </Button>
        <Button variant="outlined" onClick={handlePrint} startIcon={<Print />} color="info" sx={{ fontWeight: 'bold' }}>
          Imprimir / Generar PDF
        </Button>
      </DialogActions>

      {/* ÁREA DE IMPRESIÓN */}
      <Box className="area-imprimible" sx={{ display: 'none' }}>
        <FichaIngresoTemplate scout={scout} datos={formData} />
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