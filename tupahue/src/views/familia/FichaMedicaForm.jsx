import { useState, useEffect } from 'react';
import { 
  Box, Typography, TextField, Grid, Button, Checkbox, 
  FormControlLabel, Paper, Stack, Dialog, DialogTitle, 
  DialogContent, DialogActions, Divider, CircularProgress, Alert 
} from '@mui/material';
import { Save, CheckCircle, Visibility } from '@mui/icons-material';
import { FichaMedicaTemplate } from './FichaMedicaTemplate';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import { generarFichaMedicaPDF } from '../../services/pdfService'; 

export const FichaMedicaForm = ({ open, onClose, scout, onSave }) => {
  const { user } = useAuth(); 
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const defaultMedicos = {
    fechaControl: '', domicilio: '', telEmergencia1: '', telEmergencia2: '',
    hemorragias: false, encias: false, dolorCabeza: false, presionAlta: false, presionBaja: false,
    transfusiones: false, convulsiones: false, cirugias: false, internaciones: false,
    actividadFisica: true, cualquierActividad: true, motivoNoActividad: '',
    vacunaQuintuple: '', vacunaTripleCelular: '', vacunaTripleAcelular: '', vacunaDoble: '',
    calendarioCompleto: false, noTieneVacunas: false, noSabeVacunas: false,
    grupoSanguineo: '', factorRh: '', peso: '', talla: '',
    medicacion: false, cualMedicacion: '', cronica: false, cualCronica: '',
    tratamiento: false, cualTratamiento: '', cud: false, alergia: false, cualAlergia: '',
    anticoagulado: false, drogaAnticoagulante: '', dieta: false, cualDieta: '',
    panico: false, frecuenciaPanico: '', saludMental: false, cualSaludMental: '',
    tratamientoMental: false, cualTratamientoMental: '', fobia: false,
    adjuntaCertificado: false, hablarEducador: false,
    obraSocial: '', nroCredencial: '', telObraSocial: ''
  };

  const [formData, setFormData] = useState(defaultMedicos);

  useEffect(() => {
    if (scout?.datosMedicos) {
      setFormData({ ...defaultMedicos, ...scout.datosMedicos });
    } else {
      setFormData(defaultMedicos);
    }
    if (open) setSuccess(false); 
  }, [scout, open]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
    if (success) setSuccess(false);
  };

  const handleGuardar = async (e) => {
    if (e) e.preventDefault(); 
    setLoading(true);
    try {
      const datosConFirma = {
        ...formData,
        firmaPadre: user?.firma_url, 
        aclaracionPadre: `${user?.nombre} ${user?.apellido}`,
        dniPadre: user?.dni,
        fechaFirmaPadre: new Date().toLocaleDateString('es-AR')
      };

      const pibeActualizado = { ...scout, datosMedicos: datosConFirma };
      const pdfBlob = await generarFichaMedicaPDF(pibeActualizado, true);
      
      const filePath = `${scout.id}/ficha_medica/ficha_medica.pdf`;
      await supabase.storage.from('documentos').upload(filePath, pdfBlob, {
        contentType: 'application/pdf', upsert: true 
      });

      await onSave(pibeActualizado);
      setSuccess(true); 
    } catch (error) {
      console.error(error);
      alert("Error al guardar la ficha.");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => window.print();

  if (!scout) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth disableEnforceFocus>
      <DialogTitle sx={{ bgcolor: '#5A189A', color: 'white', fontWeight: '900' }}>
        Ficha Médica: {scout.nombre} {scout.apellido}
      </DialogTitle>
      
      <DialogContent sx={{ p: 4, bgcolor: '#f8f9fa' }} className="no-print">
        {success && (
          <Alert severity="success" sx={{ mb: 2, borderRadius: 2, fontWeight: 800 }}>
            ¡Datos guardados con éxito! El legajo digital ha sido actualizado.
          </Alert>
        )}

        <Grid container spacing={3}>
           {/* SECCIÓN 1: CONTACTO */}
           <Grid item xs={12} md={4}>
            <Paper elevation={0} sx={{ p: 3, height: '100%', borderRadius: 4, border: '1px solid #e0e0e0' }}>
              <Typography variant="subtitle1" fontWeight="900" color="primary" mb={2}>1. Emergencia</Typography>
              <Stack spacing={2}>
                <TextField label="Fecha último control" size="small" name="fechaControl" value={formData.fechaControl} onChange={handleChange} fullWidth placeholder="DD/MM/AAAA" />
                <TextField label="Domicilio Actual" size="small" name="domicilio" value={formData.domicilio} onChange={handleChange} fullWidth />
                <TextField label="Emergencia 1 (Nombre y Tel)" size="small" name="telEmergencia1" value={formData.telEmergencia1} onChange={handleChange} fullWidth />
                <TextField label="Emergencia 2 (Nombre y Tel)" size="small" name="telEmergencia2" value={formData.telEmergencia2} onChange={handleChange} fullWidth />
              </Stack>
            </Paper>
          </Grid>

          {/* SECCIÓN 2: ANTECEDENTES */}
          <Grid item xs={12} md={4}>
            <Paper elevation={0} sx={{ p: 3, height: '100%', borderRadius: 4, border: '1px solid #e0e0e0' }}>
              <Typography variant="subtitle1" fontWeight="900" color="primary" mb={2}>2. Antecedentes</Typography>
              <Grid container>
                {[
                  { n: 'hemorragias', l: 'Hemorragias' }, { n: 'encias', l: 'Sangran encías' },
                  { n: 'dolorCabeza', l: 'Dolor cabeza' }, { n: 'presionAlta', l: 'Presión Alta' },
                  { n: 'presionBaja', l: 'Presión Baja' }, { n: 'transfusiones', l: 'Transfusiones' },
                  { n: 'convulsiones', l: 'Convulsiones' }, { n: 'cirugias', l: 'Cirugías' },
                  { n: 'internaciones', l: 'Internaciones' }
                ].map((item) => (
                  <Grid item xs={6} key={item.n}>
                    <FormControlLabel 
                      control={<Checkbox size="small" checked={formData[item.n] || false} onChange={handleChange} name={item.n} />} 
                      label={<Typography variant="caption" sx={{ fontWeight: 700 }}>{item.l}</Typography>} 
                    />
                  </Grid>
                ))}
              </Grid>
              <Divider sx={{ my: 1 }} />
              <FormControlLabel control={<Checkbox size="small" checked={formData.cualquierActividad} onChange={handleChange} name="cualquierActividad" />} label={<Typography variant="body2" fontWeight="900">Apto para cualquier actividad</Typography>} />
              {!formData.cualquierActividad && (
                <TextField label="Especificar restricciones" size="small" name="motivoNoActividad" value={formData.motivoNoActividad} onChange={handleChange} fullWidth sx={{ mt: 1 }} />
              )}
            </Paper>
          </Grid>

          {/* SECCIÓN 3: CLÍNICA Y VACUNAS */}
          <Grid item xs={12} md={4}>
            <Paper elevation={0} sx={{ p: 3, height: '100%', borderRadius: 4, border: '1px solid #e0e0e0' }}>
              <Typography variant="subtitle1" fontWeight="900" color="primary" mb={1}>3. Clínica y Vacunas</Typography>
              <Grid container spacing={1} mb={2}>
                <Grid item xs={6}><TextField label="Grupo" size="small" name="grupoSanguineo" value={formData.grupoSanguineo} onChange={handleChange} fullWidth /></Grid>
                <Grid item xs={6}><TextField label="RH" size="small" name="factorRh" value={formData.factorRh} onChange={handleChange} fullWidth /></Grid>
                <Grid item xs={6}><TextField label="Peso" size="small" name="peso" value={formData.peso} onChange={handleChange} fullWidth /></Grid>
                <Grid item xs={6}><TextField label="Talla" size="small" name="talla" value={formData.talla} onChange={handleChange} fullWidth /></Grid>
              </Grid>
              <Typography variant="caption" fontWeight="900">Vacunas (Año):</Typography>
              <Grid container spacing={1}>
                <Grid item xs={6}><TextField label="Quíntuple" size="small" name="vacunaQuintuple" value={formData.vacunaQuintuple} onChange={handleChange} fullWidth /></Grid>
                <Grid item xs={6}><TextField label="Doble" size="small" name="vacunaDoble" value={formData.vacunaDoble} onChange={handleChange} fullWidth /></Grid>
                <Grid item xs={6}><TextField label="Triple Cel." size="small" name="vacunaTripleCelular" value={formData.vacunaTripleCelular} onChange={handleChange} fullWidth /></Grid>
                <Grid item xs={6}><TextField label="Triple Ace." size="small" name="vacunaTripleAcelular" value={formData.vacunaTripleAcelular} onChange={handleChange} fullWidth /></Grid>
              </Grid>
              <FormControlLabel control={<Checkbox size="small" checked={formData.calendarioCompleto} onChange={handleChange} name="calendarioCompleto" />} label={<Typography variant="caption" fontWeight="bold">Calendario Completo</Typography>} />
            </Paper>
          </Grid>

          {/* SECCIÓN 4: DETALLE MÉDICO */}
          <Grid item xs={12} md={8}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid #e0e0e0' }}>
              <Typography variant="subtitle1" fontWeight="900" color="primary" mb={2}>4. Alergias, Medicación y Salud Mental</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <FormControlLabel control={<Checkbox size="small" checked={formData.alergia} onChange={handleChange} name="alergia" />} label="Sufre alergias" />
                  {formData.alergia && <TextField label="¿A qué?" size="small" name="cualAlergia" value={formData.cualAlergia} onChange={handleChange} fullWidth />}
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControlLabel control={<Checkbox size="small" checked={formData.medicacion} onChange={handleChange} name="medicacion" />} label="Toma Medicación" />
                  {formData.medicacion && <TextField label="Dosis/Droga" size="small" name="cualMedicacion" value={formData.cualMedicacion} onChange={handleChange} fullWidth />}
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControlLabel control={<Checkbox size="small" checked={formData.cronica} onChange={handleChange} name="cronica" />} label="Enf. Crónica" />
                  {formData.cronica && <TextField label="¿Cuál?" size="small" name="cualCronica" value={formData.cualCronica} onChange={handleChange} fullWidth />}
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControlLabel control={<Checkbox size="small" checked={formData.panico} onChange={handleChange} name="panico" />} label="Ataques Pánico" />
                  {formData.panico && <TextField label="Frecuencia" size="small" name="frecuenciaPanico" value={formData.frecuenciaPanico} onChange={handleChange} fullWidth />}
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControlLabel control={<Checkbox size="small" checked={formData.saludMental} onChange={handleChange} name="saludMental" />} label="Salud Mental" />
                  {formData.saludMental && <TextField label="Diagnóstico" size="small" name="cualSaludMental" value={formData.cualSaludMental} onChange={handleChange} fullWidth />}
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid #e0e0e0' }}>
              <Typography variant="subtitle1" fontWeight="900" color="primary" mb={2}>5. Cobertura</Typography>
              <Stack spacing={2}>
                <TextField label="Obra Social" size="small" name="obraSocial" value={formData.obraSocial} onChange={handleChange} fullWidth />
                <TextField label="N° Afiliado" size="small" name="nroCredencial" value={formData.nroCredencial} onChange={handleChange} fullWidth />
                <TextField label="Tel. Cobertura" size="small" name="telObraSocial" value={formData.telObraSocial} onChange={handleChange} fullWidth />
                <FormControlLabel control={<Checkbox size="small" checked={formData.cud} onChange={handleChange} name="cud" />} label="Tiene CUD" />
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3, bgcolor: '#f8f9fa' }} className="no-print">
        <Button onClick={onClose} sx={{ fontWeight: 900 }}>Cerrar</Button>
        <Button 
          variant="contained" 
          onClick={handleGuardar} 
          disabled={loading || success}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : (success ? <CheckCircle /> : <Save />)} 
          sx={{ bgcolor: success ? '#4caf50' : '#5A189A', fontWeight: 900, px: 4, borderRadius: 2 }}
        >
          {loading ? 'Guardando...' : (success ? '¡Guardado!' : 'Guardar Cambios')}
        </Button>
        <Button variant="outlined" onClick={handlePrint} startIcon={<Visibility />} color="success" sx={{ fontWeight: 900, borderRadius: 2 }}>
          Ver SAAC
        </Button>
      </DialogActions>

      <Box className="area-imprimible" sx={{ display: 'none' }}>
        <FichaMedicaTemplate scout={scout} datosMedicos={formData} />
      </Box>

      <style>{`
        @media print {
          @page { margin: 0; size: A4; }
          body * { visibility: hidden; }
          .no-print { display: none !important; }
          .area-imprimible { display: block !important; position: absolute; left: 0; top: 0; width: 210mm; }
          .area-imprimible, .area-imprimible * { visibility: visible; }
        }
      `}</style>
    </Dialog>
  );
};