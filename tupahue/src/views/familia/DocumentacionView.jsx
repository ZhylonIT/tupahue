import { useState, useRef } from 'react';
import { Box, Typography, Paper, Stack, Grid, Button, LinearProgress, Chip, IconButton } from '@mui/material';
import { 
  CheckCircle, ErrorOutline, Article, AssignmentInd, 
  EventNote, FilePresent, Visibility, CloudUpload 
} from '@mui/icons-material';

// Importamos los formularios de las Fichas Oficiales
import { FichaMedicaForm } from './FichaMedicaForm';
import { FichaDatosPersonalesForm } from './FichaDatosPersonalesForm';
import { FichaSalidasCercanasForm } from './FichaSalidasCercanasForm';
import { FichaUsoImagenForm } from './FichaUsoImagenForm';
import { FichaIngresoForm } from './FichaIngresoForm';
import { FichaAutorizacionSalidaForm } from './FichaAutorizacionSalidaForm';

const DOCS_UNICA_VEZ = [
  { id: 'ingreso_menores', nombre: 'Autorización de Ingreso (<18 años)', formType: 'ingreso' },
  { id: 'fotocopias_dni', nombre: 'Fotocopias DNI (Padres e Hijo)', isFile: true },
  { id: 'partida_nacimiento', nombre: 'Fotocopia Partida de Nacimiento', isFile: true },
];

const DOCS_ANUALES = [
  { id: 'ficha_medica', nombre: 'Ficha Médica (Salud)', formType: 'medica' },
  { id: 'ficha_personales', nombre: 'Ficha de Datos Personales', formType: 'personales' },
  { id: 'salidas_cercanas', nombre: 'Autorización Salidas Cercanas', formType: 'salidas' },
  { id: 'uso_imagen', nombre: 'Autorización Uso de Imagen', formType: 'imagen' },
];

const DOCS_EVENTOS = [
  { id: 'auto_campamento_menor', nombre: 'Autorización Salida/Campamento', isEventDoc: true },
];

export const DocumentacionView = ({ hijo, onUpdateScout }) => {
  const [fichaMedicaOpen, setFichaMedicaOpen] = useState(false);
  const [fichaPersonalesOpen, setFichaPersonalesOpen] = useState(false);
  const [fichaSalidasOpen, setFichaSalidasOpen] = useState(false);
  const [fichaImagenOpen, setFichaImagenOpen] = useState(false);
  const [fichaIngresoOpen, setFichaIngresoOpen] = useState(false);
  const [fichaEventoOpen, setFichaEventoOpen] = useState(false);

  const [uploadingId, setUploadingId] = useState(null);
  const fileInputRef = useRef(null);
  const [activeDocId, setActiveDocId] = useState(null);

  if (!hijo) return null;

  const docsSubidos = hijo.documentos || [];
  const totalObligatorios = [...DOCS_UNICA_VEZ, ...DOCS_ANUALES].length;
  const completados = docsSubidos.filter(id => [...DOCS_UNICA_VEZ, ...DOCS_ANUALES].some(d => d.id === id)).length;
  const porcentaje = Math.round((completados / totalObligatorios) * 100);

  const handleTriggerUpload = (docId) => { 
    setActiveDocId(docId); 
    fileInputRef.current.click(); 
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file || !activeDocId) return;
    setUploadingId(activeDocId);
    setTimeout(() => {
      const nuevosDocs = [...new Set([...docsSubidos, activeDocId])];
      onUpdateScout({ ...hijo, documentos: nuevosDocs });
      setUploadingId(null);
      e.target.value = null;
    }, 1500);
  };

  const handleSaveForm = (hijoAct, docId) => {
    const nuevosDocs = [...new Set([...(hijoAct.documentos || []), docId])];
    onUpdateScout({ ...hijoAct, documentos: nuevosDocs });
    setFichaMedicaOpen(false); 
    setFichaPersonalesOpen(false); 
    setFichaSalidasOpen(false); 
    setFichaImagenOpen(false); 
    setFichaIngresoOpen(false); 
    setFichaEventoOpen(false);
  };

  const renderFilaDocumento = (doc) => {
    const estaSubido = docsSubidos.includes(doc.id);
    const isUploading = uploadingId === doc.id;

    return (
      <Paper 
        key={doc.id} 
        elevation={0} 
        sx={{ 
          p: 2, mb: 1.5, border: '1px solid', 
          borderColor: estaSubido ? '#a5d6a7' : '#e0e0e0', 
          borderRadius: 2, 
          bgcolor: estaSubido ? '#f1f8e9' : '#fff'
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {estaSubido ? (
              <CheckCircle sx={{ color: '#2e7d32' }} />
            ) : (
              <Box sx={{ width: 24, height: 24, borderRadius: '50%', border: '2px solid #ffb74d', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography sx={{ color: '#ffb74d', fontSize: 14, fontWeight: 900 }}>!</Typography>
              </Box>
            )}
            
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: estaSubido ? '#2e7d32' : '#333' }}>
                {doc.nombre}
              </Typography>
              
              <Stack direction="row" spacing={1} alignItems="center">
                {estaSubido && (
                  <Chip 
                    size="small" 
                    icon={<FilePresent sx={{ fontSize: '14px !important' }} />} 
                    label="Archivo en sistema" 
                    color="success" 
                    variant="outlined"
                    sx={{ height: 20, fontSize: '0.65rem', fontWeight: 600, bgcolor: 'white' }}
                  />
                )}
                {estaSubido && (
                  <IconButton size="small" sx={{ p: 0 }} onClick={() => alert("Visualizando documento digital...")}>
                    <Visibility sx={{ fontSize: 16, color: '#5A189A' }} />
                  </IconButton>
                )}
              </Stack>
              
              <Typography variant="caption" color="textSecondary" display="block">
                {isUploading ? 'Procesando...' : (estaSubido ? 'Documento al día' : 'Pendiente de completar')}
              </Typography>
            </Box>
          </Box>

          <Button 
            variant={estaSubido ? "outlined" : "contained"} 
            size="small" 
            startIcon={estaSubido ? <Visibility /> : (doc.isFile ? <CloudUpload /> : <Article />)}
            sx={{ 
              borderRadius: 2, textTransform: 'none', fontWeight: 600, minWidth: '120px',
              bgcolor: estaSubido ? 'transparent' : '#5A189A',
              color: estaSubido ? '#5A189A' : 'white',
              border: estaSubido ? '1px solid #5A189A' : 'none'
            }}
            onClick={() => {
              if (doc.isFile) return handleTriggerUpload(doc.id);
              if (doc.id === 'auto_campamento_menor') return setFichaEventoOpen(true);
              if (doc.formType === 'medica') setFichaMedicaOpen(true);
              if (doc.formType === 'personales') setFichaPersonalesOpen(true);
              if (doc.formType === 'salidas') setFichaSalidasOpen(true);
              if (doc.formType === 'imagen') setFichaImagenOpen(true);
              if (doc.formType === 'ingreso') setFichaIngresoOpen(true);
            }}
          >
            {estaSubido ? 'Ver / Editar' : (doc.isFile ? 'Subir Foto' : 'Completar')}
          </Button>
        </Stack>
        {isUploading && <LinearProgress sx={{ mt: 1, borderRadius: 1 }} />}
      </Paper>
    );
  };

  return (
    <Box sx={{ animation: 'fadeIn 0.3s' }}>
      <input type="file" hidden ref={fileInputRef} onChange={handleFileChange} accept=".pdf,image/*" />

      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900 }}>Gestión de Legajo</Typography>
          <Typography variant="subtitle1" color="textSecondary">Documentación de: <b style={{ color: '#5A189A' }}>{hijo.nombre} {hijo.apellido}</b></Typography>
        </Box>
        <AssignmentInd sx={{ fontSize: 40, color: '#5A189A', opacity: 0.2 }} />
      </Stack>

      <Grid container spacing={4}>
        <Grid item xs={12} md={7}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, color: '#5A189A' }}>Renovación Anual</Typography>
            {DOCS_ANUALES.map(renderFilaDocumento)}
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, color: '#455a64' }}>Por Única Vez</Typography>
            {DOCS_UNICA_VEZ.map(renderFilaDocumento)}
          </Box>
        </Grid>

        <Grid item xs={12} md={5}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, color: '#5A189A' }}>Autorizaciones por Evento</Typography>            
            {DOCS_EVENTOS.map(renderFilaDocumento)}
          </Box>

          <Paper sx={{ p: 3, borderRadius: 4, textAlign: 'center', border: '1px solid #eee' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>Estado del Legajo Principal</Typography>
            <Box sx={{ position: 'relative', display: 'inline-flex' }}>
              <Box sx={{ width: 100, height: 100, borderRadius: '50%', border: '8px solid #f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="h5" sx={{ fontWeight: 900 }}>{porcentaje}%</Typography>
              </Box>
              <svg style={{ position: 'absolute', top: -4, left: -4, width: 108, height: 108, transform: 'rotate(-90deg)' }}>
                <circle cx="54" cy="54" r="50" fill="none" stroke={porcentaje === 100 ? '#4caf50' : '#5A189A'} strokeWidth="8" strokeDasharray="314" strokeDashoffset={314 - (314 * porcentaje) / 100} strokeLinecap="round" />
              </svg>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* MODALES */}
      <FichaMedicaForm open={fichaMedicaOpen} onClose={() => setFichaMedicaOpen(false)} scout={hijo} onSave={(h) => handleSaveForm(h, 'ficha_medica')} />
      <FichaDatosPersonalesForm open={fichaPersonalesOpen} onClose={() => setFichaPersonalesOpen(false)} scout={hijo} onSave={(h) => handleSaveForm(h, 'ficha_personales')} />
      <FichaSalidasCercanasForm open={fichaSalidasOpen} onClose={() => setFichaSalidasOpen(false)} scout={hijo} onSave={(h) => handleSaveForm(h, 'salidas_cercanas')} />
      <FichaUsoImagenForm open={fichaImagenOpen} onClose={() => setFichaImagenOpen(false)} scout={hijo} onSave={(h) => handleSaveForm(h, 'uso_imagen')} />
      <FichaIngresoForm open={fichaIngresoOpen} onClose={() => setFichaIngresoOpen(false)} scout={hijo} onSave={(h) => handleSaveForm(h, 'ingreso_menores')} />
      <FichaAutorizacionSalidaForm open={fichaEventoOpen} onClose={() => setFichaEventoOpen(false)} scout={hijo} onSave={(h, id) => handleSaveForm(h, id)} />
    </Box>
  );
};