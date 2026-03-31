import { useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Button, Stack, Dialog, DialogContent, DialogActions } from '@mui/material';
import { ReceiptLong, Download, ErrorOutline, Print } from '@mui/icons-material';
import { useFinanzas } from '../../hooks/useFinanzas'; 
// 👇 Importamos el componente de recibo que armaste para los educadores
import { ReciboTemplate } from '../educador/finanzas/ReciboTemplate';

export const FinanzasView = ({ hijo }) => {
  const { movimientos } = useFinanzas();
  
  // Estado para controlar qué recibo estamos viendo en el modal
  const [reciboSeleccionado, setReciboSeleccionado] = useState(null);

  if (!hijo) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 4, border: '2px dashed #ccc', bgcolor: 'transparent' }}>
        <ErrorOutline sx={{ fontSize: 50, color: '#ccc', mb: 2 }} />
        <Typography color="textSecondary">Seleccioná un hijo en la pestaña "Mis Hijos" para ver su estado de cuenta.</Typography>
      </Paper>
    );
  }

  const historialPagos = movimientos.filter(m => 
    m.tipo === 'ingreso' && 
    (String(m.scoutId) === String(hijo.id) || String(m.jovenId) === String(hijo.id) || String(m.id_scout) === String(hijo.id))
  );

  // Función nativa para imprimir / guardar PDF
  const handlePrint = () => {
    window.print();
  };

  return (
    <Box sx={{ animation: 'fadeIn 0.3s' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900 }}>Cuotas y Recibos</Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Estado de cuenta de: <b style={{ color: '#5A189A' }}>{hijo.nombre} {hijo.apellido}</b>
          </Typography>
        </Box>
        <ReceiptLong sx={{ fontSize: 40, color: '#5A189A', opacity: 0.2 }} />
      </Stack>

      {historialPagos.length === 0 ? (
        <Paper sx={{ p: 5, textAlign: 'center', borderRadius: 3, bgcolor: '#fff', border: '1px solid #eee' }}>
          <ReceiptLong sx={{ fontSize: 50, color: '#ccc', mb: 2 }} />
          <Typography color="textSecondary">No hay registros de pagos cargados en el sistema para este beneficiario.</Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid #eee' }}>
          <Table>
            <TableHead sx={{ bgcolor: '#f8f9fa' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Concepto</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Monto</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Estado</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Fecha</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="right">Comprobante</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {historialPagos.map((pago) => (
                <TableRow key={pago.id} hover>
                  <TableCell sx={{ fontWeight: 500, textTransform: 'capitalize' }}>
                    {pago.concepto || pago.categoria || pago.mes || 'Cuota/Evento'}
                  </TableCell>
                  <TableCell>${pago.monto}</TableCell>
                  <TableCell>
                    <Chip 
                      label="PAGADO" size="small" color="success"
                      sx={{ fontWeight: 700, fontSize: '0.7rem', borderRadius: 1 }}
                    />
                  </TableCell>
                  <TableCell>{pago.fecha || pago.fechaPago || '-'}</TableCell>
                  <TableCell align="right">
                    <Button 
                      size="small" 
                      startIcon={<Download />} 
                      variant="outlined"
                      sx={{ borderRadius: 2, textTransform: 'none' }}
                      onClick={() => setReciboSeleccionado(pago)} // Abre el modal
                    >
                      Recibo
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* MODAL DEL RECIBO */}
      <Dialog 
        open={!!reciboSeleccionado} 
        onClose={() => setReciboSeleccionado(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 4, bgcolor: '#f8f9fa' } }}
      >
        <DialogContent sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
          {/* Este Box con className "area-imprimible" es la clave para la impresión */}
          <Box className="area-imprimible" sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            {reciboSeleccionado && (
              <ReciboTemplate movimiento={reciboSeleccionado} scout={hijo} />
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0, className: 'no-print' }}>
          <Button onClick={() => setReciboSeleccionado(null)} color="inherit" sx={{ fontWeight: 700 }}>
            Cerrar
          </Button>
          <Button 
            variant="contained" 
            onClick={handlePrint} 
            startIcon={<Print />}
            sx={{ bgcolor: '#5A189A', fontWeight: 700, px: 3 }}
          >
            Imprimir / Guardar PDF
          </Button>
        </DialogActions>
      </Dialog>

      {/* ESTILOS DE IMPRESIÓN MÁGICOS */}
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            .area-imprimible, .area-imprimible * {
              visibility: visible;
            }
            .area-imprimible {
              position: fixed;
              left: 0;
              top: 0;
              width: 100%;
              padding: 0;
              margin: 0;
              transform: scale(0.9); /* Ajuste para que entre perfecto en A4 */
              transform-origin: top center;
            }
            .no-print {
              display: none !important;
            }
            /* Forza al navegador a imprimir los fondos de colores del recibo */
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
          }
        `}
      </style>
    </Box>
  );
};