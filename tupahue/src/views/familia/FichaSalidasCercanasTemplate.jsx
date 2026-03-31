import { Box, Typography, Grid } from '@mui/material';
import logoSAAC from '../../assets/images/Logo_SAAC.png';

export const FichaSalidasCercanasTemplate = ({ scout, datos }) => {
  if (!scout || !datos) return null;

  // Helpers para simular los espacios para completar
  const Campo = ({ texto }) => (
    <Typography component="span" sx={{ fontWeight: 'bold', textDecoration: 'underline', mx: 0.5, fontSize: '12px' }}>
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
          <Typography variant="h6" sx={{ fontWeight: 900, textTransform: 'uppercase' }}>Autorización Anual Para Salidas Cercanas</Typography>
          <Typography variant="subtitle2">Planilla Versión: 07-21</Typography>
          <Typography variant="caption">www.scouts.org.ar</Typography>
        </Grid>
      </Grid>

      <Typography variant="h6" sx={{ textAlign: 'center', fontWeight: 'bold', textTransform: 'uppercase', mb: 4, textDecoration: 'underline' }}>
        AUTORIZACIÓN ANUAL PARA SALIDAS CERCANAS
      </Typography>

      {/* CUERPO DEL DOCUMENTO */}
      <Typography variant="body1" sx={{ textAlign: 'justify', lineHeight: 2.2, fontSize: '12px' }}>
        En la localidad de <Campo texto={datos.localidad} />, provincia de <Campo texto={datos.provincia} />, 
        partido / departamento de <Campo texto={datos.partido} />, a los <Campo texto={datos.dia} /> días del mes de <Campo texto={datos.mes} /> del año <Campo texto={datos.anio} />, 
        yo (1) <Campo texto={datos.tutorNombre} /> nacido/a el <Campo texto={datos.tutorNacimiento} /> de nacionalidad <Campo texto={datos.tutorNacionalidad} /> 
        y DNI <Campo texto={datos.tutorDni} /> con domicilio en <Campo texto={datos.tutorDomicilio} /> Teléfono: <Campo texto={datos.tutorTelefono} /> 
        en mi carácter de (2) <Campo texto={datos.tutorVinculo} /> OTORGO AUTORIZACIÓN PARA QUE EL / LA MENOR (3) <Campo texto={`${scout.nombre} ${scout.apellido}`} /> 
        nacido/a el <Campo texto={scout.fechaNacimiento} /> de nacionalidad <Campo texto={datos.scoutNacionalidad} /> 
        y DNI <Campo texto={scout.dni} /> con domicilio en <Campo texto={datos.scoutDomicilio} /> 
        para salir de la sede del Grupo Scout N° <Campo texto="996" /> del Distrito N° <Campo texto="3" /> perteneciente a la Zona N° <Campo texto="8" /> 
        de Scouts de Argentina Asociación Civil, durante el presente año <Campo texto={datos.anio} /> cuando las actividades planificadas así lo requieran y bajo el cuidado de los/las Educadores/as Scout del Grupo Scout.
      </Typography>

      <Typography variant="body1" sx={{ textAlign: 'justify', lineHeight: 2.2, fontSize: '12px', mt: 2 }}>
        Dichas actividades podrán ser: juegos por el barrio / localidad, visita a plazas, recolección y/o venta de elementos varios, servicios, actividades religiosas o comunitarias y cualquier otra actividad fuera de la sede del grupo en un rango no mayor a <Campo texto={datos.rangoDistancia} />, y siempre y cuando la salida no requiera pernocte.
      </Typography>

      <Typography variant="body1" sx={{ textAlign: 'justify', lineHeight: 2.2, fontSize: '12px', mt: 2 }}>
        Dejo constancia que tengo conocimiento que para las actividades no abarcadas en esta autorización, los responsables del Organismo me pedirán autorización particular en cada caso, conforme al Manual General de Normas de SAAC, Capítulo 4.
      </Typography>

      <Typography variant="body1" sx={{ textAlign: 'justify', lineHeight: 2.2, fontSize: '12px', mt: 2 }}>
        Asimismo, doy autorización para que el menor sea transportado por la Asociación desde y hasta el lugar donde se realice la actividad autorizada por el medio de transporte que decida la Institución, comprometiéndome en caso de revocación a hacerlo saber a las autoridades correspondientes y por escrito.
      </Typography>

      {/* FIRMA TUTOR */}
      <Box sx={{ display: 'flex', mt: 6, mb: 4 }}>
        <Typography variant="body2" sx={{ fontSize: '12px', mr: 2 }}>Firma:</Typography>
        <Box sx={{ borderBottom: '1px solid black', width: '250px' }}></Box>
      </Box>

      {/* AVAL SCOUT */}
      <Box sx={{ border: '1px solid black', p: 2, mb: 4 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', textDecoration: 'underline', mb: 1, fontSize: '12px' }}>
          AVAL DE LOS RESPONSABLES SCOUTS (4)
        </Typography>
        <Typography variant="body2" sx={{ textAlign: 'justify', fontSize: '11px', mb: 3 }}>
          Certifico que el/la Menor registrado/a en la categoría de Beneficiario, posee el Legajo Personal completo según el capitulo 4, del Manual General de Normas de SAAC y que la persona que está otorgando autorización tiene su firma registrada en la "AUTORIZACIÓN DE INGRESO DE NIÑOS, NIÑAS Y JÓVENES MENORES DE 18 AÑOS".
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
              <Typography variant="body2" sx={{ fontSize: '11px', mr: 1 }}>Firma:</Typography>
              <Box sx={{ borderBottom: '1px solid black', flexGrow: 1 }}></Box>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
              <Typography variant="body2" sx={{ fontSize: '11px', mr: 1 }}>Aclaración:</Typography>
              <Box sx={{ borderBottom: '1px solid black', flexGrow: 1 }}></Box>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
              <Typography variant="body2" sx={{ fontSize: '11px', mr: 1 }}>DNI:</Typography>
              <Box sx={{ borderBottom: '1px solid black', flexGrow: 1 }}></Box>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
              <Typography variant="body2" sx={{ fontSize: '11px', mr: 1 }}>Función en el Grupo Scout:</Typography>
              <Box sx={{ borderBottom: '1px solid black', flexGrow: 1 }}></Box>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* NOTAS AL PIE */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="caption" sx={{ display: 'block', fontSize: '9px', lineHeight: 1.2 }}>1 Nombre y apellido completo de quien firma la autorización, tal como figura en el DNI</Typography>
        <Typography variant="caption" sx={{ display: 'block', fontSize: '9px', lineHeight: 1.2 }}>2 Hay que hacer figurar el carácter en el cual se autoriza al menor: padre/ madre/ tutor/ guardador/ persona que ejerce la tenencia judicial del/la menor</Typography>
        <Typography variant="caption" sx={{ display: 'block', fontSize: '9px', lineHeight: 1.2 }}>3 Nombre y apellido completo del/la Menor tal como figura en el DNI</Typography>
        <Typography variant="caption" sx={{ display: 'block', fontSize: '9px', lineHeight: 1.2 }}>4 El/la Jefe de Grupo o Jefe/a de Unidad</Typography>
      </Box>

      {/* FOOTER SAAC */}
      <Box sx={{ textAlign: 'center', borderTop: '2px solid #005b96', pt: 1 }}>
        <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block', fontSize: '10px' }}>MIEMBRO DE LA ORGANIZACIÓN MUNDIAL DEL MOVIMIENTO SCOUT</Typography>
        <Typography variant="caption" sx={{ display: 'block', fontSize: '9px' }}>Scouts de Argentina Asociación Civil, es una organización sin fines de lucro, con Personería Jurídica Nacional N° 1645416 - Res IGJ N° 999 del 24 de septiembre de 1998.</Typography>
        <Typography variant="caption" sx={{ display: 'block', fontSize: '9px' }}>Sede Nacional: Libertad 1282 - CABA C1012AAZ - Argentina - Tel: +54-11-4811-0185 - CUIT 30-69732250-3 - IVA Exento</Typography>
      </Box>
    </Box>
  );
};