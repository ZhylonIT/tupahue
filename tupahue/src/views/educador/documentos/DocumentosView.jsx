import { useState } from 'react';
import { 
  Box, Typography, Grid, Card, CardContent, TextField, 
  InputAdornment, Avatar, Stack, Chip, Divider, Button, Tooltip, Paper, LinearProgress,
  Dialog, DialogTitle, DialogContent, IconButton, List, ListItem, ListItemIcon, ListItemText, Alert
} from '@mui/material';
import { 
  Search, LocalHospital, Warning, Description, ErrorOutline, 
  CheckCircle, AssignmentInd, InsertPhoto, Public, WhatsApp, FolderOpen, PictureAsPdf, Close, Visibility,
  HistoryEdu 
} from '@mui/icons-material';
import { useDocumentos } from './useDocumentos';
import { RAMAS } from '../../../constants/ramas';
import { FichaScout } from '../../../components/FichaScout';

// --- CONSTANTES ---
const NOMBRES_DOCUMENTOS = {
  ingreso_menores: 'Autorización de Ingreso (<18 años)',
  fotocopias_dni: 'Fotocopias DNI (Padres e Hijo)',
  partida_nacimiento: 'Fotocopia Partida de Nacimiento',
  ficha_medica: 'Ficha Médica Oficial (PDF)',
  ficha_personales: 'Ficha de Datos Personales',
  salidas_cercanas: 'Autorización Salidas Cercanas',
  uso_imagen: 'Autorización Uso de Imagen',
  auto_campamento_menor: 'Autorización Salida/Campamento (Menores)',
  ddjj_campamento_mayor: 'DDJJ Salida/Campamento (Mayores >18)'
};

// --- SUB-COMPONENTES UI LIGEROS ---
const CheckItem = ({ label, completado, icon }) => (
  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
    <Stack direction="row" spacing={1.5} alignItems="center">
      {icon}
      <Typography variant="body2" sx={{ fontWeight: completado ? 500 : 700, color: completado ? 'text.secondary' : 'text.primary' }}>{label}</Typography>
    </Stack>
    {completado ? <CheckCircle sx={{ color: '#4caf50', fontSize: 18 }} /> : <ErrorOutline sx={{ color: '#ff9800', fontSize: 18 }} />}
  </Stack>
);

// --- TARJETA DEL SCOUT ---
const LegajoCard = ({ scout, ramaScout, esVistaGlobal, isCompleto, requiereFirma, onOpenExpediente, onWhatsApp, onOpenDocs }) => {
  const dm = scout.datosMedicos || {};
  const cantDocs = scout.documentos?.length || 0;

  return (
    <Card sx={{ 
      borderRadius: 4, 
      border: requiereFirma ? '2px solid #ff9800' : (isCompleto ? '1px solid #eee' : `1px solid #e0e0e0`), 
      boxShadow: requiereFirma ? '0px 4px 15px rgba(255, 152, 0, 0.2)' : 'none', 
      position: 'relative', 
      transition: 'transform 0.2s', 
      '&:hover': { transform: 'translateY(-4px)', boxShadow: 2 }
    }}>
      {requiereFirma && (
        <Chip 
          icon={<HistoryEdu style={{ color: 'white', fontSize: '1rem' }} />} 
          label="PENDIENTE AVAL" 
          size="small" 
          sx={{ 
            position: 'absolute', top: 12, right: 12, bgcolor: '#ff9800', color: 'white', 
            fontWeight: 800, fontSize: '0.65rem', animation: 'pulse 2s infinite' 
          }} 
        />
      )}
      
      <CardContent>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Avatar sx={{ bgcolor: isCompleto ? ramaScout.color : '#bdbdbd', fontWeight: 700 }}>
            {scout.apellido?.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, lineHeight: 1.2 }}>{scout.apellido}, {scout.nombre}</Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="caption" color="text.secondary">DNI: {scout.dni}</Typography>
              {esVistaGlobal && <Chip label={ramaScout.nombre} size="small" sx={{ height: 16, fontSize: '0.6rem', bgcolor: `${ramaScout.color}20`, color: ramaScout.color, fontWeight: 700 }} />}
            </Stack>
          </Box>
        </Stack>

        <Divider sx={{ my: 1.5 }} />

        {requiereFirma && (
          <Alert severity="warning" icon={<HistoryEdu fontSize="small" />} sx={{ mb: 2, py: 0, borderRadius: 2, '& .MuiAlert-message': { fontSize: '0.75rem', fontWeight: 700 } }}>
            Ficha de ingreso sin avalar
          </Alert>
        )}

        <Box sx={{ p: 1.5, bgcolor: '#f8f9fa', borderRadius: 2 }}>
          <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', mb: 1, display: 'block', textTransform: 'uppercase' }}>Estado del Legajo</Typography>
          <CheckItem label="Inscripción" icon={<AssignmentInd sx={{ color: 'text.secondary', fontSize: 18 }} />} completado={scout.fichaEntregada} />
          <CheckItem label="Ficha Médica" icon={<LocalHospital sx={{ color: 'text.secondary', fontSize: 18 }} />} completado={scout.fichaEntregada} />
        </Box>

        <Stack spacing={1} sx={{ mt: 2 }}>
          <Button 
            fullWidth 
            variant={requiereFirma ? "contained" : "outlined"} 
            startIcon={requiereFirma ? <HistoryEdu /> : <Description />} 
            onClick={() => onOpenExpediente(scout)} 
            sx={{ 
              borderRadius: 2, textTransform: 'none', fontWeight: 700, 
              bgcolor: requiereFirma ? '#ff9800' : 'transparent',
              color: requiereFirma ? 'white' : 'text.primary',
              '&:hover': { bgcolor: requiereFirma ? '#e68a00' : `${ramaScout.color}10` }
            }}
          >
            {requiereFirma ? 'Revisar y Avalar' : 'Ver Expediente'}
          </Button>
          <Button fullWidth variant="text" startIcon={<FolderOpen />} disabled={cantDocs === 0} onClick={() => onOpenDocs(scout)} sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700, color: cantDocs > 0 ? 'text.secondary' : '#ccc' }}>
            Archivos Adjuntos ({cantDocs})
          </Button>
        </Stack>
      </CardContent>
      <style>{`
        @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }
      `}</style>
    </Card>
  );
};

// --- MODAL DE ARCHIVOS ---
const ArchivosModal = ({ open, onClose, scout, onVerArchivo }) => (
  <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
    <DialogTitle sx={{ m: 0, p: 2, bgcolor: '#455a64', color: 'white' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h6" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}><FolderOpen /> Archivos de {scout?.nombre}</Typography>
        <IconButton onClick={onClose} sx={{ color: 'white' }}><Close /></IconButton>
      </Stack>
    </DialogTitle>
    <DialogContent sx={{ p: 0, bgcolor: '#fafafa' }}>
      {scout?.documentos?.length > 0 ? (
        <List sx={{ pt: 0 }}>
          {scout.documentos.map((docId, i) => (
            <Box key={docId}>
              <ListItem sx={{ py: 2 }}>
                <ListItemIcon><PictureAsPdf color="error" fontSize="large" /></ListItemIcon>
                <ListItemText primary={<Typography sx={{ fontWeight: 700 }}>{NOMBRES_DOCUMENTOS[docId] || docId}</Typography>} secondary="PDF Oficial" />
                <Button variant="contained" size="small" startIcon={<Visibility />} onClick={() => onVerArchivo(docId)} sx={{ bgcolor: '#455a64', fontWeight: 'bold' }}>Ver PDF</Button>
              </ListItem>
              {i < scout.documentos.length - 1 && <Divider />}
            </Box>
          ))}
        </List>
      ) : (
        <Box sx={{ p: 4, textAlign: 'center' }}><Typography color="text.secondary">Sin archivos cargados.</Typography></Box>
      )}
    </DialogContent>
  </Dialog>
);

// --- COMPONENTE PRINCIPAL ---
export const DocumentosView = ({ scouts: initialScouts = [], ramaId = 'CAMINANTES' }) => {
  // Manejamos los scouts en un estado local para que la UI reaccione al aval
  const [scoutsList, setScoutsList] = useState(initialScouts);
  const { busqueda, setBusqueda, esVistaGlobal, CONFIG_RAMA, scoutsFiltrados, legajoCompleto, requiereFirmaIngreso } = useDocumentos(scoutsList, ramaId);

  const [expedienteOpen, setExpedienteOpen] = useState(false);
  const [docsModalOpen, setDocsModalOpen] = useState(false);
  const [scoutSeleccionado, setScoutSeleccionado] = useState(null);

  // Función para avalar digitalmente la ficha de ingreso
  const handleAvalarIngreso = (scoutId) => {
    const ahora = new Date().toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    
    // Actualizamos el scout en la lista
    const nuevaLista = scoutsList.map(s => {
      if (s.id === scoutId) {
        return {
          ...s,
          avaladoPorEducadores: true,
          educadorAvalista: "Jefe de Grupo", // Esto vendrá del Auth luego
          fechaAval: ahora
        };
      }
      return s;
    });

    setScoutsList(nuevaLista);
    setExpedienteOpen(false); // Cerramos el modal después de avalar
    alert("¡Ficha de ingreso avalada con éxito! Se ha registrado tu firma digital.");
  };

  const handleVerArchivo = (docId) => alert(`Abriendo: ${NOMBRES_DOCUMENTOS[docId] || docId}`);

  return (
    <Box>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" sx={{ mb: 4 }} spacing={2}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900 }}>Gestión de Legajos: <span style={{ color: CONFIG_RAMA.color }}>{CONFIG_RAMA.nombre}</span></Typography>
        </Box>
        <TextField placeholder="Buscar..." size="small" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ color: CONFIG_RAMA.color }} /></InputAdornment> }} />
      </Stack>

      <Grid container spacing={3}>
        {scoutsFiltrados.map((scout) => (
          <Grid size={{ xs: 12, md: 6, lg: 4 }} key={scout.id}>
            <LegajoCard 
              scout={scout} 
              ramaScout={RAMAS[scout.rama?.toUpperCase()] || CONFIG_RAMA} 
              esVistaGlobal={esVistaGlobal} 
              isCompleto={legajoCompleto(scout)} 
              requiereFirma={requiereFirmaIngreso(scout)}
              onOpenExpediente={(s) => { setScoutSeleccionado(s); setExpedienteOpen(true); }} 
              onOpenDocs={(s) => { setScoutSeleccionado(s); setDocsModalOpen(true); }} 
              onWhatsApp={(s) => alert("Enviando recordatorio...")} 
            />
          </Grid>
        ))}
      </Grid>

      {/* MODALES */}
      <FichaScout 
        open={expedienteOpen} 
        onClose={() => { setExpedienteOpen(false); setScoutSeleccionado(null); }} 
        scout={scoutSeleccionado} 
        onAvalarIngreso={handleAvalarIngreso} // Pasamos la nueva función
      />
      <ArchivosModal 
        open={docsModalOpen} 
        onClose={() => { setDocsModalOpen(false); setScoutSeleccionado(null); }} 
        scout={scoutSeleccionado} 
        onVerArchivo={handleVerArchivo} 
      />
    </Box>
  );
};