import { useState, useEffect } from 'react';
import { Box, Typography, Container, Paper, IconButton, Stack, CardMedia, CardActionArea } from '@mui/material';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useNavigate } from 'react-router-dom';

export const NewsSection = () => {
  const navigate = useNavigate();
  const [noticias, setNoticias] = useState([]);

  // Carga y filtra las noticias del LocalStorage
  useEffect(() => {
    const datos = JSON.parse(localStorage.getItem('noticias-tupahue') || '[]');
    const publicadas = datos.filter(n => n.estado === 'Publicado').slice(0, 6); // Máximo 6 en el home
    setNoticias(publicadas);
  }, []);

  const scroll = (direction) => {
    const container = document.getElementById('news-container');
    const scrollAmount = 350;
    container.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
  };

  // Esta función limpia las etiquetas HTML (negritas, colores, etc) que vienen del editor 
  // para que el texto de vista previa (la descripción corta) sea solo texto plano.
  const stripHtml = (html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  };

  return (
    <Container maxWidth="lg" sx={{ mb: 10 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <NewReleasesIcon sx={{ color: '#5A189A' }} />
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#333' }}>Últimas Noticias</Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <IconButton onClick={() => scroll('left')} sx={{ boxShadow: 2, bgcolor: 'white', '&:hover': {bgcolor: '#eee'} }}>
            <KeyboardArrowLeftIcon />
          </IconButton>
          <IconButton onClick={() => scroll('right')} sx={{ boxShadow: 2, bgcolor: 'white', '&:hover': {bgcolor: '#eee'} }}>
            <KeyboardArrowRightIcon />
          </IconButton>
        </Stack>
      </Box>

      <Box 
        id="news-container"
        sx={{ 
          display: 'flex', gap: 3, overflowX: 'auto', pb: 3,
          scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' }
        }}
      >
        {noticias.length === 0 ? (
          <Typography variant="body1" color="text.secondary" sx={{ py: 4, pl: 2, fontStyle: 'italic' }}>
            Aún no hay noticias publicadas.
          </Typography>
        ) : (
          noticias.map((nota) => (
            <Paper 
              key={nota.id}
              elevation={3}
              sx={{ 
                borderRadius: 4, overflow: 'hidden', flex: '0 0 auto', 
                width: { xs: '280px', sm: '340px' }, transition: '0.3s',
                '&:hover': { transform: 'translateY(-8px)' }
              }}
            >
              {/* Al hacer clic, navega a la URL con el ID de la noticia real */}
              <CardActionArea onClick={() => navigate(`/noticias/${nota.id}`)}>
                <CardMedia
                  component="img"
                  height="180"
                  image={nota.imagen || 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=500'}
                  alt={nota.titulo}
                />
                <Box sx={{ p: 3 }}>
                  <Typography variant="caption" sx={{ color: '#5A189A', fontWeight: 700, textTransform: 'uppercase' }}>
                    {nota.categoria} • {nota.fecha}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 800, mt: 1, mb: 1, lineHeight: 1.2 }}>
                    {nota.titulo}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ 
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' 
                  }}>
                    {stripHtml(nota.descripcion)}
                  </Typography>
                </Box>
              </CardActionArea>
            </Paper>
          ))
        )}
      </Box>
    </Container>
  );
};  