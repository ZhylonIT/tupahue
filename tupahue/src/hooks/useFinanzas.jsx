import { useState, useEffect, useMemo } from 'react';

export const useFinanzas = () => {
  const [movimientos, setMovimientos] = useState(() => {
    const save = localStorage.getItem('tupahue_movimientos');
    return save ? JSON.parse(save) : [];
  });

  // 👇 ESTADO DINÁMICO PARA EVENTOS
  const [eventosConfig, setEventosConfig] = useState(() => {
    const save = localStorage.getItem('tupahue_config_eventos');
    return save ? JSON.parse(save) : [];
  });

  useEffect(() => {
    localStorage.setItem('tupahue_movimientos', JSON.stringify(movimientos));
  }, [movimientos]);

  useEffect(() => {
    localStorage.setItem('tupahue_config_eventos', JSON.stringify(eventosConfig));
  }, [eventosConfig]);

  // Acciones de Movimientos
  const agregarMovimiento = (mov) => {
    setMovimientos([...movimientos, { ...mov, id: Date.now() }]);
  };

  const eliminarMovimiento = (id) => {
    setMovimientos(movimientos.filter(m => m.id !== id));
  };

  // Acciones de Configuración de Eventos
  const agregarEventoConfig = (nuevo) => {
    setEventosConfig([...eventosConfig, { ...nuevo, id: Date.now().toString() }]);
  };

  const eliminarEventoConfig = (id) => {
    setEventosConfig(eventosConfig.filter(e => e.id !== id));
  };

  // Cálculos de Totales
  const totalIngresos = useMemo(() => 
    movimientos.filter(m => m.tipo === 'ingreso').reduce((acc, m) => acc + Number(m.monto), 0), 
  [movimientos]);

  const totalEgresos = useMemo(() => 
    movimientos.filter(m => m.tipo === 'egreso').reduce((acc, m) => acc + Number(m.monto), 0), 
  [movimientos]);

  const saldoCaja = totalIngresos - totalEgresos;

  return {
    movimientos,
    totalIngresos,
    totalEgresos,
    saldoCaja,
    eventosConfig,
    agregarMovimiento,
    eliminarMovimiento,
    agregarEventoConfig,
    eliminarEventoConfig
  };
};