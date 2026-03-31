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

  // --- NUEVA LÓGICA DE AVALES ---
  // Detecta si el beneficiario subió la planilla de ingreso pero los educadores aún no la "firmaron"
  const requiereFirmaIngreso = (scout) => {
    const tieneDocIngreso = scout.documentos?.includes('ingreso_menores');
    // Si tiene el documento pero NO tiene la propiedad de aval en true, requiere atención
    return tieneDocIngreso && !scout.avaladoPorEducadores;
  };

  // Filtrado múltiple memorizado para mejor rendimiento
  const scoutsFiltrados = useMemo(() => {
    return scouts.filter(s => {
      // Si es vista global, no filtramos por rama; si no, comparamos con la rama seleccionada
      const matchRama = esVistaGlobal || (s.rama && s.rama.toUpperCase() === idBusqueda);
      
      // Búsqueda por Nombre, Apellido o DNI
      const nom = (s.nombre || "").toLowerCase();
      const ape = (s.apellido || "").toLowerCase();
      const dni = (s.dni || "").toString();
      const bus = busqueda.toLowerCase();

      const matchBusqueda = nom.includes(bus) || ape.includes(bus) || dni.includes(bus);
      
      return matchRama && matchBusqueda;
    });
  }, [scouts, busqueda, esVistaGlobal, idBusqueda]);

  return {
    busqueda, 
    setBusqueda,
    esVistaGlobal, 
    CONFIG_RAMA,
    scoutsFiltrados, 
    legajoCompleto,
    requiereFirmaIngreso // Exportamos la nueva utilidad
  };
};