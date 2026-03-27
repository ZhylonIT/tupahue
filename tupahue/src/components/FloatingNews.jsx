import { useState, useEffect } from 'react';
import { Box, Typography, Container, Paper, CardActionArea, CardMedia } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import NewReleasesIcon from '@mui/icons-material/NewReleases';

const VIOLETA_SCOUT = '#5A189A';

export const FloatingNews = () => {
  const navigate = useNavigate();
  const [noticiasDestacadas, setNoticiasDestacadas] = useState([]);

  useEffect(() => {
    const datos = JSON.parse(localStorage.getItem('noticias-tupahue') || '[]');
    const publicadas = datos.filter(n => n.estado === 'Publicado').slice(0, 5);
    setNoticiasDestacadas(publicadas);
  }, []);

  if (noticiasDestacadas.length === 0) return null;

  return (
    <Container 
      maxWidth="lg" 
      sx={{ 
        position: 'absolute', 
        bottom: { xs: '-100px', md: '-130px' }, // Offset para que flote sobre el borde del slider
        left: 0, 
        right: 0, 
        zIndex: 10 
      }}
    >
      {/* Título Indicador */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, px: 1 }}>
        <NewReleasesIcon sx={{ color: 'white', filter: 'drop-shadow(0px 2px 2px rgba(0,0,0,0.3))' }} />
        <Typography variant="h6" sx={{ fontWeight: 800, color: 'white', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
          Últimas Noticias
        </Typography>
      </Box>

      {/* Carrusel Horizontal */}
      <Box 
        sx={{ 
          display: 'flex', 
          gap: 2.5, 
          overflowX: 'auto', 
          pb: 3,
          px: 1,
          scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' }
        }}
      >
        {noticiasDestacadas.map((nota) => (
          <Paper
            key={nota.id}
            elevation={3}
            sx={{
              borderRadius: 3,
              overflow: 'hidden',
              flex: '0 0 auto',
              width: { xs: '240px', md: '280px' },
              bgcolor: 'white',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 8px 25px rgba(0,0,0,0.15)' }
            }}
          >
            <CardActionArea onClick={() => navigate(`/noticias/${nota.id}`)}>
              <CardMedia
                component="img"
                height="140"
                image={nota.imagen || 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=500'}
                alt={nota.titulo}
              />
              <Box sx={{ p: 2 }}>
                <Typography variant="caption" sx={{ color: VIOLETA_SCOUT, fontWeight: 700, textTransform: 'uppercase' }}>
                  {nota.categoria}
                </Typography>
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    fontWeight: 800, mt: 0.5, lineHeight: 1.2, color: '#333',
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' 
                  }}
                >
                  {nota.titulo}
                </Typography>
              </Box>
            </CardActionArea>
          </Paper>
        ))}
      </Box>
    </Container>
  );
};