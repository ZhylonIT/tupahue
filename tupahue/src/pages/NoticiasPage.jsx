import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { 
  Box, Container, Typography, Grid, Card, CardContent, 
  CardMedia, Button, Chip, Stack // 👇 Añadimos Stack acá
} from '@mui/material';
import { CalendarToday, Person, ArrowForward } from '@mui/icons-material';

// 👇 Importamos la foto de fondo
import bannerNoticias from '../assets/images/bannernoticias.jpg';

const VIOLETA_SCOUT = '#5A189A';

export const NoticiasPage = () => {
  const [noticias, setNoticias] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Leemos del mismo canal que el Panel de Control
    const datos = JSON.parse(localStorage.getItem('noticias-tupahue') || '[]');
    // Solo mostramos las que están publicadas
    const soloPublicadas = datos.filter(n => n.estado === 'Publicado');
    setNoticias(soloPublicadas);
    window.scrollTo(0, 0);
  }, []);

  return (
    <Box sx={{ bgcolor: '#fbfcfd', minHeight: '100vh', pb: 10 }}>
      
      {/* 👇 HERO SECTION TOTALMENTE RENOVADO 👇 */}
      <Box 
        sx={{ 
          position: 'relative',
          bgcolor: VIOLETA_SCOUT, 
          color: 'white', 
          py: { xs: 8, md: 14 }, // Más padding para que respire
          mb: 8,
          backgroundImage: `linear-gradient(rgba(90, 24, 154, 0.7), rgba(90, 24, 154, 0.9)), url(${bannerNoticias})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: { xs: '70vh', md: '80vh' }, // Forzamos una altura imponente
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}
      >
        <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
          <Typography 
            variant="h2" 
            sx={{ 
              fontWeight: 900, 
              mb: 3, 
              fontSize: { xs: '2.8rem', md: '4.5rem' }, 
              textShadow: '0px 4px 10px rgba(0,0,0,0.3)' // Sombrita para que despegue del fondo
            }}
          >
            Novedades Tupahue
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              opacity: 0.95, 
              fontWeight: 400, 
              maxWidth: '700px', 
              mx: 'auto', 
              fontSize: { xs: '1.1rem', md: '1.3rem' } 
            }}
          >
            Enterate de las últimas actividades, eventos y comunicados de nuestro Grupo Scout.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg">
        {noticias.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 10 }}>
            <Typography variant="h5" color="text.secondary">
              No hay noticias publicadas por el momento.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={4}>
            {noticias.map((n) => (
              <Grid item xs={12} md={6} lg={4} key={n.id}>
                <Card 
                  onClick={() => navigate(`/noticias/${n.id}`)} 
                  sx={{ 
                    cursor: 'pointer',
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    borderRadius: 4,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': { transform: 'translateY(-10px)', boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }
                  }}
                >
                  <CardMedia
                    component="img"
                    height="220"
                    image={n.imagen || 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=500'}
                    alt={n.titulo}
                  />
                  <CardContent sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column' }}>
                    <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                      <Chip label={n.categoria} size="small" sx={{ bgcolor: 'rgba(90, 24, 154, 0.1)', color: VIOLETA_SCOUT, fontWeight: 700 }} />
                    </Stack>
                    
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, lineHeight: 1.2 }}>
                      {n.titulo}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, color: 'text.secondary', mb: 3, mt: 'auto' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <CalendarToday sx={{ fontSize: 16 }} />
                        <Typography variant="caption">{n.fecha}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Person sx={{ fontSize: 16 }} />
                        <Typography variant="caption">{n.autor}</Typography>
                      </Box>
                    </Box>

                    <Button 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        navigate(`/noticias/${n.id}`); 
                      }}
                      variant="text" 
                      endIcon={<ArrowForward />} 
                      sx={{ color: VIOLETA_SCOUT, fontWeight: 700, p: 0, '&:hover': { bgcolor: 'transparent', gap: 1 } }}
                    >
                      Leer más
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};