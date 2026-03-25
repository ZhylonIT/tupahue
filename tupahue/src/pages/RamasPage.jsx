import { Typography, Box, Card, CardContent, CardActions, Button, Container, Chip, CardMedia }
  from '@mui/material';
import { Link } from 'react-router-dom';
import bannerramas from '../assets/images/bannerramas.jpg';

const HERO_IMAGE = bannerramas;

export const RamasPage = () => {
  const ramas = [
    {
      id: 'lobatos',
      nombre: 'Lobatos y Lobeznas',
      edad: '7 a 10 años',
      lema: '"Siempre mejor"',
      descripcion: 'A través del Juego Scout y el Marco Simbólico de El Libro de las Tierras Vírgenes.',
      color: '#fbc02d',
      imagen: '/src/assets/images/lobatosylobeznas.jpg'
    },
    {
      id: 'scouts',
      nombre: 'Scouts',
      edad: '10 a 14 años',
      lema: '"Siempre Listos"',
      descripcion: 'El sistema de patrullas les permite liderar sus propias aventuras y campamentos.',
      color: '#0ac914',
      imagen: '/src/assets/images/Scout.jpg'
    },
    {
      id: 'caminantes',
      nombre: 'Caminantes',
      edad: '14 a 18 años',
      lema: '"Siempre Listos"',
      descripcion: 'El desafío de descubrir el mundo y a uno mismo a través de la empresa y la hoja de ruta.',
      color: '#4faaf5',
      imagen: '/src/assets/images/caminantes.jpg'
    },
    {
      id: 'rovers',
      nombre: 'Rovers',
      edad: '18 a 22 años',
      lema: '"Servir"',
      descripcion: 'Jóvenes que se preparan para la vida adulta a través del proyecto personal y el servicio social.',
      color: '#f10000',
      imagen: '/src/assets/images/rover.jpg'
    }
  ];

  return (
    <Box sx={{ overflowX: 'hidden', width: '100%' }}>

      {/* SECCIÓN HERO */}
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
          backgroundImage: `linear-gradient(rgba(90, 24, 154, 0.7), rgba(90, 24, 154, 0.7)), url(${HERO_IMAGE})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          textAlign: 'center',
          mb: 10,
        }}
      >
        <Container maxWidth="md">
          <Typography variant="overline" sx={{ fontSize: '1.2rem', fontWeight: 300, letterSpacing: 2, display: 'block', mb: 1 }}>
            Etapas de Crecimiento
          </Typography>
          <Typography
            variant="h1"
            sx={{
              fontWeight: 800,
              fontSize: { xs: '3.5rem', md: '5.5rem' },
              mb: 2,
              letterSpacing: '-2px',
              textShadow: '2px 2px 10px rgba(0,0,0,0.3)'
            }}
          >
            Nuestras Ramas
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 400, opacity: 0.9, maxWidth: '700px', mx: 'auto' }}>
            Cada etapa es una nueva aventura adaptada a tu edad, donde el aprendizaje nunca se detiene.
          </Typography>
        </Container>
      </Box>

      {/* CUERPO DE LAS TARJETAS */}
      <Container maxWidth="lg" sx={{ pb: 10 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(4, 1fr)'
            },
            gap: 3,
            alignItems: 'stretch'
          }}
        >
          {ramas.map((rama, index) => (
            <Card
              key={index}
              elevation={0}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderRadius: 6,
                border: '1px solid #eee',
                height: '100%',
                transition: '0.3s ease',
                '&:hover': {
                  boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
                  transform: 'translateY(-10px)',
                  borderColor: rama.color
                }
              }}
            >
              <Box>
                <Box sx={{ height: 8, bgcolor: rama.color }} />
                <CardMedia
                  component="img"
                  height="180"
                  image={rama.imagen}
                  alt={rama.nombre}
                  sx={{ objectFit: 'cover' }}
                />

                <Box sx={{ textAlign: 'center', mt: -2, zIndex: 1, position: 'relative' }}>
                  <Chip
                    label={rama.edad}
                    sx={{
                      fontWeight: 'bold',
                      bgcolor: rama.color,
                      color: 'white',
                      fontSize: '0.75rem',
                      height: '26px',
                    }}
                  />
                </Box>

                <CardContent sx={{ textAlign: 'center', pt: 3, px: 2 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 800,
                      fontSize: '1.25rem',
                      minHeight: '3rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {rama.nombre}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{ color: rama.color, fontStyle: 'italic', mb: 2, fontWeight: 600 }}
                  >
                    {rama.lema}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem', lineHeight: 1.6 }}>
                    {rama.descripcion}
                  </Typography>
                </CardContent>
              </Box>

              <CardActions sx={{ justifyContent: 'center', pb: 4, pt: 0 }}>                
                <Button
                  component={Link}
                  to={`/ramas/${rama.id}`}
                  variant="outlined"
                  size="small"
                  sx={{
                    borderRadius: 3,
                    borderColor: rama.color,
                    color: rama.color,
                    fontWeight: 'bold',
                    px: 3,
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: rama.color,
                      borderColor: rama.color,
                      color: 'white',
                    }
                  }}
                >
                  Saber más
                </Button>
              </CardActions>
            </Card>
          ))}
        </Box>
      </Container>
    </Box>
  );
};