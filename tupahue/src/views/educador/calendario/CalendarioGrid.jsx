import { Box, Typography, Paper, Stack } from '@mui/material';

export const CalendarioGrid = ({ fechaVista, eventos, configRama, onEventClick }) => {
  const year = fechaVista.getFullYear();
  const month = fechaVista.getMonth();
  const primerDiaSemana = new Date(year, month, 1).getDay();
  const diasEnMes = new Date(year, month + 1, 0).getDate();
  const dias = Array.from({ length: diasEnMes }, (_, i) => i + 1);
  const espaciosBlanco = Array.from({ length: primerDiaSemana }, (_, i) => i);

  return (
    <Paper sx={{ borderRadius: 4, overflow: 'hidden', border: '1px solid #eee', boxShadow: 'none' }}>
      <Box sx={{ overflowX: 'auto' }}>
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(7, minmax(120px, 1fr))', 
          bgcolor: '#eee', 
          gap: '1px' 
        }}>
          {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(d => (
            <Box key={d} sx={{ bgcolor: '#fafafa', py: 1.5, textAlign: 'center' }}>
              <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary' }}>{d}</Typography>
            </Box>
          ))}
          
          {espaciosBlanco.map(b => <Box key={`b-${b}`} sx={{ minHeight: 120, bgcolor: '#fff' }} />)}
          
          {dias.map(dia => {
            const eventosDelDia = eventos.filter(ev => Number(ev.fecha.split('-')[2]) === dia);
            const esHoy = new Date().getDate() === dia && new Date().getMonth() === month && new Date().getFullYear() === year;
            
            return (
              <Box key={dia} sx={{ 
                minHeight: 120, 
                bgcolor: esHoy ? `${configRama.color}05` : '#fff', 
                p: 1 
              }}>
                <Typography variant="caption" sx={{ 
                  fontWeight: 800, mb: 1, display: 'flex', alignItems: 'center', 
                  justifyContent: 'center', width: 22, height: 22, borderRadius: '50%', 
                  color: esHoy ? 'white' : 'text.primary', 
                  bgcolor: esHoy ? configRama.color : 'transparent' 
                }}>
                  {dia}
                </Typography>
                
                <Stack spacing={0.5}>
                  {eventosDelDia.map(ev => {
                    const esNacional = ev.tipo === 'NACIONAL';
                    // Creamos un texto informativo para el tooltip
                    const infoTooltip = `${ev.titulo}${ev.hora ? `\nHora: ${ev.hora}` : ''}${ev.lugar ? `\nLugar: ${ev.lugar}` : ''}`;
                    
                    return (
                      <Box 
                        key={ev.id} 
                        onClick={() => onEventClick(ev)} 
                        title={infoTooltip} // Muestra hora y lugar al pasar el mouse
                        sx={{ 
                          background: ev.color, 
                          color: esNacional ? '#004A77' : 'white', 
                          border: esNacional ? '1px solid #75BDF0' : 'none', 
                          p: '4px 6px', 
                          borderRadius: 1, 
                          fontSize: '0.65rem', 
                          fontWeight: 700, 
                          cursor: 'pointer', 
                          overflow: 'hidden', 
                          textOverflow: 'ellipsis', 
                          whiteSpace: 'nowrap',
                          '&:hover': {
                            filter: 'brightness(0.95)',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                          }
                        }}
                      >
                        {ev.titulo}
                      </Box>
                    );
                  })}
                </Stack>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Paper>
  );
};