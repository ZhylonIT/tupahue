import { useState, useRef } from 'react';
import {
  Typography, Box, TextField, Button, Container,
  Paper, Stack, Grid, Alert, MenuItem
} from '@mui/material';
import { Email, LocationOn, AccessTime, Send, KeyboardArrowDown } from '@mui/icons-material';
import bannerContacto from '../assets/images/bannercontacto.png';

const RAMAS = [
  'Lobatos y Lobeznas (7 a 10 años)',
  'Rama Scout (10 a 14 años)',
  'Caminantes (14 a 17 años)',
  'Rovers (17 a 21 años)',
  'Educadores / Colaboradores'
];

const VIOLETA_SCOUT = '#5A189A';

export const ContactoPage = () => {
  const [formData, setFormData] = useState({ nombre: '', email: '', rama: '', mensaje: '' });
  const [error, setError] = useState('');
  const [enviado, setEnviado] = useState(false);

  const nombreInputRef = useRef(null);

  const scrollToForm = () => {
    const formElement = document.getElementById('seccion-formulario');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        if (nombreInputRef.current) {
          nombreInputRef.current.focus();
        }
      }, 700);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.nombre || !formData.email || !formData.mensaje) {
      setError('Por favor, completá los campos obligatorios.');
      return;
    }

    if (!emailRegex.test(formData.email)) {
      setError('Por favor, ingresá un correo electrónico válido.');
      return;
    }

    setEnviado(true);
    setFormData({ nombre: '', email: '', rama: '', mensaje: '' });
    setTimeout(() => setEnviado(false), 5000);
  };

  const textFieldStyles = {
    '& .MuiOutlinedInput-root': {
      '&.Mui-focused fieldset': { borderColor: VIOLETA_SCOUT },
    },
    '& .MuiInputLabel-root.Mui-focused': { color: VIOLETA_SCOUT },
  };

  return (
    <Box sx={{ overflowX: 'hidden' }}>
      {/* BANNER HERO */}
      <Box
        sx={{
          position: 'relative',
          height: { xs: '70vh', md: '80vh' },
          minHeight: '500px',
          width: '100vw',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          backgroundImage: `linear-gradient(rgba(90, 24, 154, 0.7), rgba(90, 24, 154, 0.7)), url(${bannerContacto})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          textAlign: 'center',
          mb: 10,
        }}
      >
        <Container maxWidth="md">
          <Typography variant="overline" sx={{ fontSize: '1.2rem', fontWeight: 300, letterSpacing: 2, display: 'block', mb: 1 }}>
            El fogón está encendido
          </Typography>
          <Typography 
            variant="h1" 
            sx={{ 
              fontWeight: 800, 
              fontSize: { xs: '3rem', md: '5.5rem' }, 
              mb: 1, 
              letterSpacing: '-2px',
              textShadow: '2px 2px 10px rgba(0,0,0,0.3)' 
            }}
          >
            Tu lugar, nuestra casa...
          </Typography>
          <Typography variant="h4" sx={{ mb: 5, fontWeight: 300, opacity: 0.9 }}>
            ¡Tu próxima aventura comienza acá!
          </Typography>
          <Button
            variant="outlined"
            size="large"
            onClick={scrollToForm}
            endIcon={<KeyboardArrowDown />}
            sx={{
              color: 'white', borderColor: 'white', borderWidth: 2, borderRadius: 10, px: 5, py: 1.5,
              fontSize: '1.1rem',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.1)', transform: 'translateY(3px)' },
              transition: 'all 0.3s'
            }}
          >
            Escribinos
          </Button>
        </Container>
      </Box>

      {/* SECCIÓN CONTENIDO PRINCIPAL */}
      <Container maxWidth="lg" sx={{ pb: 10 }}>
        <Grid
          container
          id="seccion-formulario"
          spacing={0}
          alignItems="flex-start" // Alineación al tope superior
        >
          {/* COLUMNA IZQUIERDA: INFORMACIÓN */}
          <Grid item xs={12} md={6} sx={{ pr: { md: 8 } }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                // Este pt: 6 iguala el padding interno del Paper de la derecha
                pt: { xs: 0, md: 6 }, 
                textAlign: 'left'
              }}
            >
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  mb: 3,
                  color: VIOLETA_SCOUT,
                  lineHeight: 1.1,
                  fontSize: { xs: '2.5rem', md: '3rem' }
                }}
              >
                ¡Sumate a nuestra aventura!
              </Typography>
              
              <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem', mb: 6, maxWidth: '500px' }}>
                Estamos listos para recibirte y responder todas tus dudas. No hace falta experiencia previa, ¡solo ganas de aprender!
              </Typography>

              <Stack spacing={4}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <LocationOn sx={{ color: VIOLETA_SCOUT, fontSize: 35 }} />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>Ubicación</Typography>
                    <Typography variant="body1">Monroe 750, Ituzaingó.</Typography>
                    <Typography variant="body2" color="text.secondary">Patio de la Parroquia "Nuestra Señora del Pilar".</Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <AccessTime sx={{ color: VIOLETA_SCOUT, fontSize: 35 }} />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>Horarios</Typography>
                    <Typography variant="body1">Sábados de 15:00 a 18:00 hs.</Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Email sx={{ color: VIOLETA_SCOUT, fontSize: 35 }} />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>Email</Typography>
                    <Typography variant="body1">grupo996@scouts.org.ar</Typography>
                  </Box>
                </Box>
              </Stack>
            </Box>
          </Grid>

          {/* COLUMNA DERECHA: FORMULARIO */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 4, md: 6 }, // El padding md: 6 define la posición del título derecho
                borderRadius: 8,
                bgcolor: '#ffffff',
                border: '1px solid #eaeaea',
                boxShadow: '0 20px 40px rgba(90, 24, 154, 0.05)',
              }}
            >
              <Typography variant="h4" sx={{ fontWeight: 800, mb: 4, color: VIOLETA_SCOUT }}>
                Envianos un mensaje
              </Typography>
              <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField fullWidth label="Nombre completo" name="nombre" value={formData.nombre} onChange={handleChange} sx={textFieldStyles} inputRef={nombreInputRef} />
                <TextField fullWidth label="Correo electrónico" name="email" value={formData.email} onChange={handleChange} sx={textFieldStyles} />
                <TextField select fullWidth label="¿Por qué rama consultas?" name="rama" value={formData.rama} onChange={handleChange} sx={textFieldStyles}>
                  {RAMAS.map((r) => (<MenuItem key={r} value={r}>{r}</MenuItem>))}
                </TextField>
                <TextField fullWidth label="Tu mensaje" name="mensaje" multiline rows={4} value={formData.mensaje} onChange={handleChange} sx={textFieldStyles} />

                {error && <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>}
                {enviado && <Alert severity="success" sx={{ borderRadius: 2 }}>¡Mensaje enviado con éxito!</Alert>}

                <Button
                  type="submit" variant="contained" size="large" endIcon={<Send />}
                  sx={{ py: 2, mt: 2, borderRadius: 4, fontWeight: 'bold', bgcolor: VIOLETA_SCOUT, fontSize: '1.1rem', '&:hover': { bgcolor: '#3c1066' } }}
                >
                  Enviar Consulta
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* MAPA GOOGLE */}
        <Box
          sx={{
            mt: 12,
            height: '450px',
            width: '100%',
            borderRadius: 6,
            overflow: 'hidden',
            boxShadow: '0 12px 30px rgba(0,0,0,0.08)',
            border: '1px solid #eee',
          }}
        >
          <iframe
            title="Mapa"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3282.4431536761763!2d-58.675!3d-34.661!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcbe075b9f7a5b%3A0x6b3b5b5b5b5b5b5b!2sMonroe%20750%2C%20Ituzaing%C3%B3!5e0!3m2!1ses-419!2sar!4v1234567890"
            width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy"
          />
        </Box>
      </Container>
    </Box>
  );
};