import { useState } from 'react';
import { Box, Typography, TextField, Grid, Button, Paper, Stack, Dialog, DialogTitle, DialogContent, DialogActions, Divider } from '@mui/material';
import { Print, Save } from '@mui/icons-material';
import { FichaDatosPersonalesTemplate } from './FichaDatosPersonalesTemplate';

export const FichaDatosPersonalesForm = ({ open, onClose, scout, onSave }) => {
  const [formData, setFormData] = useState(scout.datosPersonales || {
    nacionalidad: '', escuela: '', grado: '', religion: '', 
    tutor1Nombre: '', tutor1Dni: '', tutor1Vinculo: '', tutor1Tel: '', tutor1Email: '', tutor1Ocupacion: '',
    tutor2Nombre: '', tutor2Dni: '', tutor2Vinculo: '', tutor2Tel: '', tutor2Email: '', tutor2Ocupacion: '',
    personasAutorizadas: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGuardar = () => {
    onSave({ ...scout, datosPersonales: formData });
  };

  const handlePrint = () => {
    window.print();
  };

  if (!scout) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle sx={{ bgcolor: '#005b96', color: 'white', fontWeight: 'bold' }}>
        Ficha de Datos Personales de {scout.nombre} {scout.apellido}
      </DialogTitle>
      
      <DialogContent sx={{ p: 3, bgcolor: '#f8f9fa' }} className="no-print">
        <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
          Esta información es vital para el registro oficial de la Asociación y el contacto directo con la familia.
        </Typography>

        <Grid container spacing={3}>
          {/* DATOS DEL BENEFICIARIO */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="subtitle1" fontWeight="bold" color="primary" mb={2}>1. Datos del Beneficiario</Typography>
              <Stack spacing={2}>
                <TextField label="Nacionalidad" size="small" name="nacionalidad" value={formData.nacionalidad} onChange={handleChange} fullWidth />
                <TextField label="Religión / Culto" size="small" name="religion" value={formData.religion} onChange={handleChange} fullWidth />
                <Divider />
                <TextField label="Institución Educativa" size="small" name="escuela" value={formData.escuela} onChange={handleChange} fullWidth />
                <TextField label="Año / Grado Escolar" size="small" name="grado" value={formData.grado} onChange={handleChange} fullWidth />
              </Stack>
            </Paper>
          </Grid>

          {/* DATOS DEL TUTOR 1 */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="subtitle1" fontWeight="bold" color="primary" mb={2}>2. Adulto Responsable 1</Typography>
              <Stack spacing={2}>
                <TextField label="Nombre y Apellido" size="small" name="tutor1Nombre" value={formData.tutor1Nombre} onChange={handleChange} fullWidth />
                <Stack direction="row" spacing={2}>
                  <TextField label="Vínculo" size="small" name="tutor1Vinculo" value={formData.tutor1Vinculo} onChange={handleChange} fullWidth />
                  <TextField label="DNI" size="small" name="tutor1Dni" value={formData.tutor1Dni} onChange={handleChange} fullWidth />
                </Stack>
                <TextField label="Teléfono (Celular)" size="small" name="tutor1Tel" value={formData.tutor1Tel} onChange={handleChange} fullWidth />
                <TextField label="Correo Electrónico" size="small" name="tutor1Email" value={formData.tutor1Email} onChange={handleChange} fullWidth />
                <TextField label="Ocupación / Profesión" size="small" name="tutor1Ocupacion" value={formData.tutor1Ocupacion} onChange={handleChange} fullWidth />
              </Stack>
            </Paper>
          </Grid>

          {/* DATOS DEL TUTOR 2 & EXTRA */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="subtitle1" fontWeight="bold" color="primary" mb={2}>2. Adulto Responsable 2</Typography>
              <Stack spacing={2}>
                <TextField label="Nombre y Apellido" size="small" name="tutor2Nombre" value={formData.tutor2Nombre} onChange={handleChange} fullWidth />
                <Stack direction="row" spacing={2}>
                  <TextField label="Vínculo" size="small" name="tutor2Vinculo" value={formData.tutor2Vinculo} onChange={handleChange} fullWidth />
                  <TextField label="DNI" size="small" name="tutor2Dni" value={formData.tutor2Dni} onChange={handleChange} fullWidth />
                </Stack>
                <TextField label="Teléfono (Celular)" size="small" name="tutor2Tel" value={formData.tutor2Tel} onChange={handleChange} fullWidth />
                <TextField label="Correo Electrónico" size="small" name="tutor2Email" value={formData.tutor2Email} onChange={handleChange} fullWidth />
                <TextField label="Ocupación / Profesión" size="small" name="tutor2Ocupacion" value={formData.tutor2Ocupacion} onChange={handleChange} fullWidth />
              </Stack>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" fontWeight="bold" mb={1}>Retiro de Actividades</Typography>
              <TextField label="Otras personas autorizadas a retirar al menor (Nombres y DNI)" size="small" name="personasAutorizadas" value={formData.personasAutorizadas} onChange={handleChange} fullWidth multiline rows={2} />
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3, className: 'no-print' }}>
        <Button onClick={onClose} color="inherit" sx={{ fontWeight: 'bold' }}>Cancelar</Button>
        <Button variant="contained" onClick={handleGuardar} startIcon={<Save />} sx={{ bgcolor: '#005b96', fontWeight: 'bold' }}>
          Guardar Datos
        </Button>
        <Button variant="outlined" onClick={handlePrint} startIcon={<Print />} color="info" sx={{ fontWeight: 'bold' }}>
          Imprimir / Generar PDF
        </Button>
      </DialogActions>

      {/* ÁREA DE IMPRESIÓN */}
      <Box className="area-imprimible" sx={{ display: 'none' }}>
        <FichaDatosPersonalesTemplate scout={scout} datos={formData} />
      </Box>

      {/* REGLAS DE IMPRESIÓN (Las mismas que funcionaron perfecto en la médica) */}
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