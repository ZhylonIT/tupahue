import { useState } from 'react';
import { Box, Typography, TextField, Grid, Button, Checkbox, FormControlLabel, Paper, Stack, Dialog, DialogTitle, DialogContent, DialogActions, Divider } from '@mui/material';
import { Print, Save } from '@mui/icons-material';
import { FichaMedicaTemplate } from './FichaMedicaTemplate';

export const FichaMedicaForm = ({ open, onClose, scout, onSave }) => {
  const [formData, setFormData] = useState(scout.datosMedicos || {
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
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleGuardar = () => {
    onSave({ ...scout, datosMedicos: formData });
    onClose();
  };

  const handlePrint = () => {
    window.print();
  };

  if (!scout) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth>
      <DialogTitle sx={{ bgcolor: '#5A189A', color: 'white', fontWeight: 'bold' }}>
        Ficha Médica de {scout.nombre} {scout.apellido}
      </DialogTitle>
      
      <DialogContent sx={{ p: 3, bgcolor: '#f8f9fa' }} className="no-print">
        <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
          Completá todos los datos requeridos. Al guardar, podrás generar el PDF oficial con el formato de Scouts de Argentina.
        </Typography>

        <Grid container spacing={3}>
          
          {/* --- DATOS GENERALES --- */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="subtitle1" fontWeight="bold" color="primary" mb={2}>1. Datos Generales y Contacto</Typography>
              <Stack spacing={2}>
                <TextField label="Fecha último control médico" size="small" name="fechaControl" value={formData.fechaControl} onChange={handleChange} fullWidth placeholder="DD/MM/AAAA" />
                <Divider sx={{ my: 1 }} />
                <TextField label="Domicilio Completo" size="small" name="domicilio" value={formData.domicilio} onChange={handleChange} fullWidth />
                <TextField label="Teléfono Emergencia 1" size="small" name="telEmergencia1" value={formData.telEmergencia1} onChange={handleChange} fullWidth />
                <TextField label="Teléfono Emergencia 2" size="small" name="telEmergencia2" value={formData.telEmergencia2} onChange={handleChange} fullWidth />
              </Stack>
            </Paper>
          </Grid>

          {/* --- ANTECEDENTES Y SITUACIONES --- */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="subtitle1" fontWeight="bold" color="primary" mb={2}>2. Antecedentes Médicos</Typography>
              <Grid container>
                <Grid item xs={6}><FormControlLabel control={<Checkbox size="small" checked={formData.hemorragias} onChange={handleChange} name="hemorragias" />} label={<Typography variant="body2">Hemorragias nasales</Typography>} /></Grid>
                <Grid item xs={6}><FormControlLabel control={<Checkbox size="small" checked={formData.encias} onChange={handleChange} name="encias" />} label={<Typography variant="body2">Sangran encías</Typography>} /></Grid>
                <Grid item xs={6}><FormControlLabel control={<Checkbox size="small" checked={formData.dolorCabeza} onChange={handleChange} name="dolorCabeza" />} label={<Typography variant="body2">Dolor de cabeza</Typography>} /></Grid>
                <Grid item xs={6}><FormControlLabel control={<Checkbox size="small" checked={formData.presionAlta} onChange={handleChange} name="presionAlta" />} label={<Typography variant="body2">Presión alta</Typography>} /></Grid>
                <Grid item xs={6}><FormControlLabel control={<Checkbox size="small" checked={formData.presionBaja} onChange={handleChange} name="presionBaja" />} label={<Typography variant="body2">Presión baja</Typography>} /></Grid>
                <Grid item xs={6}><FormControlLabel control={<Checkbox size="small" checked={formData.transfusiones} onChange={handleChange} name="transfusiones" />} label={<Typography variant="body2">Transfusiones</Typography>} /></Grid>
                <Grid item xs={6}><FormControlLabel control={<Checkbox size="small" checked={formData.convulsiones} onChange={handleChange} name="convulsiones" />} label={<Typography variant="body2">Convulsiones</Typography>} /></Grid>
                <Grid item xs={6}><FormControlLabel control={<Checkbox size="small" checked={formData.cirugias} onChange={handleChange} name="cirugias" />} label={<Typography variant="body2">Cirugías (último año)</Typography>} /></Grid>
                <Grid item xs={12}><FormControlLabel control={<Checkbox size="small" checked={formData.internaciones} onChange={handleChange} name="internaciones" />} label={<Typography variant="body2">Internaciones (último año)</Typography>} /></Grid>
              </Grid>
              
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" fontWeight="bold">Actividad Física</Typography>
              <Grid container>
                <Grid item xs={12}><FormControlLabel control={<Checkbox size="small" checked={formData.actividadFisica} onChange={handleChange} name="actividadFisica" />} label={<Typography variant="body2">Realiza actividad física regularmente</Typography>} /></Grid>
                <Grid item xs={12}><FormControlLabel control={<Checkbox size="small" checked={formData.cualquierActividad} onChange={handleChange} name="cualquierActividad" />} label={<Typography variant="body2">Puede realizar cualquier actividad</Typography>} /></Grid>
                {(!formData.actividadFisica || !formData.cualquierActividad) && (
                  <Grid item xs={12}>
                    <TextField label="Especifique el motivo" size="small" name="motivoNoActividad" value={formData.motivoNoActividad} onChange={handleChange} fullWidth sx={{ mt: 1 }} />
                  </Grid>
                )}
              </Grid>
            </Paper>
          </Grid>

          {/* --- FÍSICO Y VACUNAS --- */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="subtitle1" fontWeight="bold" color="primary" mb={2}>3. Físico y Vacunas</Typography>
              <Stack direction="row" spacing={2} mb={2}>
                <TextField label="Grupo" size="small" name="grupoSanguineo" value={formData.grupoSanguineo} onChange={handleChange} fullWidth />
                <TextField label="Factor RH" size="small" name="factorRh" value={formData.factorRh} onChange={handleChange} fullWidth />
              </Stack>
              <Stack direction="row" spacing={2} mb={3}>
                <TextField label="Peso (Kg)" size="small" name="peso" value={formData.peso} onChange={handleChange} fullWidth />
                <TextField label="Talla (m)" size="small" name="talla" value={formData.talla} onChange={handleChange} fullWidth />
              </Stack>
              
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" fontWeight="bold" mb={1}>Fechas Últimas Dosis</Typography>
              <Stack spacing={1.5}>
                <TextField label="Quíntuple" size="small" name="vacunaQuintuple" value={formData.vacunaQuintuple} onChange={handleChange} fullWidth />
                <TextField label="Triple Bacteriana Celular" size="small" name="vacunaTripleCelular" value={formData.vacunaTripleCelular} onChange={handleChange} fullWidth />
                <TextField label="Triple Bacteriana Acelular" size="small" name="vacunaTripleAcelular" value={formData.vacunaTripleAcelular} onChange={handleChange} fullWidth />
                <TextField label="Doble Bacteriana" size="small" name="vacunaDoble" value={formData.vacunaDoble} onChange={handleChange} fullWidth />
              </Stack>
              <Grid container mt={1}>
                <Grid item xs={12}><FormControlLabel control={<Checkbox size="small" checked={formData.calendarioCompleto} onChange={handleChange} name="calendarioCompleto" />} label={<Typography variant="body2" sx={{fontWeight: 'bold', color: '#2e7d32'}}>Calendario de vacunación completo</Typography>} /></Grid>
                <Grid item xs={6}><FormControlLabel control={<Checkbox size="small" checked={formData.noTieneVacunas} onChange={handleChange} name="noTieneVacunas" />} label={<Typography variant="body2" sx={{fontSize: '0.8rem'}}>No tiene estas vacunas</Typography>} /></Grid>
                <Grid item xs={6}><FormControlLabel control={<Checkbox size="small" checked={formData.noSabeVacunas} onChange={handleChange} name="noSabeVacunas" />} label={<Typography variant="body2" sx={{fontSize: '0.8rem'}}>No sabe / No contesta</Typography>} /></Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* --- CONDICIONES ESPECÍFICAS --- */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="subtitle1" fontWeight="bold" color="primary" mb={2}>4. Condiciones Específicas y Tratamientos</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel control={<Checkbox size="small" checked={formData.alergia} onChange={handleChange} name="alergia" />} label="Sufre alergias" />
                  {formData.alergia && <TextField label="¿Cuáles?" size="small" name="cualAlergia" value={formData.cualAlergia} onChange={handleChange} fullWidth />}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel control={<Checkbox size="small" checked={formData.medicacion} onChange={handleChange} name="medicacion" />} label="Toma Medicación" />
                  {formData.medicacion && <TextField label="¿Cuál?" size="small" name="cualMedicacion" value={formData.cualMedicacion} onChange={handleChange} fullWidth />}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel control={<Checkbox size="small" checked={formData.cronica} onChange={handleChange} name="cronica" />} label="Enfermedad Crónica" />
                  {formData.cronica && <TextField label="¿Cuál?" size="small" name="cualCronica" value={formData.cualCronica} onChange={handleChange} fullWidth />}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel control={<Checkbox size="small" checked={formData.tratamiento} onChange={handleChange} name="tratamiento" />} label="Requiere tratamiento" />
                  {formData.tratamiento && <TextField label="¿Cuál?" size="small" name="cualTratamiento" value={formData.cualTratamiento} onChange={handleChange} fullWidth />}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel control={<Checkbox size="small" checked={formData.anticoagulado} onChange={handleChange} name="anticoagulado" />} label="Está anticoagulado" />
                  {formData.anticoagulado && <TextField label="¿Con qué droga?" size="small" name="drogaAnticoagulante" value={formData.drogaAnticoagulante} onChange={handleChange} fullWidth />}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel control={<Checkbox size="small" checked={formData.dieta} onChange={handleChange} name="dieta" />} label="Régimen dietario especial" />
                  {formData.dieta && <TextField label="¿Cuál?" size="small" name="cualDieta" value={formData.cualDieta} onChange={handleChange} fullWidth />}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel control={<Checkbox size="small" checked={formData.panico} onChange={handleChange} name="panico" />} label="Ataques de pánico/ansiedad" />
                  {formData.panico && <TextField label="Indique frecuencia" size="small" name="frecuenciaPanico" value={formData.frecuenciaPanico} onChange={handleChange} fullWidth />}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel control={<Checkbox size="small" checked={formData.saludMental} onChange={handleChange} name="saludMental" />} label="Diagnóstico salud mental" />
                  {formData.saludMental && <TextField label="¿Cuál?" size="small" name="cualSaludMental" value={formData.cualSaludMental} onChange={handleChange} fullWidth />}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel control={<Checkbox size="small" checked={formData.tratamientoMental} onChange={handleChange} name="tratamientoMental" />} label="Tratamiento psicológico/psiquiátrico" />
                  {formData.tratamientoMental && <TextField label="¿Cuál?" size="small" name="cualTratamientoMental" value={formData.cualTratamientoMental} onChange={handleChange} fullWidth />}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack direction="row" spacing={2} mt={1}>
                    <FormControlLabel control={<Checkbox size="small" checked={formData.fobia} onChange={handleChange} name="fobia" />} label="Miedo excesivo / Fobia" />
                    <FormControlLabel control={<Checkbox size="small" checked={formData.cud} onChange={handleChange} name="cud" />} label="Tiene CUD" />
                  </Stack>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* --- OBRA SOCIAL Y EXTRAS --- */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="subtitle1" fontWeight="bold" color="primary" mb={2}>5. Obra Social y Extras</Typography>
              <Stack spacing={2}>
                <TextField label="Obra Social o Prepaga" size="small" name="obraSocial" value={formData.obraSocial} onChange={handleChange} fullWidth />
                <TextField label="Credencial N°" size="small" name="nroCredencial" value={formData.nroCredencial} onChange={handleChange} fullWidth />
                <TextField label="Tel. Emergencia Obra Social" size="small" name="telObraSocial" value={formData.telObraSocial} onChange={handleChange} fullWidth />
              </Stack>
              <Divider sx={{ my: 3 }} />
              <Typography variant="subtitle2" fontWeight="bold" mb={1}>Extras</Typography>
              <Stack spacing={1}>
                <FormControlLabel control={<Checkbox size="small" checked={formData.adjuntaCertificado} onChange={handleChange} name="adjuntaCertificado" />} label={<Typography variant="body2">Adjunta certificado de aptitud médica</Typography>} />
                <FormControlLabel control={<Checkbox size="small" checked={formData.hablarEducador} onChange={handleChange} name="hablarEducador" />} label={<Typography variant="body2">Desea que un educador se comunique</Typography>} />
              </Stack>
            </Paper>
          </Grid>

        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3, className: 'no-print' }}>
        <Button onClick={onClose} color="inherit" sx={{ fontWeight: 'bold' }}>Cancelar</Button>
        <Button variant="contained" onClick={handleGuardar} startIcon={<Save />} sx={{ bgcolor: '#5A189A', fontWeight: 'bold' }}>
          Guardar Datos
        </Button>
        <Button variant="outlined" onClick={handlePrint} startIcon={<Print />} color="success" sx={{ fontWeight: 'bold' }}>
          Imprimir / Generar PDF
        </Button>
      </DialogActions>

      {/* --- ÁREA DE IMPRESIÓN OCULTA --- */}
      <Box className="area-imprimible" sx={{ display: 'none' }}>
        <FichaMedicaTemplate scout={scout} datosMedicos={formData} />
      </Box>

      {/* --- REGLAS DE ORO DE IMPRESIÓN --- */}
      <style>
        {`
          @media print {
            @page { margin: 0; size: A4; }
            html, body { margin: 0; padding: 0; height: 100%; overflow: hidden; background: white; }
            body * { visibility: hidden; }
            .no-print { display: none !important; }
            .area-imprimible { display: block !important; }
            .area-imprimible, .area-imprimible * { visibility: visible; }
            .area-imprimible { position: absolute; left: 0; top: 0; width: 210mm; height: 297mm; }
          }
        `}
      </style>
    </Dialog>
  );
};