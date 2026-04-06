import React, { useState } from 'react';
import { 
  Box, Typography, Grid, Card, CardContent, Button, 
  Chip, TextField, Divider, Paper, Stack, 
  Checkbox, FormControlLabel, Alert, Avatar
} from '@mui/material';
import { 
  RocketLaunch, FactCheck, RateReview, Close, 
  CheckCircle, Visibility, HistoryEdu, EventAvailable,
  Description, InfoOutlined
} from '@mui/icons-material';

export const RevisionProyectosView = ({ proyectos, ramaId, onReview, esVistaGlobal }) => {
  const [selected, setSelected] = useState(null);
  const [comentarios, setComentarios] = useState('');
  const [agendar, setAgendar] = useState(false);

  // 🎯 Terminología dinámica SAAC
  const getTerm = (rama) => rama?.toUpperCase() === 'LOBATOS' ? 'Cacería' : 'Proyecto';

  // Filtrado inteligente por rama activa y estado PENDIENTE
  const filtrados = proyectos.filter(p => 
    (esVistaGlobal || p.rama?.toUpperCase() === ramaId?.toUpperCase()) && p.estado === 'PENDIENTE'
  );

  const handleAction = (nuevoEstado) => {
    if (!comentarios.trim()) {
      return alert("Por favor, escribí un breve informe o sugerencias para orientar el trabajo de los chicos.");
    }
    
    // Ejecutamos el handler del motor global
    onReview(selected.id, nuevoEstado, comentarios, agendar);
    
    // Limpieza de estados
    setSelected(null);
    setComentarios('');
    setAgendar(false);
  };

  // --- VISTA DE DETALLE (EL FORMULARIO DE REVISIÓN) ---
  if (selected) {
    const termActual = getTerm(selected.rama);

    return (
      <Box sx={{ animation: 'fadeIn 0.3s', maxWidth: 1200, mx: 'auto' }}>
        <Button 
          startIcon={<Close />} 
          onClick={() => setSelected(null)} 
          sx={{ mb: 2, fontWeight: 800, color: 'text.secondary' }}
        >
          Volver al listado de pendientes
        </Button>

        <Card elevation={8} sx={{ borderRadius: 6, overflow: 'hidden', border: '1px solid #e0e0e0' }}>
          {/* Cabecera de la revisión */}
          <Box sx={{ bgcolor: '#1a1a1a', p: 4, color: 'white' }}>
            <Grid container alignItems="center" spacing={3}>
              <Grid item>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.1)', width: 70, height: 70, border: '2px solid rgba(255,255,255,0.2)' }}>
                  <RocketLaunch sx={{ fontSize: 40 }} />
                </Avatar>
              </Grid>
              <Grid item xs>
                <Typography variant="overline" sx={{ letterSpacing: 3, opacity: 0.7, fontWeight: 900 }}>
                  INFORME DE FACTIBILIDAD EDUCATIVA
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 900, lineHeight: 1 }}>{selected.titulo}</Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                  <Chip label={selected.rama} size="small" sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 800 }} />
                  <Chip label={selected.equipo} size="small" variant="outlined" sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)', fontWeight: 700 }} />
                </Stack>
              </Grid>
            </Grid>
          </Box>

          <CardContent sx={{ p: { xs: 3, md: 5 } }}>
            <Grid container spacing={6}>
              {/* Columna Izquierda: Lo que escribieron los chicos */}
              <Grid item xs={12} md={7}>
                <Stack spacing={5}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 900, mb: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Description color="primary" /> El Sueño (Objetivos)
                    </Typography>
                    <Paper elevation={0} sx={{ p: 3, bgcolor: '#f8fafc', borderRadius: 4, border: '1px solid #edf2f7' }}>
                      <Typography variant="body1" sx={{ whiteSpace: 'pre-line', lineHeight: 1.8, color: '#334155' }}>
                        {selected.objetivos || "Sin descripción..."}
                      </Typography>
                    </Paper>
                  </Box>

                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 900, mb: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <FactCheck color="primary" /> Diagnóstico y Recursos
                    </Typography>
                    <Paper elevation={0} sx={{ p: 3, bgcolor: '#f8fafc', borderRadius: 4, border: '1px solid #edf2f7' }}>
                      <Typography variant="body1" sx={{ whiteSpace: 'pre-line', lineHeight: 1.8, color: '#334155' }}>
                        {selected.diagnostico || "Sin descripción..."}
                      </Typography>
                    </Paper>
                  </Box>

                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 900, mb: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <EventAvailable color="primary" /> Organización y Tareas
                    </Typography>
                    <Paper elevation={0} sx={{ p: 3, bgcolor: '#f8fafc', borderRadius: 4, border: '1px solid #edf2f7' }}>
                      <Typography variant="body1" sx={{ whiteSpace: 'pre-line', lineHeight: 1.8, color: '#334155' }}>
                        {selected.tareas || "Sin descripción..."}
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
                    p: 4, borderRadius: 5, bgcolor: '#fff', border: '2px solid #f0f0f0',
                    position: 'sticky', top: 24
                  }}
                >
                  <Typography variant="h5" sx={{ fontWeight: 900, mb: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <RateReview color="secondary" /> Evaluación Adulta
                  </Typography>

                  <Alert icon={<InfoOutlined />} severity="info" sx={{ mb: 3, borderRadius: 3, '& .MuiAlert-message': { fontSize: '0.85rem' } }}>
                    Tus comentarios serán visibles para todo el {selected.equipo}. Sé claro y alentador.
                  </Alert>

                  <TextField 
                    fullWidth multiline rows={10} 
                    label="Observaciones y Consejos"
                    placeholder="Escribí aquí los puntos a mejorar o la felicitación por la iniciativa..."
                    value={comentarios}
                    onChange={(e) => setComentarios(e.target.value)}
                    variant="outlined"
                    sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: 4, bgcolor: '#fcfcfc' } }}
                  />

                  <Stack spacing={2}>
                    <FormControlLabel
                      control={<Checkbox checked={agendar} onChange={(e) => setAgendar(e.target.checked)} color="success" />}
                      label={<Typography variant="body2" sx={{ fontWeight: 700 }}>Agendar automáticamente el inicio</Typography>}
                      sx={{ mb: 1 }}
                    />

                    <Button 
                      fullWidth variant="contained" color="success" 
                      size="large" startIcon={<CheckCircle />} 
                      onClick={() => handleAction('ACTIVO')}
                      sx={{ borderRadius: 3, py: 2, fontWeight: 900, fontSize: '1rem', boxShadow: '0 8px 20px rgba(76, 175, 80, 0.3)' }}
                    >
                      APROBAR {termActual.toUpperCase()}
                    </Button>

                    <Button 
                      fullWidth variant="contained" color="warning" 
                      size="large" startIcon={<HistoryEdu />} 
                      onClick={() => handleAction('OBSERVADO')}
                      sx={{ borderRadius: 3, py: 1.5, fontWeight: 900, textTransform: 'none' }}
                    >
                      Devolver para correcciones
                    </Button>

                    <Divider sx={{ my: 1, typography: 'caption', color: 'text.disabled' }}>OPCIONES ADICIONALES</Divider>

                    <Button 
                      fullWidth variant="text" color="error" 
                      onClick={() => handleAction('RECHAZADO')}
                      sx={{ fontWeight: 800, textTransform: 'none' }}
                    >
                      Rechazar proyecto por inviabilidad
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
        <Typography variant="h3" sx={{ fontWeight: 900, color: '#1a237e' }}>Revisión de Proyectos</Typography>
        <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500 }}>
          {esVistaGlobal ? "Bandeja de entrada de todo el Grupo" : `Pendientes de la Rama ${ramaId}`}
        </Typography>
      </Box>

      {filtrados.length === 0 ? (
        <Paper 
          variant="outlined" 
          sx={{ 
            p: 12, textAlign: 'center', borderRadius: 8, 
            bgcolor: '#f8fafc', border: '3px dashed #cbd5e0' 
          }}
        >
          <RocketLaunch sx={{ fontSize: 100, color: '#cbd5e0', mb: 3 }} />
          <Typography variant="h4" color="text.secondary" sx={{ fontWeight: 800, mb: 1 }}>
            ¡Todo despejado!
          </Typography>
          <Typography variant="body1" color="text.disabled" sx={{ fontSize: '1.1rem' }}>
            No hay {ramaId === 'LOBATOS' ? 'cacerías' : 'proyectos'} esperando revisión en este momento.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={4}>
          {filtrados.map(proy => (
            <Grid item xs={12} md={6} key={proy.id}>
              <Card 
                elevation={4} 
                sx={{ 
                  borderRadius: 6, 
                  transition: '0.3s',
                  border: '1px solid #edf2f7',
                  '&:hover': { transform: 'translateY(-8px)', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                    <Chip 
                      label={proy.rama} 
                      size="small" 
                      sx={{ fontWeight: 900, bgcolor: '#1a1a1a', color: 'white', px: 1 }} 
                    />
                    <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.disabled' }}>
                      ENVIADO: {new Date(proy.ultimaModificacion).toLocaleDateString()}
                    </Typography>
                  </Stack>

                  <Typography variant="h5" sx={{ fontWeight: 900, mb: 2, color: '#1a237e', minHeight: '3.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {proy.titulo}
                  </Typography>
                  
                  <Divider sx={{ mb: 3, borderStyle: 'dashed' }} />
                  
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 900, display: 'block' }}>PEQUEÑO GRUPO</Typography>
                      <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'text.primary' }}>
                        {proy.equipo}
                      </Typography>
                    </Box>
                    <Button 
                      variant="contained" 
                      size="large"
                      startIcon={<Visibility />} 
                      onClick={() => setSelected(proy)}
                      sx={{ borderRadius: 3, fontWeight: 900, px: 3, textTransform: 'none' }}
                    >
                      Evaluar
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </Box>
  );
};