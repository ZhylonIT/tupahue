import { useState, useEffect, useMemo } from 'react';
import { 
  Grid, Paper, Typography, Box, Stack, 
  LinearProgress, Card, CardContent, Avatar, Divider, IconButton, Button, Alert
} from '@mui/material';
import { 
  TrendingUp, Group, FactCheck, RocketLaunch,
  Event as EventIcon, Public, Assignment,
  AccountBalanceWallet, Payments, School, WorkspacePremium, 
  WarningAmber, ChevronLeft, ChevronRight, LocationOn, Campaign
} from '@mui/icons-material';
import { RAMAS, ROLES_GESTION } from '../../constants/ramas';
import { FUNCIONES } from '../../constants/auth';
import { useFinanzas } from '../../hooks/useFinanzas';
import { useAdultos } from '../../hooks/useAdultos';

const VIOLETA_SCOUT = '#5A189A';

const StatCard = ({ title, value, icon, color, subtitle, onClick }) => (
  <Paper 
    onClick={onClick}
    sx={{ 
      p: 3, borderRadius: 4, height: '100%', border: '1px solid #eee', boxShadow: 'none',
      cursor: onClick ? 'pointer' : 'default',
      transition: '0.2s',
      '&:hover': onClick ? { transform: 'translateY(-4px)', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' } : {}
    }}
  >
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

export const DashboardView = ({ 
  scouts = [], 
  eventos = [], 
  proyectos = [], 
  ramaId = 'TODAS', 
  userFuncion, 
  setVistaActual 
}) => {
  const { movimientos } = useFinanzas();
  const { adultos } = useAdultos();
  
  const [currentEventIdx, setCurrentEventIdx] = useState(0);

  // 🎯 LÓGICA DE ROLES PARA IDENTIDAD VISUAL
  const esAdmin = userFuncion === FUNCIONES.JEFE_GRUPO || userFuncion === FUNCIONES.ASISTENTE_ADM;
  const esAGA = userFuncion === FUNCIONES.ASISTENTE_ADULTOS;
  const esCI = userFuncion === FUNCIONES.ASISTENTE_COM;

  // Si es un cargo global, forzamos vista global aunque venga un ramaId residual
  const esVistaGlobal = ramaId?.toUpperCase() === 'TODAS' || esAdmin || esAGA || esCI;
  const idBusqueda = ramaId?.toUpperCase();
  
  const CONFIG_RAMA = useMemo(() => {
    if (esAGA) return { nombre: 'Gestión de Adultos', color: '#D32F2F' };
    if (esCI) return { nombre: 'Comunicación Institucional', color: '#F57C00' };
    if (esAdmin) return { nombre: 'Gestión Administrativa', color: '#388E3C' };
    if (esVistaGlobal) return { nombre: 'Todo el Grupo', color: VIOLETA_SCOUT };
    return (RAMAS[idBusqueda] || RAMAS.SCOUTS);
  }, [esAGA, esCI, esAdmin, esVistaGlobal, idBusqueda]);

  // --- LÓGICA DE PROYECTOS PENDIENTES ---
  const proyectosPendientes = useMemo(() => {
    return proyectos.filter(p => {
      const mismaRama = esVistaGlobal || p.rama?.toUpperCase() === ramaId?.toUpperCase();
      return mismaRama && p.estado === 'PENDIENTE';
    }).length;
  }, [proyectos, ramaId, esVistaGlobal]);

  // --- CÁLCULOS REALES ADULTOS ---
  const statsAdultos = useMemo(() => {
    const total = adultos.length;
    if (total === 0) return { total: 0, promedio: 0, alertas: 0 };
    const maxExp = 12; 
    const completadas = adultos.reduce((acc, a) => acc + (a.formacion?.length || 0), 0);
    const promedio = Math.min(100, Math.round((completadas / (total * maxExp)) * 100));
    const alertas = adultos.filter(a => (a.formacion?.length || 0) < 2).length;
    return { total, promedio, alertas };
  }, [adultos]);

  // --- CÁLCULOS REALES FINANZAS ---
  const statsFinancieras = useMemo(() => {
    const ingresos = movimientos.filter(m => m.tipo === 'ingreso').reduce((acc, m) => acc + Number(m.monto), 0);
    const egresos = movimientos.filter(m => m.tipo === 'egreso').reduce((acc, m) => acc + Number(m.monto), 0);
    const mesActual = new Date().toLocaleString('es-AR', { month: 'long' });
    const nomMes = mesActual.charAt(0).toUpperCase() + mesActual.slice(1);
    const pagaronCuota = movimientos.filter(m => m.categoria === 'cuota' && m.mesesPagos?.includes(nomMes)).length;
    return { saldo: ingresos - egresos, pagaronCuota, nomMes };
  }, [movimientos]);

  const totalScouts = scouts.length;
  const conFicha = scouts.filter(s => s.fichaEntregada).length;
  
  const conteoPorRama = Object.values(RAMAS).map(r => ({
    ...r,
    cantidad: scouts.filter(s => s.rama?.toUpperCase() === r.id.toUpperCase()).length
  }));

  const nextEvent = (e) => { e.stopPropagation(); setCurrentEventIdx((prev) => (prev + 1) % eventos.length); };
  const prevEvent = (e) => { e.stopPropagation(); setCurrentEventIdx((prev) => (prev - 1 + eventos.length) % eventos.length); };

  const proximoEvento = eventos.length > 0 ? eventos[currentEventIdx] : null;

  return (
    <Box sx={{ animation: 'fadeIn 0.5s ease-out' }}>
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          {esAGA ? <WorkspacePremium sx={{ fontSize: 40, color: CONFIG_RAMA.color }} />
          : esCI ? <Campaign sx={{ fontSize: 40, color: CONFIG_RAMA.color }} />
          : esVistaGlobal ? <Public sx={{ fontSize: 40, color: CONFIG_RAMA.color }} /> 
          : <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: CONFIG_RAMA.color }} />}
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 900 }}>
              {CONFIG_RAMA.nombre}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {esVistaGlobal ? 'Resumen General • Grupo Scout Tupahue' : `Panel de control • ${CONFIG_RAMA.nombre}`}
            </Typography>
          </Box>
        </Stack>
      </Box>

      <Grid container spacing={3}>
        {proyectosPendientes > 0 && (
          <Grid item xs={12}>
            <Alert 
              severity="warning" variant="filled" icon={<RocketLaunch />}
              action={
                <Button color="inherit" size="small" sx={{ fontWeight: 900 }} onClick={() => setVistaActual('REVISION_PROYECTOS')}>
                  REVISAR AHORA
                </Button>
              }
              sx={{ borderRadius: 4, mb: 1, fontWeight: 700 }}
            >
              Hay {proyectosPendientes} proyectos esperando Informe de Factibilidad en {CONFIG_RAMA.nombre}.
            </Alert>
          </Grid>
        )}

        {/* 🎯 SECCIÓN DE CARDS PERSONALIZADAS POR FUNCIÓN */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title={esAGA ? "Consejo de Grupo" : "Beneficiarios"} 
            value={esAGA ? statsAdultos.total : totalScouts} 
            icon={<Group />} color={CONFIG_RAMA.color}
            subtitle={esAGA ? "Educadores en nómina" : "Activos actualmente"} 
            onClick={() => setVistaActual(esAGA ? 'ADULTOS' : 'NOMINA')}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          {esAdmin ? (
            <StatCard title="Saldo en Caja" value={`$${statsFinancieras.saldo.toLocaleString()}`} icon={<AccountBalanceWallet />} color="#2e7d32" subtitle="Disponible real" onClick={() => setVistaActual('FINANZAS')} />
          ) : esCI ? (
            <StatCard title="Noticias Activas" value="12" icon={<Campaign />} color="#F57C00" subtitle="Publicadas este mes" onClick={() => setVistaActual('NOTICIAS')} />
          ) : (
            <StatCard title={esAGA ? "Formación" : "Asistencia"} value={esAGA ? `${statsAdultos.promedio}%` : scouts.filter(s => s.presente).length} icon={esAGA ? <School /> : <TrendingUp />} color={esAGA ? "#2980b9" : "#1976d2"} subtitle={esAGA ? "Avance SNF" : "Presentes hoy"} onClick={() => setVistaActual(esAGA ? 'ADULTOS' : 'NOMINA')} />
          )}
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          {esAdmin ? (
            <StatCard title={`Cuotas ${statsFinancieras.nomMes}`} value={`${statsFinancieras.pagaronCuota}/${totalScouts}`} icon={<Payments />} color={VIOLETA_SCOUT} subtitle="Cobranza del mes" onClick={() => setVistaActual('CUOTAS')} />
          ) : esCI ? (
            <StatCard title="Difusión" value="85%" icon={<Public />} color="#F57C00" subtitle="Alcance de comunicados" onClick={() => setVistaActual('NOTICIAS')} />
          ) : (
            <StatCard title={esAGA ? "Alertas SNF" : "Fichas Médicas"} value={esAGA ? statsAdultos.alertas : `${conFicha}/${totalScouts}`} icon={esAGA ? <WarningAmber /> : <FactCheck />} color={esAGA ? "#e67e22" : "#2e7d32"} subtitle={esAGA ? "Nivel inicial s/avances" : "Documentación al día"} onClick={() => setVistaActual(esAGA ? 'ADULTOS' : 'DOCUMENTOS')} />
          )}
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
            <StatCard title="Eventos Activos" value={eventos.length} icon={<EventIcon />} color="#757575" subtitle="En el calendario" onClick={() => setVistaActual('CALENDARIO')} />
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid #eee', boxShadow: 'none' }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>
              {esAGA ? 'Progresión del Consejo (Real)' : 'Distribución por Ramas'}
            </Typography>
            <Stack spacing={2.5}>
              {esAGA ? (
                ["Inicial", "Básico", "Avanzado"].map((nivel, idx) => {
                  const cant = adultos.filter(a => {
                    const p = (a.formacion?.length || 0) / 12;
                    return idx === 0 ? p < 0.3 : idx === 1 ? p >= 0.3 && p < 0.8 : p >= 0.8;
                  }).length;
                  return (
                    <Box key={nivel}>
                      <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>Nivel {nivel}</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>{cant} Educadores</Typography>
                      </Stack>
                      <LinearProgress variant="determinate" value={statsAdultos.total > 0 ? (cant / statsAdultos.total) * 100 : 0} sx={{ height: 8, borderRadius: 5, bgcolor: '#eee', '& .MuiLinearProgress-bar': { bgcolor: '#c0392b' } }} />
                    </Box>
                  );
                })
              ) : (
                conteoPorRama.map((r) => (
                  <Box key={r.id}>
                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                      <Typography variant="body2" component="div" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: r.color }} /> {r.nombre}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>{r.cantidad} beneficiarios</Typography>
                    </Stack>
                    <LinearProgress variant="determinate" value={totalScouts > 0 ? (r.cantidad / totalScouts) * 100 : 0} sx={{ height: 8, borderRadius: 5, bgcolor: '#eee', '& .MuiLinearProgress-bar': { bgcolor: r.color } }} />
                  </Box>
                ))
              )}
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card 
            sx={{ 
              borderRadius: 4, 
              bgcolor: proximoEvento ? (esAGA ? '#c0392b' : CONFIG_RAMA.color) : '#f5f5f5', 
              color: proximoEvento ? 'white' : 'text.disabled', 
              height: '100%',
              display: 'flex', flexDirection: 'column'
            }}
          >
            <CardContent sx={{ p: 3, flexGrow: 1 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="overline" sx={{ opacity: 0.8, fontWeight: 700 }}>
                  Agenda {eventos.length > 1 && `(${currentEventIdx + 1}/${eventos.length})`}
                </Typography>
                {eventos.length > 1 && (
                  <Stack direction="row" spacing={1}>
                    <IconButton size="small" onClick={prevEvent} sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)' }}><ChevronLeft /></IconButton>
                    <IconButton size="small" onClick={nextEvent} sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)' }}><ChevronRight /></IconButton>
                  </Stack>
                )}
              </Stack>
              {proximoEvento ? (
                <Box key={proximoEvento.id} sx={{ animation: 'slideIn 0.3s ease-out' }}>
                  <Typography variant="h5" sx={{ fontWeight: 900, mb: 2 }}>{proximoEvento.titulo}</Typography>
                  <Stack spacing={1.5}>
                    <Stack direction="row" spacing={1} alignItems="center"><EventIcon fontSize="small" /><Typography variant="body2">{proximoEvento.fecha}</Typography></Stack>
                    <Stack direction="row" spacing={1} alignItems="center"><LocationOn fontSize="small" /><Typography variant="body2">{proximoEvento.lugar || 'Sede Grupo'}</Typography></Stack>
                    <Divider sx={{ bgcolor: 'rgba(255,255,255,0.2)', my: 1 }} />
                    <Typography variant="body2" sx={{ opacity: 0.9, fontStyle: 'italic' }}>{proximoEvento.descripcion || 'Sin detalles.'}</Typography>
                  </Stack>
                </Box>
              ) : (
                <Stack alignItems="center" justifyContent="center" sx={{ mt: 4, textAlign: 'center' }}>
                  <EventIcon sx={{ fontSize: 40, mb: 1, opacity: 0.3 }} />
                  <Typography variant="body2">No hay eventos.</Typography>
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <style>{`
        @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </Box>
  );
};

export default DashboardView;