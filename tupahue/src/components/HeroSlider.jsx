import { useState, useEffect } from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { Link } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import bannerhome1 from '../assets/images/homepage/bannerhome1.jpeg';
import bannerhome2 from '../assets/images/homepage/bannerhome2.jpeg';
import bannerhome3 from '../assets/images/homepage/bannerhome3.jpeg';
import bannerhome4 from '../assets/images/homepage/bannerhome4.jpg';

const VIOLETA_SCOUT = '#5A189A';

// ARRAY DE IMÁGENES DE FONDO
const backgroundImages = [
  bannerhome1, bannerhome2, bannerhome3, bannerhome4,
];

export const HeroSlider = () => {
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  // Cambia el fondo automáticamente cada 5 segundos
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentBgIndex((prevIndex) => 
        prevIndex === backgroundImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <Box
      sx={{
        position: 'relative',
        height: { xs: '65vh', md: '75vh' },
        minHeight: '450px',
        width: '100vw',
        left: '50%',
        right: '50%',
        ml: '-50vw',
        mr: '-50vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        backgroundImage: `linear-gradient(rgba(90, 24, 154, 0.65), rgba(90, 24, 154, 0.85)), url(${backgroundImages[currentBgIndex]})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        transition: 'background-image 1s ease-in-out',
        textAlign: 'center',
        pb: 12 // Espacio para que el texto no choque con las tarjetas flotantes
      }}
    >
      <Container maxWidth="md">
        <Typography variant="h1" sx={{ fontWeight: 800, fontSize: { xs: '3rem', md: '5.5rem' }, mb: 2 }}>
          Siempre Listos
        </Typography>
        <Typography variant="h5" sx={{ mb: 4, fontWeight: 400, opacity: 0.95, fontSize: { xs: '1.2rem', md: '1.5rem' } }}>
          Bienvenidos a la casa del Grupo Scout Tupahue. Educando en valores a través de la aventura y el compañerismo.
        </Typography>
        <Button
          variant="contained"
          component={Link}
          to="/contacto"
          endIcon={<ArrowForwardIcon />}
          sx={{ 
            bgcolor: 'white', 
            color: VIOLETA_SCOUT, 
            fontWeight: 'bold', 
            px: 4, 
            py: 1.5, 
            borderRadius: 10, 
            '&:hover': { bgcolor: '#f0f0f0' } 
          }}
        >
          Sumate a la aventura
        </Button>
      </Container>
    </Box>
  );
};