import React, { useMemo } from 'react';
import { 
  Box, Typography, Grid, Paper, Card, CardContent, Avatar, 
  useTheme, Chip, List, ListItem, ListItemIcon, Divider,
  Stack 
} from '@mui/material';
import { 
  HistoryEdu, Groups as GroupsIcon, EmojiEvents, EventAvailable, 
  AutoAwesome, CheckCircle, FormatQuote, Shield, Stars, RocketLaunch,
  CalendarMonth, LocationOn
} from '@mui/icons-material';
import { RAMAS } from '../../constants/ramas';

// --- 🎯 CONSTANTES ACTUALIZADAS SEGÚN SAAC ---
const MARCO_SIMBOLICO = {
  LOBATOS: {
    fraseMarco: "Jugar con el Pueblo Libre de los Lobos",
    promesa: "Yo, (nombre), prometo ser Siempre Mejor, amar a Dios y a mi país y cumplir la Ley de la Manada.",
    ley: ["El lobato escucha y respeta a los otros.", "El lobato dice la verdad", "El lobato es alegre y amigable", "El lobato comparte en familia", "El lobato ayuda a los demás", "El lobato cuida la naturaleza"],
    pequenoGrupo: "Seisena",
    proyectoNombre: "Cacería"
  },
  SCOUTS: {
    fraseMarco: "Explorar nuevos territorios con un grupo de amigos",
    promesa: "Yo, (nombre), por mi honor prometo hacer cuanto de mí dependa para cumplir mis deberes para con Dios, la Patria, con los demás y conmigo mismo, ayudar al prójimo y vivir la Ley Scout.",
    ley: [
      "El Scout ama a dios y vive plenamente su fe",
      "El Scout es leal y digno de confianza",
      "El Scout es generoso, cortes y solidario",
      "El Scout es respetuoso y hermano de todos",
      "El Scout defiende y valora la familia",
      "El Scout ama y defiende la vida y la naturaleza",
      "El Scout sabe obedecer, elige y actua con responsabilidad",
      "El Scout es optimista y aún en las dificultades",
      "El Scout es economico, trabajador y respetuoso del bien ajeno",
      "El Scout es puro y lleva una vida sana"],
    pequenoGrupo: "Patrulla",
    proyectoNombre: "Proyecto"
  },
  CAMINANTES: {
    fraseMarco: "Ser Caminante es desafiarse a descubrir nuevos caminos",
    promesa: "Yo, (nombre), por mi honor prometo hacer cuanto de mí dependa para cumplir mis deberes para con Dios, la Patria, con los demás y conmigo mismo, ayudar al prójimo y vivir la Ley Scout.",
    ley: [
      "El Scout ama a dios y vive plenamente su fe",
      "El Scout es leal y digno de confianza",
      "El Scout es generoso, cortes y solidario",
      "El Scout es respetuoso y hermano de todos",
      "El Scout defiende y valora la familia",
      "El Scout ama y defiende la vida y la naturaleza",
      "El Scout sabe obedecer, elige y actua con responsabilidad",
      "El Scout es optimista y aún en las dificultades",
      "El Scout es economico, trabajador y respetuoso del bien ajeno",
      "El Scout es puro y lleva una vida sana"],
    pequenoGrupo: "Equipo",
    proyectoNombre: "Proyecto"
  },
  ROVERS: {
    fraseMarco: "Construyo un proyecto para mi vida, con compromiso y solidaridad",
    promesa: "Yo, (nombre), por mi honor prometo hacer cuanto de mí dependa para cumplir mis deberes para con Dios, la Patria, con los demás y conmigo mismo, ayudar al prójimo y vivir la Ley Scout.",
    ley: [
      "El Scout ama a dios y vive plenamente su fe",
      "El Scout es leal y digno de confianza",
      "El Scout es generoso, cortes y solidario",
      "El Scout es respetuoso y hermano de todos",
      "El Scout defiende y valora la familia",
      "El Scout ama y defiende la vida y la naturaleza",
      "El Scout sabe obedecer, elige y actua con responsabilidad",
      "El Scout es optimista y aún en las dificultades",
      "El Scout es economico, trabajador y respetuoso del bien ajeno",
      "El Scout es puro y lleva una vida sana"],
    pequenoGrupo: "Comunidad",
    proyectoNombre: "Proyecto"
  }
};

export const MiRamaView = ({ joven, proyectos = [], eventos = [] }) => {
  const theme = useTheme();

  // Filtramos el proyecto activo del joven
  const proyectoActivoReal = useMemo(() => {
    return (proyectos || []).find(p => 
      p.equipo === joven?.equipo && 
      p.rama === joven?.rama && 
      p.estado === 'ACTIVO'
    );
  }, [proyectos, joven]);

  // Filtramos eventos próximos (Rama o Grupo)
  const eventosRama = useMemo(() => {
    const hoy = new Date().toISOString().split('T')[0];
    return (eventos || [])
      .filter(ev => 
        ev.fecha >= hoy && 
        (ev.tipo === 'GRUPAL' || ev.rama?.toUpperCase() === joven?.rama?.toUpperCase())
      )
      .sort((a, b) => a.fecha.localeCompare(b.fecha))
      .slice(0, 3);
  }, [eventos, joven]);

  if (!joven) return null;

  const ramaKey = joven.rama?.toUpperCase() || 'SCOUTS';
  const CONFIG_RAMA = RAMAS[ramaKey];
  const infoSimbolica = MARCO_SIMBOLICO[ramaKey] || MARCO_SIMBOLICO.SCOUTS;
  const colorPrincipal = CONFIG_RAMA?.color || '#333';

  return (
    <Box sx={{ p: 0, pb: 6, animation: 'fadeIn 0.8s ease-out' }}>

      {/* BANNER DE IDENTIDAD */}
      <Paper
        elevation={12}
        sx={{
          p: { xs: 4, md: 6 }, mb: 4, borderRadius: 6,
          background: `linear-gradient(135deg, ${colorPrincipal} 0%, #1a1a1a 100%)`,
          color: '#fff', position: 'relative', overflow: 'hidden',
          boxShadow: `0 20px 40px ${colorPrincipal}33`
        }}
      >
        <Box sx={{ position: 'absolute', right: -40, top: -40, opacity: 0.1, transform: 'rotate(-15deg)' }}>
          <Shield sx={{ fontSize: 350 }} />
        </Box>

        <Grid container alignItems="center" spacing={4}>
          <Grid item>
            <Avatar sx={{
              width: { xs: 100, md: 140 }, height: { xs: 100, md: 140 }, 
              border: '6px solid rgba(255,255,255,0.2)',
              bgcolor: 'rgba(255,255,255,0.1)', boxShadow: 10,
            }}>
              <GroupsIcon sx={{ fontSize: { xs: 50, md: 80 } }} />
            </Avatar>
          </Grid>
          <Grid item xs={12} sm>
            <Box>
              <Typography variant="overline" sx={{ fontWeight: 900, letterSpacing: 4, opacity: 0.8 }}>
                MI {infoSimbolica.pequenoGrupo.toUpperCase()}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', mt: 1 }}>
                <Typography variant="h2" sx={{ fontWeight: 900, textTransform: 'uppercase', lineHeight: 1 }}>
                  {joven.equipo || joven.patrulla || joven.seisena || "Tupahue"}
                </Typography>
                {joven.funcion && (
                  <Chip 
                    label={joven.funcion} 
                    icon={<Stars sx={{ color: '#000 !important' }} />}
                    sx={{ bgcolor: '#fff', color: '#000', fontWeight: 900, borderRadius: 2, px: 1 }} 
                  />
                )}
              </Box>
              <Typography variant="h5" sx={{ opacity: 0.9, fontWeight: 400, mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Shield sx={{ fontSize: 24 }} /> Rama {CONFIG_RAMA?.nombre} • Grupo Scout Tupahue
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={4}>
        {/* COLUMNA IZQUIERDA: MÍSTICA */}
        <Grid item xs={12} md={7}>
          <Card elevation={4} sx={{ borderRadius: 6, height: '100%' }}>
            <CardContent sx={{ p: 5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 2 }}>
                <HistoryEdu sx={{ color: colorPrincipal, fontSize: 36 }} />
                <Typography variant="h4" sx={{ fontWeight: 900 }}>Mística y Valores</Typography>
              </Box>

              <Box sx={{ mb: 6, textAlign: 'center', bgcolor: `${colorPrincipal}08`, p: 4, borderRadius: 6, border: `1px dashed ${colorPrincipal}44` }}>
                <AutoAwesome sx={{ color: colorPrincipal, mb: 1, fontSize: 32 }} />
                <Typography variant="h3" sx={{ fontWeight: 900, fontStyle: 'italic', lineHeight: 1.2 }}>
                  "{infoSimbolica.fraseMarco}"
                </Typography>
              </Box>

              <Box sx={{ p: 4, borderRadius: 4, bgcolor: '#f8fafc', borderLeft: `10px solid ${colorPrincipal}`, mb: 6 }}>
                <Typography variant="overline" sx={{ fontWeight: 900, color: colorPrincipal }}>NUESTRA PROMESA</Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, lineHeight: 1.6 }}>
                  {infoSimbolica.promesa.replace("(nombre)", joven.nombre)}
                </Typography>
              </Box>

              <Typography variant="h6" sx={{ fontWeight: 900, mb: 3, color: 'text.secondary' }}>LA LEY SCOUT</Typography>
              <List>
                {infoSimbolica.ley.map((punto, index) => (
                  <ListItem key={index} disablePadding sx={{ mb: 1.5 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <CheckCircle sx={{ color: colorPrincipal }} />
                    </ListItemIcon>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>{punto}</Typography>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* COLUMNA DERECHA: PROYECTOS Y EVENTOS */}
        <Grid item xs={12} md={5}>
          <Stack spacing={4}>
            {/* CARD DE PROYECTO ACTUAL */}
            <Card sx={{ borderRadius: 6, bgcolor: '#1a1a1a', color: '#fff', borderLeft: `6px solid ${colorPrincipal}` }}>
              <CardContent sx={{ p: 4 }}>
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <RocketLaunch sx={{ color: colorPrincipal, fontSize: 40 }} />
                    <Typography variant="h5" sx={{ fontWeight: 900 }}>{infoSimbolica.proyectoNombre} Actual</Typography>
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 900, color: colorPrincipal }}>
                    {proyectoActivoReal ? proyectoActivoReal.titulo : `¡Elegí tu próximo ${infoSimbolica.proyectoNombre}!`}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    {proyectoActivoReal ? "Tu equipo está en marcha." : "Reunite con tu grupo para proponer un nuevo desafío."}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>

            {/* CARD DE PRÓXIMAS ACTIVIDADES */}
            <Card sx={{ borderRadius: 6 }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
                  <CalendarMonth sx={{ color: colorPrincipal, fontSize: 32 }} />
                  <Typography variant="h5" sx={{ fontWeight: 900 }}>Próximas Citas</Typography>
                </Box>
                <Stack spacing={2}>
                  {eventosRama.length > 0 ? (
                    eventosRama.map((ev) => (
                      <Paper key={ev.id} variant="outlined" sx={{ p: 2, borderRadius: 4, bgcolor: '#f8fafc' }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 900, color: colorPrincipal }}>{ev.titulo}</Typography>
                        <Stack direction="row" spacing={2} sx={{ mt: 1, opacity: 0.7 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <EventAvailable sx={{ fontSize: 14 }} />
                            <Typography variant="caption">{ev.fecha}</Typography>
                          </Box>
                        </Stack>
                      </Paper>
                    ))
                  ) : (
                    <Typography variant="body2" sx={{ fontStyle: 'italic', textAlign: 'center' }}>No hay eventos agendados.</Typography>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};