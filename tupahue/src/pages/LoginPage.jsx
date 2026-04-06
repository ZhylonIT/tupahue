import { useState } from 'react';
import { 
  Container, Box, Paper, Typography, TextField, Button, Link, Stack, 
  IconButton, InputAdornment, CircularProgress, Dialog, DialogTitle, 
  DialogContent, DialogActions, DialogContentText, Alert, Collapse, MenuItem 
} from '@mui/material';
import { Visibility, VisibilityOff, Email, PersonAdd, Login, Badge, FamilyRestroom, Person } from '@mui/icons-material';
import logoTupahue from '../assets/images/logo.png';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 
import { ROLES } from '../constants/auth';

const VIOLETA_SCOUT = '#5A189A';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login, register } = useAuth(); 

  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dni, setDni] = useState(''); 
  const [nombre, setNombre] = useState(''); 
  const [apellido, setApellido] = useState('');
  const [role, setRole] = useState(ROLES.JOVEN); 
  const [tieneHijos, setTieneHijos] = useState(false); 
  const [hijosDnis, setHijosDnis] = useState(''); 

  const [errorMsg, setErrorMsg] = useState(''); 

  const [openRecover, setOpenRecover] = useState(false);
  const [emailRecover, setEmailRecover] = useState('');
  const [recoverLoading, setRecoverLoading] = useState(false);
  const [recoverSent, setRecoverSent] = useState(false);

  const isEmailInvalid = email !== '' && !email.includes('@');
  const isRecoverEmailInvalid = emailRecover !== '' && !emailRecover.includes('@');

  const cleanDni = (value) => value.replace(/\D/g, '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || isEmailInvalid) return;
    
    setLoading(true);
    setErrorMsg('');

    try {
      if (isRegister) {
        if (!nombre || !apellido || !dni) {
          throw new Error("Nombre, Apellido y DNI son obligatorios.");
        }
        const dnisArray = hijosDnis.split(',').map(d => cleanDni(d)).filter(d => d !== '');
        
        await register({ 
          email, 
          password, 
          dni: cleanDni(dni), 
          nombre, 
          apellido,
          roleSolicitado: role, 
          hijosDnis: dnisArray 
        });
      } else {
        await login(email, password);
      }
      
      navigate('/dashboard'); 
    } catch (error) {
      console.error("Error Auth:", error.message);
      setErrorMsg(error.message.includes('Invalid login credentials') 
        ? 'Email o contraseña incorrectos.' 
        : error.message || 'Hubo un problema al conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  const handleRecoverPassword = (e) => {
    e.preventDefault();
    if (!emailRecover || isRecoverEmailInvalid) return;
    setRecoverLoading(true);
    setTimeout(() => {
      setRecoverLoading(false);
      setRecoverSent(true);
      setTimeout(() => {
        setOpenRecover(false);
        setRecoverSent(false);
        setEmailRecover('');
      }, 4000);
    }, 2000);
  };

  return (
    <Box sx={{ minHeight: '90vh', display: 'flex', alignItems: 'center', bgcolor: '#f8f9fa', py: 6 }}>
      <Container maxWidth="xs">
        <Paper 
          elevation={4} 
          sx={{ 
            p: 4, borderRadius: 4, textAlign: 'center',
            borderTop: `6px solid ${VIOLETA_SCOUT}` 
          }}
        >
          <Link component={NavLink} to="/">
            <Box
              component="img"
              src={logoTupahue}
              alt="Logo Tupahue"
              sx={{ height: 85, mb: 2, transition: '0.3s', '&:hover': { transform: 'scale(1.05)' } }}
            />
          </Link>

          <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, color: '#333' }}>
            {isRegister ? 'Crear mi Cuenta' : 'Gestión Tupahue'}
          </Typography>
          
          <Typography variant="body2" color="textSecondary" sx={{ mb: 4 }}>
            {isRegister 
              ? 'Registrate para acceder al sistema.' 
              : 'Ingresá con tu cuenta para acceder al panel.'}
          </Typography>

          <Collapse in={!!errorMsg}>
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {errorMsg}
            </Alert>
          </Collapse>

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Stack spacing={2.5}>
              
              {isRegister && (
                <>
                  <TextField 
                    select label="Soy..." size="small"
                    value={role} onChange={(e) => setRole(e.target.value)}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  >
                    <MenuItem value={ROLES.JOVEN}>Joven (Protagonista)</MenuItem>
                    <MenuItem value={ROLES.EDUCADOR}>Educador (Dirigente)</MenuItem>
                    <MenuItem value={ROLES.FAMILIA}>Familiar / Tutor</MenuItem>
                  </TextField>

                  <Stack direction="row" spacing={1}>
                    <TextField 
                      fullWidth label="Nombre" size="small"
                      value={nombre} onChange={(e) => setNombre(e.target.value)}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                    <TextField 
                      fullWidth label="Apellido" size="small"
                      value={apellido} onChange={(e) => setApellido(e.target.value)}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Stack>

                  <TextField 
                    fullWidth label="Mi DNI" size="small"
                    value={dni} 
                    onChange={(e) => setDni(cleanDni(e.target.value))}
                    placeholder="Solo números"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person sx={{ fontSize: 20, color: '#ccc' }} />
                        </InputAdornment>
                      ),
                    }}
                  />

                  {(role === ROLES.EDUCADOR || role === ROLES.FAMILIA) && (
                    <Box sx={{ textAlign: 'left', p: 1.5, bgcolor: '#f0f0f0', borderRadius: 2 }}>
                      <Button 
                        size="small" 
                        onClick={() => setTieneHijos(!tieneHijos)}
                        startIcon={<FamilyRestroom />}
                        sx={{ textTransform: 'none', fontWeight: 800, color: VIOLETA_SCOUT }}
                      >
                        {tieneHijos ? 'No vincular hijos ahora' : '¿Vincular hijos?'}
                      </Button>
                      {tieneHijos && (
                        <TextField 
                          placeholder="DNI de hijos (ej: 40001002)" 
                          size="small" fullWidth sx={{ mt: 1, bgcolor: 'white' }}
                          value={hijosDnis} 
                          onChange={(e) => setHijosDnis(e.target.value)}
                          helperText="Usar solo números (separados por coma)"
                        />
                      )}
                    </Box>
                  )}
                </>
              )}

              <TextField 
                fullWidth label="Email" size="small"
                value={email} onChange={(e) => setEmail(e.target.value)}
                error={isEmailInvalid}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
              
              <TextField 
                fullWidth label="Contraseña" size="small"
                type={showPassword ? 'text' : 'password'}
                value={password} onChange={(e) => setPassword(e.target.value)}
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
                fullWidth type="submit" variant="contained" size="large"
                disabled={loading || !email || !password || isEmailInvalid}
                startIcon={!loading && (isRegister ? <PersonAdd /> : <Login />)}
                sx={{ 
                  bgcolor: VIOLETA_SCOUT, py: 1.5, borderRadius: 2, fontWeight: 900,
                  '&:hover': { bgcolor: '#48137B' }
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : (isRegister ? 'Registrarme' : 'Entrar')}
              </Button>
            </Stack>
          </Box>

          <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Button
              onClick={() => { setIsRegister(!isRegister); setErrorMsg(''); }}
              variant="text"
              sx={{ 
                color: VIOLETA_SCOUT, textTransform: 'none', fontWeight: 800,
                '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' }
              }}
            >
              {isRegister ? '¿Ya tenés cuenta? Inicia sesión' : '¿No tenés cuenta? Registrate acá'}
            </Button>
            
            {!isRegister && (
              <Button
                onClick={() => setOpenRecover(true)}
                variant="text"
                sx={{ color: 'text.secondary', textTransform: 'none', fontSize: '0.8rem' }}
              >
                ¿Olvidaste tu contraseña?
              </Button>
            )}
          </Box>
        </Paper>
      </Container>

      <Dialog open={openRecover} onClose={() => setOpenRecover(false)}>
        <DialogTitle sx={{ fontWeight: 900 }}>Recuperar Contraseña</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Ingresá tu email y te enviaremos un enlace para restablecer tu contraseña.
          </DialogContentText>
          {recoverSent ? (
            <Alert severity="success">Enlace enviado. Revisá tu casilla de correo.</Alert>
          ) : (
            <TextField
              autoFocus margin="dense" label="Email" type="email" fullWidth variant="outlined"
              value={emailRecover} onChange={(e) => setEmailRecover(e.target.value)}
              error={isRecoverEmailInvalid}
            />
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenRecover(false)}>Cancelar</Button>
          {!recoverSent && (
            <Button 
              onClick={handleRecoverPassword} variant="contained" disabled={recoverLoading || !emailRecover || isRecoverEmailInvalid}
              sx={{ bgcolor: VIOLETA_SCOUT }}
            >
              {recoverLoading ? <CircularProgress size={20} /> : 'Enviar'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};