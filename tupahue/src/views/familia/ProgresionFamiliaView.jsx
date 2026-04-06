import { 
  Box, Typography, Paper, Stack, Grid, Avatar, 
  LinearProgress, Chip, Accordion, AccordionSummary, AccordionDetails 
} from '@mui/material';
import { ExpandMore, CheckCircle, RadioButtonUnchecked, EmojiEvents, FamilyRestroom } from '@mui/icons-material';
import { RAMAS } from '../../constants/ramas';
import { SENDEROS, AREAS_ROVERS, OBJETIVOS_POR_RAMA } from '../../constants/progresion';

export const ProgresionFamiliaView = ({ hijo }) => {
  if (!hijo) return null;

  const ramaId = hijo.rama?.toUpperCase() || 'SCOUTS';
  const CONFIG_RAMA = RAMAS[ramaId] || RAMAS.SCOUTS;
  const esRover = ramaId === 'ROVERS';
  const etapas = CONFIG_RAMA.etapas || [];
  const etapaActual = etapas.find(e => e.id === hijo.etapa) || etapas[0];
  
  const categorias = esRover ? AREAS_ROVERS : SENDEROS;
  const objetivosRama = OBJETIVOS_POR_RAMA[ramaId] || {};
  
  // 🎯 CONEXIÓN A SUPABASE: Leemos directo de la columna JSONB que creamos
  const objetivosLogrados = Array.isArray(hijo.objetivos_logrados) ? hijo.objetivos_logrados : [];

  return (
    <Box sx={{ animation: 'fadeIn 0.3s' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900 }}>Progresión de {hijo.nombre}</Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Etapa actual: <b style={{ color: etapaActual.color }}>{etapaActual.nombre.toUpperCase()}</b>
          </Typography>
        </Box>
        <Avatar sx={{ width: 70, height: 70, bgcolor: etapaActual.color + '15', border: `2px solid ${etapaActual.color}`, color: etapaActual.color }}>
          {etapaActual.icon ? <etapaActual.icon sx={{ fontSize: 40 }} /> : <EmojiEvents sx={{ fontSize: 40 }} />}
        </Avatar>
      </Stack>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>Etapas Alcanzadas</Typography>
          <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid #eee' }}>
            <Stack spacing={3}>
              {etapas.map((e, index) => {
                const indexActual = etapas.findIndex(et => et.id === etapaActual.id);
                const esAlcanzada = index <= indexActual;
                return (
                  <Stack key={e.id} direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: esAlcanzada ? e.color : '#f5f5f5', color: esAlcanzada ? 'white' : '#ccc', width: 45, height: 45 }}>
                      {e.icon ? <e.icon /> : <EmojiEvents />}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: esAlcanzada ? '#333' : '#bbb' }}>{e.nombre}</Typography>
                      {index === indexActual && <Chip label="ACTUAL" size="small" sx={{ height: 16, fontSize: '0.6rem', fontWeight: 900, bgcolor: e.color, color: 'white' }} />}
                    </Box>
                    {esAlcanzada && index !== indexActual && <CheckCircle sx={{ color: '#4caf50', fontSize: 20 }} />}
                  </Stack>
                );
              })}
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>{esRover ? 'Áreas de Crecimiento' : 'Senderos'}</Typography>
          <Stack spacing={1.5} sx={{ mb: 4 }}>
            {categorias.map((cat) => {
              const listaObjetivos = objetivosRama[cat.id] || [];
              const completados = listaObjetivos.filter(obj => objetivosLogrados.includes(obj)).length;
              const porcentaje = listaObjetivos.length > 0 ? (completados / listaObjetivos.length) * 100 : 0;

              return (
                <Accordion key={cat.id} sx={{ borderRadius: 3, border: '1px solid #eee' }}>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ width: '100%' }}>
                      <Box sx={{ color: cat.color }}>{cat.icon}</Box>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{cat.nombre}</Typography>
                        <LinearProgress variant="determinate" value={porcentaje} sx={{ height: 4, borderRadius: 2, '& .MuiLinearProgress-bar': { bgcolor: cat.color } }} />
                      </Box>
                      <Typography variant="caption" sx={{ fontWeight: 800, ml: 1 }}>{completados}/{listaObjetivos.length}</Typography>
                    </Stack>
                  </AccordionSummary>
                  <AccordionDetails sx={{ bgcolor: '#fafafa' }}>
                    <Stack spacing={1.5}>
                      {listaObjetivos.map((obj, idx) => {
                        const estaLogrado = objetivosLogrados.includes(obj);
                        return (
                          <Stack key={idx} direction="row" spacing={1.5}>
                            {estaLogrado ? <CheckCircle sx={{ color: cat.color, fontSize: 18 }} /> : <RadioButtonUnchecked sx={{ color: '#ccc', fontSize: 18 }} />}
                            <Typography variant="caption" sx={{ color: estaLogrado ? '#333' : '#999' }}>{obj}</Typography>
                          </Stack>
                        );
                      })}
                    </Stack>
                  </AccordionDetails>
                </Accordion>
              );
            })}
          </Stack>

          {/* 🎯 CONEXIÓN A SUPABASE: Leemos de observacionesFamilia */}
          {hijo.observacionesFamilia && (
            <Paper elevation={0} sx={{ p: 3, borderRadius: 4, bgcolor: '#fffde7', border: '1px solid #fff59d', display: 'flex', gap: 2 }}>
              <Box sx={{ color: '#fbc02d' }}><FamilyRestroom /></Box>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#f9a825', mb: 0.5 }}>Mensaje de los Educadores</Typography>
                <Typography variant="body2" sx={{ color: '#5d4037', fontStyle: 'italic', lineHeight: 1.6 }}>"{hijo.observacionesFamilia}"</Typography>
              </Box>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};