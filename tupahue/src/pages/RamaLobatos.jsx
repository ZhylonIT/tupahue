import { Box, Container, Typography, Button, Paper, Grid, Card, CardContent, Divider } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import GroupsIcon from '@mui/icons-material/Groups';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import TerrainIcon from '@mui/icons-material/Terrain';
import StarsIcon from '@mui/icons-material/Stars';
import { useNavigate } from 'react-router-dom';
import { RAMAS } from '../constants/ramas';

// 👇 IMPORTACIONES SEGÚN TU ÁRBOL DE PROYECTO
import logoPataTierna from '../assets/images/progresiones/logopatatierna.png';
import logoSaltador from '../assets/images/progresiones/logosaltador.png';
import logoRastreador from '../assets/images/progresiones/logorastreador.png';
import logoCazador from '../assets/images/progresiones/logocazador.png';
import logoPertenencia from '../assets/images/progresiones/pertenencialyl.png';

export const RamaLobatos = () => {
  const navigate = useNavigate();
  const ramaInfo = RAMAS.LOBATOS;

  return (
    <Box sx={{ py: 6, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      <Container maxWidth="lg">
        {/* BOTÓN VOLVER */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/ramas')}
          sx={{ mb: 4, color: '#666', fontWeight: 600, '&:hover': { bgcolor: 'rgba(0,0,0,0.05)' } }}
        >
          Volver a Ramas
        </Button>

        {/* CABECERA CON LOGO DE PERTENENCIA */}
        <Paper
          elevation={4}
          sx={{
            p: { xs: 4, md: 8 },
            borderRadius: 6,
            bgcolor: ramaInfo.color,
            color: '#2D1E00',
            textAlign: 'center',
            mb: 6,
            backgroundImage: 'linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.1) 75%, transparent 75%, transparent)',
            backgroundSize: '50px 50px'
          }}
        >
          <Box
            component="img"
            src={logoPertenencia}
            alt="Logo Rama"
            sx={{ height: { xs: 150, md: 150 }, mb: 3, filter: 'drop-shadow(0px 4px 8px rgba(0,0,0,0.2))' }}
          />
          <Typography variant="h5" sx={{ fontWeight: 600, opacity: 0.9, mb: 1, textTransform: 'uppercase', letterSpacing: 2 }}>
            Rama {ramaInfo.nombre}
          </Typography>
          <Typography variant="h2" sx={{ fontWeight: 900, mb: 2, fontSize: { xs: '2.8rem', md: '4.5rem' } }}>
            ¡Siempre Mejor!
          </Typography>
          <Divider sx={{ my: 3, borderColor: 'rgba(0,0,0,0.1)', width: '40%', mx: 'auto' }} />
          <Typography variant="h6" sx={{ fontWeight: 700, opacity: 0.8 }}>
            Rango Etario: {ramaInfo.rangoEtario} (7 a 10 años)
          </Typography>
        </Paper>

        <Grid container spacing={4}>
          {/* SECCIÓN 1: INTRODUCCIÓN */}
          <Grid item xs={12} md={7}>
            <Typography variant="h3" sx={{ fontWeight: 800, textAlign: 'center', mb: 3, color: '#2D1E00' }}>
              Aprender a jugar a través de la fantasía
            </Typography>
            <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8, color: '#555', mb: 3 }}>
              Es una propuesta educativa destinada a niños y niñas que ofrece un espacio privilegiado para el juego y la imaginación.
              Aquí, la <strong>Manada</strong> funciona como una sociedad democrática donde cada lobato y lobezna tiene voz en las
              decisiones que los involucran.
            </Typography>

            <Card sx={{
              borderRadius: 4, borderLeft: `6px solid ${ramaInfo.color}`, bgcolor: '#fff',
              transition: '0.3s', '&:hover': { transform: 'translateY(-8px)', boxShadow: 8 }
            }}>
              <CardContent>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
                  Nuestra Misión
                </Typography>
                <Typography variant="body1" sx={{ color: '#666', lineHeight: 1.6 }}>
                  Acompañamos el desarrollo de su pleno potencial físico, intelectual, emocional, social y espiritual,
                  fomentando la autonomía a través del juego y el compromiso con la Ley de la Manada.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* SECCIÓN 2: MARCO SIMBÓLICO */}
          <Grid item xs={12} md={5}>
            <Paper sx={{
              p: 4, borderRadius: 5, bgcolor: '#2D1E00', color: '#fff', height: '100%',
              transition: '0.3s', '&:hover': { transform: 'translateY(-8px)', boxShadow: 8 }
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AutoStoriesIcon sx={{ mr: 2, color: ramaInfo.color }} />
                <Typography variant="h5" sx={{ fontWeight: 700 }}>Marco Simbólico</Typography>
              </Box>
              <Typography variant="h5" sx={{ color: ramaInfo.color, mb: 2, fontStyle: 'italic' }}>
                "Jugar con el Pueblo Libre de los Lobos"
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.8, lineHeight: 1.7 }}>
                Nuestra mística se inspira en la novela de Rudyard Kipling, <strong>"El Libro de las Tierras Vírgenes"</strong>.
                A través de este relato, los niños configuran una atmósfera de referencia donde aprenden valores, normas de convivencia
                y el sentido de pertenencia.
              </Typography>
            </Paper>
          </Grid>

          {/* SECCIÓN 3: ORGANIZACIÓN (MIGRADO A CSS GRID ESTRICTO) */}
          <Grid item xs={12}>
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 4, textAlign: 'center', mt: 4, color: '#2D1E00' }}>
              ¿Cómo nos organizamos?
            </Typography>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
                gap: 3
              }}
            >
              {[
                {
                  title: 'La Manada',
                  desc: 'Es la sociedad democrática integrada por niños y educadores, donde se comparten vivencias y se crece en conjunto.',
                  icon: <GroupsIcon sx={{ fontSize: 45, color: '#2D1E00' }} />
                },
                {
                  title: 'Las Seisenas',
                  desc: 'Pequeños grupos operativos que facilitan la organización de actividades, identificados por colores de pelaje.',
                  icon: <TerrainIcon sx={{ fontSize: 45, color: '#2D1E00' }} />
                },
                {
                  title: 'Consejo de la Roca',
                  desc: 'Instancia máxima de participación directa donde se toman acuerdos y se reflexiona sobre la convivencia.',
                  icon: <StarsIcon sx={{ fontSize: 45, color: '#2D1E00' }} />
                }
              ].map((item, index) => (
                <Card
                  elevation={3}
                  key={index}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    textAlign: 'center',
                    p: 4,
                    borderRadius: 5,
                    transition: '0.3s',
                    borderBottom: `5px solid ${ramaInfo.color}`,
                    '&:hover': { transform: 'translateY(-8px)', boxShadow: 8 }
                  }}
                >
                  <Box sx={{ mb: 2, display: 'inline-flex', p: 2, borderRadius: '50%', bgcolor: 'rgba(45, 30, 0, 0.05)', alignSelf: 'center' }}>
                    {item.icon}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 1.5 }}>{item.title}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7, flexGrow: 1 }}>{item.desc}</Typography>
                </Card>
              ))}
            </Box>
          </Grid>

          {/* SECCIÓN 4: PROGRESIÓN (MIGRADO A CSS GRID ESTRICTO) */}
          <Grid item xs={12} sx={{ mt: 6 }}>
            <Box sx={{ mb: 6 }}>
              <Typography variant="h3" sx={{ fontWeight: 900, textAlign: 'center', mb: 2, color: '#2D1E00' }}>
                Etapas de Progresión
              </Typography>
              <Typography variant="h6" sx={{ textAlign: 'center', mb: 6, color: '#666', maxWidth: '800px', mx: 'auto' }}>
                A través de los <strong>Senderos</strong>, cada lobato descubre sus habilidades personales guiado por los Viejos Lobos.
              </Typography>

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
                  gap: 3
                }}
              >
                {[
                  { etapa: 'Pata Tierna', img: logoPataTierna, ref: 'El inicio del rastro', char: 'Hermano Gris' },
                  { etapa: 'Saltador/a', img: logoSaltador, ref: 'Nuevos horizontes', char: 'Baloo' },
                  { etapa: 'Rastreador/a', img: logoRastreador, ref: 'Siguiendo la pista', char: 'Bagheera' },
                  { etapa: 'Cazador/a', img: logoCazador, ref: 'Hacia la Unidad Scout', char: 'Kaa' }
                ].map((item, i) => (
                  <Paper
                    elevation={6}
                    key={i}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      p: 4,
                      textAlign: 'center',
                      borderRadius: 8,
                      position: 'relative',
                      transition: '0.4s',
                      border: `2px solid ${ramaInfo.color}`,
                      '&:hover': { transform: 'scale(1.05)', boxShadow: 12 }
                    }}
                  >
                    <Box component="img" src={item.img} alt={item.etapa} sx={{ height: 80, mb: 2, objectFit: 'contain', alignSelf: 'center' }} />
                    <Typography variant="h6" sx={{ fontWeight: 900, color: '#2D1E00' }}>Etapa {i + 1}</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>{item.etapa}</Typography>
                    <Divider sx={{ mb: 2, width: '40%', mx: 'auto' }} />
                    <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#555', mb: 1, flexGrow: 1 }}>"{item.ref}"</Typography>
                    <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', color: '#888' }}>Acompaña: {item.char}</Typography>
                  </Paper>
                ))}
              </Box>

              {/* HERRAMIENTAS DE PROGRESIÓN */}
              <Box sx={{
                mt: 8, p: { xs: 4, md: 6 }, borderRadius: 6, bgcolor: '#fff', border: '1px solid #ddd',
                transition: '0.3s', '&:hover': { transform: 'translateY(-8px)', boxShadow: 8 }
              }}>
                <Typography variant="h3" sx={{ fontWeight: 800, textAlign: 'center', mb: 4, color: '#2D1E00' }}>
                  Herramientas de Progresión
                </Typography>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                    gap: 4
                  }}
                >
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#FFD600', mb: 2 }}>
                      El Cuaderno de Caza
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#666', lineHeight: 1.7 }}>
                      Es el registro personal donde cada niño/a guarda sus aprendizajes y aventuras.
                      Funciona como un <strong>diario de vida</strong> que fomenta la reflexión sobre su propio crecimiento.
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#FFD600', mb: 2 }}>
                      Los Rastros
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#666', lineHeight: 1.7 }}>
                      Mediante fichas organizadas por áreas de desarrollo, los niños eligen entre 16 y 20 competencias
                      para desarrollar en cada etapa, haciendo su camino <strong>personalizado y lúdico.</strong>
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};