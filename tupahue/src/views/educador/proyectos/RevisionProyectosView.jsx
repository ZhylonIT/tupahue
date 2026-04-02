import React, { useState } from 'react';
import { 
  Box, Typography, Grid, Card, CardContent, Button, 
  Chip, TextField, Divider, Paper, Stack, 
  Checkbox, FormControlLabel, Alert
} from '@mui/material';
import { 
  RocketLaunch, FactCheck, RateReview, Close, 
  CheckCircle, Visibility, HistoryEdu, EventAvailable,
  Description
} from '@mui/icons-material';

export const RevisionProyectosView = ({ proyectos, ramaId, onReview, esVistaGlobal }) => {
  const [selected, setSelected] = useState(null);
  const [comentarios, setComentarios] = useState('');
  const [agendar, setAgendar] = useState(false); // 👈 MODIFICADO: Desactivado por defecto (Punto 2)

  // Filtrado inteligente por rama activa y estado PENDIENTE
  const filtrados = proyectos.filter(p => 
    (esVistaGlobal || p.rama?.toUpperCase() === ramaId?.toUpperCase()) && p.estado === 'PENDIENTE'
  );

  const handleAction = (nuevoEstado) => {
    if (!comentarios.trim()) {
      return alert("Por favor, escribí el informe de factibilidad u observaciones para orientar a los chicos.");
    }
    
    // Enviamos el ID, el estado, los comentarios y el booleano de agendado
    onReview(selected.id, nuevoEstado, comentarios, agendar);
    
    // Reset de estados
    setSelected(null);
    setComentarios('');
    setAgendar(false); // 👈 MODIFICADO: Reset a false (Punto 2)
  };

  // --- VISTA DE DETALLE (EL FORMULARIO DE REVISIÓN) ---
  if (selected) {
    return (
      <Box sx={{ animation: 'fadeIn 0.3s' }}>
        <Button 
          startIcon={<Close />} 
          onClick={() => setSelected(null)} 
          sx={{ mb: 2, fontWeight: 800 }}
        >
          Volver al listado
        </Button>

        <Card elevation={8} sx={{ borderRadius: 6, overflow: 'hidden', border: '1px solid #e0e0e0' }}>
          {/* Cabecera de la revisión */}
          <Box sx={{ bgcolor: '#1a1a1a', p: 3, color: 'white' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="overline" sx={{ letterSpacing: 2, opacity: 0.7, fontWeight: 900 }}>
                  Informe de Factibilidad Educativa
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 900 }}>{selected.titulo}</Typography>
                <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                  {selected.rama} — {selected.equipo}
                </Typography>
              </Box>
              <RocketLaunch sx={{ fontSize: 50, opacity: 0.2 }} />
            </Stack>
          </Box>

          <CardContent sx={{ p: 4 }}>
            <Grid container spacing={5}>
              {/* Columna Izquierda: Contenido del Proyecto */}
              <Grid item xs={12} md={7}>
                <Typography variant="h6" sx={{ fontWeight: 900, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Description color="primary" /> Memoria Descriptiva
                </Typography>
                
                <Stack spacing={4}>
                  <Box>
                    <Typography variant="caption" sx={{ fontWeight: 900, color: 'primary.main', display: 'block', mb: 1 }}>
                      1. EL SUEÑO / OBJETIVOS
                    </Typography>
                    <Paper variant="outlined" sx={{ p: 2, bgcolor: '#fcfcfc', borderRadius: 3 }}>
                      <Typography variant="body1" sx={{ whiteSpace: 'pre-line', lineHeight: 1.6 }}>
                        {selected.objetivos}
                      </Typography>
                    </Paper>
                  </Box>

                  <Box>
                    <Typography variant="caption" sx={{ fontWeight: 900, color: 'primary.main', display: 'block', mb: 1 }}>
                      2. DIAGNÓSTICO / RECURSOS
                    </Typography>
                    <Paper variant="outlined" sx={{ p: 2, bgcolor: '#fcfcfc', borderRadius: 3 }}>
                      <Typography variant="body1" sx={{ whiteSpace: 'pre-line', lineHeight: 1.6 }}>
                        {selected.diagnostico}
                      </Typography>
                    </Paper>
                  </Box>

                  <Box>
                    <Typography variant="caption" sx={{ fontWeight: 900, color: 'primary.main', display: 'block', mb: 1 }}>
                      3. ORGANIZACIÓN / TAREAS
                    </Typography>
                    <Paper variant="outlined" sx={{ p: 2, bgcolor: '#fcfcfc', borderRadius: 3 }}>
                      <Typography variant="body1" sx={{ whiteSpace: 'pre-line', lineHeight: 1.6 }}>
                        {selected.tareas}
                      </Typography>
                    </Paper>
                  </Box>
                </Stack>
              </Grid>

              {/* Columna Derecha: Panel de Decisión del Educador */}
              <Grid item xs={12} md={5}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 3, 
                    borderRadius: 4, 
                    bgcolor: '#f8f9fa', 
                    border: '1px solid #eee',
                    position: 'sticky',
                    top: 20
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 900, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <RateReview color="secondary" /> Dictamen del Educador
                  </Typography>

                  <TextField 
                    fullWidth multiline rows={8} 
                    label="Observaciones Pedagógicas"
                    placeholder="Escribí aquí el feedback para los chicos..."
                    value={comentarios}
                    onChange={(e) => setComentarios(e.target.value)}
                    variant="outlined"
                    sx={{ mb: 3, bgcolor: 'white', '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                  />

                  <Stack spacing={2}>
                    {/* Checkbox de Integración con Calendario */}
                    <FormControlLabel
                      control={
                        <Checkbox 
                          checked={agendar} 
                          onChange={(e) => setAgendar(e.target.checked)}
                          color="success"
                        />
                      }
                      label={
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                          Agendar inicio en Calendario de Rama
                        </Typography>
                      }
                      sx={{ mb: 1, ml: 0.5 }}
                    />

                    <Button 
                      fullWidth variant="contained" color="success" 
                      size="large" startIcon={<CheckCircle />} 
                      onClick={() => handleAction('ACTIVO')}
                      sx={{ borderRadius: 3, py: 1.5, fontWeight: 900 }}
                    >
                      APROBAR (ES FACTIBLE)
                    </Button>

                    <Button 
                      fullWidth variant="contained" color="warning" 
                      size="large" startIcon={<HistoryEdu />} 
                      onClick={() => handleAction('OBSERVADO')}
                      sx={{ borderRadius: 3, py: 1.5, fontWeight: 900 }}
                    >
                      DEVOLVER CON OBSERVACIONES
                    </Button>

                    <Divider sx={{ my: 1 }}>o también</Divider>

                    <Button 
                      fullWidth variant="outlined" color="error" 
                      onClick={() => handleAction('RECHAZADO')}
                      sx={{ borderRadius: 3, fontWeight: 800 }}
                    >
                      RECHAZAR PROYECTO
                    </Button>
                  </Stack>
                </Paper>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    );
  }

  // --- VISTA DE LISTADO (GRILLA DE PENDIENTES) ---
  return (
    <Box sx={{ animation: 'fadeIn 0.5s' }}>
      <Box sx={{ mb: 5 }}>
        <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: -1 }}>Revisión de Proyectos</Typography>
        <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500 }}>
          {esVistaGlobal ? "Bandeja de entrada de todo el Grupo" : `Pendientes de la Rama ${ramaId}`}
        </Typography>
      </Box>

      {filtrados.length === 0 ? (
        <Paper 
          variant="outlined" 
          sx={{ 
            p: 10, textAlign: 'center', borderRadius: 6, 
            bgcolor: '#fcfcfc', border: '3px dashed #e0e0e0' 
          }}
        >
          <RocketLaunch sx={{ fontSize: 80, color: '#e0e0e0', mb: 2 }} />
          <Typography variant="h5" color="text.secondary" sx={{ fontWeight: 700 }}>
            No hay proyectos esperando revisión.
          </Typography>
          <Typography variant="body1" color="text.disabled">
            ¡Buen trabajo! Estás al día con las planificaciones de los chicos.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filtrados.map(proy => (
            <Grid item xs={12} md={6} key={proy.id}>
              <Card 
                elevation={3} 
                sx={{ 
                  borderRadius: 5, 
                  transition: '0.3s',
                  '&:hover': { transform: 'translateY(-5px)', boxShadow: 10 }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
                    <Chip 
                      label={proy.rama} 
                      size="small" 
                      sx={{ fontWeight: 900, bgcolor: '#1a1a1a', color: 'white' }} 
                    />
                    <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.disabled' }}>
                      ENVIADO: {new Date(proy.ultimaModificacion).toLocaleDateString()}
                    </Typography>
                  </Stack>

                  <Typography variant="h5" sx={{ fontWeight: 900, mb: 1, color: '#1a1a1a' }}>
                    {proy.titulo}
                  </Typography>
                  
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                      mb: 3, 
                      display: '-webkit-box', 
                      WebkitLineClamp: 2, 
                      WebkitBoxOrient: 'vertical', 
                      overflow: 'hidden',
                      minHeight: '3em'
                    }}
                  >
                    {proy.objetivos}
                  </Typography>

                  <Divider sx={{ mb: 2 }} />
                  
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                      {proy.equipo}
                    </Typography>
                    <Button 
                      variant="contained" 
                      startIcon={<Visibility />} 
                      onClick={() => setSelected(proy)}
                      sx={{ borderRadius: 2, fontWeight: 800, textTransform: 'none' }}
                    >
                      Evaluar Factibilidad
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </Box>
  );
};