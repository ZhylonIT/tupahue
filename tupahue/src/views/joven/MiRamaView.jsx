import React, { useMemo } from 'react';
import { 
  Box, Typography, Grid, Paper, Card, CardContent, Avatar, 
  useTheme, Chip, List, ListItem, ListItemIcon, Divider,
  Stack 
} from '@mui/material';
import { 
  HistoryEdu, Groups as GroupsIcon, EmojiEvents, EventAvailable, 
  AutoAwesome, CheckCircle, FormatQuote, Shield, Stars, RocketLaunch 
} from '@mui/icons-material';
import { RAMAS } from '../../constants/ramas';

// --- CONSTANTES DE TEXTOS OFICIALES SAAC ---
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

export const MiRamaView = ({ joven, proyectos = [] }) => {
  const theme = useTheme();

  // 1. Buscamos el proyecto activo real del equipo/patrulla
  const proyectoActivoReal = useMemo(() => {
    return (proyectos || []).find(p => 
      p.equipo === joven?.equipo && 
      p.rama === joven?.rama && 
      p.estado === 'ACTIVO'
    );
  }, [proyectos, joven]);

  if (!joven) return null;

  const ramaKey = joven.rama?.toUpperCase() || 'SCOUTS';
  const CONFIG_RAMA = RAMAS[ramaKey];
  const infoSimbolica = MARCO_SIMBOLICO[ramaKey] || MARCO_SIMBOLICO.SCOUTS;
  const colorPrincipal = CONFIG_RAMA?.color || '#333';

  return (
    <Box sx={{ p: 0, pb: 6, animation: 'fadeIn 0.8s ease-out' }}>

      {/* 1. BANNER DE IDENTIDAD */}
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
              animation: 'pulse 3s infinite ease-in-out'
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
                  {joven.equipo || "Tupahue"}
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
                <Shield sx={{ fontSize: 24 }} /> Rama {CONFIG_RAMA?.nombre} • Distrito 3 • Zona 8
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={4}>

        {/* 2. MARCO SIMBÓLICO */}
        <Grid item xs={12} md={7}>
          <Card elevation={4} sx={{ borderRadius: 6, border: '1px solid #edf2f7' }}>
            <CardContent sx={{ p: 5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 2 }}>
                <HistoryEdu sx={{ color: colorPrincipal, fontSize: 36 }} />
                <Typography variant="h4" sx={{ fontWeight: 900 }}>Mística y Valores</Typography>
              </Box>

              <Box sx={{ mb: 6, textAlign: 'center', bgcolor: `${colorPrincipal}08`, p: 4, borderRadius: 6, border: `1px dashed ${colorPrincipal}44` }}>
                <AutoAwesome sx={{ color: colorPrincipal, mb: 1, fontSize: 32 }} />
                <Typography variant="h3" sx={{ fontWeight: 900, fontStyle: 'italic', color: 'text.primary', lineHeight: 1.2, mb: 1 }}>
                  "{infoSimbolica.fraseMarco}"
                </Typography>
              </Box>

              <Box sx={{ position: 'relative', mb: 6 }}>
                <FormatQuote sx={{ position: 'absolute', top: -25, left: -10, fontSize: 100, color: colorPrincipal, opacity: 0.1 }} />
                <Box sx={{ p: 4, borderRadius: 4, bgcolor: '#f8fafc', borderLeft: `10px solid ${colorPrincipal}`, boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                  <Typography variant="overline" sx={{ fontWeight: 900, color: colorPrincipal, mb: 1, display: 'block', letterSpacing: 2 }}>NUESTRA PROMESA</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, lineHeight: 1.6, color: '#1e293b' }}>
                    {infoSimbolica.promesa.replace("(nombre)", joven.nombre)}
                  </Typography>
                </Box>
              </Box>

              <Typography variant="h6" sx={{ fontWeight: 900, mb: 3, textTransform: 'uppercase', color: 'text.secondary', letterSpacing: 1 }}>
                La Ley de la {ramaKey.charAt(0) + ramaKey.slice(1).toLowerCase()}
              </Typography>
              <List sx={{ display: 'grid', gap: 1.5 }}>
                {infoSimbolica.ley.map((punto, index) => (
                  <ListItem key={index} disablePadding sx={{ transition: '0.3s', '&:hover': { transform: 'translateX(10px)' } }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <CheckCircle sx={{ color: colorPrincipal, fontSize: 24 }} />
                    </ListItemIcon>
                    <Typography variant="body1" sx={{ fontWeight: 600, fontSize: '1.15rem', color: '#334155' }}>
                      {punto}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* 3. PROYECTO Y MEMBRESÍA */}
        <Grid item xs={12} md={5}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>

            {/* CARD DE PROYECTO (CONECTADA) */}
            <Card 
              elevation={8} 
              sx={{ 
                borderRadius: 6, 
                bgcolor: '#1a1a1a', 
                color: '#fff', 
                overflow: 'hidden',
                border: proyectoActivoReal ? `2px solid ${colorPrincipal}` : 'none'
              }}
            >
              <Box sx={{ bgcolor: colorPrincipal, height: 10 }} />
              <CardContent sx={{ p: 4 }}>
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <RocketLaunch sx={{ color: colorPrincipal, fontSize: 40 }} />
                    <Typography variant="h5" sx={{ fontWeight: 900 }}>
                      {infoSimbolica.proyectoNombre} Actual
                    </Typography>
                  </Box>

                  <Typography variant="h3" sx={{ fontWeight: 900, color: colorPrincipal, lineHeight: 1.1 }}>
                    {proyectoActivoReal 
                      ? proyectoActivoReal.titulo 
                      : `¡Es hora de soñar tu próximo ${infoSimbolica.proyectoNombre}!`}
                  </Typography>

                  <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)', my: 2 }} />
                  
                  <Typography variant="body1" sx={{ opacity: 0.8, fontWeight: 500 }}>
                    {proyectoActivoReal 
                      ? "En plena ejecución. ¡A seguir trabajando por el objetivo!" 
                      : "Reunite con tu pequeño grupo y empezá a planificar una nueva aventura."}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>

            {/* MEMBRESÍA (SÓLO PERMANENCIA POR AHORA) */}
            <Card elevation={4} sx={{ borderRadius: 6, border: '1px solid #edf2f7' }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 2 }}>
                  <EventAvailable sx={{ color: colorPrincipal, fontSize: 36 }} />
                  <Typography variant="h5" sx={{ fontWeight: 900 }}>Membresía Tupahue</Typography>
                </Box>
                
                <Grid container spacing={4}>
                  <Grid item xs={12}>
                    <Paper 
                      variant="outlined" 
                      sx={{ 
                        p: 3, borderRadius: 4, display: 'flex', 
                        alignItems: 'center', justifyContent: 'space-between', 
                        bgcolor: '#f8fafc' 
                      }}
                    >
                      <Box>
                        <Typography variant="h3" sx={{ fontWeight: 900, color: '#1e293b' }}>
                          {joven.permanencia || "1"}
                        </Typography>
                        <Typography variant="button" sx={{ fontWeight: 800, color: 'text.secondary' }}>
                          Años en el Grupo
                        </Typography>
                      </Box>
                      <Avatar sx={{ bgcolor: colorPrincipal, width: 56, height: 56 }}>
                        <Shield sx={{ fontSize: 32 }} />
                      </Avatar>
                    </Paper>
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="caption" sx={{ color: 'text.disabled', fontStyle: 'italic', textAlign: 'center', display: 'block' }}>
                      * El registro de asistencia estará disponible en una próxima actualización vinculada al calendario.
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

          </Box>
        </Grid>

      </Grid>

      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </Box>
  );
};