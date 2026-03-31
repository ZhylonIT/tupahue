import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, TextField, Typography, MenuItem, IconButton, Stack } from '@mui/material';
import { Close, Save, Print } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import logoSaac from '../../assets/images/Logo_SAAC.png';

export const FichaAutorizacionSalidaForm = ({ open, onClose, scout, onSave }) => {
  const [datos, setDatos] = useState({
    tipoActividad: 'CAMPAMENTO',
    lugarDestino: '',
    ubicacionDestino: '',
    fechaDesde: '',
    fechaHasta: '',
    localidad: 'Ituzaingó',
    provincia: 'Buenos Aires',
    partido: 'Ituzaingó',
  });

  useEffect(() => {
    if (scout?.datosEvento) setDatos(prev => ({ ...prev, ...scout.datosEvento }));
  }, [scout, open]);

  const handleChange = (e) => setDatos({ ...datos, [e.target.name]: e.target.value });

  const handleGuardar = () => {
    const hijoAct = { ...scout, datosEvento: { ...datos } };
    onSave(hijoAct, 'auto_campamento_menor');
  };

  const handleImprimir = () => {
    const tutor = {
      nombre: scout.datosPersonales?.tutor1Nombre || '__________________________',
      dni: scout.datosPersonales?.tutor1Dni || '__________',
      vinculo: scout.datosPersonales?.tutor1Vinculo || '__________',
      domicilio: scout.datosMedicos?.domicilio || '__________________________',
      tel: scout.datosPersonales?.tutor1Tel || '__________',
      nacionalidad: scout.datosPersonales?.tutor1Nacionalidad || 'Argentina',
      nacimiento: scout.datosPersonales?.tutor1Nacimiento || '__/__/____'
    };

    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    const doc = iframe.contentWindow.document;

    doc.write(`
      <html>
        <head>
          <style>
            @page { size: A4; margin: 15mm; }
            body { font-family: Arial, sans-serif; font-size: 11px; line-height: 1.3; color: #000; }
            .header { display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #000; padding-bottom: 5px; }
            .logo { width: 110px; height: auto; }
            .header-center { text-align: center; flex: 1; }
            .header-right { text-align: right; font-size: 9px; }
            .title { text-align: center; font-weight: bold; margin: 15px 0; font-size: 13px; }
            .text-block { text-align: justify; margin-bottom: 10px; line-height: 1.6; }
            .campo { font-weight: bold; border-bottom: 1px dotted #000; padding: 0 3px; }
            .legal-text { font-size: 10px; text-align: justify; margin: 15px 0; }
            .firma-padre { margin: 30px 0 30px 50px; }
            .aval-box { border: 1px solid #000; padding: 10px; margin-top: 10px; }
            .aval-title { font-weight: bold; text-decoration: underline; font-size: 11px; margin-bottom: 5px; }
            .firma-row { display: flex; justify-content: space-between; margin-top: 25px; }
            .linea-firma { border-top: 1px solid #000; width: 180px; text-align: left; padding-top: 3px; font-size: 9px; }
            .footer-info { text-align: center; font-size: 8px; margin-top: 15px; border-top: 0.5px solid #ccc; padding-top: 5px; }
          </style>
        </head>
        <body>
          <div class="header">
            <img src="${window.location.origin}${logoSaac}" class="logo" />
            <div class="header-center">
              <div style="font-weight: bold; font-size: 12px;">Autorización de Padres / Madres / Tutores</div>
              <div style="font-size: 10px;">para Salidas, Acantonamientos y/o Campamentos</div>
            </div>
            <div class="header-right">
              Planilla Versión: 07-21<br/>www.scouts.org.ar
            </div>
          </div>

          <div class="title">AUTORIZACIÓN DE PADRES / MADRES / TUTORES<br/>PARA SALIDAS, ACANTONAMIENTOS Y/O CAMPAMENTOS</div>

          <div class="text-block">
            En la localidad de <span class="campo">${datos.localidad}</span>, provincia de <span class="campo">${datos.provincia}</span>, partido / departamento de <span class="campo">${datos.partido}</span>, a los <span class="campo">${new Date().getDate()}</span> días del mes de <span class="campo">${new Date().toLocaleString('es-AR', {month: 'long'})}</span> del año <span class="campo">${new Date().getFullYear()}</span>, yo (1) <span class="campo">${tutor.nombre}</span> de nacionalidad <span class="campo">${tutor.nacionalidad}</span> nacido/a el <span class="campo">${tutor.nacimiento}</span> DNI <span class="campo">${tutor.dni}</span> Teléfono: <span class="campo">${tutor.tel}</span> y con domicilio en <span class="campo">${tutor.domicilio}</span> en mi carácter de (2) <span class="campo">${tutor.vinculo}</span> OTORGO AUTORIZACIÓN PARA QUE EL / LA MENOR (3) <span class="campo">${scout.nombre} ${scout.apellido}</span> de nacionalidad <span class="campo">Argentina</span> nacido/a el <span class="campo">${scout.fechaNacimiento}</span> y DNI <span class="campo">${scout.dni}</span> con domicilio en <span class="campo">${tutor.domicilio}</span> para que realice la <span class="campo">${datos.tipoActividad}</span> desde el día <span class="campo">${datos.fechaDesde}</span> hasta el día <span class="campo">${datos.fechaHasta}</span> en el lugar ubicado en <span class="campo">${datos.lugarDestino}, ${datos.ubicacionDestino}</span> acompañado de sus educadores/as pertenecientes al Grupo Scout N° <span class="campo">996</span> Nombre <span class="campo">Tupahue</span> del Distrito N° <span class="campo">3</span> de la Zona <span class="campo">8</span> de Scouts de Argentina Asociación Civil.
          </div>

          <div class="legal-text">
            Asimismo, doy autorización: 1) Para que los/las responsables de las actividades tomen, en caso de accidente o enfermedad todas las medidas necesarias para salvaguardar la integridad y la salud del / la menor. 2) Para realizar cualquier intervención quirúrgica de urgencia que así lo requiera la integridad y la salud del / la menor, 3) Que el menor sea transportado por la Asociación desde y hasta el lugar donde se realice la actividad autorizada por el medio de transporte que decida la Institución, dando conformidad para que se realicen los trámites y gestiones inherentes a cada viaje, ante las autoridades pertinentes y empresas de transporte, comprometiéndome en caso de revocación a hacerlo saber a las autoridades correspondientes y por escrito.
          </div>

          <div class="firma-padre">
            <div class="linea-firma" style="width: 250px;">Firma:</div>
          </div>

          <div class="aval-box">
            <div class="aval-title">AVAL DE LOS RESPONSABLES SCOUTS (4)</div>
            <div style="font-size: 10px;">
              Certifico que el/la Menor registrado/a en la categoría de Beneficiario, posee el Legajo Personal completo según el capitulo 4, del Manual General de Normas de SAAC y que la persona que está otorgando autorización tiene su firma registrada en la "AUTORIZACIÓN DE INGRESO DE NIÑOS, NIÑAS Y JÓVENES MENORES DE 18 AÑOS".-
            </div>
            <div class="firma-row">
              <div class="linea-firma">Firma:</div>
              <div style="width: 250px; font-size: 10px;">
                Aclaración: ...........................................................................<br/>
                DNI: ........................................................................................<br/>
                Función en el Grupo Scout: .................................................
              </div>
            </div>
          </div>

          <div style="text-align: center; font-weight: bold; margin-top: 15px; font-size: 10px;">
            MIEMBRO DE LA ORGANIZACIÓN MUNDIAL DEL MOVIMIENTO SCOUT
          </div>

          <div class="footer-info">
            Scouts de Argentina Asociación Civil, es una organización sin fines de lucro, con Personería Jurídica Nacional N° 1645416-Res IGJ N° 999 del 24 de septiembre de 1998.<br/>
            Sede Nacional: Libertad 1282 - CABA C1012AAZ - Argentina - Tel: +54-11-4811-0185 - CUIT 30-69732250-3 - IVA Exento
          </div>
        </body>
      </html>
    `);

    doc.close();
    iframe.contentWindow.onload = () => {
      iframe.contentWindow.print();
      setTimeout(() => { document.body.removeChild(iframe); }, 1000);
    };
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 900, bgcolor: '#5A189A', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Autorización de Salida
        <IconButton onClick={onClose} size="small" sx={{ color: 'white' }}><Close /></IconButton>
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        <Grid container spacing={2} sx={{ pt: 1 }}>
          <Grid item xs={12}>
            <TextField select fullWidth label="Actividad" name="tipoActividad" value={datos.tipoActividad} onChange={handleChange} size="small">
              <MenuItem value="SALIDA">SALIDA</MenuItem>
              <MenuItem value="ACANTONAMIENTO">ACANTONAMIENTO</MenuItem>
              <MenuItem value="CAMPAMENTO">CAMPAMENTO</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12}><TextField fullWidth label="Lugar (Predio)" name="lugarDestino" value={datos.lugarDestino} onChange={handleChange} size="small" /></Grid>
          <Grid item xs={12}><TextField fullWidth label="Ubicación" name="ubicacionDestino" value={datos.ubicacionDestino} onChange={handleChange} size="small" /></Grid>
          <Grid item xs={6}><TextField fullWidth label="Desde" name="fechaDesde" type="date" value={datos.fechaDesde} InputLabelProps={{ shrink: true }} onChange={handleChange} size="small" /></Grid>
          <Grid item xs={6}><TextField fullWidth label="Hasta" name="fechaHasta" type="date" value={datos.fechaHasta} InputLabelProps={{ shrink: true }} onChange={handleChange} size="small" /></Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Stack direction="row" spacing={1} justifyContent="flex-end" width="100%" alignItems="center">
          <Button onClick={onClose} sx={{ fontWeight: 'bold', color: 'black' }}>CANCELAR</Button>
          <Button startIcon={<Save />} onClick={handleGuardar} variant="contained" sx={{ bgcolor: '#00619A', fontWeight: 'bold' }}>GUARDAR DATOS</Button>
          <Button variant="outlined" startIcon={<Print />} onClick={handleImprimir} disabled={!datos.lugarDestino} sx={{ color: '#0083C9', borderColor: '#0083C9', fontWeight: 'bold' }}>IMPRIMIR / GENERAR PDF</Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};