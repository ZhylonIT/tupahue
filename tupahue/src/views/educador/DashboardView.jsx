import { useState, useEffect } from 'react';
import { 
  Grid, Paper, Typography, Box, Stack, 
  LinearProgress, Card, CardContent, Avatar, Button
} from '@mui/material';
import { 
  TrendingUp, 
  Group, 
  FactCheck, 
  NotificationImportant,
  Event as EventIcon,
  Public,
  AutoGraph,
  AdsClick,
  Assignment
} from '@mui/icons-material';
import { RAMAS } from '../../constants/ramas';
import { FUNCIONES } from '../../constants/auth';

const StatCard = ({ title, value, icon, color, subtitle }) => (
  <Paper sx={{ p: 3, borderRadius: 4, height: '100%', border: '1px solid #eee', boxShadow: 'none' }}>
    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
      <Box>
        <Typography variant="overline" sx={{ color: 'text.secondary', fontWeight: 700 }}>{title}</Typography>
        <Typography variant="h4" sx={{ fontWeight: 900, my: 1 }}>{value}</Typography>
        <Typography variant="caption" color="text.secondary">{subtitle}</Typography>
      </Box>
      <Avatar sx={{ bgcolor: `${color}15`, color: color, borderRadius: 2 }}>
        {icon}
      </Avatar>
    </Stack>
  </Paper>
);

export const DashboardView = ({ scouts = [], eventos = [], ramaId = 'CAMINANTES', userFuncion, setVistaActual }) => {
  const esVistaGlobal = ramaId.toUpperCase() === 'TODAS';
  const idBusqueda = ramaId.toUpperCase();
  const CONFIG_RAMA = esVistaGlobal 
    ? { nombre: 'Todo el Grupo', color: '#2c3e50' }
    : (RAMAS[idBusqueda] || RAMAS.CAMINANTES);

  // Lógica de roles sincronizada con tu auth.jsx
  const esAsistentePrograma = userFuncion === FUNCIONES.ASISTENTE_PROG;

  // Lógica de datos generales
  const totalScouts = scouts.length;
  const conFicha = scouts.filter(s => s.fichaEntregada).length;
  const porcentajeFichas = totalScouts > 0 ? (conFicha / totalScouts) * 100 : 0;
  
  // Cálculo por ramas
  const conteoPorRama = Object.values(RAMAS).map(r => ({
    ...r,
    cantidad: scouts.filter(s => s.rama?.toUpperCase() === r.id.toUpperCase()).length
  }));

  const proximoEvento = eventos.length > 0 ? eventos[0] : null;

  // --- NUEVO: Lógica para contar Planificaciones Nuevas (Últimos 7 días) ---
  const [planisNuevas, setPlanisNuevas] = useState(0);

  useEffect(() => {
    if (esAsistentePrograma || esVistaGlobal) {
      const ramas = ['LOBATOS', 'SCOUTS', 'CAMINANTES', 'ROVERS'];
      let contadorNuevas = 0;
      
      const haceUnaSemana = new Date();
      haceUnaSemana.setDate(haceUnaSemana.getDate() - 7);

      ramas.forEach(rama => {
        const saved = localStorage.getItem(`tupahue_historial_planificaciones_${rama}`);
        if (saved) {
          const historial = JSON.parse(saved);
          historial.forEach(plani => {
            if (plani.id > haceUnaSemana.getTime()) {
              contadorNuevas++;
            }
          });
        }
      });
      setPlanisNuevas(contadorNuevas);
    }
  }, [esAsistentePrograma, esVistaGlobal]);

  return (
    <Box>
      {/* CABECERA DINÁMICA */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          {esVistaGlobal ? (
            <Public sx={{ fontSize: 40, color: CONFIG_RAMA.color }} />
          ) : esAsistentePrograma ? (
            <AutoGraph sx={{ fontSize: 40, color: CONFIG_RAMA.color }} />
          ) : (
             <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: CONFIG_RAMA.color }} />
          )}
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 900 }}>
              {esAsistentePrograma ? 'Gestión de Programa' : '¡Siempre Listo!'}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {esAsistentePrograma 
                ? `Seguimiento Educativo • ${CONFIG_RAMA.nombre}` 
                : esVistaGlobal ? 'Resumen General del Grupo Scout Tupahue' : `Panel de control de la ${CONFIG_RAMA.nombre}`}
            </Typography>
          </Box>
        </Stack>
      </Box>

      <Grid container spacing={3}>
        {/* FILA DE CARDS DINÁMICAS */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Beneficiarios" 
            value={totalScouts} 
            icon={<Group />} 
            color={CONFIG_RAMA.color}
            subtitle={esVistaGlobal ? "Total Grupo" : "Activos en rama"}
          />
        </Grid>

        {/* Si es Asistente de Programa o está en la vista Global */}
        {(esAsistentePrograma || esVistaGlobal) ? (
          <>
            <Grid item xs={12} sm={6} md={3}>
              <Box 
                onClick={() => setVistaActual && setVistaActual('PLANIFICACIONES')}
                sx={{ 
                  cursor: 'pointer', height: '100%', 
                  transition: '0.2s', '&:hover': { transform: 'scale(1.02)' } 
                }}
              >
                <StatCard 
                  title="Planificaciones" 
                  value={planisNuevas} 
                  icon={planisNuevas > 0 ? <NotificationImportant /> : <Assignment />} 
                  color={planisNuevas > 0 ? "#1976d2" : "#757575"} 
                  subtitle={planisNuevas > 0 ? "Nuevas (Clic para revisar)" : "Todas al día"} 
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard 
                title="Eventos" 
                value={eventos.length} 
                icon={<EventIcon />} 
                color="#ed6c02" 
                subtitle="Agendados en total" 
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard 
                title="Fichas Médicas" 
                value={`${conFicha}/${totalScouts}`} 
                icon={<FactCheck />} 
                color="#2e7d32" 
                subtitle={`${porcentajeFichas.toFixed(0)}% entrega global`} 
              />
            </Grid>
          </>
        ) : (
          /* Vista normal para el Educador de Rama */
          <>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard title="Fichas Médicas" value={`${conFicha}/${totalScouts}`} icon={<FactCheck />} color="#2e7d32" subtitle={`${porcentajeFichas.toFixed(0)}% entrega`} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard title="Asistencia" value={scouts.filter(s => s.presente).length} icon={<TrendingUp />} color="#1976d2" subtitle="Presentes hoy" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard title="Alertas" value={totalScouts - conFicha} icon={<NotificationImportant />} color="#d32f2f" subtitle="Faltan fichas" />
            </Grid>
          </>
        )}

        {/* BLOQUE CENTRAL: RAMAS O PROGRESIÓN */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid #eee', boxShadow: 'none', height: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>
              {esAsistentePrograma ? 'Próximas Entregas de Insignias' : esVistaGlobal ? 'Distribución por Secciones' : 'Estado de Documentación'}
            </Typography>
            
            {esAsistentePrograma ? (
              <Stack spacing={2}>
                {scouts.slice(0, 4).map((scout, index) => (
                  <Box key={index} sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>{scout.nombre}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Meta: {index % 2 === 0 ? 'Etapa Progresión' : 'Especialidad'}
                      </Typography>
                    </Box>
                    <Button size="small" variant="outlined" sx={{ borderRadius: 2 }}>Planificar</Button>
                  </Box>
                ))}
              </Stack>
            ) : esVistaGlobal ? (
              <Stack spacing={2.5}>
                {conteoPorRama.map((r) => (
                  <Box key={r.id}>
                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: r.color }} />
                        {r.nombre}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>{r.cantidad} chicos</Typography>
                    </Stack>
                    <LinearProgress 
                      variant="determinate" 
                      value={totalScouts > 0 ? (r.cantidad / totalScouts) * 100 : 0} 
                      sx={{ 
                        height: 8, borderRadius: 5, bgcolor: '#eee',
                        '& .MuiLinearProgress-bar': { bgcolor: r.color } 
                      }} 
                    />
                  </Box>
                ))}
              </Stack>
            ) : (
              <Box>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                  <Typography variant="body2">Fichas Médicas Nacionales</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>{conFicha} de {totalScouts}</Typography>
                </Stack>
                <LinearProgress 
                  variant="determinate" 
                  value={porcentajeFichas} 
                  sx={{ 
                    height: 10, borderRadius: 5, bgcolor: '#eee',
                    '& .MuiLinearProgress-bar': { bgcolor: CONFIG_RAMA.color } 
                  }} 
                />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
                  Es vital que todos los miembros de la <b>{CONFIG_RAMA.nombre}</b> tengan su documentación al día.
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* AGENDA */}
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 4, bgcolor: CONFIG_RAMA.color, color: 'white', height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="overline" sx={{ opacity: 0.8, fontWeight: 700 }}>
                {esAsistentePrograma ? 'Foco de Programa' : 'Agenda de Grupo'}
              </Typography>
              {proximoEvento ? (
                <Stack spacing={2} sx={{ mt: 2 }}>
                  <Typography variant="h5" sx={{ fontWeight: 900 }}>{proximoEvento.titulo}</Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <EventIcon fontSize="small" />
                    <Typography variant="body2">{proximoEvento.fecha}</Typography>
                  </Stack>
                  <Typography variant="body2" sx={{ bgcolor: 'rgba(255,255,255,0.1)', p: 1.5, borderRadius: 2 }}>
                    {esAsistentePrograma 
                      ? "Prioridad: Revisión de objetivos personales y progresión técnica."
                      : `Lugar: ${proximoEvento.lugar || 'Sede Grupo'}`}
                  </Typography>
                </Stack>
              ) : <Typography sx={{ mt: 2 }}>No hay actividades programadas.</Typography>}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardView;