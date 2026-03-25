import { Typography, Box, Container, Paper, Stack, Button } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import bannerhistoria from '../assets/images/bannerhistoria.jpg';

const HEADER_IMAGE = bannerhistoria;

export const HistoriaPage = () => {
  const hitos = [
    {
      year: '8/2004',
      title: 'Fundación',
      content: 'El 14 de agosto del 2004, un grupo de educadores, familias y jóvenes se reúnen por primera vez en el patio de la parroquia "Nuestra señora del Pilar". Este día nació Tupahue, que significa "Lugar de Dios". Los fundadores del grupo Scout fueron Adrian Reinoso, Hernan Moreiras, Matias Musculito y Sergio Rinaldi.'
    },
    {
      year: '5/2005',
      title: 'Fundación primeras patrullas',
      content: 'Un hecho historico sucedio en Tupahue: ¡Se fundaron las dos priemras patrullas! La patrulla tigre y Halcon. Unos meses mas tarde, se les sumaria la patrulla Puma.'
    },
    {
      year: '6/2005',
      title: 'Formulacion de promesas',
      content: 'Matias Kassem, Lucas Lopez Zavaleta, Javito y Cristian Gallardo son los primeros jovenes en formular su promesa Scout'
    },
    {
      year: '8/2005',
      title: '1er campamento de invierno',
      content: 'En la localidad de Marcos Paz, en el centro Scout "Colonia Inchausti", nuestro grupo Scout realizo su primer campamento de invierno'
    },
    {
      year: '1/2006',
      title: '1er campamento de verano',
      content: 'En enero del año 2006, Tupahue tuvo su primer campamento de verano en san pedro, donde se realizo la primer foto de todo el grupo en las puertas de la iglesia ...'
    },
    {
      year: '3/2007',
      title: 'Fundación de la comunidad Caminante',
      content: 'Tras culminar el campamento de verano 2007 en Barker, muchos jovenes de la rama Scout se empezaron a preparar para abrir una nueva rama en nuestro GS, a la que mas tarde, la nombrarian "Roland Phillps"' 
    },
    {
      year: '3/2010',
      title: 'Fundación de la comunidad Rover',
      content: 'Cuando culmino el campamento de verano en Mendoza, los mismos jovenes que fundaron la rama Caminante, ahora van a tener el desafio de abrir una nueva rama.'
    },
    {
      year: '3/2012',
      title: 'El nacimiento de Juan Carr',
      content: 'Tras un periodo en el que la rama Rover no prospero por la partida temprana de los jovenes que la conformaron, tras el pase de rama de la siguiente camada, la comunidad volvio a resurgir. Mas tarde, con una mezcla entre la primer camada de Rover y la ultima que volvio a abrir la rama, empezaron a forjar los cimientos de la que hasta hoy se la conoce como "Comunidad Rover Juan Carr"'
    },
    {
      year: '12/2013',
      title: '1er partida Rover',
      content: 'En diciembre del 2013, sucede un hecho historico en Tupahue: Arturo Quintana y Emanuel Castillo son los primeros jovenes en culminar su etapa como protagonistas del movimiento Scout, realizado su partida y despedida de sus compañeros de ruta.'
    },
    {
      year: '8/2014',
      title: '10 años',
      content: 'El 14 de agosto del 2014, Tupahue cumple sus primeros 10 años'
    },
    {
      year: '8/2024',
      title: '20 años',
      content: 'El 14 de agosto del 2024, nuestro grupo cumple 20 años... no hay mejor forma de celebrar nuestro aniversario que haciendo un campamento de 3 dias'
    },

    // ... agrega tus otros hitos aquí
  ];

  return (
    <Box sx={{ overflowX: 'hidden' }}>      
      <Box
        sx={{
          position: 'relative',
          height: { xs: '70vh', md: '80vh' }, // Altura igual a la Home
          minHeight: '500px',
          width: '100vw',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          backgroundImage: `linear-gradient(rgba(90, 24, 154, 0.7), rgba(90, 24, 154, 0.7)), url(${HEADER_IMAGE})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          textAlign: 'center',
          borderRadius: 0, // Quitamos el border radius
          mb: 8,
          mt: 0,
          pt: 0
        }}
      >
        <Container maxWidth="md">
          <Typography 
            variant="overline" 
            sx={{ fontSize: '1.2rem', fontWeight: 300, letterSpacing: 2, display: 'block', mb: 1 }}
          >
            Grupo Scout Tupahue
          </Typography>
          
          <Typography 
            variant="h1" 
            sx={{ 
              fontWeight: 800, 
              fontSize: { xs: '3.5rem', md: '5.5rem' }, // Tamaño igual a la Home
              mb: 2,
              textShadow: '2px 2px 10px rgba(0,0,0,0.3)',
              letterSpacing: '-2px'
            }}
          >
            Nuestra Historia
          </Typography>

          <Typography variant="h5" sx={{ fontWeight: 400, opacity: 0.9, mb: 4, maxWidth: '700px', mx: 'auto' }}>
            Un legado de aventuras y crecimiento educando en valores.
          </Typography>

          <Button
            variant="outlined"
            size="large"
            endIcon={<KeyboardArrowDownIcon />}
            sx={{
              color: 'white',
              borderColor: 'white',
              borderWidth: 2,
              borderRadius: 10,
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              '&:hover': {
                borderColor: 'white',
                bgcolor: 'rgba(255,255,255,0.1)',
                borderWidth: 2,
                transform: 'translateY(3px)'
              },
              transition: 'all 0.3s'
            }}
            onClick={() => window.scrollTo({ top: 700, behavior: 'smooth' })}
          >
            Conocé nuestro camino
          </Button>
        </Container>
      </Box>

      {/* CUERPO DE LA PÁGINA (LÍNEA DE TIEMPO) */}
      <Container maxWidth="md" sx={{ pb: 12 }}>
        <Stack spacing={4}>
          {hitos.map((hito, index) => (
            <Paper
              key={index}
              elevation={0}
              sx={{
                p: { xs: 4, md: 5 },
                borderRadius: 6,
                border: '1px solid #eee',
                position: 'relative',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.02)'
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  top: '20%',
                  bottom: '20%',
                  width: '6px',
                  bgcolor: '#5A189A',
                  borderRadius: '0 4px 4px 0'
                }
              }}
            >
              <Typography variant="h3" color="primary" sx={{ fontWeight: 800, mb: 1 }}>
                {hito.year}
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                {hito.title}
              </Typography>
              <Typography variant="body1" sx={{ fontSize: '1.1rem', color: 'text.secondary', lineHeight: 1.7 }}>
                {hito.content}
              </Typography>
            </Paper>
          ))}
        </Stack>
      </Container>
    </Box>
  );
};