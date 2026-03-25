import { 
  Box, Typography, Modal, Fade, Stack, IconButton, Divider, 
  Button, FormControl, Select, MenuItem, Accordion, 
  AccordionSummary, AccordionDetails, FormGroup, FormControlLabel, Checkbox 
} from '@mui/material';
import { Close, TrendingUp, ExpandMore, Save } from '@mui/icons-material';

const modalStyle = {
  position: 'absolute', top: '50%', left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '95%', sm: 550 },
  maxHeight: '90vh', overflowY: 'auto',
  bgcolor: 'background.paper', borderRadius: 4, boxShadow: 24, p: 4,
};

export const ProgresionModal = ({ 
  open, scout, onClose, configRama, etapas = [], // <-- Valor por defecto agregado
  categorias, objetivosRama, tempEtapa, setTempEtapa, 
  tempObjetivos, onToggleObjetivo, onConfirmar, onPase 
}) => {
  
  const calcularProgreso = (areaId) => {
    const objetivosArea = objetivosRama[areaId] || [];
    if (objetivosArea.length === 0) return 0;
    const cumplidos = objetivosArea.filter(obj => tempObjetivos[`${scout?.id}-${obj}`]).length;
    return Math.round((cumplidos / objetivosArea.length) * 100);
  };

  // VALIDACIÓN SEGURA: Solo calculamos si hay etapas cargadas
  const esUltimaEtapa = etapas.length > 0 && tempEtapa === etapas[etapas.length - 1].id;

  return (
    <Modal open={open} onClose={onClose}>
      <Fade in={open}>
        <Box sx={modalStyle}>
          {scout && configRama && (
            <>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 800 }}>Evaluación</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {scout.nombre} - {configRama.nombre}
                  </Typography>
                </Box>
                <IconButton onClick={onClose}><Close /></IconButton>
              </Stack>
              
              <Divider sx={{ my: 3 }} />

              {esUltimaEtapa && (
                <Box sx={{ mb: 4, p: 2, bgcolor: `${configRama.color}10`, borderRadius: 3, border: `1px dashed ${configRama.color}` }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                    <Box>
                      <Typography variant="subtitle2" sx={{ color: configRama.color, fontWeight: 800 }}>¡Listo para el pase!</Typography>
                      <Typography variant="caption" color="text.secondary">Etapa máxima alcanzada</Typography>
                    </Box>
                    <Button variant="contained" size="small" startIcon={<TrendingUp />} onClick={onPase} sx={{ bgcolor: configRama.color, borderRadius: 2, fontWeight: 700 }}>
                      Pasar de Rama
                    </Button>
                  </Stack>
                </Box>
              )}

              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 700 }}>Cambiar Etapa</Typography>
                <FormControl fullWidth size="small">
                  <Select value={tempEtapa} onChange={(e) => setTempEtapa(e.target.value)} sx={{ borderRadius: 2 }}>
                    {etapas.map((e) => (
                      <MenuItem key={e.id} value={e.id}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          {e.icon && <e.icon sx={{ color: e.color, fontSize: 18 }} />}
                          <Typography variant="body2">{e.nombre}</Typography>
                        </Stack>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 700 }}>Senderos / Áreas</Typography>
                {categorias.map((cat) => (
                  <Accordion key={cat.id} sx={{ mb: 1, boxShadow: 'none', border: '1px solid #eee', borderRadius: '8px !important' }}>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Stack direction="row" spacing={2} alignItems="center" sx={{ width: '100%', pr: 2 }}>
                        <Box sx={{ color: cat.color, display: 'flex' }}>{cat.icon}</Box>
                        <Typography sx={{ fontWeight: 700, flexGrow: 1 }}>{cat.nombre}</Typography>
                        <Typography variant="caption" sx={{ fontWeight: 800 }}>{calcularProgreso(cat.id)}%</Typography>
                      </Stack>
                    </AccordionSummary>
                    <AccordionDetails>
                      <FormGroup>
                        {(objetivosRama[cat.id] || []).map((obj) => (
                          <FormControlLabel 
                            key={obj}
                            control={<Checkbox size="small" checked={!!tempObjetivos[`${scout.id}-${obj}`]} onChange={() => onToggleObjetivo(scout.id, obj)} sx={{ color: cat.color, '&.Mui-checked': { color: cat.color } }} />}
                            label={<Typography variant="body2">{obj}</Typography>}
                          />
                        ))}
                      </FormGroup>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Box>

              <Button fullWidth variant="contained" startIcon={<Save />} onClick={onConfirmar} sx={{ bgcolor: configRama.color, borderRadius: 2, py: 1.5, fontWeight: 700 }}>
                Guardar Progresión
              </Button>
            </>
          )}
        </Box>
      </Fade>
    </Modal>
  );
};