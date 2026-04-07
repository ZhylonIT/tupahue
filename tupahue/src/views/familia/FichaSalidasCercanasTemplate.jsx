import { Box, Typography, Grid } from '@mui/material';
import logoSAAC from '../../assets/images/Logo_SAAC.png';

export const FichaSalidasCercanasTemplate = ({ scout, datos }) => {
  if (!scout || !datos) return null;

  const Campo = ({ texto }) => (
    <Typography component="span" sx={{ fontWeight: 'bold', textDecoration: 'underline', mx: 0.5, fontSize: '12px' }}>
      {texto || '\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0'}
    </Typography>
  );

  return (
    <Box sx={{ width: '210mm', height: '297mm', p: '20mm', bgcolor: 'white', color: 'black', boxSizing: 'border-box' }}>
      
      {/* ENCABEZADO */}
      <Grid container spacing={2} sx={{ mb: 4, alignItems: 'center' }}>
        <Grid item xs={4}>
          <Box component="img" src={logoSAAC} alt="Scouts de Argentina" sx={{ width: '150px', objectFit: 'contain' }} />
        </Grid>
        <Grid item xs={8} sx={{ textAlign: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 900, textTransform: 'uppercase' }}>Autorización Anual Para Salidas Cercanas</Typography>
          <Typography variant="subtitle2">Planilla Versión: 07-21</Typography>
          <Typography variant="caption">www.scouts.org.ar</Typography>
        </Grid>
      </Grid>

      <Typography variant="h6" sx={{ textAlign: 'center', fontWeight: 'bold', textTransform: 'uppercase', mb: 4, textDecoration: 'underline' }}>
        AUTORIZACIÓN ANUAL PARA SALIDAS CERCANAS
      </Typography>

      <Typography variant="body1" sx={{ textAlign: 'justify', lineHeight: 2.2, fontSize: '13px' }}>
        En la localidad de <Campo texto={datos.localidad} />, provincia de <Campo texto={datos.provincia} />, 
        partido / departamento de <Campo texto={datos.partido} />, a los <Campo texto={datos.dia} /> días del mes de <Campo texto={datos.mes} /> del año <Campo texto={datos.anio} />, 
        yo (1) <Campo texto={datos.tutorNombre} /> nacido/a el <Campo texto={datos.tutorNacimiento} /> de nacionalidad <Campo texto={datos.tutorNacionalidad} /> 
        y DNI <Campo texto={datos.tutorDni} /> con domicilio en <Campo texto={datos.tutorDomicilio} /> Teléfono: <Campo texto={datos.tutorTelefono} /> 
        en mi carácter de (2) <Campo texto={datos.tutorVinculo} /> OTORGO AUTORIZACIÓN PARA QUE EL / LA MENOR (3) <Campo texto={`${scout.nombre} ${scout.apellido}`} /> 
        nacido/a el <Campo texto={scout.fechaNacimiento} /> de nacionalidad <Campo texto={datos.scoutNacionalidad} /> 
        y DNI <Campo texto={scout.dni} /> con domicilio en <Campo texto={datos.scoutDomicilio} /> 
        para salir de la sede del Grupo Scout N° <Campo texto="996" /> del Distrito N° <Campo texto="3" /> perteneciente a la Zona N° <Campo texto="8" /> 
        de Scouts de Argentina Asociación Civil, durante el presente año <Campo texto={datos.anio} />.
      </Typography>

      <Typography variant="body1" sx={{ textAlign: 'justify', lineHeight: 2.2, fontSize: '13px', mt: 2 }}>
        Dichas actividades podrán ser: juegos por el barrio / localidad, visita a plazas, servicios y cualquier otra actividad fuera de la sede del grupo en un rango no mayor a <Campo texto={datos.rangoDistancia} />, y siempre y cuando la salida no requiera pernocte.
      </Typography>

      {/* SECCIÓN DE FIRMA DIGITALIZADA */}
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '250px' }}>
        <Box sx={{ height: '60px', display: 'flex', alignItems: 'flex-end', mb: 1 }}>
          {datos.firmaPadre && <img src={datos.firmaPadre} alt="Firma" style={{ maxHeight: '60px' }} />}
        </Box>
        <Box sx={{ borderBottom: '1px solid black', width: '100%' }}></Box>
        <Typography variant="body2" sx={{ fontSize: '11px', mt: 1, fontWeight: 'bold' }}>Firma Adulto Responsable</Typography>
        <Typography variant="caption">{datos.aclaracionPadre}</Typography>
      </Box>

      {/* AVAL SCOUT (VACÍO PARA FIRMA FÍSICA O SELLO) */}
      <Box sx={{ border: '1px solid black', p: 2, mt: 6 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', textDecoration: 'underline', mb: 1, fontSize: '11px' }}>
          AVAL DE LOS RESPONSABLES SCOUTS
        </Typography>
        <Typography variant="body2" sx={{ textAlign: 'justify', fontSize: '10px', mb: 2 }}>
          Certifico que el/la Menor posee el Legajo Personal completo y que la persona que otorga la autorización tiene su firma registrada.
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}><Typography variant="caption">Firma Educador: ___________________________</Typography></Grid>
          <Grid item xs={6}><Typography variant="caption">Aclaración: ___________________________</Typography></Grid>
        </Grid>
      </Box>

      {/* FOOTER SAAC */}
      <Box sx={{ position: 'absolute', bottom: '20mm', left: '20mm', right: '20mm', textAlign: 'center', borderTop: '1px solid #ccc', pt: 2 }}>
        <Typography variant="caption" sx={{ display: 'block', fontSize: '8px' }}>Scouts de Argentina Asociación Civil - Grupo Scout Tupahue 996</Typography>
      </Box>
    </Box>
  );
};