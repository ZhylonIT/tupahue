import { useState, useMemo } from 'react';
import { RAMAS } from '../../../constants/ramas';

export const useDocumentos = (scouts, ramaId) => {
  const [busqueda, setBusqueda] = useState('');
  
  const idBusqueda = ramaId?.toUpperCase();
  const esVistaGlobal = idBusqueda === 'TODAS';
  
  const CONFIG_RAMA = esVistaGlobal 
    ? { nombre: 'Todo el Grupo', color: '#5A189A' } 
    : (RAMAS[idBusqueda] || RAMAS.CAMINANTES);

  // Función para determinar si el legajo está 100% completo
  const legajoCompleto = (scout) => scout.fichaEntregada; 

  // Filtrado múltiple (Rama y Búsqueda de texto) memorizado para mejor rendimiento
  const scoutsFiltrados = useMemo(() => {
    return scouts.filter(s => {
      const matchRama = esVistaGlobal || (s.rama && s.rama.toUpperCase() === idBusqueda);
      const matchBusqueda = (s.nombre?.toLowerCase() || "").includes(busqueda.toLowerCase()) || 
                            (s.apellido?.toLowerCase() || "").includes(busqueda.toLowerCase()) ||
                            (s.dni?.toString() || "").includes(busqueda);
      return matchRama && matchBusqueda;
    });
  }, [scouts, busqueda, esVistaGlobal, idBusqueda]);

  return {
    busqueda, 
    setBusqueda,
    esVistaGlobal, 
    CONFIG_RAMA,
    scoutsFiltrados, 
    legajoCompleto
  };
};