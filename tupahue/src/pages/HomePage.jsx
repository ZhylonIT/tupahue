import { Typography, Button, Box, Grid, Card, CardContent, Container, Stack } from '@mui/material';
import { Link } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import bannerhome from '../assets/images/bannerhome.jpg'

const HERO_IMAGE = bannerhome;

export const HomePage = () => {
  const branchPreviews = [
    {
      id: 'lobatos', // Coincide con la ruta /ramas/lobatos
      title: 'Lobatos y Lobeznas',
      age: '7 a 10 años',
      desc: 'Aprendiendo a través del juego y el Gran Aullido.',
      color: '#FFD60A'
    },
    {
      id: 'scouts', // Coincide con la ruta /ramas/scouts
      title: 'Rama Scout',
      age: '10 a 14 años',
      desc: 'La aventura de la patrulla y la vida al aire libre.',
      color: '#06af22'
    },
    {
      id: 'caminantes', // Coincide con la ruta /ramas/caminantes
      title: 'Caminantes',
      age: '14 a 18 años',
      desc: 'Descubriendo nuevos horizontes y desafíos grupales.',
      color: '#1183ee'
    },
    {
      id: 'rovers', // Coincide con la ruta /ramas/rovers
      title: 'Rovers',
      age: '18 a 22 años',
      desc: 'El servicio como estilo de vida y compromiso social.',
      color: '#C1121F'
    },
  ];

  return (
    <Box>
      {/* HERO SECTION - ANCHO COMPLETO */}
      <Box
        sx={{
          position: 'relative',
          height: { xs: '70vh', md: '80vh' },
          minHeight: '500px',
          width: '100vw',
          left: '50%',
          right: '50%',
          ml: '-50vw',
          mr: '-50vw',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          backgroundImage: `linear-gradient(rgba(90, 24, 154, 0.6), rgba(90, 24, 154, 0.8)), url(${HERO_IMAGE})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          textAlign: 'center',
          mb: 8,
          mt: 0,
          pt: 0
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h1"
            sx={{
              fontWeight: 800,
              fontSize: { xs: '3.5rem', md: '5.5rem' },
              mb: 2,
              letterSpacing: '-2px'
            }}
          >
            Siempre Listos
          </Typography>

          <Typography
            variant="h5"
            sx={{
              mb: 5,
              fontWeight: 400,
              lineHeight: 1.6,
              opacity: 0.95,
              maxWidth: '700px',
              mx: 'auto'
            }}
          >
            Bienvenidos a la casa del Grupo Scout Tupahue. Educando en valores a través de la aventura, el compañerismo y el servicio en la naturaleza.
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            <Button
              variant="contained"
              size="large"
              component={Link}
              to="/contacto"
              endIcon={<ArrowForwardIcon />}
              sx={{
                bgcolor: 'white',
                color: '#5A189A',
                fontWeight: 'bold',
                px: 5,
                py: 2,
                borderRadius: 10,
                fontSize: '1.1rem',
                '&:hover': { bgcolor: '#f0f0f0', transform: 'scale(1.05)' },
                transition: 'all 0.3s'
              }}
            >
              Sumate a la aventura
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* SECCIÓN RAMAS - CENTRADA */}
      <Container maxWidth="lg" sx={{ mb: 10 }}>
        <Typography
          variant="h3"
          textAlign="center"
          sx={{ fontWeight: 800, mb: 2, color: '#333' }}
        >
          Nuestras Ramas
        </Typography>
        <Typography
          variant="h6"
          textAlign="center"
          color="text.secondary"
          sx={{ mb: 6, maxWidth: '600px', mx: 'auto' }}
        >
          Cada etapa es una nueva oportunidad para crecer y aprender juntos.
        </Typography>

        <Grid
          container
          spacing={4}
          justifyContent="center"
        >
          {branchPreviews.map((branch, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                elevation={0}
                sx={{
                  height: '100%',
                  borderRadius: 6,
                  border: '1px solid #eee',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover': {
                    transform: 'translateY(-10px)',
                    boxShadow: `0 20px 40px rgba(0,0,0,0.08)`,
                    borderColor: branch.color
                  }
                }}
              >
                <CardContent sx={{ p: 4, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box
                    sx={{
                      width: '60px',
                      height: '8px',
                      bgcolor: branch.color,
                      mx: 'auto',
                      mb: 3,
                      borderRadius: 2
                    }}
                  />

                  <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {branch.title}
                  </Typography>

                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: branch.color,
                      fontWeight: 'bold',
                      mb: 2,
                      textTransform: 'uppercase',
                      letterSpacing: 1
                    }}
                  >
                    {branch.age}
                  </Typography>

                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3, flexGrow: 1 }}>
                    {branch.desc}
                  </Typography>

                  <Button
                    component={Link}
                    to={`/ramas/${branch.id}`} // Redirección dinámica al detalle
                    variant="outlined"
                    sx={{
                      mt: 'auto',
                      textTransform: 'none',
                      fontWeight: 'bold',
                      borderRadius: 3,
                      color: branch.color,
                      borderColor: branch.color,
                      '&:hover': {
                        bgcolor: branch.color,
                        color: 'white',
                        borderColor: branch.color,
                      }
                    }}
                  >
                    Saber más
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};