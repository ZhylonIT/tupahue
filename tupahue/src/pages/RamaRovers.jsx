import { Box, Container, Typography, Button, Paper, Grid, Card, CardContent, Divider } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import GroupsIcon from '@mui/icons-material/Groups';
import HandshakeIcon from '@mui/icons-material/Handshake';
import { useNavigate } from 'react-router-dom';
import { RAMAS } from '../constants/ramas';

// 👇 IMPORTACIONES DE LOGOS SEGÚN TU ÁRBOL
import logoEncuentro from '../assets/images/progresiones/logoencuentro.png';
import logoCompromiso from '../assets/images/progresiones/logocompromiso.png';
import logoProyeccion from '../assets/images/progresiones/logoproyeccion.png';
import logoPertenencia from '../assets/images/progresiones/pertenenciarover.png';

export const RamaRovers = () => {
  const navigate = useNavigate();
  const ramaInfo = RAMAS.ROVERS;

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

        {/* CABECERA - Rojo Rover */}
        <Paper
          elevation={4}
          sx={{
            p: { xs: 4, md: 8 },
            borderRadius: 6,
            bgcolor: ramaInfo.color,
            color: '#fff',
            textAlign: 'center',
            mb: 6,
            backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.1) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.1) 75%, transparent 75%, transparent)',
            backgroundSize: '40px 40px'
          }}
        >
          <Box
            component="img"
            src={logoPertenencia}
            alt="Logo Rama Rover"
            sx={{ height: { xs: 150, md: 150 }, mb: 3, filter: 'drop-shadow(0px 4px 10px rgba(0,0,0,0.4))' }}
          />
          <Typography variant="h5" sx={{ fontWeight: 600, opacity: 0.9, mb: 1, textTransform: 'uppercase', letterSpacing: 2 }}>
            Rama {ramaInfo.nombre}
          </Typography>
          <Typography variant="h2" sx={{ fontWeight: 900, mb: 2, fontSize: { xs: '2.8rem', md: '4.5rem' } }}>
            ¡Servir!
          </Typography>
          <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.3)', width: '40%', mx: 'auto' }} />
          <Typography variant="h6" sx={{ fontWeight: 700, opacity: 0.9 }}>
            Rango Etario: {ramaInfo.rangoEtario} (17 a 21 años)
          </Typography>
        </Paper>

        <Grid container spacing={4}>
          {/* SECCIÓN 1: PROPÓSITO */}
          <Grid item xs={12} md={7}>
            <Typography variant="h3" sx={{ fontWeight: 800, textAlign: 'center', mb: 3, color: '#450a0a' }}>
              Encontrando el lugar en la sociedad
            </Typography>
            <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8, color: '#555', mb: 3 }}>
              La Rama Rovers apoya a los jóvenes en su transición final hacia la edad adulta.
              Es un tiempo de <strong>decisiones personales</strong> donde cada Rover busca su identidad
              y construye su proyecto de vida, insertándose de manera creativa y positiva en la comunidad.
            </Typography>

            <Card sx={{
              borderRadius: 4, borderLeft: `6px solid ${ramaInfo.color}`, bgcolor: '#fff',
              transition: '0.3s', '&:hover': { transform: 'translateY(-8px)', boxShadow: 8 }
            }}>
              <CardContent>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: ramaInfo.color }}>
                  Nuestra Misión
                </Typography>
                <Typography variant="body1" sx={{ color: '#666', lineHeight: 1.6 }}>
                  Ayudamos a los jóvenes adultos a desarrollar su propio camino, planificando activamente
                  su futuro para lograr una integración social y económica plena basada en valores.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* SECCIÓN 2: MARCO SIMBÓLICO */}
          <Grid item xs={12} md={5}>
            <Paper sx={{
              p: 4, borderRadius: 5, bgcolor: '#450a0a', color: '#fff', height: '100%',
              transition: '0.3s', '&:hover': { transform: 'translateY(-8px)', boxShadow: 8 }
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <DirectionsRunIcon sx={{ mr: 2, color: ramaInfo.color }} />
                <Typography variant="h5" sx={{ fontWeight: 700 }}>Marco Simbólico</Typography>
              </Box>
              <Typography variant="h5" sx={{ color: ramaInfo.color, mb: 2, fontStyle: 'italic' }}>
                "Rema tu propia canoa"
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.8, lineHeight: 1.7 }}>
                Inspirado en la metáfora de Baden-Powell, invitamos al joven a ser protagonista de su vida.
                Es un <strong>viaje iniciático</strong> de descubrimiento personal y social, orientado por la
                Cruz del Sur para encontrar un rumbo con compromiso y solidaridad.
              </Typography>
            </Paper>
          </Grid>

          {/* SECCIÓN 3: ORGANIZACIÓN (MIGRADO A CSS GRID ESTRICTO) */}
          <Grid item xs={12}>
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 4, textAlign: 'center', mt: 4, color: '#450a0a' }}>
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
                  title: 'La Comunidad Rover',
                  desc: 'Espacio democrático y flexible que agrupa a jóvenes y educadores para compartir vivencias.',
                  icon: <GroupsIcon sx={{ fontSize: 45, color: ramaInfo.color }} />
                },
                {
                  title: 'El Equipo Rover',
                  desc: 'Comunidades de aprendizaje para realizar proyectos, viajes o actividades específicas.',
                  icon: <HandshakeIcon sx={{ fontSize: 45, color: ramaInfo.color }} />
                },
                {
                  title: 'Asamblea de Comunidad',
                  desc: 'Órgano de gobierno donde todos participan directamente en la toma de decisiones.',
                  icon: <AssignmentIndIcon sx={{ fontSize: 45, color: ramaInfo.color }} />
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
                  <Box sx={{ mb: 2, display: 'inline-flex', p: 2, borderRadius: '50%', bgcolor: 'rgba(211, 47, 47, 0.05)', alignSelf: 'center' }}>
                    {item.icon}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 1.5 }}>{item.title}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>{item.desc}</Typography>
                </Card>
              ))}
            </Box>
          </Grid>

          {/* SECCIÓN 4: PROGRESIÓN CON LOGOS DE PROYECTO */}
          <Grid item xs={12} sx={{ mt: 6 }}>
            <Box sx={{ mb: 6 }}>
              <Typography variant="h3" sx={{ fontWeight: 900, textAlign: 'center', mb: 2, color: '#450a0a' }}>
                Etapas de Progresión
              </Typography>
              <Typography variant="h6" sx={{ textAlign: 'center', mb: 6, color: '#666', maxWidth: '800px', mx: 'auto' }}>
                El trayecto Rover se organiza en tres momentos clave hacia la autonomía y el servicio social.
              </Typography>

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
                  gap: 3
                }}
              >
                {[
                  { etapa: 'Encuentro', img: logoEncuentro, desc: 'Integración a la comunidad y diseño del primer Plan Personal.' },
                  { etapa: 'Compromiso', img: logoCompromiso, desc: 'Adhesión voluntaria a los valores y consolidación de la autonomía.' },
                  { etapa: 'Proyección', img: logoProyeccion, desc: 'Liderazgo de proyectos y preparación para la partida hacia la sociedad.' }
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
                      transition: '0.4s',
                      border: `2px solid ${ramaInfo.color}`,
                      '&:hover': { transform: 'scale(1.05)', boxShadow: 12 }
                    }}
                  >
                    <Box
                      component="img"
                      src={item.img}
                      alt={item.etapa}
                      sx={{ height: 100, mb: 2, objectFit: 'contain', alignSelf: 'center' }}
                    />
                    <Typography variant="h6" sx={{ fontWeight: 900, color: ramaInfo.color }}>Etapa {i + 1}</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>{item.etapa}</Typography>
                    <Divider sx={{ mb: 2, width: '40%', mx: 'auto' }} />
                    <Typography variant="body2" sx={{ color: '#555', lineHeight: 1.6 }}>{item.desc}</Typography>
                  </Paper>
                ))}
              </Box>

              {/* HERRAMIENTAS ROVER */}
              <Box sx={{
                mt: 8, p: { xs: 4, md: 6 }, borderRadius: 6, bgcolor: '#fff', border: '1px solid #ddd',
                transition: '0.3s', '&:hover': { transform: 'translateY(-8px)', boxShadow: 8 }
              }}>
                <Typography variant="h3" sx={{ fontWeight: 800, textAlign: 'center', mb: 4, color: '#450a0a' }}>
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
                    <Typography variant="h5" sx={{ fontWeight: 800, color: ramaInfo.color, mb: 2 }}>
                      Plan Personal de Acción
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#666', lineHeight: 1.7 }}>
                      Es la herramienta central donde cada Rover diseña su trayecto, fijando metas para su integración social y desarrollo profesional.
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: ramaInfo.color, mb: 2 }}>
                      Carta de Comunidad
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#666', lineHeight: 1.7 }}>
                      Manifiesto de valores y acuerdos construidos colectivamente que guía la convivencia y el servicio de la unidad.
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