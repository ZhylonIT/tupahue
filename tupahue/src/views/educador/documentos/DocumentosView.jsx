import { 
  Box, Typography, Grid, Card, CardContent, TextField, 
  InputAdornment, Avatar, Stack, Chip, Divider, Button, Tooltip, Paper, LinearProgress
} from '@mui/material';
import { 
  Search, LocalHospital, Warning, ContactEmergency, 
  Description, ErrorOutline, CheckCircle, AssignmentInd, InsertPhoto, Public
} from '@mui/icons-material';
import { useDocumentos } from './useDocumentos';
import { RAMAS } from '../../../constants/ramas';


// Sub-componente extraído para que el código principal quede más limpio
const CheckItem = ({ label, completado, icon }) => (
  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
    <Stack direction="row" spacing={1.5} alignItems="center">
      {icon}
      <Typography variant="body2" sx={{ fontWeight: completado ? 500 : 700, color: completado ? 'text.secondary' : 'text.primary' }}>
        {label}
      </Typography>
    </Stack>
    {completado 
      ? <CheckCircle sx={{ color: '#4caf50', fontSize: 18 }} /> 
      : <ErrorOutline sx={{ color: '#ff9800', fontSize: 18 }} />
    }
  </Stack>
);

export const DocumentosView = ({ scouts = [], ramaId = 'CAMINANTES' }) => {
  
  // ¡Toda la lógica viene servida desde el hook!
  const {
    busqueda, setBusqueda,
    esVistaGlobal, CONFIG_RAMA,
    scoutsFiltrados, legajoCompleto
  } = useDocumentos(scouts, ramaId);

  return (
    <Box>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" sx={{ mb: 4 }} spacing={2}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {esVistaGlobal && <Public sx={{ color: CONFIG_RAMA.color }} />}
            Gestión de Legajos: <span style={{ color: CONFIG_RAMA.color }}>{CONFIG_RAMA.nombre}</span>
          </Typography>
          <Typography variant="body2" color="text.secondary">Auditoría de documentación y fichas médicas</Typography>
        </Box>
        
        <TextField 
          placeholder="Buscar protagonista o DNI..."
          variant="outlined"
          size="small"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          sx={{ bgcolor: 'white', borderRadius: 2, width: { xs: '100%', sm: 350 } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: CONFIG_RAMA.color }} />
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      {/* Panel de Resumen Global (Solo visible para el AdP) */}
      {esVistaGlobal && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {Object.values(RAMAS).map(ramaInfo => {
            const scoutsRama = scouts.filter(s => s.rama?.toUpperCase() === ramaInfo.id);
            const alDia = scoutsRama.filter(s => legajoCompleto(s)).length;
            const porcentaje = scoutsRama.length > 0 ? Math.round((alDia / scoutsRama.length) * 100) : 0;
            
            return (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={ramaInfo.id}>
                <Paper sx={{ p: 2, borderRadius: 4, borderLeft: `6px solid ${ramaInfo.color}` }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase' }}>
                    {ramaInfo.nombre}
                  </Typography>
                  <Stack direction="row" alignItems="baseline" spacing={1} sx={{ mt: 1, mb: 1 }}>
                    <Typography variant="h4" sx={{ fontWeight: 900, color: ramaInfo.color }}>{porcentaje}%</Typography>
                    <Typography variant="body2" color="text.secondary">al día</Typography>
                  </Stack>
                  <LinearProgress 
                    variant="determinate" 
                    value={porcentaje} 
                    sx={{ height: 6, borderRadius: 3, '& .MuiLinearProgress-bar': { bgcolor: ramaInfo.color } }} 
                  />
                  <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'text.secondary', fontWeight: 600 }}>
                    {alDia} de {scoutsRama.length} legajos completos
                  </Typography>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Grilla de Legajos */}
      <Grid container spacing={3}>
        {scoutsFiltrados.length > 0 ? (
          scoutsFiltrados.map((scout) => {
            const ramaScout = RAMAS[scout.rama?.toUpperCase()] || CONFIG_RAMA;
            const isCompleto = legajoCompleto(scout);

            return (
              <Grid size={{ xs: 12, md: 6, lg: 4 }} key={scout.id}>
                <Card sx={{ 
                  borderRadius: 4, 
                  border: isCompleto ? '1px solid #eee' : `2px solid #ff9800`, 
                  boxShadow: 'none',
                  position: 'relative',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-4px)', boxShadow: 2 }
                }}>
                  
                  {!isCompleto && (
                    <Chip 
                      icon={<ErrorOutline style={{ color: 'white', fontSize: '1rem' }} />}
                      label="INCOMPLETO" 
                      size="small" 
                      sx={{ 
                        position: 'absolute', top: 12, right: 12, 
                        bgcolor: '#ff9800', color: 'white', fontWeight: 800, fontSize: '0.65rem' 
                      }} 
                    />
                  )}

                  <CardContent>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                      <Avatar sx={{ bgcolor: isCompleto ? ramaScout.color : '#bdbdbd', fontWeight: 700 }}>
                        {scout.apellido?.charAt(0) || scout.nombre?.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
                          {scout.apellido}, {scout.nombre}
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography variant="caption" color="text.secondary">DNI: {scout.dni}</Typography>
                          {esVistaGlobal && (
                            <Chip label={ramaScout.nombre} size="small" sx={{ height: 16, fontSize: '0.6rem', bgcolor: `${ramaScout.color}20`, color: ramaScout.color, fontWeight: 700 }} />
                          )}
                        </Stack>
                      </Box>
                    </Stack>

                    <Divider sx={{ my: 1.5 }} />

                    <Box sx={{ p: 1.5, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                      <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', mb: 1, display: 'block', textTransform: 'uppercase' }}>
                        Estado del Legajo
                      </Typography>
                      
                      {/* Checklist de Documentos */}
                      <CheckItem 
                        label="Ficha de Inscripción" 
                        icon={<AssignmentInd sx={{ color: 'text.secondary', fontSize: 18 }} />} 
                        completado={scout.fichaEntregada} 
                      />
                      <CheckItem 
                        label="Ficha Médica" 
                        icon={<LocalHospital sx={{ color: 'text.secondary', fontSize: 18 }} />} 
                        completado={scout.fichaEntregada} 
                      />
                      <CheckItem 
                        label="Autorización de Imagen" 
                        icon={<InsertPhoto sx={{ color: 'text.secondary', fontSize: 18 }} />} 
                        completado={scout.fichaEntregada} 
                      />
                    </Box>

                    {/* Alerta Médica Rápida */}
                    {scout.alergias && scout.alergias !== "Ninguna" && (
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 2, px: 1 }}>
                        <Warning sx={{ color: '#d32f2f', fontSize: 16 }} />
                        <Typography variant="caption" sx={{ color: '#d32f2f', fontWeight: 700 }}>
                          Alerta Médica: {scout.alergias}
                        </Typography>
                      </Stack>
                    )}

                    <Tooltip title={!isCompleto ? "Notificar a la familia (Próximamente)" : "Abrir Legajo Completo"}>
                      <span>
                        <Button 
                          fullWidth 
                          variant="outlined" 
                          startIcon={<Description />}
                          sx={{ 
                            mt: 2, borderRadius: 2, textTransform: 'none', fontWeight: 700,
                            borderColor: '#eee', color: 'text.primary',
                            '&:hover': { borderColor: ramaScout.color, color: ramaScout.color, bgcolor: `${ramaScout.color}10` } 
                          }}
                        >
                          {isCompleto ? 'Ver Expediente' : 'Gestionar Faltantes'}
                        </Button>
                      </span>
                    </Tooltip>
                  </CardContent>
                </Card>
              </Grid>
            );
          })
        ) : (
          <Grid size={{ xs: 12 }}>
            <Box sx={{ textAlign: 'center', py: 10, bgcolor: 'white', borderRadius: 4, border: '1px dashed #ccc' }}>
              <Typography color="text.secondary">No se encontraron legajos con esos criterios.</Typography>
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};