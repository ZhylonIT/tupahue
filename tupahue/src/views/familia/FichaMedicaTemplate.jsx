import { Box, Typography, Grid, Divider } from '@mui/material';
import logoSAAC from '../../assets/images/Logo_SAAC.png';

export const FichaMedicaTemplate = ({ scout, datosMedicos, firmaPadre, datosPadre }) => {
  if (!scout || !datosMedicos) return null;

  const RowCheck = ({ label, value }) => (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #000', py: 0.5, px: 1 }}>
      <Typography variant="body2" sx={{ fontSize: '11px' }}>{label}</Typography>
      <Typography variant="body2" sx={{ fontSize: '11px', fontWeight: 'bold' }}>{value ? 'SI' : 'NO'}</Typography>
    </Box>
  );

  const RowText = ({ label, value, width = '100%' }) => (
    <Box sx={{ display: 'flex', borderBottom: '1px solid #000', py: 0.5, px: 1, width }}>
      <Typography variant="body2" sx={{ fontSize: '11px', whiteSpace: 'nowrap', mr: 1 }}>{label}</Typography>
      <Typography variant="body2" sx={{ fontSize: '11px', fontWeight: 'bold', width: '100%' }}>{value}</Typography>
    </Box>
  );

  return (
    <Box sx={{ width: '210mm', height: '296mm', overflow: 'hidden', p: '10mm', bgcolor: 'white', color: 'black', boxSizing: 'border-box' }}>
      
      {/* ENCABEZADO */}
      <Grid container spacing={2} sx={{ mb: 2, alignItems: 'center' }}>
        <Grid item xs={4}>
          <Box
            component="img"
            src={logoSAAC}
            alt="Scouts de Argentina"
            sx={{ width: '160px', objectFit: 'contain' }}
          />
        </Grid>
        <Grid item xs={8} sx={{ textAlign: 'center', pr: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 900, textTransform: 'uppercase' }}>Formulario de Información de Salud</Typography>
          <Typography variant="subtitle2">Planilla Versión: 01-25</Typography>
          <Typography variant="caption">www.scouts.org.ar</Typography>
          <Box sx={{ border: '2px solid black', p: 0.5, mt: 1, bgcolor: '#f0f0f0', width: '80%', mx: 'auto' }}>
            <Typography variant="caption" sx={{ fontWeight: 'bold' }}>DECLARACIÓN JURADA DE SALUD</Typography><br/>
            <Typography variant="caption" sx={{ fontSize: '9px' }}>Los Datos consignados en la presente tienen carácter de declaración jurada por el firmante</Typography>
          </Box>
        </Grid>
      </Grid>

      {/* DATOS PERSONALES */}
      <Box sx={{ border: '1px solid black', mb: 2 }}>
        <Grid container>
          <Grid item xs={6}><RowText label="Apellido:" value={scout.apellido} /></Grid>
          <Grid item xs={6}><RowText label="Nombre:" value={scout.nombre} /></Grid>
          <Grid item xs={6}><RowText label="Fecha de nacimiento:" value={scout.fechaNacimiento || scout.fecha_nacimiento || ''} /></Grid>
          <Grid item xs={6}><RowText label="De haber realizado un control médico indique fecha:" value={datosMedicos.fechaControl} /></Grid>
          <Grid item xs={3}><RowText label="D.N.I:" value={scout.dni} /></Grid>
          <Grid item xs={3}><RowText label="N° Zona:" value="8" /></Grid>
          <Grid item xs={3}><RowText label="N° Distrito:" value="3" /></Grid>
          <Grid item xs={3}><RowText label="N° Grupo:" value="996" /></Grid>
          <Grid item xs={12}><RowText label="Domicilio:" value={datosMedicos.domicilio} /></Grid>
          <Grid item xs={6}><RowText label="Teléfono para Emergencia 1:" value={datosMedicos.telEmergencia1} /></Grid>
          <Grid item xs={6}><RowText label="Teléfono para Emergencia 2:" value={datosMedicos.telEmergencia2} /></Grid>
        </Grid>
      </Box>

      <Typography variant="body2" sx={{ fontSize: '10px', mb: 2, textAlign: 'justify' }}>
        La información que Ud. se dispone a llenar y que acompañará a su hijo/a o a usted durante todas las actividades, contempla una serie de datos y antecedentes que orientarán al personal de salud actuante en caso de necesidad.
      </Typography>

      <Grid container spacing={2}>
        {/* COLUMNA IZQUIERDA */}
        <Grid item xs={6}>
          <Typography variant="body2" sx={{ fontSize: '11px', fontWeight: 'bold', mb: 1 }}>Conteste las siguientes situaciones (Indicar con SI o NO)</Typography>
          <Box sx={{ border: '1px solid black', borderBottom: 0 }}>
            <RowCheck label="Tiene hemorragias nasales" value={datosMedicos.hemorragias} />
            <RowCheck label="Sangran sus encías al cepillarse" value={datosMedicos.encias} />
            <RowCheck label="Tiene dolor de cabeza" value={datosMedicos.dolorCabeza} />
            <RowCheck label="Sufre presión alta" value={datosMedicos.presionAlta} />
            <RowCheck label="Sufre presión baja" value={datosMedicos.presionBaja} />
            <RowCheck label="Recibió transfusiones de sangre" value={datosMedicos.transfusiones} />
            <RowCheck label="Ha tenido convulsiones" value={datosMedicos.convulsiones} />
            <RowCheck label="Tuvo cirugías en el último año" value={datosMedicos.cirugias} />
            <RowCheck label="Tuvo internaciones en el último año" value={datosMedicos.internaciones} />
            <RowCheck label="Realiza actividad física" value={datosMedicos.actividadFisica} />
            <RowCheck label="Puede realizar cualquier actividad física" value={datosMedicos.cualquierActividad} />
          </Box>
          <Box sx={{ border: '1px solid black', p: 1, minHeight: '40px' }}>
            <Typography variant="body2" sx={{ fontSize: '10px' }}>Si su respuesta fue NO especifique debajo:</Typography>
            <Typography variant="body2" sx={{ fontSize: '11px', fontWeight: 'bold' }}>{datosMedicos.motivoNoActividad}</Typography>
          </Box>

          <Typography variant="body2" sx={{ fontSize: '11px', fontWeight: 'bold', mt: 2, mb: 1 }}>Vacunas | Ultima Dosis</Typography>
          <Box sx={{ border: '1px solid black', borderBottom: 0 }}>
            <RowText label="Quintuple:" value={datosMedicos.vacunaQuintuple} />
            <RowText label="Triple Bacteriana Celular:" value={datosMedicos.vacunaTripleCelular} />
            <RowText label="Triple Bacteriana Acelular:" value={datosMedicos.vacunaTripleAcelular} />
            <RowText label="Doble Bacteriana:" value={datosMedicos.vacunaDoble} />
            <RowCheck label="Calendario de vacunación completo" value={datosMedicos.calendarioCompleto} />
            <RowCheck label="No tiene las vacunas mencionadas" value={datosMedicos.noTieneVacunas} />
            <RowCheck label="No sabe/no contesta" value={datosMedicos.noSabeVacunas} />
          </Box>
        </Grid>

        {/* COLUMNA DERECHA */}
        <Grid item xs={6}>
          <Box sx={{ border: '1px solid black', mb: 2 }}>
            <Grid container>
              <Grid item xs={6}><RowText label="Grupo Sanguíneo:" value={datosMedicos.grupoSanguineo} /></Grid>
              <Grid item xs={6}><RowText label="Factor RH:" value={datosMedicos.factorRh} /></Grid>
              <Grid item xs={6}><RowText label="Peso (Kg):" value={datosMedicos.peso} /></Grid>
              <Grid item xs={6}><RowText label="Talla (m):" value={datosMedicos.talla} /></Grid>
            </Grid>
          </Box>

          <Box sx={{ border: '1px solid black', borderBottom: 0 }}>
            <RowText label="¿Toma alguna medicación? SI/NO ¿Cuál?" value={datosMedicos.medicacion ? `SI - ${datosMedicos.cualMedicacion}` : 'NO'} />
            <RowText label="¿Padece alguna enfermedad crónica? SI/NO ¿Cuál?" value={datosMedicos.cronica ? `SI - ${datosMedicos.cualCronica}` : 'NO'} />
            <RowText label="¿Requiere tratamiento? SI/NO ¿Cuál?" value={datosMedicos.tratamiento ? `SI - ${datosMedicos.cualTratamiento}` : 'NO'} />
            <RowText label="¿Tiene CUD?" value={datosMedicos.cud ? 'SI' : 'NO'} />
            <RowText label="¿Sufre alguna alergia? SI/NO ¿Cuál?" value={datosMedicos.alergia ? `SI - ${datosMedicos.cualAlergia}` : 'NO'} />
            <RowText label="¿Está anticoagulado? SI/NO ¿Droga?" value={datosMedicos.anticoagulado ? `SI - ${datosMedicos.drogaAnticoagulante}` : 'NO'} />
            <RowText label="¿Sigue régimen dietario especial? SI/NO" value={datosMedicos.dieta ? `SI - ${datosMedicos.cualDieta}` : 'NO'} />
            <RowText label="¿Ha tenido ataques de pánico? Frecuencia" value={datosMedicos.panico ? `SI - ${datosMedicos.frecuenciaPanico}` : 'NO'} />
            <RowText label="¿Diagnóstico de salud mental? SI/NO ¿Cuál?" value={datosMedicos.saludMental ? `SI - ${datosMedicos.cualSaludMental}` : 'NO'} />
            <RowText label="Recibe tratamiento SI/NO ¿Cuál?" value={datosMedicos.tratamientoMental ? `SI - ${datosMedicos.cualTratamientoMental}` : 'NO'} />
            <RowText label="¿Tiene algún miedo excesivo o fobia?" value={datosMedicos.fobia ? 'SI' : 'NO'} />
          </Box>

          <Box sx={{ border: '1px solid black', p: 1, mt: 2, bgcolor: '#f9f9f9' }}>
             <RowCheck label="¿Adjunta certificado de aptitud médica?" value={datosMedicos.adjuntaCertificado} />
             <RowCheck label="¿Desea que un educador se comunique?" value={datosMedicos.hablarEducador} />
          </Box>
        </Grid>
      </Grid>

      <Box sx={{ border: '1px solid black', mt: 2 }}>
        <Grid container>
          <Grid item xs={12}><RowText label="Obra Social o Prepaga:" value={datosMedicos.obraSocial} /></Grid>
          <Grid item xs={6}><RowText label="Credencial N°:" value={datosMedicos.nroCredencial} /></Grid>
          <Grid item xs={6}><RowText label="Tel. Emergencia Obra Social:" value={datosMedicos.telObraSocial} /></Grid>
        </Grid>
      </Box>

      <Typography variant="body2" sx={{ fontSize: '10px', mt: 2, textAlign: 'justify' }}>
        Declaro bajo juramento que toda la información aquí aportada es verídica y de sufrir alguna modificación de los datos o de hechos nuevos, asumo el compromiso de informarla a la brevedad.
      </Typography>

      {/* 🎯 SECCIÓN DE FIRMA AUTOMATIZADA */}
      <Grid container spacing={4} sx={{ mt: 2, px: 2, alignItems: 'flex-end' }}>
        <Grid item xs={5} sx={{ textAlign: 'center' }}>
          {/* Renderizado de la firma si existe */}
          <Box sx={{ height: '60px', display: 'flex', justifyContent: 'center', alignItems: 'flex-end', mb: 0.5 }}>
            {firmaPadre ? (
              <img src={firmaPadre} alt="Firma Digital" style={{ maxHeight: '60px', maxWidth: '180px', objectFit: 'contain' }} />
            ) : (
              <Box sx={{ width: '100%', height: '1px', bgcolor: 'transparent' }} />
            )}
          </Box>
          <Box sx={{ borderBottom: '1px solid black', width: '100%' }}></Box>
          <Typography variant="body2" sx={{ fontSize: '10px', mt: 0.5, fontWeight: 'bold' }}>Firma Adulto/Madre/Padre/Tutor</Typography>
        </Grid>
        
        <Grid item xs={1}></Grid>

        <Grid item xs={6}>
          <RowText label="Aclaración:" value={datosPadre?.aclaracion || ''} />
          <RowText label="DNI:" value={datosPadre?.dni || ''} />
          <RowText label="Fecha:" value={new Date().toLocaleDateString('es-AR')} />
        </Grid>
      </Grid>

    </Box>
  );
};