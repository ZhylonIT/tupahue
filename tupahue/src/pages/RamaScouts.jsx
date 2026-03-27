import { Box, Container, Typography, Button, Paper, Grid, Card, CardContent, Divider } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ExploreIcon from '@mui/icons-material/Explore';
import GroupsIcon from '@mui/icons-material/Groups';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import FlagIcon from '@mui/icons-material/Flag';
import { useNavigate } from 'react-router-dom';
import { RAMAS } from '../constants/ramas';

// 👇 IMPORTACIONES SEGÚN TU ÁRBOL DE PROYECTO
import logoPista from '../assets/images/progresiones/logopista.png';
import logoSenda from '../assets/images/progresiones/logosenda.png';
import logoRumbo from '../assets/images/progresiones/logorumbo.png';
import logoTravesia from '../assets/images/progresiones/logotravesia.png';
import logoPertenencia from '../assets/images/progresiones/pertenenciascout.png';

export const RamaScouts = () => {
  const navigate = useNavigate();
  const ramaInfo = RAMAS.SCOUTS;

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

        {/* CABECERA - Color Verde Rama */}
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
            alt="Logo Rama Scout"
            sx={{ height: { xs: 150, md: 150 }, mb: 3, filter: 'drop-shadow(0px 4px 8px rgba(0,0,0,0.3))' }}
          />
          <Typography variant="h5" sx={{ fontWeight: 600, opacity: 0.9, mb: 1, textTransform: 'uppercase', letterSpacing: 2 }}>
            Rama {ramaInfo.nombre}
          </Typography>
          <Typography variant="h2" sx={{ fontWeight: 900, mb: 2, fontSize: { xs: '2.8rem', md: '4.5rem' } }}>
            ¡Siempre Listos!
          </Typography>
          <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.3)', width: '40%', mx: 'auto' }} />
          <Typography variant="h6" sx={{ fontWeight: 700, opacity: 0.9 }}>
            Rango Etario: {ramaInfo.rangoEtario} (10 a 14 años)
          </Typography>
        </Paper>

        <Grid container spacing={4}>
          {/* SECCIÓN 1: ¿QUÉ ES LA RAMA SCOUTS? */}
          <Grid item xs={12} md={7}>
            <Typography variant="h3" sx={{ fontWeight: 800, textAlign: 'center', mb: 3, color: '#333' }}>
              La Aventura de la Adolescencia
            </Typography>
            <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8, color: '#555', mb: 3 }}>
              La Rama Scouts está dirigida a jóvenes que transitan la adolescencia temprana.
              Es un espacio de <strong>autonomía creciente</strong> donde la Patrulla se convierte en una
              "pequeño grupo de amigos" que exploran juntos nuevos territorios, asumiendo responsabilidades
              reales y participando activamente en la gestión de su propia unidad.
            </Typography>

            <Card sx={{
              borderRadius: 4, borderLeft: `6px solid ${ramaInfo.color}`, bgcolor: '#fff',
              transition: '0.3s', '&:hover': { transform: 'translateY(-8px)', boxShadow: 8 }
            }}>
              <CardContent>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: ramaInfo.color }}>
                  Nuestra mision
                </Typography>
                <Typography variant="body1" sx={{ color: '#666', lineHeight: 1.6 }}>
                  Buscamos que cada scout aprenda a expresar sus propias ideas, resuelva conflictos
                  mediante el diálogo y se convierta en un ciudadano responsable a través del sistema
                  de autogobierno democrático.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* SECCIÓN 2: MARCO SIMBÓLICO */}
          <Grid item xs={12} md={5}>
            <Paper sx={{
              p: 4, borderRadius: 5, bgcolor: '#1b3022', color: '#fff', height: '100%',
              transition: '0.3s', '&:hover': { transform: 'translateY(-8px)', boxShadow: 8 }
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ExploreIcon sx={{ mr: 2, color: ramaInfo.color }} />
                <Typography variant="h5" sx={{ fontWeight: 700 }}>Marco Simbólico</Typography>
              </Box>
              <Typography variant="h5" sx={{ color: ramaInfo.color, mb: 2, fontStyle: 'italic' }}>
                "Explorar nuevos territorios con un grupo de amigos"
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.8, lineHeight: 1.7 }}>
                Nuestra mística se apoya en el gusto por la exploración y la pertenencia a un grupo
                de pares. En esta etapa, el scout "va delante" para descubrir sendas que
                otros puedan seguir, utilizando la brújula y la naturaleza como herramientas de
                crecimiento.
              </Typography>
            </Paper>
          </Grid>

          {/* SECCIÓN 3: ORGANIZACIÓN (MIGRADO A CSS GRID ESTRICTO) */}
          <Grid item xs={12}>
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 4, textAlign: 'center', mt: 4 }}>
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
                  title: 'La Patrulla',
                  desc: 'Es el corazón del sistema, una unidad de amigos con identidad propia (lema, bandera y libro de oro) que funciona con autonomía.',
                  icon: <GroupsIcon sx={{ fontSize: 45, color: ramaInfo.color }} />
                },
                {
                  title: 'La Unidad Scout',
                  desc: 'Es una "Federación de Patrullas" que cooperan entre sí para realizar proyectos complejos y celebraciones comunes.',
                  icon: <FlagIcon sx={{ fontSize: 45, color: ramaInfo.color }} />
                },
                {
                  title: 'Asamblea de Unidad',
                  desc: 'Ámbito democrático donde todos los scouts participan para elegir actividades y establecer acuerdos de convivencia.',
                  icon: <MenuBookIcon sx={{ fontSize: 45, color: ramaInfo.color }} />
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
                  <Box sx={{ mb: 2, display: 'inline-flex', p: 2, borderRadius: '50%', bgcolor: 'rgba(46, 125, 50, 0.05)', alignSelf: 'center' }}>
                    {item.icon}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 1.5 }}>{item.title}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7, flexGrow: 1 }}>{item.desc}</Typography>
                </Card>
              ))}
            </Box>
          </Grid>

          {/* SECCIÓN 4: PROGRESIÓN CON LOGOS DE PROYECTO (MIGRADO A CSS GRID ESTRICTO) */}
          <Grid item xs={12} sx={{ mt: 6 }}>
            <Box sx={{ mb: 6 }}>
              <Typography variant="h3" sx={{ fontWeight: 900, textAlign: 'center', mb: 2, color: '#1b3022' }}>
                Etapas de Progresión
              </Typography>
              <Typography variant="h6" sx={{ textAlign: 'center', mb: 6, color: '#666', maxWidth: '800px', mx: 'auto' }}>
                El camino del scout se organiza a través de hitos de crecimiento que motivan el avance personal y el compromiso.
              </Typography>

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
                  gap: 3
                }}
              >
                {[
                  { etapa: 'Pistas', img: logoPista, desc: 'Seguir huellas y rastros que desafían a lanzarse a la aventura.' },
                  { etapa: 'Senda', img: logoSenda, desc: 'Comprender dónde estamos y hacia dónde nos dirigimos en el camino.' },
                  { etapa: 'Rumbo', img: logoRumbo, desc: 'Gestionar la propia progresión y liderar iniciativas en la patrulla.' },
                  { etapa: 'Travesía', img: logoTravesia, desc: 'Perfeccionar habilidades y convertirse en referentes para otros.' }
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
                      sx={{ height: 80, mb: 2, objectFit: 'contain', alignSelf: 'center' }}
                    />
                    <Typography variant="h6" sx={{ fontWeight: 900, color: ramaInfo.color }}>Etapa {i + 1}</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>{item.etapa}</Typography>
                    <Divider sx={{ mb: 2, width: '40%', mx: 'auto' }} />
                    <Typography variant="body2" sx={{ color: '#555', lineHeight: 1.6, flexGrow: 1 }}>{item.desc}</Typography>
                  </Paper>
                ))}
              </Box>

              {/* HERRAMIENTAS DE PROGRESIÓN (MIGRADO A CSS GRID ESTRICTO) */}
              <Box sx={{
                mt: 8, p: { xs: 4, md: 6 }, borderRadius: 6, bgcolor: '#fff', border: '1px solid #ddd',
                transition: '0.3s', '&:hover': { transform: 'translateY(-8px)', boxShadow: 8 }
              }}>
                <Typography variant="h3" sx={{ fontWeight: 800, textAlign: 'center', mb: 4, color: '#1b3022' }}>
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
                      Bitácora de Aventura
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#666', lineHeight: 1.7 }}>
                      Es el texto que acompaña al joven en su trayecto, donde registra sus aprendizajes,
                      avances y los momentos más importantes de su vida scout.
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: ramaInfo.color, mb: 2 }}>
                      Cartas de Exploración
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#666', lineHeight: 1.7 }}>
                      Herramienta clave para que cada scout diseñe su propio trayecto educativo, eligiendo
                      de forma equilibrada las competencias que desea desarrollar en cada etapa.
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