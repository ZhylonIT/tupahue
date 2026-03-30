export const CATEGORIAS_FINANZAS = {
  INGRESOS: [
    { id: 'cuota', label: 'Cuota Mensual', color: '#2e7d32' },
    { id: 'afiliacion', label: 'Afiliación (SdA)', color: '#1b5e20' },
    { id: 'evento', label: 'Evento / Campamento', color: '#0288d1' },
    { id: 'donacion', label: 'Donación', color: '#ed6c02' },
    { id: 'recaudacion', label: 'Recaudación / Fondos', color: '#9c27b0' },
    { id: 'otros_in', label: 'Otros Ingresos', color: '#757575' },
  ],
  EGRESOS: [
    { id: 'sede', label: 'Sede (Alquiler/Servicios)', color: '#d32f2f' },
    { id: 'materiales', label: 'Materiales de Actividad', color: '#27b018' },
    { id: 'afiliacion', label: 'Afiliación (SdA)', color: '#1b5e20' },
    { id: 'merienda', label: 'Merienda', color: '#c62828' },
    { id: 'mantenimiento', label: 'Cocina, higiene y limpieza', color: '#b71c1c' },
    { id: 'salud', label: 'Elementos de botiquin', color: '#ef6c00' },
    { id: 'seguridad', label: 'Elementos de seguridad', color: '#ef6c00' },
    { id: 'formacion', label: 'formacion', color: '#ef6c00' },
    { id: 'presupuesto-participativo', label: 'Presupuesto participativo', color: '#ef6c00' },
    { id: 'distrito', label: 'cuota / eventos', color: '#0D47A1' },
    { id: 'otros_out', label: 'Otros Gastos', color: '#757575' },
  ]
};

export const ESTADOS_PAGO = {
  AL_DIA: { label: 'Al día', color: 'success' },
  ATRASADO: { label: 'Atrasado', color: 'error' },
  PENDIENTE: { label: 'Pendiente', color: 'warning' }
};

// 👇 NUEVA CONSTANTE PARA TIPOS DE EVENTOS
// Esto permite que el administrador elija qué campamento está cobrando
export const TIPOS_EVENTOS = [
  { id: 'verano', label: 'Campamento de Verano' },
  { id: 'invierno', label: 'Campamento de Invierno' },
  { id: 'rama', label: 'Salida / Acantonamiento de Rama' },
  { id: 'distrital', label: 'Evento Distrital' },
  { id: 'zonal', label: 'Evento Zonal' },
  { id: 'nacional', label: 'Evento Nacional' },
  { id: 'otro_evento', label: 'Otro Evento Especial' },
];