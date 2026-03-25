import { Box, Container, Typography, Grid, Paper, Button, List, ListItem, ListItemIcon, ListItemText, Divider, Stack, Stepper, Step, StepLabel } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import StarsIcon from '@mui/icons-material/Stars';
import { useNavigate } from 'react-router-dom';

// Mantenemos tus datos exactamente como los tenías
const INFO_RAMAS = {
  lobatos: {
    nombre: 'Lobatos y Lobeznas',
    color: '#fbc02d',
    edades: '7 a 10 años',
    lema: '¡Siempre Mejor!',
    marcoSimbolico: 'El Libro de las Tierras Vírgenes',
    descripcion: 'Es el tiempo de "dar infancia": un espacio de juego, exploración y asombro. A través de la fantasía de la selva y la historia de Mowgli, los niños y niñas aprenden valores, convivencia y autonomía, descubriendo sus propios "Rastros" en un ambiente de alegría y cuidado.',
    objetivos: [
      'Desarrollar el máximo potencial personal a través de los "Rastros" (competencias).',
      'Aprender a cooperar y asumir responsabilidades dentro de la Seisena.',
      'Explorar la realidad espiritual y el compromiso solidario con la comunidad.',
      'Fortalecer habilidades para la vida como el liderazgo y el uso responsable de la tecnología.'
    ],
    etapas: ['Pata Tierna', 'Lobo/a Saltador/a', 'Lobo/a Rastreador/a', 'Lobo/a Cazador/a'],
    etapaActiva: 0,
    ctaText: '¡Sumate a la Manada!'
  },
  scouts: {
    nombre: 'Scouts',
    color: '#0ac914',
    edades: '10 a 14 años',
    lema: '¡Siempre Listos!',
    marcoSimbolico: 'La exploración de nuevos territorios y la aventura de la Patrulla.',
    descripcion: 'Es el tiempo de la aventura y el descubrimiento. En la Unidad Scout, los jóvenes transitan la "Tierra de Nadie" hacia la autonomía, aprendiendo a trabajar en equipo a través del Sistema de Patrullas y desafiándose a sí mismos con la Carta de Exploración y la vida al aire libre.',
    objetivos: [
      'Fortalecer el carácter y la identidad personal mediante el Sistema de Patrullas.',
      'Desarrollar competencias técnicas en campismo, orientación y vida en la naturaleza.',
      'Asumir un compromiso ético basado en la Promesa y la Ley Scout.',
      'Llevar adelante proyectos (Iniciativas) que impacten positivamente en su entorno.'
    ],
    etapas: ['Pistas', 'Rumbo', 'Travesía', 'Ruta'],
    etapaActiva: 1,
    ctaText: '¡Sumate a la Unidad!'
  },
  caminantes: {
    nombre: 'Caminantes',
    color: '#4faaf5',
    edades: '14 a 17 años',
    lema: '¡Siempre Listos!',
    marcoSimbolico: 'La Hoja de Ruta y el desafío de vivir el propio camino.',
    descripcion: 'Es el tiempo de la identidad y la acción transformadora. Los Caminantes protagonizan su propia historia diseñando su "Hoja de Ruta". A través de las "Empresas", los jóvenes aprenden a trabajar por proyectos, a participar activamente en la sociedad y a consolidar su sistema de valores en comunidad.',
    objetivos: [
      'Diseñar y liderar proyectos propios (Empresas) con impacto social.',
      'Construir una identidad personal sólida basada en la autonomía y el pensamiento crítico.',
      'Desarrollar una espiritualidad comprometida y una ciudadanía activa.',
      'Fomentar vínculos saludables, la equidad de género y el respeto por la diversidad.'
    ],
    etapas: ['Búsqueda', 'Descubrimiento', 'Desafío'],
    etapaActiva: 0,
    ctaText: '¡Sumate a la Comunidad!'
  },
  rovers: {
    nombre: 'Rovers',
    color: '#f10000',
    edades: '17 a 21 años',
    lema: '¡Servir!',
    marcoSimbolico: 'Remar tu propia canoa: el desafío de la autonomía y el servicio.',
    descripcion: 'Es el tiempo de la realización y el compromiso ciudadano. En la Comunidad Rover, los jóvenes asumen la responsabilidad de su propio desarrollo a través de un "Plan Personal" y se proyectan hacia la sociedad mediante el servicio y la solidaridad. Es el paso final hacia la vida adulta, viviendo la hermandad scout de forma plena.',
    objetivos: [
      'Consolidar un Proyecto de Vida basado en valores scouts y la ética del servicio.',
      'Liderar acciones solidarias de alto impacto y compromiso social.',
      'Vivir una espiritualidad madura y un compromiso activo con el ambiente.',
      'Desarrollar habilidades para la inserción en el mundo del trabajo y el aprendizaje continuo.'
    ],
    etapas: ['Encuentro', 'Compromiso', 'Proyección'],
    etapaActiva: 0,
    ctaText: '¡Sumate a la Comunidad Rover!'
  }
};

export const RamaInfoPublicaPage = ({ rama }) => {
  const data = INFO_RAMAS[rama];
  const navigate = useNavigate();

  if (!data) return null;

  const isDarkText = rama === 'lobatos';

  return (
    <Box sx={{ py: 6 }}>
      <Container maxWidth="lg">
        
        {/* BOTÓN VOLVER */}
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate('/ramas')}
          sx={{ 
            mb: 4, 
            color: '#666', 
            fontWeight: 600,
            '&:hover': { color: data.color, bgcolor: 'transparent' } 
          }}
        >
          Volver a Ramas
        </Button>

        {/* ENCABEZADO TIPO BANNER */}
        <Paper 
          elevation={0} 
          sx={{ 
            p: { xs: 4, md: 8 }, 
            borderRadius: 6, 
            bgcolor: data.color, 
            color: isDarkText ? '#2D1E00' : 'white', 
            textAlign: 'center',
            mb: 8,
            boxShadow: `0 20px 40px ${data.color}33`
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 500, opacity: 0.8, mb: 1 }}>
            Rama {data.nombre}
          </Typography>
          <Typography variant="h2" sx={{ fontWeight: 900, mb: 2, fontSize: { xs: '2.5rem', md: '4rem' } }}>
            {data.lema}
          </Typography>
          <Stack direction="row" justifyContent="center" spacing={2}>
            <Paper sx={{ px: 2, py: 0.5, borderRadius: 10, bgcolor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(5px)' }} elevation={0}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{data.edades}</Typography>
            </Paper>
          </Stack>
        </Paper>

        <Grid container spacing={8}>
          <Grid item xs={12} md={7}>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 3 }}>Sobre la Rama</Typography>
            <Typography variant="body1" sx={{ fontSize: '1.2rem', color: 'text.secondary', lineHeight: 1.8, mb: 5 }}>
              {data.descripcion}
            </Typography>

            <Paper elevation={0} sx={{ p: 4, bgcolor: '#fcfcfc', border: '1px solid #eee', borderRadius: 4, mb: 6 }}>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <MenuBookIcon sx={{ color: data.color }} />
                <Typography variant="h6" sx={{ fontWeight: 800 }}>Marco Simbólico</Typography>
              </Stack>
              <Typography variant="body1" color="text.secondary">
                {data.marcoSimbolico}
              </Typography>
            </Paper>

            <Typography variant="h5" sx={{ fontWeight: 800, mb: 3 }}>Propuesta Educativa</Typography>
            <List>
              {data.objetivos.map((obj, index) => (
                <ListItem key={index} disableGutters sx={{ alignItems: 'flex-start', mb: 1 }}>
                  <ListItemIcon sx={{ minWidth: 40, mt: 0.5 }}>
                    <CheckCircleOutlineIcon sx={{ color: data.color }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary={obj} 
                    primaryTypographyProps={{ fontSize: '1.1rem', color: '#444', lineHeight: 1.5 }} 
                  />
                </ListItem>
              ))}
            </List>
          </Grid>
          
          <Grid item xs={12} md={5}>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 4 }}>Camino de Progresión</Typography>
            <Box sx={{ mb: 6, pl: 2 }}>
              <Stepper activeStep={data.etapaActiva} orientation="vertical">
                {data.etapas.map((label, index) => (
                  <Step key={label}>
                    <StepLabel 
                      StepIconComponent={() => (
                        <StarsIcon sx={{ color: index <= data.etapaActiva ? data.color : '#ccc' }} />
                      )}
                    >
                      <Typography variant="h6" sx={{ fontWeight: 700, ml: 1, color: index <= data.etapaActiva ? '#222' : '#999' }}>
                        {label}
                      </Typography>
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box>

            <Box 
              sx={{ 
                width: '100%', 
                height: '300px', 
                bgcolor: '#f5f5f5', 
                borderRadius: 6,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px dashed #ddd',
                position: 'sticky',
                top: '20px'
              }}
            >
              <Typography color="textSecondary" variant="body2">
                [ Espacio para foto de la Rama ]
              </Typography>
            </Box>
          </Grid>
        </Grid>      

        <Box sx={{ mt: 12 }}>
          <Divider sx={{ mb: 6 }} />
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={3} 
            justifyContent="center"
          >
            <Button 
              variant="outlined"
              startIcon={<ArrowBackIcon />} 
              onClick={() => navigate('/ramas')}
              sx={{ 
                py: 2, px: 4, borderRadius: 4, borderColor: '#ddd', color: '#666', fontWeight: 700, textTransform: 'none',
                '&:hover': { borderColor: data.color, color: data.color, bgcolor: 'transparent' }
              }}
            >
              Ver otras ramas
            </Button>

            <Button 
              variant="contained"
              onClick={() => navigate('/contacto')}
              sx={{ 
                py: 2, px: 6, borderRadius: 4, bgcolor: data.color, color: isDarkText ? '#333' : 'white', fontWeight: 800, textTransform: 'none',
                boxShadow: `0 10px 20px ${data.color}44`,
                '&:hover': { bgcolor: data.color, transform: 'translateY(-2px)', boxShadow: `0 15px 30px ${data.color}66` }
              }}
            >
              {data.ctaText}
            </Button>
          </Stack>
        </Box>

      </Container>
    </Box>
  );
};