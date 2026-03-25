import { Box, Container, Typography, Grid, Paper, Stack, Button } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import LanguageIcon from '@mui/icons-material/Language';
import PersonIcon from '@mui/icons-material/Person';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import ForestIcon from '@mui/icons-material/Forest';
import PublicIcon from '@mui/icons-material/Public';
import PsychologyIcon from '@mui/icons-material/Psychology';

const VIOLETA_SCOUT = '#5A189A';
const HEADER_IMAGE = "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1350&q=80";

const AREAS_DESARROLLO_NUEVAS = [
  { 
    titulo: 'Salud y Bienestar', 
    desc: 'Cuidado integral (físico, mental y emocional). Promovemos estilos de vida saludables, autoconocimiento y entornos seguros.', 
    icon: <HealthAndSafetyIcon sx={{ fontSize: 35, color: VIOLETA_SCOUT }} /> 
  },
  { 
    titulo: 'Ambiente', 
    desc: 'Conciencia sobre el desarrollo sostenible, consumo responsable y una conexión profunda y respetuosa con la naturaleza.', 
    icon: <ForestIcon sx={{ fontSize: 35, color: VIOLETA_SCOUT }} /> 
  },
  { 
    titulo: 'Paz y Desarrollo', 
    desc: 'Justicia, derechos humanos y resolución de conflictos. Construcción del sentido espiritual y compromiso solidario.', 
    icon: <PublicIcon sx={{ fontSize: 35, color: VIOLETA_SCOUT }} /> 
  },
  { 
    titulo: 'Habilidades para la Vida', 
    desc: 'Liderazgo, comunicación y aprendizaje continuo para que cada joven alcance su máximo potencial en la sociedad.', 
    icon: <PsychologyIcon sx={{ fontSize: 35, color: VIOLETA_SCOUT }} /> 
  },
];

const ELEMENTOS_METODO = [
  { t: 'Aprender haciendo', d: 'Aprendizaje a través de la experiencia directa, el descubrimiento y el error.' },
  { t: 'Sistema de equipos', d: 'Pequeños grupos para aprender responsabilidad, liderazgo y democracia.' },
  { t: 'Rol del Adulto', d: 'Presencia estimulante, no directiva, que acompaña el proceso del joven.' },
  { t: 'Progresión personal', d: 'Un programa que permite a cada uno crecer a su propio ritmo y metas.' },
  { t: 'Vida en la naturaleza', d: 'El escenario privilegiado donde se desarrolla gran parte de nuestra acción.' },
  { t: 'Ley y Promesa', d: 'Un marco ético aceptado voluntariamente como estilo de vida.' },
  { t: 'Marco simbólico', d: 'Conjunto de elementos que dan sentido de pertenencia, identidad y propósito.' },
  { t: 'Involucramiento comunitario', d: 'El servicio como forma de transformar la realidad local y global.' }
];

export const QueHacemosPage = () => {
  return (
    <Box sx={{ overflowX: 'hidden' }}>
      {/* HERO SECTION */}
      <Box
        sx={{
          position: 'relative', height: { xs: '70vh', md: '80vh' }, minHeight: '500px', width: '100vw', left: '50%', transform: 'translateX(-50%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
          backgroundImage: `linear-gradient(rgba(90, 24, 154, 0.7), rgba(90, 24, 154, 0.7)), url(${HEADER_IMAGE})`,
          backgroundSize: 'cover', backgroundPosition: 'center', textAlign: 'center', mb: 8
        }}
      >
        <Container maxWidth="md">
          <Typography variant="overline" sx={{ fontSize: '1.2rem', fontWeight: 300, letterSpacing: 2, display: 'block', mb: 1 }}>Grupo Scout Tupahue</Typography>
          <Typography variant="h1" sx={{ fontWeight: 800, fontSize: { xs: '3.5rem', md: '5.5rem' }, mb: 2, textShadow: '2px 2px 10px rgba(0,0,0,0.3)', letterSpacing: '-2px' }}>Nuestra Misión</Typography>
          <Typography variant="h5" sx={{ fontWeight: 400, opacity: 0.9, mb: 4, maxWidth: '700px', mx: 'auto' }}>Contribuir a la educación de los jovenes a través de un sistema de valores basado en nuestra promesa y ley Scout, para ayudar a construir un mundo mejor donde las personas se desarrollen plenamente y jueguen un papel constructivo en la sociedad.</Typography>
          <Button
            variant="outlined" size="large" endIcon={<KeyboardArrowDownIcon />}
            sx={{ color: 'white', borderColor: 'white', borderWidth: 2, borderRadius: 10, px: 4, py: 1.5, '&:hover': { bgcolor: 'rgba(255,255,255,0.1)', transform: 'translateY(3px)' }, transition: 'all 0.3s' }}
            onClick={() => window.scrollTo({ top: 800, behavior: 'smooth' })}
          >
            Descubrí qué hacemos
          </Button>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ pb: 12 }}>
        {/* INTRODUCCIÓN PRINCIPAL */}
        <Box sx={{ mb: 10, textAlign: 'center' }}>
          <Typography variant="h2" sx={{ fontWeight: 800, mb: 3, color: VIOLETA_SCOUT, fontSize: { xs: '2.5rem', md: '3.5rem' } }}>Propuesta Educativa</Typography>
          <Typography variant="body1" sx={{ fontSize: '1.25rem', color: 'text.secondary', maxWidth: '900px', mx: 'auto', lineHeight: 1.9 }}>
            Nuestro medio es la <strong>educación no formal</strong>, una alternativa que potencia las capacidades de las personas complementando la acción de la familia y la escuela.
          </Typography>
        </Box>

        {/* SECCIÓN: QUÉ Y CÓMO */}
        <Box sx={{ mb: 12 }}>
          <Grid container spacing={4} alignItems="stretch">
            <Grid item xs={12} md={6}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 5, height: '100%', bgcolor: '#f8f9fa', borderRadius: 8,
                  border: '1px solid #eee'
                }}
              >
                <Typography variant="h4" sx={{ fontWeight: 800, mb: 3, color: VIOLETA_SCOUT }}>¿Qué hacemos?</Typography>
                <Typography variant="body1" sx={{ fontSize: '1.1rem', color: 'text.secondary', lineHeight: 1.8 }}>
                  Acompañamos a niños, niñas y jóvenes en su proceso de crecimiento integral. Somos un espacio donde cada integrante descubre su potencial, construye su identidad y aprende a ser un ciudadano activo que trabaja por un mundo mejor.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 5, height: '100%', bgcolor: 'rgba(90, 24, 154, 0.04)', borderRadius: 8,
                  border: `1px solid ${VIOLETA_SCOUT}20`
                }}
              >
                <Typography variant="h4" sx={{ fontWeight: 800, mb: 3, color: VIOLETA_SCOUT }}>¿Cómo lo hacemos?</Typography>
                <Typography variant="body1" sx={{ fontSize: '1.1rem', color: 'text.secondary', lineHeight: 1.8 }}>
                  Aplicamos el metodo Scout, adaptando actividades según la edad mediante el juego, la vida al aire libre y el servicio. Utilizamos objetivos educativos claros en un entorno seguro y acompañados por adultos responsables.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        {/* FUNDAMENTOS (Relaciones) */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" sx={{ color: VIOLETA_SCOUT, fontWeight: 900 }}>Pilares de nuestra acción</Typography>
        </Box>
        <Grid container spacing={4} sx={{ mb: 15 }} justifyContent="center">
          {[
            { t: 'Relación con uno mismo', d: 'Construcción de la identidad y toma de decisiones libre.', i: <PersonIcon fontSize="large" /> },
            { t: 'Relación con el Mundo', d: 'Solidaridad, democracia y respeto por el ambiente.', i: <LanguageIcon fontSize="large" /> },
            { t: 'Relación con Dios', d: 'Búsqueda de la trascendencia y fidelidad a la propia fe.', i: <AutoAwesomeIcon fontSize="large" /> }
          ].map((item, idx) => (
            <Grid item xs={12} sm={6} md={4} key={idx} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 5, border: '1px solid #eee', width: '100%', maxWidth: { sm: '400px', md: 'none' }, display: 'flex', flexDirection: 'column', alignItems: 'center' }} elevation={0}>
                <Box sx={{ color: VIOLETA_SCOUT, mb: 2 }}>{item.i}</Box>
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>{item.t}</Typography>
                <Typography variant="body2" color="text.secondary">{item.d}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* NUEVAS ÁREAS DE DESARROLLO (4 TARJETAS) */}
        <Typography variant="h3" textAlign="center" sx={{ color: VIOLETA_SCOUT, fontWeight: 900 }}>Áreas de Desarrollo</Typography>
        <Grid container spacing={4} sx={{ mb: 15 }} justifyContent="center">
          {AREAS_DESARROLLO_NUEVAS.map((area, index) => (
            <Grid item xs={12} sm={6} md={3} key={index} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 4, height: '100%', width: '100%', borderRadius: 6, border: '1px solid #eee', position: 'relative', transition: 'all 0.3s ease',
                  '&:hover': { transform: 'translateY(-5px)', borderColor: VIOLETA_SCOUT, boxShadow: '0 10px 20px rgba(0,0,0,0.05)' },
                  '&::before': { content: '""', position: 'absolute', left: 0, top: '25%', bottom: '25%', width: '4px', bgcolor: VIOLETA_SCOUT, borderRadius: '0 4px 4px 0' }
                }}
              >
                <Stack spacing={2}>
                  <Box sx={{ bgcolor: 'rgba(90, 24, 154, 0.05)', p: 1.5, borderRadius: 3, width: 'fit-content' }}>{area.icon}</Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2 }}>{area.titulo}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>{area.desc}</Typography>
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* EL MÉTODO SCOUT (8 PUNTOS) */}
        <Box sx={{ bgcolor: 'rgba(90, 24, 154, 0.03)', p: {xs: 4, md: 8}, borderRadius: 8 }}>
          <Typography variant="h3" textAlign="center" sx={{ color: VIOLETA_SCOUT, fontWeight: 800, mb: 8 }}>El Método Scout</Typography>
          <Grid container spacing={4} justifyContent="center">
            {ELEMENTOS_METODO.map((metodo, idx) => (
              <Grid item xs={12} sm={6} key={idx}>
                <Stack direction="row" spacing={3} alignItems="flex-start">
                  <Typography variant="h3" sx={{ color: VIOLETA_SCOUT, fontWeight: 900, opacity: 0.2, lineHeight: 1 }}>
                    {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                  </Typography>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>{metodo.t}</Typography>
                    <Typography variant="body1" color="text.secondary">{metodo.d}</Typography>
                  </Box>
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};