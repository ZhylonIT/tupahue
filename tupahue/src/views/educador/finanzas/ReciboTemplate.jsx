import { Box, Typography, Stack, Divider } from '@mui/material';
import logoTupahue from '../../../assets/images/logo.png';

const VIOLETA_SCOUT = '#5A189A';

// Colores de las Ramas (versión pastel/suave para el fondo)
const COLORES_RAMAS = {
    LOBATOS: '#f2e575',    // Amarillo
    SCOUTS: '#76c893',     // Verde
    CAMINANTES: '#90e0ef', // Azul
    ROVERS: '#f49696',     // Rojo
};

export const ReciboTemplate = ({ movimiento, scout, evento }) => {
    if (!movimiento) return null;

    const fechaFormateada = movimiento.fecha ? movimiento.fecha.split('-').reverse().join('/') : '../../..';

    return (
        <Box sx={{
            width: '100%',
            maxWidth: '720px',
            margin: '0 auto',
            p: 4,
            bgcolor: 'white',
            color: 'black',
            borderRadius: 4,
            border: `2px solid ${VIOLETA_SCOUT}`,
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
            // --- ESQUINAS DE COLORES (RAMAS) ---
            '&::before': { // Superior Izquierda - Rojo (Rovers)
                content: '""',
                position: 'absolute',
                top: -80,
                left: -80,
                width: 240,
                height: 240,
                bgcolor: COLORES_RAMAS.ROVERS,
                borderRadius: '50%',
                filter: 'blur(50px)',
                opacity: 0.5,
                zIndex: 0
            },
            '&::after': { // Inferior Derecha - Amarillo (Lobatos)
                content: '""',
                position: 'absolute',
                bottom: -80,
                right: -80,
                width: 240,
                height: 240,
                bgcolor: COLORES_RAMAS.LOBATOS,
                borderRadius: '50%',
                filter: 'blur(50px)',
                opacity: 0.5,
                zIndex: 0
            }
        }}>
            {/* Esquinas adicionales usando Boxes internos para no sobrecargar los pseudo-elementos */}
            <Box sx={{ // Superior Derecha - Azul (Caminantes)
                position: 'absolute', top: -80, right: -80, width: 240, height: 240,
                bgcolor: COLORES_RAMAS.CAMINANTES, borderRadius: '50%', filter: 'blur(50px)', opacity: 0.4, zIndex: 0
            }} />
            <Box sx={{ // Inferior Izquierda - Verde (Scouts)
                position: 'absolute', bottom: -80, left: -80, width: 240, height: 240,
                bgcolor: COLORES_RAMAS.SCOUTS, borderRadius: '50%', filter: 'blur(50px)', opacity: 0.4, zIndex: 0
            }} />

            {/* LOGO TUPAHUE COMO MARCA DE AGUA */}
            <Box
                component="img"
                src={logoTupahue}
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '280px',
                    opacity: 0.08,
                    zIndex: 0,
                    pointerEvents: 'none',
                }}
            />

            <Box sx={{ position: 'relative', zIndex: 1 }}>
                {/* ENCABEZADO */}
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                        <Typography variant="h5" sx={{ fontWeight: 900, color: VIOLETA_SCOUT, mb: -0.5 }}>
                            GRUPO SCOUT TUPAHUE
                        </Typography>
                        <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', letterSpacing: 0.5 }}>
                            SCOUTS DE ARGENTINA ASOCIACIÓN CIVIL
                        </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="h6" sx={{ fontWeight: 900, lineHeight: 1 }}>RECIBO</Typography>
                        <Typography variant="caption" sx={{ fontWeight: 800, color: VIOLETA_SCOUT }}>
                            {/* 
       Si el backend ya mandó el nro oficial, lo usamos. 
       Si no (mientras probamos), mostramos un pedacito del ID temporal 
       o un guión para saber que falta la respuesta del server.
    */}
                            Nº {movimiento.nroRecibo
                                ? movimiento.nroRecibo.toString().padStart(6, '0')
                                : movimiento.id.toString().slice(-6)
                            }
                        </Typography>
                    </Box>
                </Stack>

                <Divider sx={{ my: 2, borderColor: VIOLETA_SCOUT, borderBottomWidth: 2 }} />

                {/* CONTENIDO DEL RECIBO */}
                <Stack spacing={3.5} sx={{ my: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
                        <Typography sx={{ fontWeight: 700, minWidth: '90px' }}>RECIBÍ de:</Typography>
                        <Typography variant="h6" sx={{
                            flex: 1, borderBottom: '1px dotted #444', fontWeight: 800, px: 1, fontFamily: 'serif', color: '#222'
                        }}>
                            {scout ? `${scout.apellido}, ${scout.nombre}` : '________________________________'}
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
                        <Typography sx={{ fontWeight: 700, minWidth: '110px' }}>la cantidad de:</Typography>
                        <Typography variant="h5" sx={{
                            flex: 1, borderBottom: '1px dotted #444', fontWeight: 900, px: 1, color: '#1b5e20'
                        }}>
                            $ {Number(movimiento.monto).toLocaleString('es-AR')}
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
                        <Typography sx={{ fontWeight: 700, minWidth: '110px' }}>en concepto de:</Typography>
                        <Typography sx={{
                            flex: 1, borderBottom: '1px dotted #444', fontWeight: 600, px: 1, fontSize: '1.1rem'
                        }}>
                            {movimiento.concepto} {evento ? ` - ${evento.nombre}` : ''}
                            {movimiento.mesesPagos?.length > 0 ? ` (${movimiento.mesesPagos.join(', ')})` : ''}
                        </Typography>
                    </Box>
                </Stack>

                {/* PIE DE PÁGINA */}
                <Stack direction="row" justifyContent="space-between" alignItems="flex-end" sx={{ mt: 5 }}>
                    <Box>
                        <Typography variant="body2" sx={{ fontWeight: 800 }}>
                            Fecha: {fechaFormateada}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                            Ituzaingó, Buenos Aires
                        </Typography>
                    </Box>

                    <Box sx={{ textAlign: 'center', minWidth: '200px' }}>
                        <Divider sx={{ bgcolor: 'black', mb: 0.5 }} />
                        <Typography variant="caption" sx={{ fontWeight: 900, letterSpacing: 1 }}>
                            Firma jefe de grupo
                        </Typography>
                    </Box>
                </Stack>
            </Box>
        </Box>
    );
};