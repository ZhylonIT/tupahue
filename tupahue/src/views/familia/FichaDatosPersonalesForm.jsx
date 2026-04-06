import { useState, useEffect } from 'react';
import { 
  Box, Typography, TextField, Grid, Button, Paper, 
  Stack, Dialog, DialogTitle, DialogContent, DialogActions, Divider 
} from '@mui/material';
import { Print, Save } from '@mui/icons-material';
import { FichaDatosPersonalesTemplate } from './FichaDatosPersonalesTemplate';

export const FichaDatosPersonalesForm = ({ open, onClose, scout, onSave }) => {
  
  // 🎯 Valores por defecto para evitar errores de "undefined"
  const defaultPersonales = {
    nacionalidad: '', escuela: '', grado: '', religion: '', 
    tutor1Nombre: '', tutor1Dni: '', tutor1Vinculo: '', tutor1Tel: '', tutor1Email: '', tutor1Ocupacion: '',
    tutor2Nombre: '', tutor2Dni: '', tutor2Vinculo: '', tutor2Tel: '', tutor2Email: '', tutor2Ocupacion: '',
    personasAutorizadas: ''
  };

  const [formData, setFormData] = useState(defaultPersonales);

  // Sincronizar estado cuando se abre el modal o cambia el scout
  useEffect(() => {
    if (scout?.datosPersonales) {
      setFormData({ ...defaultPersonales, ...scout.datosPersonales });
    } else {
      setFormData(defaultPersonales);
    }
  }, [scout, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGuardar = () => {
    // 🎯 Mandamos el objeto scout actualizado al padre (DocumentacionView)
    onSave({ 
      ...scout, 
      datosPersonales: formData 
    });
    onClose(); // Cerramos el modal después de guardar
  };

  const handlePrint = () => {
    window.print();
  };

  if (!scout) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ bgcolor: '#005b96', color: 'white', fontWeight: '900', py: 2 }}>
        Ficha de Datos Personales: {scout.nombre} {scout.apellido}
      </DialogTitle>
      
      <DialogContent sx={{ p: 4, bgcolor: '#f8f9fa' }} className="no-print">
        <Typography variant="body2" color="textSecondary" sx={{ mb: 4, fontWeight: 500 }}>
          Por favor, mantené esta información actualizada. Es fundamental para la seguridad del beneficiario y la comunicación institucional.
        </Typography>

        <Grid container spacing={3}>
          {/* SECCIÓN 1: EL JOVEN */}
          <Grid item xs={12} md={4}>
            <Paper elevation={0} sx={{ p: 3, height: '100%', borderRadius: 4, border: '1px solid #e0e0e0' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#005b96', mb: 3 }}>
                1. Información del Joven
              </Typography>
              <Stack spacing={2.5}>
                <TextField label="Nacionalidad" size="small" name="nacionalidad" value={formData.nacionalidad} onChange={handleChange} fullWidth />
                <TextField label="Religión / Culto" size="small" name="religion" value={formData.religion} onChange={handleChange} fullWidth />
                <Divider sx={{ my: 1 }} />
                <TextField label="Escuela / Institución" size="small" name="escuela" value={formData.escuela} onChange={handleChange} fullWidth />
                <TextField label="Año o Grado" size="small" name="grado" value={formData.grado} onChange={handleChange} fullWidth />
              </Stack>
            </Paper>
          </Grid>

          {/* SECCIÓN 2: TUTOR 1 */}
          <Grid item xs={12} md={4}>
            <Paper elevation={0} sx={{ p: 3, height: '100%', borderRadius: 4, border: '1px solid #e0e0e0' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#005b96', mb: 3 }}>
                2. Primer Adulto Responsable
              </Typography>
              <Stack spacing={2}>
                <TextField label="Nombre Completo" size="small" name="tutor1Nombre" value={formData.tutor1Nombre} onChange={handleChange} fullWidth />
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField label="Vínculo" size="small" name="tutor1Vinculo" value={formData.tutor1Vinculo} onChange={handleChange} fullWidth />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField label="DNI" size="small" name="tutor1Dni" value={formData.tutor1Dni} onChange={handleChange} fullWidth />
                  </Grid>
                </Grid>
                <TextField label="Celular de contacto" size="small" name="tutor1Tel" value={formData.tutor1Tel} onChange={handleChange} fullWidth />
                <TextField label="Email" size="small" name="tutor1Email" value={formData.tutor1Email} onChange={handleChange} fullWidth />
                <TextField label="Profesión / Ocupación" size="small" name="tutor1Ocupacion" value={formData.tutor1Ocupacion} onChange={handleChange} fullWidth />
              </Stack>
            </Paper>
          </Grid>

          {/* SECCIÓN 3: TUTOR 2 Y RETIRO */}
          <Grid item xs={12} md={4}>
            <Paper elevation={0} sx={{ p: 3, height: '100%', borderRadius: 4, border: '1px solid #e0e0e0' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#005b96', mb: 3 }}>
                3. Segundo Adulto Responsable
              </Typography>
              <Stack spacing={2}>
                <TextField label="Nombre Completo" size="small" name="tutor2Nombre" value={formData.tutor2Nombre} onChange={handleChange} fullWidth />
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField label="Vínculo" size="small" name="tutor2Vinculo" value={formData.tutor2Vinculo} onChange={handleChange} fullWidth />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField label="DNI" size="small" name="tutor2Dni" value={formData.tutor2Dni} onChange={handleChange} fullWidth />
                  </Grid>
                </Grid>
                <TextField label="Celular" size="small" name="tutor2Tel" value={formData.tutor2Tel} onChange={handleChange} fullWidth />
                <TextField label="Email" size="small" name="tutor2Email" value={formData.tutor2Email} onChange={handleChange} fullWidth />
              </Stack>
              <Divider sx={{ my: 3 }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5, color: 'error.main' }}>
                Autorizados a retirar al menor
              </Typography>
              <TextField 
                label="Nombres y DNI de otras personas" 
                size="small" 
                name="personasAutorizadas" 
                value={formData.personasAutorizadas} 
                onChange={handleChange} 
                fullWidth multiline rows={3} 
                placeholder="Ej: Abuela María (DNI...), Tío Jorge..."
              />
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
          sx={{ bgcolor: '#005b96', fontWeight: 900, px: 4, borderRadius: 2 }}
        >
          Guardar Cambios
        </Button>
        <Button 
          variant="outlined" 
          onClick={handlePrint} 
          startIcon={<Print />} 
          color="info" 
          sx={{ fontWeight: 800, borderRadius: 2 }}
        >
          Generar Ficha PDF
        </Button>
      </DialogActions>

      {/* ÁREA DE IMPRESIÓN */}
      <Box className="area-imprimible" sx={{ display: 'none' }}>
        <FichaDatosPersonalesTemplate scout={scout} datos={formData} />
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