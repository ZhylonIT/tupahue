import { Box, Typography, Grid } from '@mui/material';
import logoSAAC from '../../assets/images/Logo_SAAC.png';

export const FichaDatosPersonalesTemplate = ({ scout, datos }) => {
  if (!scout || !datos) return null;

  const RowText = ({ label, value, width = '100%' }) => (
    <Box sx={{ display: 'flex', borderBottom: '1px solid #000', py: 0.8, px: 1, width }}>
      <Typography variant="body2" sx={{ fontSize: '12px', whiteSpace: 'nowrap', mr: 1, color: '#444' }}>{label}</Typography>
      <Typography variant="body2" sx={{ fontSize: '12px', fontWeight: 'bold', width: '100%' }}>{value}</Typography>
    </Box>
  );

  return (
    <Box sx={{ width: '100%', height: '100%', p: '15mm', bgcolor: 'white', color: 'black', boxSizing: 'border-box', pageBreakAfter: 'avoid' }}>
      
      {/* ENCABEZADO */}
      <Grid container spacing={2} sx={{ mb: 4, alignItems: 'center' }}>
        <Grid item xs={4}>
          <Box component="img" src={logoSAAC} alt="Scouts de Argentina" sx={{ width: '160px', objectFit: 'contain' }} />
        </Grid>
        <Grid item xs={8} sx={{ textAlign: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1 }}>Ficha de Datos Personales</Typography>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Grupo Scout Tupahue 996</Typography>
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
            <Grid item xs={4}><RowText label="F. Nacimiento:" value={scout.fechaNacimiento || ''} /></Grid>
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
          <Typography variant="body2" sx={{ fontSize: '11px', color: '#444' }}>Dejamos constancia que las siguientes personas (mayores de edad) también se encuentran autorizadas para retirar al beneficiario al finalizar las actividades:</Typography>
          <Typography variant="body2" sx={{ fontSize: '12px', fontWeight: 'bold', mt: 1 }}>{datos.personasAutorizadas || 'Ninguna persona extra declarada.'}</Typography>
        </Box>
      </Box>

      {/* FIRMAS */}
      <Grid container spacing={4} sx={{ mt: 8, px: 2 }}>
        <Grid item xs={5} sx={{ textAlign: 'center' }}>
          <Box sx={{ borderBottom: '1px solid black', width: '100%', mb: 1 }}></Box>
          <Typography variant="body2" sx={{ fontSize: '11px' }}>Firma Responsable 1</Typography>
        </Grid>
        <Grid item xs={2}></Grid>
        <Grid item xs={5} sx={{ textAlign: 'center' }}>
          <Box sx={{ borderBottom: '1px solid black', width: '100%', mb: 1 }}></Box>
          <Typography variant="body2" sx={{ fontSize: '11px' }}>Firma Responsable 2 (Opcional)</Typography>
        </Grid>
      </Grid>

    </Box>
  );
};