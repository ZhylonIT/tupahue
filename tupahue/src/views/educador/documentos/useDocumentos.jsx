import { useState, useMemo } from 'react';
import { RAMAS } from '../../../constants/ramas';

export const useDocumentos = (scouts, ramaId) => {
  const [busqueda, setBusqueda] = useState('');
  
  const idBusqueda = ramaId?.toUpperCase();
  const esVistaGlobal = idBusqueda === 'TODAS';
  
  const CONFIG_RAMA = esVistaGlobal 
    ? { nombre: 'Todo el Grupo', color: '#5A189A' } 
    : (RAMAS[idBusqueda] || RAMAS.CAMINANTES);

  // Consideramos el legajo completo si tiene al menos los 3 documentos base (DNI, Partida y su Ingreso correspondiente)
  const legajoCompleto = (scout) => {
    const isRover = scout.rama?.toUpperCase() === 'ROVERS';
    const fichaIngresoAdecuada = isRover ? 'ddjj_campamento_mayor' : 'ingreso_menores';
    
    const obligatorios = [fichaIngresoAdecuada, 'fotocopias_dni', 'partida_nacimiento'];
    const docs = scout.documentos || [];
    return obligatorios.every(req => docs.includes(req));
  }; 

  // 🎯 4. Lógica de Aval Ampliada
  // Detecta si subió CUALQUIERA de las fichas que requieren aval pero aún no están avaladas
  const requiereFirmaIngreso = (scout) => {
    const docs = scout.documentos || [];
    
    // Lista de documentos que disparan la necesidad de aval
    const fichasQueRequierenAval = [
      'ingreso_menores',          // Ficha menores
      'salidas_cercanas',        // Salidas 5km
      'auto_campamento_menor',   // Salida/Campamento menor
      'ddjj_campamento_mayor'    // DDJJ Mayores Rover
    ];

    // Verificamos si tiene al menos una de estas cargada
    const tieneAlgunaFichaCargada = fichasQueRequierenAval.some(id => docs.includes(id));
    
    // Si tiene alguna pero el campo global de avalado está en false, devolvemos true
    return tieneAlgunaFichaCargada && !scout.avaladoPorEducadores;
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