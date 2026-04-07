import { Box, Typography, Grid, Divider } from '@mui/material';
import logoSAAC from '../../assets/images/Logo_SAAC.png';

export const FichaDatosPersonalesTemplate = ({ scout, datos }) => {
  if (!scout || !datos) return null;

  const RowText = ({ label, value, width = '100%' }) => (
    <Box sx={{ display: 'flex', borderBottom: '1px solid #000', py: 0.8, px: 1, width }}>
      <Typography variant="body2" sx={{ fontSize: '12px', whiteSpace: 'nowrap', mr: 1, color: '#444' }}>{label}</Typography>
      <Typography variant="body2" sx={{ fontSize: '12px', fontWeight: 'bold', width: '100%' }}>{value}</Typography>
    </Box>
  );

  // 🎯 Subcomponente para no repetir código y generar las 2 hojas
  const PaginaFicha = ({ tituloExtra = "" }) => (
    <Box sx={{ 
      width: '210mm', height: '297mm', p: '15mm', 
      bgcolor: 'white', color: 'black', boxSizing: 'border-box',
      pageBreakAfter: 'always', position: 'relative'
    }}>
      {/* ENCABEZADO */}
      <Grid container spacing={2} sx={{ mb: 4, alignItems: 'center' }}>
        <Grid item xs={4}>
          <Box component="img" src={logoSAAC} alt="Scouts de Argentina" sx={{ width: '160px', objectFit: 'contain' }} />
        </Grid>
        <Grid item xs={8} sx={{ textAlign: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1 }}>Ficha de Datos Personales</Typography>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Grupo Scout Tupahue 996 {tituloExtra}</Typography>
          <Typography variant="caption">Distrito 3 - Zona 8</Typography>
        </Grid>
      </Grid>

      {/* SECCIÓN 1: BENEFICIARIO */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle2" sx={{ bgcolor: '#eee', p: 1, fontWeight: 'bold', border: '1px solid black', borderBottom: 0 }}>
          I. DATOS DEL BENEFICIARIO
        </Typography>
        <Box sx={{ border: '1px solid black' }}>
          <Grid container>
            <Grid item xs={6}><RowText label="Apellidos:" value={scout.apellido} /></Grid>
            <Grid item xs={6}><RowText label="Nombres:" value={scout.nombre} /></Grid>
            <Grid item xs={4}><RowText label="D.N.I:" value={scout.dni} /></Grid>
            <Grid item xs={4}><RowText label="F. Nacimiento:" value={scout.fechaNacimiento || scout.fecha_nacimiento || ''} /></Grid>
            <Grid item xs={4}><RowText label="Nacionalidad:" value={datos.nacionalidad} /></Grid>
            <Grid item xs={12}><RowText label="Religión / Culto:" value={datos.religion} /></Grid>
            <Grid item xs={8}><RowText label="Institución Educativa:" value={datos.escuela} /></Grid>
            <Grid item xs={4}><RowText label="Grado / Año:" value={datos.grado} /></Grid>
          </Grid>
        </Box>
      </Box>

      {/* SECCIÓN 2: PADRES/TUTORES */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle2" sx={{ bgcolor: '#eee', p: 1, fontWeight: 'bold', border: '1px solid black', borderBottom: 0 }}>
          II. DATOS DEL GRUPO FAMILIAR (Adultos Responsables)
        </Typography>
        <Box sx={{ border: '1px solid black' }}>
          <Grid container>
            <Grid item xs={12}><Box sx={{ bgcolor: '#fafafa', px: 1, py: 0.5, borderBottom: '1px solid #000' }}><Typography variant="caption" fontWeight="bold">Responsable 1</Typography></Box></Grid>
            <Grid item xs={8}><RowText label="Nombre y Apellido:" value={datos.tutor1Nombre} /></Grid>
            <Grid item xs={4}><RowText label="Vínculo:" value={datos.tutor1Vinculo} /></Grid>
            <Grid item xs={4}><RowText label="D.N.I:" value={datos.tutor1Dni} /></Grid>
            <Grid item xs={4}><RowText label="Teléfono:" value={datos.tutor1Tel} /></Grid>
            <Grid item xs={4}><RowText label="Ocupación:" value={datos.tutor1Ocupacion} /></Grid>
            <Grid item xs={12}><RowText label="Correo Electrónico:" value={datos.tutor1Email} /></Grid>

            <Grid item xs={12}><Box sx={{ bgcolor: '#fafafa', px: 1, py: 0.5, borderBottom: '1px solid #000', borderTop: '1px solid #000' }}><Typography variant="caption" fontWeight="bold">Responsable 2</Typography></Box></Grid>
            <Grid item xs={8}><RowText label="Nombre y Apellido:" value={datos.tutor2Nombre} /></Grid>
            <Grid item xs={4}><RowText label="Vínculo:" value={datos.tutor2Vinculo} /></Grid>
            <Grid item xs={6}><RowText label="D.N.I:" value={datos.tutor2Dni} /></Grid>
            <Grid item xs={6}><RowText label="Teléfono:" value={datos.tutor2Tel} /></Grid>
          </Grid>
        </Box>
      </Box>

      {/* SECCIÓN 3: AUTORIZACIONES EXTRA */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="subtitle2" sx={{ bgcolor: '#eee', p: 1, fontWeight: 'bold', border: '1px solid black', borderBottom: 0 }}>
          III. RETIRO DE ACTIVIDADES
        </Typography>
        <Box sx={{ border: '1px solid black', p: 1, minHeight: '60px' }}>
          <Typography variant="body2" sx={{ fontSize: '11px', color: '#444' }}>Dejamos constancia que las siguientes personas (mayores de edad) se encuentran autorizadas para retirar al beneficiario:</Typography>
          <Typography variant="body2" sx={{ fontSize: '12px', fontWeight: 'bold', mt: 1 }}>{datos.personasAutorizadas || 'Ninguna persona extra declarada.'}</Typography>
        </Box>
      </Box>

      {/* 🎯 SECCIÓN DE FIRMA PERSISTIDA */}
      <Grid container spacing={4} sx={{ mt: 4, px: 2, alignItems: 'flex-end' }}>
        <Grid item xs={5} sx={{ textAlign: 'center' }}>
          <Box sx={{ height: '60px', display: 'flex', justifyContent: 'center', alignItems: 'flex-end', mb: 0.5 }}>
            {datos.firmaPadre && (
              <img src={datos.firmaPadre} alt="Firma" style={{ maxHeight: '60px', maxWidth: '180px', objectFit: 'contain' }} />
            )}
          </Box>
          <Box sx={{ borderBottom: '1px solid black', width: '100%' }}></Box>
          <Typography variant="body2" sx={{ fontSize: '10px', fontWeight: 'bold', mt: 0.5 }}>Firma Adulto Responsable</Typography>
        </Grid>
        <Grid item xs={1}></Grid>
        <Grid item xs={6}>
          <Typography variant="body2" sx={{ fontSize: '11px' }}><b>Aclaración:</b> {datos.aclaracionPadre || '___________________________'}</Typography>
          <Typography variant="body2" sx={{ fontSize: '11px', mt: 1 }}><b>DNI:</b> {datos.dniPadre || '___________________________'}</Typography>
          <Typography variant="body2" sx={{ fontSize: '11px', mt: 1 }}><b>Fecha:</b> {datos.fechaFirmaPadre || new Date().toLocaleDateString('es-AR')}</Typography>
        </Grid>
      </Grid>
      
      <Typography variant="caption" sx={{ position: 'absolute', bottom: 10, right: 20, fontSize: '8px', color: '#ccc' }}>
        Copia Generada por Tupahue Digital - {new Date().toLocaleString()}
      </Typography>
    </Box>
  );

  return (
    <Box>
      <PaginaFicha tituloExtra="(Copia Rama)" />
      <PaginaFicha tituloExtra="(Copia Administración)" />
    </Box>
  );
};