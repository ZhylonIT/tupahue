import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Button, Chip, Divider, Avatar } from '@mui/material';
import { ArrowBack, CalendarToday, Person } from '@mui/icons-material';

const VIOLETA_SCOUT = '#5A189A';

export const NoticiaDetallePage = () => {
  const { id } = useParams(); // Obtenemos el ID de la URL
  const navigate = useNavigate();
  const [noticia, setNoticia] = useState(null);

  useEffect(() => {
    // Leemos el LocalStorage
    const datos = JSON.parse(localStorage.getItem('noticias-tupahue') || '[]');
    // Buscamos la noticia exacta por su ID (convertimos a string por si acaso)
    const notaEncontrada = datos.find(n => n.id.toString() === id);
    
    setNoticia(notaEncontrada);
    window.scrollTo(0, 0); // Que la página empiece siempre arriba
  }, [id]);

  if (!noticia) {
    return (
      <Box sx={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h5" color="text.secondary" gutterBottom>
          No pudimos encontrar esta noticia.
        </Typography>
        <Button variant="contained" onClick={() => navigate('/noticias')} sx={{ bgcolor: VIOLETA_SCOUT, mt: 2 }}>
          Volver a Noticias
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#fbfcfd', minHeight: '100vh', pb: 10 }}>
      {/* Botón Volver */}
      <Container maxWidth="md" sx={{ pt: 4, pb: 2 }}>
        <Button 
          startIcon={<ArrowBack />} 
          onClick={() => navigate(-1)} // Vuelve a la página anterior (Home o Listado)
          sx={{ color: '#666', fontWeight: 600, textTransform: 'none', mb: 2 }}
        >
          Volver
        </Button>
      </Container>

      <Container maxWidth="md">
        {/* Cabecera de la Noticia */}
        <Box sx={{ mb: 4 }}>
          <Chip 
            label={noticia.categoria} 
            sx={{ bgcolor: 'rgba(90, 24, 154, 0.1)', color: VIOLETA_SCOUT, fontWeight: 800, mb: 2 }} 
          />
          <Typography variant="h3" sx={{ fontWeight: 800, color: '#333', mb: 3, lineHeight: 1.2, fontSize: { xs: '2rem', md: '3rem' } }}>
            {noticia.titulo}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, color: 'text.secondary' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CalendarToday fontSize="small" />
              <Typography variant="body2" sx={{ fontWeight: 500 }}>{noticia.fecha}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Person fontSize="small" />
              <Typography variant="body2" sx={{ fontWeight: 500 }}>{noticia.autor || 'Grupo Scout Tupahue'}</Typography>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ mb: 4 }} />

        {/* Imagen de Portada (Si tiene) */}
        {noticia.imagen && (
          <Box 
            component="img" 
            src={noticia.imagen} 
            alt={noticia.titulo}
            sx={{ width: '100%', maxHeight: '500px', objectFit: 'cover', borderRadius: 4, mb: 5, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
          />
        )}

        {/* Cuerpo de la noticia: Aquí inyectamos el HTML de TinyMCE */}
        <Box 
          sx={{ 
            bgcolor: '#fff', 
            p: { xs: 3, md: 6 }, 
            borderRadius: 4, 
            boxShadow: '0 2px 15px rgba(0,0,0,0.03)',
            // Estilos globales para asegurarnos que el contenido HTML se vea bien en mobile
            '& img': { maxWidth: '100%', height: 'auto', borderRadius: 2 },
            '& p': { fontSize: '1.1rem', lineHeight: 1.8, color: '#444', mb: 2 },
            '& h1, & h2, & h3': { color: '#222', mt: 4, mb: 2 },
            '& a': { color: VIOLETA_SCOUT },
          }}
          dangerouslySetInnerHTML={{ __html: noticia.descripcion }}
        />
      </Container>
    </Box>
  );
};