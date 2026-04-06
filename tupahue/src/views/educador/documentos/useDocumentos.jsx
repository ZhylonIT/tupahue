import { useState, useMemo } from 'react';
import { RAMAS } from '../../../constants/ramas';

export const useDocumentos = (scouts, ramaId) => {
  const [busqueda, setBusqueda] = useState('');
  
  const idBusqueda = ramaId?.toUpperCase();
  const esVistaGlobal = idBusqueda === 'TODAS';
  
  const CONFIG_RAMA = esVistaGlobal 
    ? { nombre: 'Todo el Grupo', color: '#5A189A' } 
    : (RAMAS[idBusqueda] || RAMAS.CAMINANTES);

  // Consideramos el legajo completo si tiene al menos los 3 documentos obligatorios
  const legajoCompleto = (scout) => {
    const obligatorios = ['ingreso_menores', 'fotocopias_dni', 'partida_nacimiento'];
    const docs = scout.documentos || [];
    return obligatorios.every(req => docs.includes(req));
  }; 

  // Detecta si subió la planilla de ingreso pero los educadores aún no la "firmaron"
  const requiereFirmaIngreso = (scout) => {
    const tieneDocIngreso = scout.documentos?.includes('ingreso_menores');
    return tieneDocIngreso && !scout.avaladoPorEducadores;
  };

  const scoutsFiltrados = useMemo(() => {
    return scouts.filter(s => {
      const matchRama = esVistaGlobal || (s.rama && s.rama.toUpperCase() === idBusqueda);
      
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
    requiereFirmaIngreso
  };
};