import { useState } from 'react';
import { 
  Container, Box, Paper, Typography, TextField, Button, Link, Stack, 
  IconButton, InputAdornment, CircularProgress, Dialog, DialogTitle, 
  DialogContent, DialogActions, DialogContentText, Alert 
} from '@mui/material';
import { Visibility, VisibilityOff, Login, Email } from '@mui/icons-material';
import logoTupahue from '../assets/images/logo.png';
import { NavLink } from 'react-router-dom';

const VIOLETA_SCOUT = '#5A189A';

export const LoginPage = () => {
  // --- ESTADOS LOGIN ---
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // --- ESTADOS RECUPERACIÓN ---
  const [openRecover, setOpenRecover] = useState(false);
  const [emailRecover, setEmailRecover] = useState('');
  const [recoverLoading, setRecoverLoading] = useState(false);
  const [recoverSent, setRecoverSent] = useState(false);

  // Validación de formato de email
  const isEmailInvalid = email !== '' && !email.includes('@');
  const isRecoverEmailInvalid = emailRecover !== '' && !emailRecover.includes('@');

  // Manejador Login
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password || isEmailInvalid) return;
    setLoading(true);
    // Simulación API
    setTimeout(() => setLoading(false), 2000);
  };

  // Manejador Recuperación
  const handleRecoverPassword = (e) => {
    e.preventDefault();
    if (!emailRecover || isRecoverEmailInvalid) return;
    
    setRecoverLoading(true);
    // Simulación de envío de correo
    setTimeout(() => {
      setRecoverLoading(false);
      setRecoverSent(true);
      // Cerramos el modal automáticamente tras 4 segundos del mensaje de éxito
      setTimeout(() => {
        setOpenRecover(false);
        setRecoverSent(false);
        setEmailRecover('');
      }, 4000);
    }, 2000);
  };

  return (
    <Box 
      sx={{ 
        minHeight: '80vh', 
        display: 'flex', 
        alignItems: 'center', 
        bgcolor: '#f8f9fa',
        py: 6 
      }}
    >
      <Container maxWidth="xs">
        <Paper 
          elevation={4} 
          sx={{ 
            p: 4, 
            borderRadius: 4, 
            textAlign: 'center',
            borderTop: `6px solid ${VIOLETA_SCOUT}` 
          }}
        >
          <Link component={NavLink} to="/">
            <Box
              component="img"
              src={logoTupahue}
              alt="Logo Tupahue"
              sx={{ height: 90, mb: 2, transition: '0.3s', '&:hover': { transform: 'scale(1.05)' } }}
            />
          </Link>

          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: '#333' }}>
            Gestión Tupahue
          </Typography>
          
          <Typography variant="body2" color="textSecondary" sx={{ mb: 4 }}>
            Ingresá con tu cuenta para acceder al panel de gestión.
          </Typography>

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Stack spacing={3}>
              <TextField 
                fullWidth 
                label="Usuario o Email" 
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={isEmailInvalid}
                helperText={isEmailInvalid ? "Email no válido" : ""}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
              
              <TextField 
                fullWidth 
                label="Contraseña" 
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button 
                fullWidth 
                type="submit"
                variant="contained" 
                size="large"
                disabled={loading || !email || !password || isEmailInvalid}
                sx={{ 
                  bgcolor: VIOLETA_SCOUT, py: 1.5, borderRadius: 2, fontWeight: 'bold',
                  '&:hover': { bgcolor: '#48137B' }
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Entrar'}
              </Button>
            </Stack>
          </Box>

          <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Button
              onClick={() => setOpenRecover(true)}
              variant="text"
              sx={{ 
                color: VIOLETA_SCOUT, textTransform: 'none', fontWeight: 500,
                '&:hover': { textDecoration: 'underline', bgcolor: 'transparent' }
              }}
            >
              ¿Olvidaste tu contraseña?
            </Button>
            
            <Link 
              component={NavLink} to="/" variant="body2" 
              sx={{ color: 'text.secondary', textDecoration: 'none', mt: 1 }}
            >
              ← Volver al sitio público
            </Link>
          </Box>
        </Paper>
      </Container>

      {/* --- MODAL DE RECUPERACIÓN --- */}
      <Dialog 
        open={openRecover} 
        onClose={() => !recoverLoading && setOpenRecover(false)}
        PaperProps={{ sx: { borderRadius: 4, p: 1, maxWidth: '400px' } }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: VIOLETA_SCOUT, textAlign: 'center' }}>
          Recuperar acceso
        </DialogTitle>
        
        <Box component="form" onSubmit={handleRecoverPassword}>
          <DialogContent>
            {recoverSent ? (
              <Alert severity="success" sx={{ borderRadius: 2 }}>
                Instrucciones enviadas. Revisá tu casilla de correo (y la carpeta de spam).
              </Alert>
            ) : (
              <>
                <DialogContentText sx={{ mb: 3, textAlign: 'center' }}>
                  Ingresá tu correo electrónico y te enviaremos un link para restablecer tu contraseña.
                </DialogContentText>
                <TextField
                  autoFocus
                  required
                  fullWidth
                  label="Correo Electrónico"
                  type="email"
                  variant="outlined"
                  value={emailRecover}
                  onChange={(e) => setEmailRecover(e.target.value)}
                  error={isRecoverEmailInvalid}
                  helperText={isRecoverEmailInvalid ? "Formato de email incorrecto" : ""}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ color: 'action.active', mr: 1 }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </>
            )}
          </DialogContent>
          
          <DialogActions sx={{ p: 3, justifyContent: 'center', gap: 2 }}>
            {!recoverSent && (
              <>
                <Button 
                  onClick={() => setOpenRecover(false)} 
                  disabled={recoverLoading}
                  sx={{ color: 'text.secondary' }}
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit"
                  variant="contained"
                  disabled={recoverLoading || !emailRecover || isRecoverEmailInvalid}
                  sx={{ bgcolor: VIOLETA_SCOUT, px: 4, borderRadius: 2, '&:hover': { bgcolor: '#48137B' } }}
                >
                  {recoverLoading ? <CircularProgress size={24} color="inherit" /> : 'Enviar link'}
                </Button>
              </>
            )}
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
};