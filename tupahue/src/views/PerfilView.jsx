import { useState } from 'react';
import { 
  Box, Typography, Paper, Grid, Avatar, Button, Stack, 
  Divider, Chip, TextField, Alert, IconButton, InputAdornment
} from '@mui/material';
import { 
  HistoryEdu, Badge, VerifiedUser, Mail, Edit, Save, Cancel, 
  WhatsApp, LocationOn, Cake, Lock, Visibility, VisibilityOff, 
  BusinessCenter // 🎯 Icono para la profesión
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { FirmaDigitalModal } from '../components/FirmaDigitalModal';

export const PerfilView = () => {
  const { user, userFuncion, updateProfile, updateEmail, updatePassword } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [modalFirma, setModalFirma] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Estados locales - 🎯 Agregamos 'ocupacion'
  const [formData, setFormData] = useState({
    nombre: user?.nombre || '',
    apellido: user?.apellido || '',
    dni: user?.dni || '',
    telefono: user?.telefono || '',
    direccion: user?.direccion || '',
    localidad: user?.localidad || '',
    fecha_nacimiento: user?.fecha_nacimiento || '',
    ocupacion: user?.ocupacion || '' 
  });

  const [securityData, setSecurityData] = useState({
    email: user?.email || '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ msg: '', type: 'success' });

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      // 1. Guardamos datos del perfil incluyendo la nueva ocupación
      await updateProfile(formData);

      // 2. Si el email cambió, lo actualizamos en Auth
      if (securityData.email !== user.email) {
        await updateEmail(securityData.email);
      }

      // 3. Si hay contraseña nueva, la actualizamos
      if (securityData.password) {
        await updatePassword(securityData.password);
        setSecurityData(prev => ({ ...prev, password: '' }));
      }

      setIsEditing(false);
      setStatus({ msg: 'Perfil y credenciales actualizados correctamente.', type: 'success' });
    } catch (e) {
      setStatus({ msg: e.message || 'Error al actualizar datos.', type: 'error' });
    } finally {
      setLoading(false);
      setTimeout(() => setStatus({ msg: '', type: 'success' }), 4000);
    }
  };

  const handleSaveFirma = async (datosFirma) => {
    try {
      await updateProfile({ firma_url: datosFirma.firmaImg });
      setModalFirma(false);
      setStatus({ msg: 'Firma guardada correctamente.', type: 'success' });
    } catch (e) {
      alert("Error al guardar la firma.");
    }
  };

  return (
    <Box sx={{ animation: 'fadeIn 0.5s ease-out', maxWidth: 1000, mx: 'auto', p: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 900 }}>Mi Perfil</Typography>
        {!isEditing ? (
          <Button startIcon={<Edit />} variant="outlined" onClick={() => setIsEditing(true)} sx={{ borderRadius: 2, fontWeight: 700 }}>
            Editar Perfil
          </Button>
        ) : (
          <Stack direction="row" spacing={1}>
            <Button startIcon={<Cancel />} color="error" onClick={() => setIsEditing(false)}>Cancelar</Button>
            <Button startIcon={<Save />} variant="contained" onClick={handleSaveProfile} disabled={loading} sx={{ bgcolor: '#5A189A', fontWeight: 700 }}>
              {loading ? 'Guardando...' : 'Guardar Todo'}
            </Button>
          </Stack>
        )}
      </Stack>

      {status.msg && <Alert severity={status.type} sx={{ mb: 3, borderRadius: 3 }}>{status.msg}</Alert>}

      <Grid container spacing={3}>
        {/* COLUMNA IZQUIERDA: IDENTIDAD */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 4, borderRadius: 4, textAlign: 'center', border: '1px solid #eee', boxShadow: 'none' }}>
            <Avatar sx={{ width: 100, height: 100, mx: 'auto', mb: 2, bgcolor: '#5A189A', fontSize: 40 }}>{user?.nombre?.[0] || 'U'}</Avatar>
            {isEditing ? (
              <Stack spacing={2}>
                <TextField label="Nombre" size="small" value={formData.nombre} onChange={(e) => setFormData({...formData, nombre: e.target.value})} />
                <TextField label="Apellido" size="small" value={formData.apellido} onChange={(e) => setFormData({...formData, apellido: e.target.value})} />
              </Stack>
            ) : (
              <>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>{user?.nombre} {user?.apellido}</Typography>
                <Chip label={userFuncion} size="small" color="primary" sx={{ mt: 1, fontWeight: 700 }} />
              </>
            )}
            <Divider sx={{ my: 3 }} />
            <Stack spacing={2} textAlign="left">
              <Stack direction="row" spacing={2}><Badge color="action" /><Box sx={{ width: '100%' }}><Typography variant="caption" color="textSecondary">DNI</Typography>
              {isEditing ? <TextField size="small" variant="standard" fullWidth value={formData.dni} onChange={(e) => setFormData({...formData, dni: e.target.value})} /> : <Typography variant="body2" sx={{ fontWeight: 700 }}>{user?.dni}</Typography>}</Box></Stack>
              
              {/* 🎯 NUEVA SECCIÓN: OCUPACIÓN */}
              <Stack direction="row" spacing={2}><BusinessCenter color="action" /><Box sx={{ width: '100%' }}><Typography variant="caption" color="textSecondary">Profesión / Ocupación</Typography>
              {isEditing ? <TextField size="small" variant="standard" fullWidth value={formData.ocupacion} onChange={(e) => setFormData({...formData, ocupacion: e.target.value})} placeholder="Ej: Abogado, Comerciante..." /> : <Typography variant="body2" sx={{ fontWeight: 700 }}>{user?.ocupacion || 'No definida'}</Typography>}</Box></Stack>

              <Stack direction="row" spacing={2}><Cake color="action" /><Box sx={{ width: '100%' }}><Typography variant="caption" color="textSecondary">Nacimiento</Typography>
              {isEditing ? <TextField type="date" size="small" variant="standard" fullWidth value={formData.fecha_nacimiento} onChange={(e) => setFormData({...formData, fecha_nacimiento: e.target.value})} /> : <Typography variant="body2" sx={{ fontWeight: 700 }}>{user?.fecha_nacimiento || 'No cargada'}</Typography>}</Box></Stack>
            </Stack>
          </Paper>
        </Grid>

        {/* COLUMNA DERECHA: CONTACTO Y SEGURIDAD */}
        <Grid item xs={12} md={8}>
          <Stack spacing={3}>
            {/* CONTACTO */}
            <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid #eee', boxShadow: 'none' }}>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}><WhatsApp color="primary" /> Contacto y Ubicación</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="textSecondary">WhatsApp / Teléfono</Typography>
                  {isEditing ? <TextField fullWidth size="small" value={formData.telefono} onChange={(e) => setFormData({...formData, telefono: e.target.value})} /> : <Typography variant="body1" sx={{ fontWeight: 600 }}>{user?.telefono || 'Sin asignar'}</Typography>}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="textSecondary">Localidad</Typography>
                  {isEditing ? <TextField fullWidth size="small" value={formData.localidad} onChange={(e) => setFormData({...formData, localidad: e.target.value})} /> : <Typography variant="body1" sx={{ fontWeight: 600 }}>{user?.localidad || 'Sin asignar'}</Typography>}
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" color="textSecondary">Dirección Residencial</Typography>
                  {isEditing ? <TextField fullWidth size="small" value={formData.direccion} onChange={(e) => setFormData({...formData, direccion: e.target.value})} /> : <Typography variant="body1" sx={{ fontWeight: 600 }}>{user?.direccion || 'Sin asignar'}</Typography>}
                </Grid>
              </Grid>
            </Paper>

            {/* SEGURIDAD */}
            <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid #eee', boxShadow: 'none', bgcolor: isEditing ? '#fff8e1' : '#fff' }}>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}><Lock color="primary" /> Credenciales de Acceso</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="textSecondary">Email de Usuario</Typography>
                  {isEditing ? <TextField fullWidth size="small" value={securityData.email} onChange={(e) => setSecurityData({...securityData, email: e.target.value})} /> : <Typography variant="body1" sx={{ fontWeight: 600 }}>{user?.email}</Typography>}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="textSecondary">Contraseña</Typography>
                  {isEditing ? (
                    <TextField 
                      fullWidth size="small" type={showPassword ? 'text' : 'password'} placeholder="Nueva contraseña (opcional)"
                      value={securityData.password} onChange={(e) => setSecurityData({...securityData, password: e.target.value})}
                      InputProps={{ endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShowPassword(!showPassword)}>{showPassword ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment> }}
                    />
                  ) : <Typography variant="body1" sx={{ fontWeight: 600 }}>••••••••••••</Typography>}
                </Grid>
              </Grid>
            </Paper>

            {/* FIRMA */}
            <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid #eee', boxShadow: 'none' }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1 }}><HistoryEdu color="primary" /> Firma Digital</Typography>
                <Button size="small" onClick={() => setModalFirma(true)}>Cambiar Firma</Button>
              </Stack>
              <Box sx={{ mt: 2, border: '1px solid #eee', borderRadius: 2, p: 2, textAlign: 'center', bgcolor: '#fafafa' }}>
                {user?.firma_url ? <img src={user.firma_url} alt="Firma" style={{ maxHeight: 100, maxWidth: '100%' }} /> : <Typography variant="caption">No configurada</Typography>}
              </Box>
            </Paper>
          </Stack>
        </Grid>
      </Grid>

      <FirmaDigitalModal open={modalFirma} onClose={() => setModalFirma(false)} user={user} onConfirm={handleSaveFirma} />
    </Box>
  );
};