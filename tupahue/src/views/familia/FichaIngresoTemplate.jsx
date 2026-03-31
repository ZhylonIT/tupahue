import { Box, Typography, Grid } from '@mui/material';
import logoSAAC from '../../assets/images/Logo_SAAC.png';

export const FichaIngresoTemplate = ({ scout, datos }) => {
  if (!scout || !datos) return null;

  const Campo = ({ texto }) => (
    <Typography 
      component="span" 
      sx={{ 
        fontWeight: 'bold', 
        textDecoration: 'underline', 
        px: 0.5, 
        fontSize: '12px',
        display: 'inline'
      }}
    >
      {texto || '\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0'}
    </Typography>
  );

  return (
    <Box sx={{ 
      width: '100%', 
      height: '100%', 
      p: '15mm', 
      bgcolor: 'white', 
      color: 'black', 
      boxSizing: 'border-box', 
      pageBreakAfter: 'avoid',
      fontFamily: 'Arial, sans-serif'
    }}>
      
      {/* ENCABEZADO OFICIAL[cite: 3] */}
      <Grid container spacing={2} sx={{ mb: 3, alignItems: 'center' }}>
        <Grid item xs={4}>
          <Box component="img" src={logoSAAC} alt="Scouts de Argentina" sx={{ width: '140px', objectFit: 'contain' }} />
        </Grid>
        <Grid item xs={8} sx={{ textAlign: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 900, textTransform: 'uppercase', lineHeight: 1.1, fontSize: '15px' }}>
            Autorización de Ingreso de<br/>Niños, Niñas y Jóvenes Menores de 18 Años
          </Typography>
          <Typography variant="subtitle2" sx={{ fontSize: '11px' }}>Planilla Versión: 07-21[cite: 3]</Typography>
          <Typography variant="caption" sx={{ fontSize: '10px' }}>www.scouts.org.ar[cite: 3]</Typography>
        </Grid>
      </Grid>

      <Typography variant="h6" sx={{ textAlign: 'center', fontWeight: 'bold', textTransform: 'uppercase', mb: 3, textDecoration: 'underline', fontSize: '14px' }}>
        AUTORIZACIÓN DE INGRESO DE<br/>NIÑOS, NIÑAS Y JÓVENES MENORES DE 18 AÑOS[cite: 3]
      </Typography>

      {/* CUERPO DEL DOCUMENTO[cite: 3] */}
      <Box sx={{ lineHeight: 1.8, fontSize: '12px', textAlign: 'left' }}>
        <Typography variant="body2" sx={{ fontSize: '12px', display: 'inline' }}>
          En la localidad de <Campo texto={datos.localidad} />, provincia de <Campo texto={datos.provincia} />, 
          partido / departamento de <Campo texto={datos.partido} />, a los <Campo texto={datos.dia} /> días del mes de <Campo texto={datos.mes} /> del año <Campo texto={datos.anio} />, 
          YO (1) <Campo texto={datos.tutorNombre} /> nacido/a el <Campo texto={datos.tutorNacimiento} /> de nacionalidad <Campo texto={datos.tutorNacionalidad} /> 
          de <Campo texto={datos.tutorDni} /> DNI y con domicilio en <Campo texto={datos.tutorDomicilio} /> Teléfono: <Campo texto={datos.tutorTelefono} /> 
          en mi carácter de (2) <Campo texto={datos.tutorVinculo} /> OTORGO AUTORIZACIÓN para que EL MENOR (3) <Campo texto={`${scout.nombre} ${scout.apellido}`} /> 
          nacido/a el <Campo texto={scout.fechaNacimiento} /> de nacionalidad <Campo texto={datos.scoutNacionalidad} /> 
          de <Campo texto={scout.dni} /> y DNI con domicilio en <Campo texto={datos.scoutDomicilio} /> 
          para que participe de las actividades scouts desarrolladas por los dirigentes pertenecientes al Grupo Scout No <Campo texto="996" /> 
          Nombre <Campo texto="Tupahue" /> del Distrito N° <Campo texto="3" /> de la Zona N° <Campo texto="8" /> de Scouts de Argentina Asociación Civil.[cite: 3]
        </Typography>
      </Box>

      <Typography variant="body2" sx={{ fontSize: '11px', mt: 2, fontWeight: 'bold' }}>
        A la autorización se debe adjuntar fotocopias de la Partida de Nacimiento del Menor y de frente y dorso del DNI, tanto del menor, como del autorizante y de otra documentación legal.[cite: 3]
      </Typography>

      {/* FIRMA DEL PADRE[cite: 3] */}
      <Box sx={{ mt: 4, mb: 3 }}>
        <Box sx={{ borderBottom: '1px solid black', width: '250px', mb: 0.5 }}></Box>
        <Typography variant="caption" sx={{ fontWeight: 'bold' }}>Firma del Adulto Responsable (Padre/Madre/Tutor)[cite: 3]</Typography>
      </Box>

      {/* ACLARACIÓN TENENCIA[cite: 3] */}
      <Box sx={{ mt: 2, p: 1, border: '1px solid #eee' }}>
        <Typography variant="caption" sx={{ display: 'block', mb: 1 }}>Formula aclaraciones sobre la situación de tenencia o guarda del menor (4)[cite: 3]</Typography>
        <Typography variant="body2" sx={{ minHeight: '20px', fontStyle: 'italic', borderBottom: '1px dashed #ccc' }}>
          {datos.aclaracionTenencia || '\u00A0'}
        </Typography>
      </Box>

      {/* SECCIÓN TESTIGOS (EDUCADORES)[cite: 3] */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', textDecoration: 'underline', mb: 3, fontSize: '12px' }}>
          TESTIGOS (5) - Aval de los Educadores del Grupo Scout[cite: 3]
        </Typography>
        
        <Grid container spacing={6}>
          <Grid item xs={6}>
            <Box sx={{ textAlign: 'center' }}>
              <Box sx={{ borderBottom: '1px solid black', width: '100%', mt: 4, mb: 1, minHeight: '40px' }}></Box>
              <Typography variant="caption" sx={{ display: 'block', fontWeight: 'bold' }}>Firma Jefe de Grupo Scout[cite: 3]</Typography>
              <Box sx={{ textAlign: 'left', mt: 1 }}>
                <Typography variant="caption" sx={{ display: 'block' }}>Aclaración: ...................................................</Typography>
                <Typography variant="caption" sx={{ display: 'block' }}>DNI: ..............................................................</Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={6}>
            <Box sx={{ textAlign: 'center' }}>
              <Box sx={{ borderBottom: '1px solid black', width: '100%', mt: 4, mb: 1, minHeight: '40px' }}></Box>
              <Typography variant="caption" sx={{ display: 'block', fontWeight: 'bold' }}>Firma Educador de Rama ({scout.rama})[cite: 3]</Typography>
              <Box sx={{ textAlign: 'left', mt: 1 }}>
                <Typography variant="caption" sx={{ display: 'block' }}>Aclaración: ...................................................</Typography>
                <Typography variant="caption" sx={{ display: 'block' }}>DNI: ..............................................................</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* FOOTER SAAC[cite: 3] */}
      <Box sx={{ textAlign: 'center', mt: 4, pt: 2, borderTop: '1px solid #eee' }}>
        <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block', fontSize: '9px' }}>MIEMBRO DE LA ORGANIZACIÓN MUNDIAL DEL MOVIMIENTO SCOUT[cite: 3]</Typography>
        <Typography variant="caption" sx={{ display: 'block', fontSize: '8px' }}>Scouts de Argentina Asociación Civil - CUIT 30-69732250-3 - Libertad 1282, CABA.[cite: 3]</Typography>
      </Box>
    </Box>
  );
};