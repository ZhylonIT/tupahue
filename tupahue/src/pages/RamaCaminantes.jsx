import { Box, Container, Typography, Button, Paper, Grid, Card, CardContent, Divider } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import TerrainIcon from '@mui/icons-material/Terrain';
import MapIcon from '@mui/icons-material/Map';
import GroupsIcon from '@mui/icons-material/Groups';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import { useNavigate } from 'react-router-dom';
import { RAMAS } from '../constants/ramas';

// 👇 IMPORTACIONES DE LOGOS
import logoTierra from '../assets/images/progresiones/logotierra.png';
import logoFuego from '../assets/images/progresiones/logofuego.png';
import logoAire from '../assets/images/progresiones/logoaire.png';
import logoAgua from '../assets/images/progresiones/logoagua.png';
import logoPertenencia from '../assets/images/progresiones/pertenenciacaminantes.png';

export const RamaCaminantes = () => {
  const navigate = useNavigate();
  const ramaInfo = RAMAS.CAMINANTES;

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

        {/* CABECERA */}
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
            alt="Logo Rama Caminantes"
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
            Rango Etario: {ramaInfo.rangoEtario} (14 a 17 años)
          </Typography>
        </Paper>

        <Grid container spacing={4}>
          {/* SECCIÓN 1: PROPÓSITO */}
          <Grid item xs={12} md={7}>
            <Typography variant="h3" sx={{ fontWeight: 800, textAlign: 'center', mb: 3, color: '#002855' }}>
              Liderando el Presente
            </Typography>
            <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8, color: '#555', mb: 3 }}>
              La Rama Caminantes ofrece una plataforma para establecer vínculos y construir redes, tanto con pares como con adultos.
              Es una propuesta diseñada para dar respuesta a la dinámica grupal de la adolescencia media,
              donde la <strong>responsabilidad personal</strong> y la búsqueda de lo trascendente guían el camino.
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
                  Ayudamos a los jóvenes a hacerse progresivamente responsables de su desarrollo personal, proponiéndose metas
                  propias e identificando las acciones necesarias para alcanzarlas.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* SECCIÓN 2: MARCO SIMBÓLICO */}
          <Grid item xs={12} md={5}>
            <Paper sx={{
              p: 4, borderRadius: 5, bgcolor: '#002855', color: '#fff', height: '100%',
              transition: '0.3s', '&:hover': { transform: 'translateY(-8px)', boxShadow: 8 }
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TerrainIcon sx={{ mr: 2, color: ramaInfo.color }} />
                <Typography variant="h5" sx={{ fontWeight: 700 }}>Marco Simbólico</Typography>
              </Box>
              <Typography variant="h5" sx={{ color: ramaInfo.color, mb: 2, fontStyle: 'italic' }}>
                "Caminar en búsqueda de lo trascendente"
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.8, lineHeight: 1.7 }}>
                Invitamos a los jóvenes a explorar lo invisible y a caminar con la mirada puesta en el horizonte.
                El marco se basa en el desafío de <strong>hospedar las diferencias</strong>, creando comunidades acogedoras
                donde se exploren opciones espirituales con respeto y diálogo.
              </Typography>
            </Paper>
          </Grid>

          {/* SECCIÓN 3: ORGANIZACIÓN (MIGRADO A CSS GRID ESTRICTO) */}
          <Grid item xs={12}>
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 4, textAlign: 'center', mt: 4, color: '#002855' }}>
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
                { title: 'La Comunidad Caminante', desc: 'Ámbito general de convivencia donde se ponen en práctica reglas acordadas con adultos.', icon: <GroupsIcon sx={{ fontSize: 45, color: ramaInfo.color }} /> },
                { title: 'El Equipo', desc: 'Pequeños grupos de mayor intimidad donde se consolida la identidad del joven.', icon: <MapIcon sx={{ fontSize: 45, color: ramaInfo.color }} /> },
                { title: 'Asamblea de Comunidad', desc: 'Espacio democrático para expresar compromisos personales y resolver desafíos colectivos.', icon: <AddLocationAltIcon sx={{ fontSize: 45, color: ramaInfo.color }} /> }
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
                  <Box sx={{ mb: 2, display: 'inline-flex', p: 2, borderRadius: '50%', bgcolor: 'rgba(0, 86, 179, 0.05)', alignSelf: 'center' }}>
                    {item.icon}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 1.5 }}>{item.title}</Typography>
                  <Typography variant="body2" color="text.secondary">{item.desc}</Typography>
                </Card>
              ))}
            </Box>
          </Grid>

          {/* SECCIÓN 4: PROGRESIÓN Y HERRAMIENTAS (MIGRADO A CSS GRID ESTRICTO) */}
          <Grid item xs={12} sx={{ mt: 6 }}>
            <Box sx={{ mb: 6 }}>
              <Typography variant="h3" sx={{ fontWeight: 900, textAlign: 'center', mb: 2, color: '#002855' }}>
                Etapas de Crecimiento
              </Typography>
              <Typography variant="h6" sx={{ textAlign: 'center', mb: 6, color: '#666', maxWidth: '800px', mx: 'auto' }}>
                Cada elemento representa una etapa de nuestra historia y un desafío hacia el futuro.
              </Typography>

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
                  gap: 3
                }}
              >
                {[
                  { etapa: 'Tierra', img: logoTierra, desc: 'Simboliza nuestras raíces en la Manada, el juego y la fantasía inicial.' },
                  { etapa: 'Fuego', img: logoFuego, desc: 'Representa la pasión y la vida de patrulla heredada de la Unidad Scout.' },
                  { etapa: 'Aire', img: logoAire, desc: 'La libertad propia del Caminante, explorando nuevos pensamientos e ideas.' },
                  { etapa: 'Agua', img: logoAgua, desc: 'La fluidez hacia los Rovers, preparándonos para remar nuestra propia canoa.' }
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
                    <Box component="img" src={item.img} alt={item.etapa} sx={{ height: 85, mb: 2, objectFit: 'contain', alignSelf: 'center' }} />
                    <Typography variant="h6" sx={{ fontWeight: 900, color: ramaInfo.color }}>Etapa {i + 1}</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>{item.etapa}</Typography>
                    <Divider sx={{ mb: 2, width: '40%', mx: 'auto' }} />
                    <Typography variant="body2" sx={{ color: '#555', lineHeight: 1.6 }}>{item.desc}</Typography>
                  </Paper>
                ))}
              </Box>

              {/* NUEVA SECCIÓN DE HERRAMIENTAS CAMINANTES */}
              <Box sx={{
                mt: 8, p: { xs: 4, md: 6 }, borderRadius: 6, bgcolor: '#fff', border: '1px solid #ddd',
                transition: '0.3s', '&:hover': { transform: 'translateY(-8px)', boxShadow: 8 }
              }}>
                <Typography variant="h3" sx={{ fontWeight: 800, textAlign: 'center', mb: 4, color: '#002855' }}>
                  Herramientas de Progresión
                </Typography>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
                    gap: 4
                  }}
                >
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: ramaInfo.color, mb: 2 }}>
                      Diario de Marcha
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#666', lineHeight: 1.7 }}>
                      Es la herramienta principal mediante la cual cada joven organiza su progresión personal, eligiendo las competencias educativas y diseñando su propio trayecto de forma artesanal.
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: ramaInfo.color, mb: 2 }}>
                      Proyectos Caminantes
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#666', lineHeight: 1.7 }}>
                      Reemplazando a las antiguas "Empresas", son iniciativas impulsadas por los jóvenes en cinco campos de acción prioritarios: Solidaridad, Naturaleza, Viaje y Aventura, Arte y Cultura, y Vocación.
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: ramaInfo.color, mb: 2 }}>
                      Carta de Comunidad
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#666', lineHeight: 1.7 }}>
                      Es el documento fundamental que reúne los valores, acuerdos de convivencia y procedimientos. Cada joven la conoce y adhiere voluntariamente al integrarse a la Comunidad.
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