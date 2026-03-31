import { Box, Typography, Grid } from '@mui/material';
import logoSAAC from '../../assets/images/Logo_SAAC.png';

export const FichaAutorizacionSalidaTemplate = ({ scout, datos }) => (
  <Box sx={{ width: '100%', p: '15mm', bgcolor: 'white', color: 'black', fontFamily: 'Arial' }}>
    <Grid container alignItems="center" sx={{ mb: 2 }}>
      <Grid item xs={3}><Box component="img" src={logoSAAC} sx={{ width: '120px' }} /></Grid>
      <Grid item xs={9} sx={{ textAlign: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 900, fontSize: '14px' }}>Autorización de Padres / Madres / Tutores para Salidas, Acantonamientos y/o Campamentos</Typography>
        <Typography variant="caption">Planilla Versión: 07-21 | www.scouts.org.ar</Typography>
      </Grid>
    </Grid>

    <Typography sx={{ textAlign: 'center', fontWeight: 'bold', textDecoration: 'underline', mb: 3 }}>
      AUTORIZACIÓN PARA {datos.tipoActividad}
    </Typography>

    <Typography sx={{ lineHeight: 2, fontSize: '12px', textAlign: 'justify' }}>
      En la localidad de <b>{datos.localidad}</b>, provincia de <b>{datos.provincia}</b>, partido de <b>{datos.partido}</b>, 
      a los <b>{datos.dia}</b> días del mes de <b>{datos.mes}</b> del año <b>{datos.anio}</b>, 
      YO <b>{datos.tutorNombre}</b> nacido/a el <b>{datos.tutorNacimiento || '___'}</b> de nacionalidad <b>{datos.tutorNacionalidad}</b> 
      DNI <b>{datos.tutorDni}</b> con domicilio en <b>{datos.tutorDomicilio}</b> en mi carácter de <b>{datos.tutorVinculo}</b> 
      OTORGO AUTORIZACIÓN PARA QUE EL MENOR <b>{scout.nombre} {scout.apellido}</b> nacido/a el <b>{scout.fechaNacimiento}</b> 
      DNI <b>{scout.dni}</b> realice la actividad de <b>{datos.tipoActividad}</b> desde el día <b>{datos.fechaDesde}</b> hasta el día <b>{datos.fechaHasta}</b> 
      en el lugar ubicado en <b>{datos.lugarDestino}, {datos.ubicacionDestino}</b> acompañado de sus educadores del Grupo Scout N° <b>996 Tupahue</b>.
    </Typography>

    <Typography sx={{ mt: 2, fontSize: '11px', fontStyle: 'italic' }}>
      Asimismo, doy autorización para medidas médicas de urgencia e intervenciones quirúrgicas si fuera necesario...
    </Typography>

    <Box sx={{ mt: 6, borderBottom: '1px solid black', width: '200px' }} />
    <Typography variant="caption">Firma del Responsable</Typography>

    <Box sx={{ mt: 4, p: 1, border: '1px solid black' }}>
      <Typography sx={{ fontWeight: 'bold', fontSize: '12px' }}>AVAL DE LOS RESPONSABLES SCOUTS</Typography>
      <Typography sx={{ fontSize: '10px' }}>Certifico que el menor posee legajo completo...</Typography>
      <Grid container sx={{ mt: 2 }}>
        <Grid item xs={6}><Box sx={{ borderBottom: '1px solid black', width: '80%' }} /><Typography variant="caption">Firma Jefe de Grupo</Typography></Grid>
      </Grid>
    </Box>
  </Box>
);