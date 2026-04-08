import { useState, useEffect } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, TextField,
  Avatar, Stack, Chip, Divider, Button,
  Dialog, DialogTitle, DialogContent, IconButton, List, ListItem, ListItemIcon, ListItemText, CircularProgress
} from '@mui/material';
import {
  LocalHospital, ErrorOutline, CheckCircle, AssignmentInd, FolderOpen,
  PictureAsPdf, Close, HistoryEdu, Description, CloudDownload
} from '@mui/icons-material';

import { useDocumentos } from './useDocumentos';
import { RAMAS } from '../../../constants/ramas';
import { FichaScout } from '../../../components/FichaScout';
import { FirmaDigitalModal } from '../../../components/FirmaDigitalModal';
import { supabase } from '../../../lib/supabaseClient';
import { useAuth } from '../../../context/AuthContext';
import { descargarZipLegajos } from '../../../services/zipLegajos';

// 🎯 IMPORTAMOS LOS GENERADORES DE PDF PARA RE-ARMARLOS
import {
  generarFichaIngresoPDF,
  generarSalidasCercanasPDF,
  generarAutorizacionEventoPDF,
  generarDdjjMayoresPDF
} from '../../../services/pdfService';

const NOMBRES_DOCUMENTOS = {
  ingreso_menores: 'Autorización de Ingreso (<18 años)',
  fotocopias_dni: 'Fotocopias DNI (Padres e Hijo)',
  partida_nacimiento: 'Fotocopia Partida de Nacimiento',
  ficha_medica: 'Ficha Médica Oficial (SAAC)',
  ficha_personales: 'Ficha de Datos Personales (SAAC)',
  salidas_cercanas: 'Autorización Salidas Cercanas',
  uso_imagen: 'Autorización Uso de Imagen',
  auto_campamento_menor: 'Autorización Salida/Campamento (Menores)',
  ddjj_campamento_mayor: 'DDJJ Salida/Campamento (Mayores >18)'
};

const CheckItem = ({ label, completado, icon }) => (
  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
    <Stack direction="row" spacing={1.5} alignItems="center">
      {icon}
      <Typography variant="body2" sx={{ fontWeight: completado ? 500 : 700, color: completado ? 'text.secondary' : 'text.primary' }}>{label}</Typography>
    </Stack>
    {completado ? <CheckCircle sx={{ color: '#4caf50', fontSize: 18 }} /> : <ErrorOutline sx={{ color: '#ff9800', fontSize: 18 }} />}
  </Stack>
);

const LegajoCard = ({ scout, ramaScout, esVistaGlobal, isCompleto, requiereFirma, onOpenExpediente, onOpenDocs, onDownloadSingle }) => {
  const cantDocs = scout.documentos?.length || 0;

  return (
    <Card sx={{
      borderRadius: 4,
      border: requiereFirma ? '2px solid #ff9800' : (isCompleto ? '1px solid #eee' : `1px solid #e0e0e0`),
      boxShadow: requiereFirma ? '0px 4px 15px rgba(255, 152, 0, 0.2)' : 'none',
      position: 'relative', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)', boxShadow: 2 }
    }}>
      {requiereFirma && (
        <Chip
          icon={<HistoryEdu style={{ color: 'white', fontSize: '1rem' }} />} label="PENDIENTE AVAL" size="small"
          sx={{ position: 'absolute', top: 12, right: 12, bgcolor: '#ff9800', color: 'white', fontWeight: 800, fontSize: '0.65rem' }}
        />
      )}

      <CardContent>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Avatar sx={{ bgcolor: isCompleto ? ramaScout.color : '#bdbdbd', fontWeight: 700 }}>
            {scout.apellido?.charAt(0)}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, lineHeight: 1.2 }}>{scout.apellido}, {scout.nombre}</Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="caption" color="text.secondary">DNI: {scout.dni}</Typography>
              {esVistaGlobal && <Chip label={ramaScout.nombre} size="small" sx={{ height: 16, fontSize: '0.6rem', bgcolor: `${ramaScout.color}20`, color: ramaScout.color, fontWeight: 700 }} />}
            </Stack>
          </Box>
          <IconButton size="small" onClick={() => onDownloadSingle(scout)} title="Descargar Legajo ZIP">
            <CloudDownload fontSize="small" />
          </IconButton>
        </Stack>

        <Divider sx={{ my: 1.5 }} />

        <Box sx={{ p: 1.5, bgcolor: '#f8f9fa', borderRadius: 2 }}>
          <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', mb: 1, display: 'block', textTransform: 'uppercase' }}>Estado del Legajo</Typography>
          <CheckItem label="Inscripción" icon={<AssignmentInd sx={{ color: 'text.secondary', fontSize: 18 }} />} completado={scout.documentos?.includes('ingreso_menores')} />
          <CheckItem label="Ficha Médica" icon={<LocalHospital sx={{ color: 'text.secondary', fontSize: 18 }} />} completado={scout.documentos?.includes('ficha_medica')} />
        </Box>

        <Stack spacing={1} sx={{ mt: 2 }}>
          <Button
            fullWidth variant={requiereFirma ? "contained" : "outlined"}
            startIcon={requiereFirma ? <HistoryEdu /> : <Description />}
            onClick={() => onOpenExpediente(scout)}
            sx={{
              borderRadius: 2, textTransform: 'none', fontWeight: 700,
              bgcolor: requiereFirma ? '#ff9800' : 'transparent', color: requiereFirma ? 'white' : 'text.primary'
            }}
          >
            {requiereFirma ? 'Revisar y Avalar' : 'Ver Expediente'}
          </Button>
          <Button fullWidth variant="text" startIcon={<FolderOpen />} disabled={cantDocs === 0} onClick={() => onOpenDocs(scout)} sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}>
            Archivos Adjuntos ({cantDocs})
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

const ArchivosModal = ({ open, onClose, scout }) => {
  const [loading, setLoading] = useState(false);
  const [listaArchivos, setListaArchivos] = useState({});

  useEffect(() => {
    if (open && scout?.documentos) {
      cargarTodosLosArchivos();
    }
  }, [open, scout]);

  const cargarTodosLosArchivos = async () => {
    setLoading(true);
    let mapa = {};
    for (const docId of (scout.documentos || [])) {
      const folderPath = `${scout.id}/${docId}`;
      const { data } = await supabase.storage.from('documentos').list(folderPath);
      mapa[docId] = data?.filter(f => f.name !== '.emptyFolderPlaceholder') || [];
    }
    setListaArchivos(mapa);
    setLoading(false);
  };

  const handleVerArchivo = (docId, fileName) => {
    const filePath = `${scout.id}/${docId}/${fileName}`;
    const { data } = supabase.storage.from('documentos').getPublicUrl(filePath);
    window.open(`${data.publicUrl}?t=${new Date().getTime()}`, '_blank');
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ m: 0, p: 2, bgcolor: '#455a64', color: 'white' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
            <FolderOpen /> Archivos de {scout?.nombre}
          </Typography>
          <IconButton onClick={onClose} sx={{ color: 'white' }}><Close /></IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent sx={{ p: 0, maxHeight: '70vh' }}>
        {loading ? (
          <Box sx={{ p: 4, textAlign: 'center' }}><CircularProgress /></Box>
        ) : (
          <List>
            {scout?.documentos?.map((docId) => (
              <Box key={docId} sx={{ mb: 1 }}>
                <Typography variant="caption" sx={{ px: 2, pt: 1, fontWeight: 900, color: 'text.secondary', display: 'block', bgcolor: '#f5f5f5' }}>
                  {NOMBRES_DOCUMENTOS[docId] || docId.toUpperCase()}
                </Typography>
                {listaArchivos[docId]?.length > 0 ? (
                  listaArchivos[docId].map((file) => (
                    <ListItem key={file.name} sx={{ py: 1 }}>
                      <ListItemIcon><PictureAsPdf color="error" /></ListItemIcon>
                      <ListItemText
                        primary={file.name.split('_').slice(1).join('_') || file.name}
                        primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
                      />
                      <Button size="small" onClick={() => handleVerArchivo(docId, file.name)}>Ver</Button>
                    </ListItem>
                  ))
                ) : (
                  <Typography variant="caption" sx={{ px: 2, pb: 1, fontStyle: 'italic', display: 'block', textAlign: 'center' }}>Sin archivos</Typography>
                )}
                <Divider />
              </Box>
            ))}
          </List>
        )}
      </DialogContent>
    </Dialog>
  );
};

export const DocumentosView = ({ scouts = [], ramaId = 'CAMINANTES', onUpdateScout }) => {
  const { busqueda, setBusqueda, esVistaGlobal, CONFIG_RAMA, scoutsFiltrados, legajoCompleto, requiereFirmaIngreso } = useDocumentos(scouts, ramaId);
  const { user } = useAuth();

  const [expedienteOpen, setExpedienteOpen] = useState(false);
  const [docsModalOpen, setDocsModalOpen] = useState(false);
  const [firmaModalOpen, setFirmaModalOpen] = useState(false);
  const [scoutSeleccionado, setScoutSeleccionado] = useState(null);
  const [isZipping, setIsZipping] = useState(false);

  const handleDownloadRama = async () => {
    setIsZipping(true);
    await descargarZipLegajos(scoutsFiltrados, `Legajos_${CONFIG_RAMA.nombre}`);
    setIsZipping(false);
  };

  const handleConfirmarFirma = async (datosFirma) => {
    if (!scoutSeleccionado) return;

    const ahora = new Date().toLocaleDateString('es-AR');
    try {
      // 🎯 ESTRICTO POR FUNCIÓN (Corregido para leer Array 'funciones')
      const esJefe = Array.isArray(user?.funciones) ? user.funciones.some(f => f.includes('JEFE')) : false;

      const camposAval = {
        // 1. Si es educador, pisamos el genérico SIEMPRE (para salidas y eventos).
        // Si es Jefe, solo lo pisamos si el genérico estaba vacío.
        ...((!esJefe || !scoutSeleccionado.firmaDigitalImg) && {
          firmaDigitalImg: datosFirma.firmaImg,
          educadorAvalista: datosFirma.aclaracion,
          educadorDNI: datosFirma.dni,
        }),

        // 2. Guardamos la copia en el cajón específico
        ...(esJefe ? {
          aval_jefe_firma: datosFirma.firmaImg,
          aval_jefe_aclaracion: datosFirma.aclaracion,
          aval_jefe_dni: datosFirma.dni
        } : {
          aval_educador_firma: datosFirma.firmaImg,
          aval_educador_aclaracion: datosFirma.aclaracion,
          aval_educador_dni: datosFirma.dni
        })
      };

      // 3. MATEMÁTICA DE AVAL (¿Está 100% completo?)
      const tieneIngreso = scoutSeleccionado.documentos?.includes('ingreso_menores');
      const tieneJefeFirma = esJefe ? true : !!scoutSeleccionado.aval_jefe_firma;
      const tieneEduFirma = !esJefe ? true : !!scoutSeleccionado.aval_educador_firma;

      let estaCompletamenteAvalado = false;
      if (tieneIngreso) {
        estaCompletamenteAvalado = tieneJefeFirma && tieneEduFirma;
      } else {
        estaCompletamenteAvalado = true; // Si no hay ingreso, la firma actual alcanza
      }

      const pibeAvalado = {
        ...scoutSeleccionado,
        ...camposAval,
        avaladoPorEducadores: estaCompletamenteAvalado,
        fechaAval: ahora,
        ultimaModificacion: new Date()
      };

      await onUpdateScout(pibeAvalado);

      const mapeoGeneradores = {
        ingreso_menores: () => generarFichaIngresoPDF(pibeAvalado, true),
        salidas_cercanas: () => generarSalidasCercanasPDF(pibeAvalado, true),
        auto_campamento_menor: () => generarAutorizacionEventoPDF(pibeAvalado, true),
        ddjj_campamento_mayor: () => generarDdjjMayoresPDF(pibeAvalado, true)
      };

      for (const docId of (pibeAvalado.documentos || [])) {
        if (mapeoGeneradores[docId]) {
          const folderPath = `${pibeAvalado.id}/${docId}`;
          const { data: existingFiles } = await supabase.storage.from('documentos').list(folderPath);
          const validFiles = existingFiles?.filter(f => f.name !== '.emptyFolderPlaceholder') || [];

          let fileNameToUse = `${docId}_firmado.pdf`;
          if (validFiles.length > 0) fileNameToUse = validFiles[0].name;

          const filePath = `${folderPath}/${fileNameToUse}`;
          const blobNuevo = mapeoGeneradores[docId]();

          await supabase.storage.from('documentos').upload(filePath, blobNuevo, {
            upsert: true,
            contentType: 'application/pdf'
          });
        }
      }

      setFirmaModalOpen(false);
      setExpedienteOpen(false);
      alert(estaCompletamenteAvalado
        ? "¡Aval guardado correctamente! Los PDFs fueron actualizados."
        : "Firma registrada exitosamente. Se aguarda la firma del otro educador para completar el legajo.");
    } catch (error) {
      console.error("Error al persistir el aval:", error);
      alert("Error al guardar el aval: " + error.message);
    }
  };

  return (
    <Box>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" sx={{ mb: 4 }} spacing={2}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900 }}>Legajos Digitales: <span style={{ color: CONFIG_RAMA.color }}>{CONFIG_RAMA.nombre}</span></Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <TextField placeholder="Filtrar por nombre o DNI..." size="small" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} sx={{ width: 250 }} />
          <Button
            variant="contained"
            startIcon={isZipping ? <CircularProgress size={20} color="inherit" /> : <CloudDownload />}
            onClick={handleDownloadRama}
            disabled={isZipping || scoutsFiltrados.length === 0}
            sx={{ bgcolor: CONFIG_RAMA.color, fontWeight: 800, borderRadius: 2 }}
          >
            {isZipping ? 'Procesando Nube...' : 'Descargar Rama ZIP'}
          </Button>
        </Stack>
      </Stack>

      <Grid container spacing={3}>
        {scoutsFiltrados.map((scout) => (
          <Grid item xs={12} md={6} lg={4} key={scout.id}>
            <LegajoCard
              scout={scout}
              ramaScout={RAMAS[scout.rama?.toUpperCase()] || CONFIG_RAMA}
              esVistaGlobal={esVistaGlobal}
              isCompleto={legajoCompleto(scout)}
              requiereFirma={requiereFirmaIngreso(scout)}
              onOpenExpediente={(s) => { setScoutSeleccionado(s); setExpedienteOpen(true); }}
              onOpenDocs={(s) => { setScoutSeleccionado(s); setDocsModalOpen(true); }}
              onDownloadSingle={(s) => descargarZipLegajos([s], `Legajo_${s.apellido}`)}
            />
          </Grid>
        ))}
      </Grid>

      <FichaScout
        open={expedienteOpen}
        onClose={() => setExpedienteOpen(false)}
        scout={scoutSeleccionado}
        onAvalarIngreso={(s) => { setScoutSeleccionado(s); setFirmaModalOpen(true); }}
      />

      <ArchivosModal open={docsModalOpen} onClose={() => setDocsModalOpen(false)} scout={scoutSeleccionado} />

      <FirmaDigitalModal
        open={firmaModalOpen}
        onClose={() => setFirmaModalOpen(false)}
        onConfirm={handleConfirmarFirma}
        user={user}
        titulo="Firma de Aval Institucional"
      />
    </Box>
  );
};