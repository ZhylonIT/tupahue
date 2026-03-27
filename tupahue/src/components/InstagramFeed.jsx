import { Box, Container, Typography, Button, Stack } from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ModeCommentIcon from '@mui/icons-material/ModeComment';

const VIOLETA_SCOUT = '#5A189A';

// 👇 Estos son los datos "de mentira" (Mockup). 
// El día de mañana, esto se reemplaza por los datos reales de la API.
const MOCK_POSTS = [
  { id: 1, image: 'https://images.unsplash.com/photo-1533222481259-ce20eda1e20b?auto=format&fit=crop&w=500&q=80', likes: 142, comments: 12 },
  { id: 2, image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=500&q=80', likes: 98, comments: 5 },
  { id: 3, image: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=500&q=80', likes: 215, comments: 24 },
  { id: 4, image: 'https://images.unsplash.com/photo-1517805686688-47dd930554b2?auto=format&fit=crop&w=500&q=80', likes: 176, comments: 8 },
];

export const InstagramFeed = () => {
  return (
    <Box sx={{ py: 10, bgcolor: '#fff' }}>
      <Container maxWidth="lg">
        
        {/* CABECERA DE LA SECCIÓN */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <InstagramIcon sx={{ fontSize: 50, color: '#E1306C', mb: 1 }} />
          <Typography variant="h3" sx={{ fontWeight: 900, color: '#333', mb: 1 }}>
            Viví la aventura
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Seguinos en Instagram{' '}
            <Box 
              component="span" 
              sx={{ color: VIOLETA_SCOUT, fontWeight: 800, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
              onClick={() => window.open('https://www.instagram.com/grupotupahue/', '_blank')}
            >
              @grupotupahue
            </Box>
          </Typography>
        </Box>

        {/* GRILLA DE FOTOS ESTILO INSTAGRAM (CSS GRID ESTRICTO) */}
        <Box 
          sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, 
            gap: 2, 
            mb: 6 
          }}
        >
          {MOCK_POSTS.map((post) => (
            <Box 
              key={post.id}
              onClick={() => window.open('https://www.instagram.com/grupotupahue/', '_blank')}
              sx={{ 
                position: 'relative', 
                paddingTop: '100%', // 👈 Este truco hace que la caja sea siempre un cuadrado perfecto (1:1)
                overflow: 'hidden', 
                borderRadius: 4,
                cursor: 'pointer',
                '&:hover .overlay': { opacity: 1 },
                '&:hover img': { transform: 'scale(1.05)' }
              }}
            >
              <Box 
                component="img" 
                src={post.image} 
                alt="Instagram post" 
                sx={{ 
                  position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', 
                  transition: 'transform 0.4s ease' 
                }} 
              />
              
              {/* OVERLAY NEGRO CON LIKES Y COMENTARIOS AL HACER HOVER */}
              <Box 
                className="overlay"
                sx={{ 
                  position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', 
                  bgcolor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                  opacity: 0, transition: 'opacity 0.3s ease' 
                }}
              >
                <Stack direction="row" spacing={3} sx={{ color: 'white', fontWeight: 800, fontSize: '1.2rem' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <FavoriteIcon fontSize="small" /> {post.likes}
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <ModeCommentIcon fontSize="small" /> {post.comments}
                  </Box>
                </Stack>
              </Box>
            </Box>
          ))}
        </Box>

        {/* BOTÓN CALL TO ACTION */}
        <Box sx={{ textAlign: 'center' }}>
          <Button 
            variant="contained" 
            startIcon={<InstagramIcon />}
            onClick={() => window.open('https://www.instagram.com/grupotupahue/', '_blank')}
            sx={{ 
              bgcolor: '#E1306C', fontWeight: 'bold', px: 4, py: 1.5, borderRadius: 8,
              '&:hover': { bgcolor: '#C13584', transform: 'translateY(-3px)', boxShadow: '0 8px 20px rgba(225, 48, 108, 0.4)' },
              transition: 'all 0.3s ease'
            }}
          >
            Ver más en Instagram
          </Button>
        </Box>

      </Container>
    </Box>
  );
};