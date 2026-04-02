import React, { useState } from 'react';
import { 
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Chip, Button, Stack, Dialog, DialogContent, 
  DialogActions, Avatar 
} from '@mui/material';
import { 
  ReceiptLong, Download, ErrorOutline, Print, 
  AccountBalanceWallet, VerifiedUser 
} from '@mui/icons-material';
import { useFinanzas } from '../../hooks/useFinanzas'; 
import { ReciboTemplate } from '../educador/finanzas/ReciboTemplate';

export const MisFinanzasJovenView = ({ joven }) => {
  const { movimientos } = useFinanzas();  
  const [reciboSeleccionado, setReciboSeleccionado] = useState(null);

  if (!joven) return null;
  const historialPagos = movimientos.filter(m => 
    m.tipo === 'ingreso' && 
    (String(m.scoutId) === String(joven.id) || 
     String(m.jovenId) === String(joven.id) || 
     String(m.id_scout) === String(joven.id))
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <Box sx={{ animation: 'fadeIn 0.5s ease-out', pb: 4 }}>
      
      {/* 1. ENCABEZADO DE CUENTA PERSONAL */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 4, mb: 4, borderRadius: 5, 
          bgcolor: '#f8f9fa', border: '1px solid #e9ecef',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
        }}
      >
        <Box>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
            <VerifiedUser sx={{ color: '#5A189A', fontSize: 20 }} />
            <Typography variant="overline" sx={{ fontWeight: 900, letterSpacing: 2, color: 'text.secondary' }}>
              GESTIÓN FINANCIERA PERSONAL
            </Typography>
          </Stack>
          <Typography variant="h3" sx={{ fontWeight: 900, mb: 0.5 }}>Mi Estado de Cuenta</Typography>
          <Typography variant="h6" color="textSecondary" sx={{ fontWeight: 500 }}>
            Protagonista: <b style={{ color: '#5A189A' }}>{joven.nombre} {joven.apellido}</b>
          </Typography>
        </Box>
        <Avatar sx={{ width: 80, height: 80, bgcolor: 'rgba(90, 24, 154, 0.1)', color: '#5A189A' }}>
          <AccountBalanceWallet sx={{ fontSize: 40 }} />
        </Avatar>
      </Paper>

      {/* 2. LISTADO DE MOVIMIENTOS */}
      {historialPagos.length === 0 ? (
        <Paper sx={{ p: 10, textAlign: 'center', borderRadius: 6, bgcolor: 'transparent', border: '2px dashed #dee2e6' }}>
          <ReceiptLong sx={{ fontSize: 70, color: '#ced4da', mb: 2 }} />
          <Typography variant="h6" color="textSecondary" sx={{ fontWeight: 700 }}>
            Sin movimientos registrados
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Cuando el Asistente de Finanzas registre un aporte, aparecerá aquí con su recibo oficial.
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper} elevation={4} sx={{ borderRadius: 5, border: '1px solid #edf2f7', overflow: 'hidden' }}>
          <Table>
            <TableHead sx={{ bgcolor: '#1a1a1a' }}>
              <TableRow>
                <TableCell sx={{ color: 'white', fontWeight: 800 }}>CONCEPTO</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 800 }}>MONTO</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 800 }}>ESTADO</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 800 }}>FECHA DE PAGO</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 800 }} align="right">RECIBO</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {historialPagos.map((pago) => (
                <TableRow key={pago.id} hover>
                  <TableCell sx={{ fontWeight: 700, textTransform: 'uppercase', color: '#2d3748' }}>
                    {pago.concepto || pago.categoria || pago.mes || 'Cuota / Actividad'}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 900, color: '#1b5e20', fontSize: '1.1rem' }}>
                    ${Number(pago.monto).toLocaleString('es-AR')}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label="PAGO REGISTRADO" 
                      size="small" 
                      color="success"
                      sx={{ fontWeight: 900, borderRadius: 2, px: 1 }}
                    />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#64748b' }}>
                    {pago.fecha ? pago.fecha.split('-').reverse().join('/') : (pago.fechaPago || '-')}
                  </TableCell>
                  <TableCell align="right">
                    <Button 
                      size="small" 
                      startIcon={<Download />} 
                      variant="contained"
                      sx={{ 
                        borderRadius: 3, 
                        textTransform: 'none', 
                        fontWeight: 800,
                        bgcolor: '#5A189A',
                        '&:hover': { bgcolor: '#48127a' }
                      }}
                      onClick={() => setReciboSeleccionado(pago)}
                    >
                      Ver Comprobante
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* 3. DIALOG DE RECIBO OFICIAL (Área imprimible) */}
      <Dialog 
        open={!!reciboSeleccionado} 
        onClose={() => setReciboSeleccionado(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 6, bgcolor: '#f8f9fa' } }}
      >
        <DialogContent sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
          <Box className="area-imprimible" sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            {reciboSeleccionado && (
              <ReciboTemplate movimiento={reciboSeleccionado} scout={joven} />
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0, justifyContent: 'space-between', px: 4 }}>
          <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 600 }}>
            Documento emitido por Sistema de Gestión Tupahue
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button onClick={() => setReciboSeleccionado(null)} color="inherit" sx={{ fontWeight: 800 }}>
              Cerrar
            </Button>
            <Button 
              variant="contained" 
              onClick={handlePrint} 
              startIcon={<Print />}
              sx={{ bgcolor: '#5A189A', fontWeight: 800, px: 4, borderRadius: 3 }}
            >
              Imprimir / PDF
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>

      {/* Estilos para impresión (A4) */}
      <style>
        {`
          @media print {
            body * { visibility: hidden; }
            .area-imprimible, .area-imprimible * { visibility: visible; }
            .area-imprimible {
              position: fixed; left: 0; top: 0; width: 100%;
              transform: scale(0.95); transform-origin: top center;
            }
            .no-print { display: none !important; }
            * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          }
        `}
      </style>
    </Box>
  );
};