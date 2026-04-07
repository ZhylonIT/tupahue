import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, TextField, MenuItem, IconButton, Stack, CircularProgress, Alert } from '@mui/material';
import { Close, Save, Visibility } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import { generarAutorizacionEventoPDF } from '../../services/pdfService';

export const FichaAutorizacionSalidaForm = ({ open, onClose, scout, onSave }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [datos, setDatos] = useState({
    tipoActividad: 'CAMPAMENTO',
    lugarDestino: '',
    ubicacionDestino: '',
    fechaDesde: '',
    fechaHasta: '',
    localidad: 'Ituzaingó',
    provincia: 'Buenos Aires',
    partido: 'Ituzaingó',
  });

  useEffect(() => {
    if (scout?.datosEvento) setDatos(prev => ({ ...prev, ...scout.datosEvento }));
    if (open) setSuccess(false);
  }, [scout, open]);

  const handleChange = (e) => setDatos({ ...datos, [e.target.name]: e.target.value });

  const handleGuardar = async () => {
    setLoading(true);
    try {
      // Preparamos el objeto de tutor para el motor del PDF
      const tutorInfo = {
        nombre: `${user?.nombre} ${user?.apellido}`,
        dni: user?.dni,
        vinculo: scout.datosPersonales?.tutor1Vinculo || 'Padre/Madre',
        domicilio: scout.datosMedicos?.domicilio || '',
        tel: user?.telefono || scout.datosPersonales?.tutor1Tel || '',
        nacionalidad: scout.datosPersonales?.tutor1Nacionalidad || 'Argentina',
        nacimiento: scout.datosPersonales?.tutor1Nacimiento || ''
      };

      const datosCompletos = { 
        ...datos, 
        tutorInfo, 
        firmaPadre: user?.firma_url,
        fechaFirmaPadre: new Date().toLocaleDateString('es-AR')
      };

      const hijoActualizado = { ...scout, datosEvento: datosCompletos };

      // 1. Generar Blob
      const pdfBlob = await generarAutorizacionEventoPDF(hijoActualizado, true);

      // 2. Subir a Storage (Pisando el anterior según lo acordado)
      const filePath = `${scout.id}/auto_campamento_menor/auto_campamento_menor.pdf`;
      await supabase.storage.from('documentos').upload(filePath, pdfBlob, {
        contentType: 'application/pdf', upsert: true
      });

      // 3. Guardar en DB
      await onSave(hijoActualizado, 'auto_campamento_menor');
      setSuccess(true);
    } catch (error) {
      console.error(error);
      alert("Error al procesar la autorización.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerPDF = () => {
    const tutorInfo = {
      nombre: `${user?.nombre} ${user?.apellido}`,
      dni: user?.dni,
      vinculo: scout.datosPersonales?.tutor1Vinculo || 'Padre/Madre',
      domicilio: scout.datosMedicos?.domicilio || '',
      tel: user?.telefono || '',
      nacionalidad: 'Argentina',
      nacimiento: ''
    };
    const scoutTemp = { ...scout, datosEvento: { ...datos, tutorInfo, firmaPadre: user?.firma_url } };
    generarAutorizacionEventoPDF(scoutTemp, false);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ fontWeight: 900, bgcolor: '#5A189A', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Autorización de Salida / Campamento
        <IconButton onClick={onClose} size="small" sx={{ color: 'white' }}><Close /></IconButton>
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        {success && <Alert severity="success" sx={{ mb: 2, fontWeight: 700 }}>¡Autorización generada y subida al legajo!</Alert>}
        <Grid container spacing={2} sx={{ pt: 1 }}>
          <Grid item xs={12}>
            <TextField select fullWidth label="Tipo de Actividad" name="tipoActividad" value={datos.tipoActividad} onChange={handleChange} size="small">
              <MenuItem value="SALIDA">SALIDA</MenuItem>
              <MenuItem value="ACANTONAMIENTO">ACANTONAMIENTO</MenuItem>
              <MenuItem value="CAMPAMENTO">CAMPAMENTO</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12}><TextField fullWidth label="Lugar (Nombre del Predio)" name="lugarDestino" value={datos.lugarDestino} onChange={handleChange} size="small" /></Grid>
          <Grid item xs={12}><TextField fullWidth label="Dirección / Localidad Destino" name="ubicacionDestino" value={datos.ubicacionDestino} onChange={handleChange} size="small" /></Grid>
          <Grid item xs={6}><TextField fullWidth label="Fecha Desde" name="fechaDesde" type="date" value={datos.fechaDesde} InputLabelProps={{ shrink: true }} onChange={handleChange} size="small" /></Grid>
          <Grid item xs={6}><TextField fullWidth label="Fecha Hasta" name="fechaHasta" type="date" value={datos.fechaHasta} InputLabelProps={{ shrink: true }} onChange={handleChange} size="small" /></Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 3, bgcolor: '#f8f9fa' }}>
        <Button onClick={onClose} sx={{ fontWeight: 'bold', color: 'text.secondary' }}>Cerrar</Button>
        <Button variant="outlined" startIcon={<Visibility />} onClick={handleVerPDF} color="secondary" sx={{ fontWeight: 'bold' }}>Vista Previa</Button>
        <Button 
          variant="contained" 
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Save />} 
          onClick={handleGuardar} 
          disabled={loading || !datos.lugarDestino || success}
          sx={{ bgcolor: success ? '#4caf50' : '#5A189A', fontWeight: 'bold', px: 4 }}
        >
          {loading ? 'Generando PDF...' : (success ? '¡Listo!' : 'Guardar y Subir')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};