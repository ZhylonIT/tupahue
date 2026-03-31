import { Box, Typography, Grid } from '@mui/material';
import logoSAAC from '../../assets/images/Logo_SAAC.png';

export const FichaUsoImagenTemplate = ({ scout, datos }) => {
  if (!scout || !datos) return null;

  const Campo = ({ texto }) => (
    <Typography component="span" sx={{ fontWeight: 'bold', textDecoration: 'underline', mx: 0.5, fontSize: '13px' }}>
      {texto || '\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0'}
    </Typography>
  );

  return (
    <Box sx={{ width: '100%', height: '100%', p: '15mm', bgcolor: 'white', color: 'black', boxSizing: 'border-box', pageBreakAfter: 'avoid' }}>
      
      {/* ENCABEZADO */}
      <Grid container spacing={2} sx={{ mb: 4, alignItems: 'center' }}>
        <Grid item xs={4}>
          <Box component="img" src={logoSAAC} alt="Scouts de Argentina" sx={{ width: '150px', objectFit: 'contain' }} />
        </Grid>
        <Grid item xs={8} sx={{ textAlign: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 900, textTransform: 'uppercase', lineHeight: 1.2 }}>Autorización Uso de Imagen<br/>Niños, Niñas y Jóvenes Menores de edad</Typography>
          <Typography variant="subtitle2" sx={{ mt: 1 }}>Planilla Versión: 07-21</Typography>
          <Typography variant="caption">www.scouts.org.ar</Typography>
        </Grid>
      </Grid>

      <Typography variant="h6" sx={{ textAlign: 'center', fontWeight: 'bold', textTransform: 'uppercase', mb: 3, textDecoration: 'underline' }}>
        AUTORIZACIÓN USO DE IMAGEN<br/>NIÑOS, NIÑAS Y JÓVENES MENORES DE 18 AÑOS
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Sres.</Typography>
        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>SCOUTS DE ARGENTINA ASOCIACION CIVIL</Typography>
        <Typography variant="body1">Libertad 1282 C.A.B.A.</Typography>
      </Box>

      {/* CUERPO DEL DOCUMENTO */}
      <Typography variant="body1" sx={{ textAlign: 'justify', lineHeight: 2.2, fontSize: '13px' }}>
        Por medio de la presente, yo <Campo texto={datos.tutorNombre} /> domiciliado/a en (Calle, Ciudad, Provincia) <Campo texto={datos.tutorDomicilio} /> y en mi carácter de Padre/Madre/ Tutor/Curador, autorizo a SCOUTS DE ARGENTINA ASOCIACION CIVIL ("SAAC"), a utilizar de manera amplia, irrestricta y gratuita las imágenes del/la menor <Campo texto={`${scout.nombre} ${scout.apellido}`} /> que sean tomadas en el año <Campo texto={datos.anio} /> DNI <Campo texto={scout.dni} /> en las Actividades Scouts (en adelante, las "Imágenes"), sin limitación temporal alguna y/o geográfica, para su almacenamiento, transmisión, uso, reproducción, comunicación pública, difusión, publicación y/o edición en cualquier tipo de formato, soporte y/o medio de difusión, producto gráfico y/o audiovisual, vinculado directa y/o indirectamente con la promoción, difusión y conocimiento de sus actividades, productos y/u objetivos de SAAC (incluyendo, pero no limitado a medios audiovisuales, redes sociales, internet, medios gráficos impresos, existente y/o a desarrollarse en el futuro).
      </Typography>

      <Typography variant="body1" sx={{ textAlign: 'justify', lineHeight: 2.2, fontSize: '13px', mt: 2 }}>
        Asimismo, dejo constancia de que he explicado al/a la menor <Campo texto={`${scout.nombre} ${scout.apellido}`} /> sobre las características y alcance de la presente autorización y que renuncio expresa e irrevocablemente a todo y cualquier tipo de reclamo contra SAAC, sus directores, autoridades y miembros en relación a los derechos autorizados por medio de la presente sobre las Imágenes y/o a percibir cualquier suma en concepto de indemnización o remuneración por los usos autorizados precedentemente indicados, relevando a SAAC de cualquier responsabilidad al respecto.
      </Typography>

      {/* FIRMA TUTOR */}
      <Box sx={{ mt: 8, mb: 6 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: 2 }}>
          <Typography variant="body1" sx={{ mr: 2, fontWeight: 'bold' }}>Firma Padre/Madre/Tutor/Curador:</Typography>
          <Box sx={{ borderBottom: '1px solid black', width: '300px' }}></Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: 2 }}>
          <Typography variant="body1" sx={{ mr: 2, fontWeight: 'bold' }}>Aclaración:</Typography>
          <Box sx={{ borderBottom: '1px solid black', width: '300px' }}><Campo texto={datos.tutorNombre} /></Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
          <Typography variant="body1" sx={{ mr: 2, fontWeight: 'bold' }}>D.N.I:</Typography>
          <Box sx={{ borderBottom: '1px solid black', width: '300px' }}><Campo texto={datos.tutorDni} /></Box>
        </Box>
      </Box>

      {/* FOOTER SAAC */}
      <Box sx={{ textAlign: 'center', borderTop: '2px solid #005b96', pt: 1, position: 'absolute', bottom: '15mm', width: 'calc(100% - 30mm)' }}>
        <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block', fontSize: '10px' }}>MIEMBRO DE LA ORGANIZACIÓN MUNDIAL DEL MOVIMIENTO SCOUT</Typography>
        <Typography variant="caption" sx={{ display: 'block', fontSize: '9px' }}>Scouts de Argentina Asociación Civil, es una organización sin fines de lucro, con Personería Jurídica Nacional N° 1645416 - Res IGJ N° 999 del 24 de septiembre de 1998.</Typography>
        <Typography variant="caption" sx={{ display: 'block', fontSize: '9px' }}>Sede Nacional: Libertad 1282 - CABA C1012AAZ - Argentina - Tel: +54-11-4811-0185 - CUIT 30-69732250-3 - IVA Exento</Typography>
      </Box>
    </Box>
  );
};