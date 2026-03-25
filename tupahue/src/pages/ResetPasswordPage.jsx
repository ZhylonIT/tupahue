import { useState } from 'react';
import { 
  Container, Box, Paper, Typography, TextField, Button, 
  Stack, IconButton, InputAdornment, CircularProgress, Alert 
} from '@mui/material';
import { Visibility, VisibilityOff, CheckCircleOutline, LockReset } from '@mui/icons-material';
import logoTupahue from '../assets/images/logo.png';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

const VIOLETA_SCOUT = '#5A189A';

export const ResetPasswordPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [passwords, setPasswords] = useState({ password: '', confirmPassword: '' });
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const passwordsMatch = passwords.password === passwords.confirmPassword;
  const isPasswordShort = passwords.password !== '' && passwords.password.length < 6;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!passwordsMatch || isPasswordShort) return;

    setLoading(true);
    // Simulación de actualización en base de datos
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      // Redirigir al login después de 3 segundos
      setTimeout(() => navigate('/login'), 3000);
    }, 2000);
  };

  return (
    <Box 
      sx={{ 
        minHeight: '80vh', display: 'flex', alignItems: 'center', 
        bgcolor: '#f8f9fa', py: 6 
      }}
    >
      <Container maxWidth="xs">
        <Paper 
          elevation={4} 
          sx={{ 
            p: 4, borderRadius: 4, textAlign: 'center',
            borderTop: `6px solid ${VIOLETA_SCOUT}` 
          }}
        >
          <Box
            component="img"
            src={logoTupahue}
            alt="Logo Tupahue"
            sx={{ height: 80, mb: 2 }}
          />

          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: '#333' }}>
            Nueva Contraseña
          </Typography>
          
          <Typography variant="body2" color="textSecondary" sx={{ mb: 4 }}>
            Estás a un paso de recuperar tu acceso. Elegí una clave segura.
          </Typography>

          {success ? (
            <Stack spacing={3} alignItems="center">
              <CheckCircleOutline sx={{ fontSize: 60, color: 'success.main' }} />
              <Alert severity="success" sx={{ width: '100%', borderRadius: 2 }}>
                ¡Contraseña actualizada! Redirigiendo al inicio de sesión...
              </Alert>
              <Button 
                component={RouterLink} 
                to="/login" 
                fullWidth 
                variant="outlined"
                sx={{ borderRadius: 2, color: VIOLETA_SCOUT, borderColor: VIOLETA_SCOUT }}
              >
                Ir al Login ahora
              </Button>
            </Stack>
          ) : (
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Stack spacing={3}>
                <TextField 
                  fullWidth 
                  label="Nueva Contraseña" 
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={passwords.password}
                  onChange={handleChange}
                  error={isPasswordShort}
                  helperText={isPasswordShort ? "Mínimo 6 caracteres" : ""}
                  required
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)}>
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField 
                  fullWidth 
                  label="Confirmar Contraseña" 
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={passwords.confirmPassword}
                  onChange={handleChange}
                  error={passwords.confirmPassword !== '' && !passwordsMatch}
                  helperText={passwords.confirmPassword !== '' && !passwordsMatch ? "Las contraseñas no coinciden" : ""}
                  required
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />

                <Button 
                  fullWidth 
                  type="submit"
                  variant="contained" 
                  size="large"
                  disabled={loading || !passwords.password || !passwordsMatch || isPasswordShort}
                  endIcon={!loading && <LockReset />}
                  sx={{ 
                    bgcolor: VIOLETA_SCOUT, py: 1.5, borderRadius: 2, fontWeight: 'bold',
                    '&:hover': { bgcolor: '#48137B' }
                  }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Restablecer Clave'}
                </Button>
              </Stack>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

//pagina para ver como funciona: http://localhost:5173/reset-password/prueba-exitosa