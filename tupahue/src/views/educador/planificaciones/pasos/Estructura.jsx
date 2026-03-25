import { useState, useEffect } from 'react';
import { 
  TextField, Typography, Button, Box, Paper, Stack, 
  Divider, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow 
} from '@mui/material';
import { Sync, Groups, WarningAmber, Edit, Save, Assignment, Analytics, Public } from '@mui/icons-material';

export const PasoEstructura = ({ ramaId, data, setData }) => {
  const [editMode, setEditMode] = useState(false);
  const esVistaGlobal = ramaId?.toUpperCase() === 'TODAS';

  useEffect(() => {
    const savedData = localStorage.getItem(`planif_estructura_${ramaId}`);
    if (savedData) {
      const parsed = JSON.parse(savedData);
      if (!data.planRama && !data.diagnostico) {
        setData(prev => ({ ...prev, ...parsed }));
      }
    }
  }, [ramaId]);

  const handleChange = (field, value) => {
    setData(prev => {
      const newData = { ...prev, [field]: value };
      localStorage.setItem(`planif_estructura_${ramaId}`, JSON.stringify({
        planRama: newData.planRama,
        diagnostico: newData.diagnostico,
        equipos: newData.equipos
      }));
      return newData;
    });
  };

  const sincronizarNomina = () => {
    const storageKey = 'tupahue_scouts';
    const nominaRaw = localStorage.getItem(storageKey);

    if (nominaRaw) {
      try {
        const todosLosScouts = JSON.parse(nominaRaw);
        
        // Si es vista global trae a todos. Si no, filtra por la rama actual.
        const beneficiarios = esVistaGlobal 
          ? todosLosScouts 
          : todosLosScouts.filter(s => s.rama?.toString().toUpperCase() === ramaId?.toUpperCase());

        if (beneficiarios.length === 0) {
          alert(esVistaGlobal ? "No hay protagonistas cargados en el Grupo." : `No se encontraron protagonistas para la rama ${ramaId}.`);
          return;
        }

        const agrupados = beneficiarios.reduce((acc, p) => {
          // En vista global agrupamos por Rama. En vista normal, por Equipo.
          const nombreColumna = esVistaGlobal 
            ? (p.rama || 'SIN RAMA').toUpperCase()
            : (p.equipo || p.patrulla || p.seisena || 'Sin Equipo').toUpperCase();

          if (!acc[nombreColumna]) {
            acc[nombreColumna] = { nombre: nombreColumna, guia: '', subguia: '', integrantes: [] };
          }
          
          const funcion = (p.funcion || p.cargo || '').toLowerCase().trim();
          const nombreCompleto = `${p.nombre} ${p.apellido}`;

          // Para eventos globales no discriminamos guías, todos son integrantes de la unidad
          if (esVistaGlobal) {
            acc[nombreColumna].integrantes.push(nombreCompleto);
          } else {
            if (funcion === 'guía' || funcion === 'guia' || funcion === 'responsable') {
              acc[nombreColumna].guia = nombreCompleto;
            } else if (funcion.includes('subguía') || funcion.includes('sub guia') || funcion.includes('subguia')) {
              acc[nombreColumna].subguia = nombreCompleto;
            } else {
              acc[nombreColumna].integrantes.push(nombreCompleto);
            }
          }
          return acc;
        }, {});

        const finalEquipos = Object.values(agrupados);
        
        setData(prev => ({ ...prev, equipos: finalEquipos }));
        
        const currentSaved = JSON.parse(localStorage.getItem(`planif_estructura_${ramaId}`) || '{}');
        localStorage.setItem(`planif_estructura_${ramaId}`, JSON.stringify({
          ...currentSaved,
          equipos: finalEquipos
        }));

        alert("¡Nómina sincronizada con éxito!");

      } catch (error) {
        console.error("Error al sincronizar", error);
        alert("Error al procesar los datos de la nómina.");
      }
    } else {
      alert("Cargá los protagonistas en la Nómina primero.");
    }
  };

  const esRamaConPatrullas = ['SCOUTS', 'CAMINANTES'].includes(ramaId?.toUpperCase());

  // Calculamos dinámicamente cuántas filas necesitamos para que no quede nadie afuera
  const maxIntegrantes = (data.equipos && data.equipos.length > 0)
    ? Math.max(...data.equipos.map(eq => eq.integrantes.length), 6) // Mínimo 6 filas para que quede prolijo
    : 6;
  const arrayIntegrantes = Array.from({ length: maxIntegrantes }, (_, i) => i);

  const sectionCardStyle = {
    borderRadius: 4, overflow: 'hidden', bgcolor: 'white', border: '1px solid #eee', mb: 4
  };

  return (
    <Box sx={{ maxWidth: '1000px', mx: 'auto', py: 2 }}>
      
      {/* SECCIÓN 1: PLAN DE RAMA / EVENTO */}
      <Paper elevation={0} sx={sectionCardStyle}>
        <Box sx={{ px: 3, py: 2, display: 'flex', alignItems: 'center', bgcolor: '#fafafa', borderBottom: '1px solid #eee' }}>
          <Stack direction="row" alignItems="center" gap={1.5}>
            <Assignment color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1rem' }}>
              {esVistaGlobal ? 'PLAN DEL EVENTO' : 'PLAN DE RAMA'}
            </Typography>
          </Stack>
        </Box>
        <Box sx={{ p: 3 }}>
          <TextField
            multiline minRows={6} fullWidth variant="standard" disabled={!editMode}
            placeholder={esVistaGlobal ? "Escribí aquí la propuesta y estrategia del evento..." : "Escribí aquí la estrategia pedagógica..."}
            value={data.planRama || ''}
            onChange={(e) => handleChange('planRama', e.target.value)}
            InputProps={{ disableUnderline: true, sx: { fontSize: '1rem', lineHeight: 1.6, color: editMode ? 'text.primary' : 'text.secondary' } }}
          />
          <Divider sx={{ my: 2, borderStyle: 'dashed' }} />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant={editMode ? "contained" : "outlined"} onClick={() => setEditMode(!editMode)} startIcon={editMode ? <Save /> : <Edit />} size="small" sx={{ borderRadius: 2, fontWeight: 700 }}>
              {editMode ? "Guardar Plan" : "Modificar"}
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* SECCIÓN 2: DIAGNÓSTICO */}
      <Paper elevation={0} sx={sectionCardStyle}>
        <Box sx={{ px: 3, py: 2, display: 'flex', alignItems: 'center', bgcolor: '#fafafa', borderBottom: '1px solid #eee' }}>
          <Stack direction="row" alignItems="center" gap={1.5}>
            <Analytics color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1rem' }}>DIAGNÓSTICO</Typography>
          </Stack>
        </Box>
        <Box sx={{ p: 3 }}>
          <TextField
            multiline minRows={6} fullWidth variant="standard" disabled={!editMode}
            placeholder={esVistaGlobal ? "¿En qué contexto institucional se realiza esta actividad?..." : "¿Cómo está la unidad hoy?..."}
            value={data.diagnostico || ''}
            onChange={(e) => handleChange('diagnostico', e.target.value)}
            InputProps={{ disableUnderline: true, sx: { fontSize: '1rem', lineHeight: 1.6, color: editMode ? 'text.primary' : 'text.secondary' } }}
          />
          <Divider sx={{ my: 2, borderStyle: 'dashed' }} />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant={editMode ? "contained" : "outlined"} onClick={() => setEditMode(!editMode)} startIcon={editMode ? <Save /> : <Edit />} size="small" sx={{ borderRadius: 2, fontWeight: 700 }}>
              {editMode ? "Guardar Diagnóstico" : "Modificar"}
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* SECCIÓN 3: ESTRUCTURA DE EQUIPOS / GRUPO */}
      <Paper elevation={0} sx={sectionCardStyle}>
        <Box sx={{ px: 3, py: 2, display: 'flex', alignItems: 'center', bgcolor: '#fafafa', borderBottom: '1px solid #eee' }}>
          <Stack direction="row" alignItems="center" gap={1.5}>
            {esVistaGlobal ? <Public color="primary" /> : <Groups color="primary" />}
            <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1rem' }}>
              {esVistaGlobal ? 'NÓMINA DE ASISTENTES POR RAMA' : 'EQUIPOS'}
            </Typography>
          </Stack>
        </Box>
        
        <Box sx={{ p: 3 }}>
          {data.equipos && data.equipos.length > 0 ? (
            <TableContainer sx={{ borderRadius: 3, border: '1px solid #eee' }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: '#fcfcfc' }}>
                    <TableCell sx={{ fontWeight: 800, color: 'text.disabled', fontSize: '0.7rem' }}>
                      {esVistaGlobal ? 'N°' : 'FUNCIÓN'}
                    </TableCell>
                    {data.equipos.map((eq, i) => (
                      <TableCell key={i} align="center" sx={{ fontWeight: 900, color: 'primary.main', minWidth: '120px' }}>
                        {eq.nombre.toUpperCase()}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {/* Ocultamos las filas de Guía/Subguía si es evento global */}
                  {!esVistaGlobal && (
                    <>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, bgcolor: '#fafafa', fontSize: '0.75rem' }}>{esRamaConPatrullas ? 'Guía' : 'Responsable'}</TableCell>
                        {data.equipos.map((eq, i) => (
                          <TableCell key={i} align="center" sx={{ fontWeight: 600, fontSize: '0.75rem' }}>{eq.guia || '-'}</TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, bgcolor: '#fafafa', fontSize: '0.75rem' }}>{esRamaConPatrullas ? 'Subguía' : 'Sub-responsable'}</TableCell>
                        {data.equipos.map((eq, i) => (
                          <TableCell key={i} align="center" sx={{ fontSize: '0.75rem' }}>{eq.subguia || '-'}</TableCell>
                        ))}
                      </TableRow>
                    </>
                  )}
                  
                  {/* Filas dinámicas de integrantes */}
                  {arrayIntegrantes.map((idx) => (
                    <TableRow key={idx}>
                      <TableCell sx={{ color: 'text.disabled', fontSize: '0.65rem' }}>
                        {esVistaGlobal ? `${idx + 1}` : `${idx + 1}° Integrante`}
                      </TableCell>
                      {data.equipos.map((eq, i) => (
                        <TableCell key={i} align="center" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
                          {eq.integrantes[idx] || '-'}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Stack alignItems="center" justifyContent="center" sx={{ py: 6, bgcolor: '#fffbf2', borderRadius: 4, border: '1px dashed #ffd54f' }}>
              <WarningAmber sx={{ fontSize: 50, color: '#ffa000', mb: 2 }} />
              <Typography variant="body2" color="text.secondary">
                {esVistaGlobal ? 'Sincronizá para traer a todos los jóvenes del Grupo.' : 'No hay equipos sincronizados.'}
              </Typography>
            </Stack>
          )}
          
          <Divider sx={{ my: 3, borderStyle: 'dashed' }} />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="contained" startIcon={<Sync />} onClick={sincronizarNomina} size="small" sx={{ borderRadius: 2, fontWeight: 800 }}>
              Sincronizar Nómina
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};