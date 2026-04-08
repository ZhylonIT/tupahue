import { useState } from 'react';
import { Box, Typography, Paper, Stack, Grid, Button, Chip } from '@mui/material';
import { CheckCircle, AssignmentInd, Article, FilePresent, Visibility, CloudUpload } from '@mui/icons-material';

// Importamos los formularios de las Fichas Oficiales
import { FichaMedicaForm } from './FichaMedicaForm';
import { FichaDatosPersonalesForm } from './FichaDatosPersonalesForm';
import { FichaSalidasCercanasForm } from './FichaSalidasCercanasForm';
import { FichaUsoImagenForm } from './FichaUsoImagenForm';
import { FichaIngresoForm } from './FichaIngresoForm';
import { FichaAutorizacionSalidaForm } from './FichaAutorizacionSalidaForm';
import { FichaDDJJMayoresForm } from './FichaDDJJMayoresForm'; 

// Importamos el gestor de archivos
import { GestorArchivosModal } from './GestorArchivosModal';

const VIOLETA_SCOUT = '#5A189A';

export const DocumentacionView = ({ hijo, onUpdateScout }) => {
  const [fichaMedicaOpen, setFichaMedicaOpen] = useState(false);
  const [fichaPersonalesOpen, setFichaPersonalesOpen] = useState(false);
  const [fichaSalidasOpen, setFichaSalidasOpen] = useState(false);
  const [fichaImagenOpen, setFichaImagenOpen] = useState(false);
  const [fichaIngresoOpen, setFichaIngresoOpen] = useState(false);
  const [fichaEventoOpen, setFichaEventoOpen] = useState(false);
  const [fichaRoverOpen, setFichaRoverOpen] = useState(false);

  // Estados del Gestor de Archivos
  const [gestorArchivosOpen, setGestorArchivosOpen] = useState(false);
  const [activeDocInfo, setActiveDocInfo] = useState(null);

  if (!hijo) return null;

  const isRover = hijo.rama?.toUpperCase() === 'ROVERS';

  const DOCS_UNICA_VEZ = [
    ...(!isRover ? [{ id: 'ingreso_menores', nombre: 'Autorización de Ingreso (<18 años)', formType: 'ingreso' }] : []),
    { id: 'fotocopias_dni', nombre: isRover ? 'Fotocopia DNI Joven' : 'Fotocopias DNI (Padres e Hijo)', isFile: true },
    { id: 'partida_nacimiento', nombre: 'Fotocopia Partida de Nacimiento', isFile: true },
  ];

  const DOCS_ANUALES = [
    { id: 'ficha_medica', nombre: 'Ficha Médica (Salud)', formType: 'medica' },
    { id: 'ficha_personales', nombre: 'Ficha de Datos Personales', formType: 'personales' },
    { id: 'salidas_cercanas', nombre: 'Autorización Salidas Cercanas', formType: 'salidas' },
    { id: 'uso_imagen', nombre: 'Autorización Uso de Imagen', formType: 'imagen' },
  ];

  const DOCS_EVENTOS = [
    isRover 
      ? { id: 'ddjj_campamento_mayor', nombre: 'DDJJ Salida/Campamento (>18 años)', isEventDoc: true, formType: 'rover' }
      : { id: 'auto_campamento_menor', nombre: 'Autorización Salida/Campamento', isEventDoc: true, formType: 'evento' },
  ];

  const docsSubidos = hijo.documentos || [];
  const totalObligatorios = [...DOCS_UNICA_VEZ, ...DOCS_ANUALES].length;
  const completados = docsSubidos.filter(id => [...DOCS_UNICA_VEZ, ...DOCS_ANUALES].some(d => d.id === id)).length;
  const porcentaje = Math.round((completados / totalObligatorios) * 100);

  const handleSaveForm = (hijoActualizado, docId) => {
    const docsDB = hijoActualizado.documentos || [];
    const nuevosDocs = [...new Set([...docsDB, docId])];    
    
    // 🎯 BLINDAJE DE SEGURIDAD LEGAL:
    // Si se sube, edita o actualiza CUALQUIER documento, el aval del educador se cae.
    const pibeParaPersistir = {
      ...hijoActualizado,
      documentos: nuevosDocs,
      avaladoPorEducadores: false,
      educadorAvalista: null,
      educadorDNI: null,
      firmaDigitalImg: null,
      fechaAval: null
    };    
    
    onUpdateScout(pibeParaPersistir);
  };

  const renderFilaDocumento = (doc) => {
    const estaSubido = docsSubidos.includes(doc.id);

    return (
      <Paper
        key={doc.id}
        elevation={0}
        sx={{
          p: 2, mb: 1.5, border: '1px solid',
          borderColor: estaSubido ? '#a5d6a7' : '#e0e0e0',
          borderRadius: 3,
          bgcolor: estaSubido ? '#f1f8e9' : '#fff',
          transition: '0.2s'
        }}
      >
        <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1, minWidth: 0 }}>
            <Box sx={{ flexShrink: 0 }}>
              {estaSubido ? (
                <CheckCircle sx={{ color: '#2e7d32' }} />
              ) : (
                <Box sx={{ width: 24, height: 24, borderRadius: '50%', border: '2px solid #ffb74d', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography sx={{ color: '#ffb74d', fontSize: 14, fontWeight: 900 }}>!</Typography>
                </Box>
              )}
            </Box>

            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: estaSubido ? '#2e7d32' : '#333', wordBreak: 'break-word' }}>
                {doc.nombre}
              </Typography>

              {estaSubido && (
                <Chip
                  size="small"
                  icon={<FilePresent sx={{ fontSize: '14px !important' }} />}
                  label={doc.isFile ? "Archivos subidos" : "Digitalizado"}
                  color="success" variant="outlined"
                  sx={{ mt: 0.5, height: 20, fontSize: '0.65rem', fontWeight: 700, bgcolor: 'white' }}
                />
              )}
            </Box>
          </Box>

          <Button
            variant={estaSubido ? "outlined" : "contained"}
            size="small"
            startIcon={estaSubido ? <Visibility /> : (doc.isFile ? <CloudUpload /> : <Article />)}
            sx={{
              borderRadius: 2, textTransform: 'none', fontWeight: 700,
              minWidth: '140px',
              flexShrink: 0,
              bgcolor: estaSubido ? 'transparent' : VIOLETA_SCOUT,
              color: estaSubido ? VIOLETA_SCOUT : 'white',
              border: estaSubido ? `1px solid ${VIOLETA_SCOUT}` : 'none',
              '&:hover': { bgcolor: estaSubido ? 'rgba(90, 24, 154, 0.05)' : '#4a148c' }
            }}
            onClick={() => {
              if (doc.isFile) {
                setActiveDocInfo(doc);
                setGestorArchivosOpen(true);
                return;
              }
              if (doc.formType === 'evento') setFichaEventoOpen(true);
              if (doc.formType === 'rover') setFichaRoverOpen(true);
              if (doc.formType === 'medica') setFichaMedicaOpen(true);
              if (doc.formType === 'personales') setFichaPersonalesOpen(true);
              if (doc.formType === 'salidas') setFichaSalidasOpen(true);
              if (doc.formType === 'imagen') setFichaImagenOpen(true);
              if (doc.formType === 'ingreso') setFichaIngresoOpen(true);
            }}
          >
            {estaSubido ? 'Ver / Editar' : (doc.isFile ? 'Subir' : 'Completar')}
          </Button>
        </Stack>
      </Paper>
    );
  };

  return (
    <Box sx={{ animation: 'fadeIn 0.3s' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: '#1a1a1a' }}>Legajo Digital</Typography>
          <Typography variant="subtitle1" color="textSecondary">
            {isRover ? "Mi documentación personal" : `Protagonista: ${hijo.nombre} ${hijo.apellido}`}
          </Typography>
        </Box>
        <AssignmentInd sx={{ fontSize: 50, color: VIOLETA_SCOUT, opacity: 0.1 }} />
      </Stack>

      <Grid container spacing={4}>
        <Grid item xs={12} md={7}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, color: VIOLETA_SCOUT, display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckCircle fontSize="small" /> Renovación Anual
            </Typography>
            {DOCS_ANUALES.map(renderFilaDocumento)}
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, color: '#455a64' }}>Documentación Base</Typography>
            {DOCS_UNICA_VEZ.map(renderFilaDocumento)}
          </Box>
        </Grid>

        <Grid item xs={12} md={5}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, color: VIOLETA_SCOUT }}>Eventos y Salidas</Typography>
            {DOCS_EVENTOS.map(renderFilaDocumento)}
          </Box>

          <Paper sx={{ p: 4, borderRadius: 5, textAlign: 'center', border: '1px solid #eee', bgcolor: '#fcfcfc' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 3 }}>Estado del Legajo</Typography>
            <Box sx={{ position: 'relative', display: 'inline-flex' }}>
              <Box sx={{
                width: 120, height: 120, borderRadius: '50%', border: '10px solid #f0f0f0',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Typography variant="h4" sx={{ fontWeight: 900, color: porcentaje === 100 ? '#4caf50' : VIOLETA_SCOUT }}>
                  {porcentaje}%
                </Typography>
              </Box>
              <svg style={{ position: 'absolute', top: -5, left: -5, width: 130, height: 130, transform: 'rotate(-90deg)' }}>
                <circle
                  cx="65" cy="65" r="60" fill="none" stroke={porcentaje === 100 ? '#4caf50' : VIOLETA_SCOUT}
                  strokeWidth="10" strokeDasharray="377" strokeDashoffset={377 - (377 * porcentaje) / 100} strokeLinecap="round"
                />
              </svg>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <GestorArchivosModal
        open={gestorArchivosOpen} onClose={() => setGestorArchivosOpen(false)}
        docInfo={activeDocInfo} scout={hijo} onUpdateScout={onUpdateScout}
      />

      <FichaMedicaForm open={fichaMedicaOpen} onClose={() => setFichaMedicaOpen(false)} scout={hijo} onSave={(h) => handleSaveForm(h, 'ficha_medica')} />
      <FichaDatosPersonalesForm open={fichaPersonalesOpen} onClose={() => setFichaPersonalesOpen(false)} scout={hijo} onSave={(h) => handleSaveForm(h, 'ficha_personales')} />
      <FichaSalidasCercanasForm open={fichaSalidasOpen} onClose={() => setFichaSalidasOpen(false)} scout={hijo} onSave={(h) => handleSaveForm(h, 'salidas_cercanas')} />
      <FichaUsoImagenForm open={fichaImagenOpen} onClose={() => setFichaImagenOpen(false)} scout={hijo} onSave={(h) => handleSaveForm(h, 'uso_imagen')} />
      <FichaIngresoForm open={fichaIngresoOpen} onClose={() => setFichaIngresoOpen(false)} scout={hijo} onSave={(h) => handleSaveForm(h, 'ingreso_menores')} />
      <FichaAutorizacionSalidaForm open={fichaEventoOpen} onClose={() => setFichaEventoOpen(false)} scout={hijo} onSave={(h, id) => handleSaveForm(h, id)} />
      
      {/* GESTIÓN ROVER */}
      <FichaDDJJMayoresForm open={fichaRoverOpen} onClose={() => setFichaRoverOpen(false)} scout={hijo} onSave={(h, id) => handleSaveForm(h, id)} />
    </Box>
  );
};