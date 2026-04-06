import { useState } from 'react';
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
          sx={{ position: 'absolute', top: 12, right: 12, bgcolor: '#ff9800', color: 'white', fontWeight: 800, fontSize: '0.65rem', animation: 'pulse 2s infinite' }} 
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
              bgcolor: requiereFirma ? '#ff9800' : 'transparent', color: requiereFirma ? 'white' : 'text.primary',
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
    </Card>
  );
};

const ArchivosModal = ({ open, onClose, scout }) => {
  const [loading, setLoading] = useState(false);

  const handleVerArchivo = async (docId) => {
    setLoading(true);
    try {
      let filePath = "";

      // 🎯 CASO ESPECIAL: Ficha Médica y Ficha Personales (Nuevos motores vectoriales)
      // Agregamos ficha_personales previendo el siguiente paso
      if (docId === 'ficha_medica' || docId === 'ficha_personales') {
        filePath = `${scout.id}/${docId}/${docId}.pdf`;
        
        // Verificamos si existe el archivo
        const { data: exists } = await supabase.storage.from('documentos').list(`${scout.id}/${docId}`);
        if (!exists || exists.length === 0) throw new Error("Archivo no generado");

      } else {
        // 🎯 CASO GENERAL: Otros archivos adjuntos
        const folderPath = `${scout.id}/${docId}`;
        const { data: fileList, error: listError } = await supabase.storage.from('documentos').list(folderPath);
        
        if (listError) throw listError;
        
        const validFiles = fileList ? fileList.filter(f => f.name !== '.emptyFolderPlaceholder') : [];
        if (validFiles.length === 0) throw new Error("Carpeta vacía");

        // Traemos el más reciente
        const newestFile = validFiles.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];
        filePath = `${folderPath}/${newestFile.name}`;
      }

      // 🎯 SOLUCIÓN ANTI-CACHÉ: Agregamos un timestamp a la URL
      const { data } = supabase.storage.from('documentos').getPublicUrl(filePath);
      const urlFinal = `${data.publicUrl}?t=${new Date().getTime()}`;
      
      window.open(urlFinal, '_blank');

    } catch (error) {
      console.error("Error abriendo archivo:", error);
      alert("No se encontró el archivo. Es posible que el padre aún no lo haya generado o cargado.");
    } finally {
      setLoading(false);
    }
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
      <DialogContent sx={{ p: 0 }}>
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2, bgcolor: '#eceff1' }}>
            <CircularProgress size={20} sx={{ color: '#455a64', mr: 1 }} />
            <Typography variant="caption" sx={{ fontWeight: 700 }}>Abriendo documento...</Typography>
          </Box>
        )}
        <List>
          {scout?.documentos?.map((docId, i) => (
            <Box key={docId}>
              <ListItem sx={{ py: 2 }}>
                <ListItemIcon><PictureAsPdf color="error" fontSize="large" /></ListItemIcon>
                <ListItemText 
                  primary={<Typography sx={{ fontWeight: 700 }}>{NOMBRES_DOCUMENTOS[docId] || docId}</Typography>} 
                  secondary={docId === 'ficha_medica' || docId === 'ficha_personales' ? "Documento Digitalizado" : "Archivo Adjunto"} 
                />
                <Button 
                  variant="contained" 
                  size="small" 
                  onClick={() => handleVerArchivo(docId)} 
                  disabled={loading} 
                  sx={{ bgcolor: '#455a64', borderRadius: 2, fontWeight: 700, textTransform: 'none' }}
                >
                  Ver Archivo
                </Button>
              </ListItem>
              {i < scout.documentos.length - 1 && <Divider />}
            </Box>
          ))}
        </List>
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
    const ahora = new Date().toLocaleDateString('es-AR');
    try {
      await onUpdateScout(scoutSeleccionado.id, scoutSeleccionado.etapa, {
        avaladoPorEducadores: true,
        educadorAvalista: datosFirma.aclaracion,
        educadorDNI: datosFirma.dni,
        firmaDigitalImg: datosFirma.firmaImg,
        fechaAval: ahora
      });
      setFirmaModalOpen(false);
      setExpedienteOpen(false);
      alert("¡Avalado con éxito!");
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    <Box>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" sx={{ mb: 4 }} spacing={2}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900 }}>Gestión de Legajos: <span style={{ color: CONFIG_RAMA.color }}>{CONFIG_RAMA.nombre}</span></Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <TextField 
            placeholder="Buscar..." 
            size="small" 
            value={busqueda} 
            onChange={(e) => setBusqueda(e.target.value)} 
          />
          <Button 
            variant="contained" 
            startIcon={isZipping ? <CircularProgress size={20} color="inherit" /> : <CloudDownload />} 
            onClick={handleDownloadRama}
            disabled={isZipping || scoutsFiltrados.length === 0}
            sx={{ bgcolor: CONFIG_RAMA.color, fontWeight: 800, borderRadius: 2 }}
          >
            {isZipping ? 'Zipeando...' : 'Descargar Rama'}
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
        onAvalarIngreso={() => setFirmaModalOpen(true)} 
      />
      
      <ArchivosModal open={docsModalOpen} onClose={() => setDocsModalOpen(false)} scout={scoutSeleccionado} />
      
      <FirmaDigitalModal 
        open={firmaModalOpen} 
        onClose={() => setFirmaModalOpen(false)} 
        onConfirm={handleConfirmarFirma} 
        user={user} 
      />
    </Box>
  );
};