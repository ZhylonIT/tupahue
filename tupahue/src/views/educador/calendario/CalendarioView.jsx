import { Box, Typography, Stack, Button, Paper, IconButton, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { Add, ChevronLeft, ChevronRight, CalendarViewMonth, ViewStream, Public } from '@mui/icons-material';

import { useCalendario } from './useCalendario'; // IMPORTAMOS EL HOOK LIMPIO
import { CalendarioGrid } from './CalendarioGrid';
import { EventoCard } from './EventoCard';
import { EventoModal } from './EventoModal';

export const CalendarioView = ({ eventos = [], onAddEvento, onUpdateEvento, onDeleteEvento, ramaId = 'CAMINANTES' }) => {
  
  // Toda la "inteligencia" del calendario viene desde el hook
  const {
    viewMode, setViewMode,
    fechaVista,
    isModalOpen,
    selectedEvent,
    esVistaGlobal,
    CONFIG_RAMA,
    eventosFiltrados,
    irMesAnterior, irMesSiguiente,
    abrirModalNuevo, abrirModalEdicion, cerrarModal,
    guardarEvento
  } = useCalendario(eventos, ramaId, onAddEvento, onUpdateEvento, onDeleteEvento);

  return (
    <Box>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" sx={{ mb: 4, gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {esVistaGlobal && <Public sx={{ color: CONFIG_RAMA.color }} />}
            Calendario {esVistaGlobal ? 'Global' : CONFIG_RAMA.nombre}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {esVistaGlobal ? 'Actividades de Grupo y Ramas' : `Agenda de la Unidad`}
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<Add />} 
          onClick={abrirModalNuevo} 
          sx={{ bgcolor: CONFIG_RAMA.color, borderRadius: 2, fontWeight: 700 }}
        >
          {esVistaGlobal ? 'Agendar Evento Grupal' : 'Nueva Actividad'}
        </Button>
      </Stack>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 3 }}>
        <Paper sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 0.5, borderRadius: 3, boxShadow: 'none', border: '1px solid #eee' }}>
          <IconButton onClick={irMesAnterior}><ChevronLeft /></IconButton>
          <Typography sx={{ fontWeight: 800 }}>
            {fechaVista.toLocaleString('es-AR', { month: 'long', year: 'numeric' }).toUpperCase()}
          </Typography>
          <IconButton onClick={irMesSiguiente}><ChevronRight /></IconButton>
        </Paper>
        <ToggleButtonGroup value={viewMode} exclusive onChange={(e, v) => v && setViewMode(v)} size="small">
          <ToggleButton value="grid"><CalendarViewMonth /></ToggleButton>
          <ToggleButton value="list"><ViewStream /></ToggleButton>
        </ToggleButtonGroup>
      </Stack>

      {viewMode === 'grid' ? (
        <CalendarioGrid 
          fechaVista={fechaVista} 
          eventos={eventosFiltrados} 
          configRama={CONFIG_RAMA} 
          onEventClick={abrirModalEdicion} 
        />
      ) : (
        <Stack spacing={2}>
          {eventosFiltrados.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 4, bgcolor: '#fafafa', border: '1px dashed #ccc' }}>
              <Typography color="text.secondary">No hay eventos agendados para este mes.</Typography>
            </Paper>
          ) : (
            eventosFiltrados.map(ev => (
              <EventoCard 
                key={ev.id} 
                evento={ev} 
                configRama={CONFIG_RAMA} 
                onEdit={() => abrirModalEdicion(ev)} 
                onDelete={() => onDeleteEvento(ev.id)} 
              />
            ))
          )}
        </Stack>
      )}

      <EventoModal 
        open={isModalOpen} 
        evento={selectedEvent} 
        configRama={CONFIG_RAMA} 
        onClose={cerrarModal} 
        onSave={guardarEvento} 
        esVistaGlobal={esVistaGlobal}
      />
    </Box>
  );
};