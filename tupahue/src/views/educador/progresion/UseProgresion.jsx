import { useState, useEffect, useMemo } from 'react';
import { RAMAS } from '../../../constants/ramas';

export const useProgresion = (scouts, ramaId, onUpdateEtapa, onPaseDeRama) => {
  const esVistaGlobal = ramaId?.toUpperCase() === 'TODAS';
  const idBusqueda = esVistaGlobal ? 'CAMINANTES' : ramaId.toUpperCase();
  const CONFIG_RAMA = RAMAS[idBusqueda] || RAMAS.CAMINANTES;
  const esRover = idBusqueda === 'ROVERS';

  const [viewMode, setViewMode] = useState('cards');
  const [filterText, setFilterText] = useState("");
  const [scoutSeleccionado, setScoutSeleccionado] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  
  const [tempEtapa, setTempEtapa] = useState('');
  const [tempObjetivos, setTempObjetivos] = useState({});
  const [tempObsInterna, setTempObsInterna] = useState('');
  const [tempObsPadres, setTempObsPadres] = useState('');

  const scoutsFiltrados = useMemo(() => {
    return scouts.filter(s => {
      const matchNombre = `${s.nombre} ${s.apellido}`.toLowerCase().includes(filterText.toLowerCase());
      if (esVistaGlobal) return matchNombre;
      return s.rama?.toUpperCase() === idBusqueda && matchNombre;
    });
  }, [scouts, esVistaGlobal, filterText, idBusqueda]);

  // 🎯 NUEVO: Calculamos los próximos pases leyendo la última etapa de cada rama
  const proximosPases = useMemo(() => {
    return scoutsFiltrados.filter(s => {
      if (!s.etapa) return false;
      const ramaScout = RAMAS[s.rama?.toUpperCase()];
      if (!ramaScout || !ramaScout.etapas || ramaScout.etapas.length === 0) return false;
      return s.etapa === ramaScout.etapas[ramaScout.etapas.length - 1].id;
    });
  }, [scoutsFiltrados]);

  useEffect(() => {
    if (scoutSeleccionado) {
      setTempEtapa(scoutSeleccionado.etapa || CONFIG_RAMA.etapas[0].id);
      
      // 🎯 MAGIA SUPABASE: Leemos el array de la DB y lo pasamos al formato de tu UI (Diccionario)
      const objetivosDB = scoutSeleccionado.objetivos_logrados || [];
      const objMap = {};
      objetivosDB.forEach(obj => {
        objMap[`${scoutSeleccionado.id}-${obj}`] = true;
      });
      setTempObjetivos(objMap);
      
      setTempObsInterna(scoutSeleccionado.observaciones || '');
      setTempObsPadres(scoutSeleccionado.observacionesFamilia || '');
    }
  }, [scoutSeleccionado, CONFIG_RAMA]);

  const handleToggleObjetivo = (scoutId, objetivo) => {
    const key = `${scoutId}-${objetivo}`;
    setTempObjetivos(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleConfirmarCambios = async () => {
    try {
      // 1. Convertimos el diccionario de la UI de vuelta a un Array limpio para Supabase
      const objetivosArray = Object.keys(tempObjetivos)
        .filter(key => key.startsWith(`${scoutSeleccionado.id}-`) && tempObjetivos[key])
        .map(key => key.replace(`${scoutSeleccionado.id}-`, ''));

      // 2. LLAMADA AL MOTOR DE SUPABASE (a través de tu prop onUpdateEtapa)
      await onUpdateEtapa(scoutSeleccionado.id, tempEtapa, {
        observaciones: tempObsInterna,
        observacionesFamilia: tempObsPadres,
        objetivos_logrados: objetivosArray 
      });

      setOpenSnackbar(true);
      setScoutSeleccionado(null);
    } catch (error) {
      alert("No se pudo guardar la progresión: " + error.message);
    }
  };

  const handlePase = () => {
    if (window.confirm(`¿Confirmar pase de ${scoutSeleccionado.nombre}?`)) {
      onPaseDeRama(scoutSeleccionado.id);
      setScoutSeleccionado(null);
    }
  };

  return {
    esVistaGlobal, idBusqueda, CONFIG_RAMA, esRover,
    viewMode, setViewMode,
    filterText, setFilterText,
    scoutSeleccionado, setScoutSeleccionado,
    openSnackbar, setOpenSnackbar,
    scoutsFiltrados, proximosPases,
    tempEtapa, setTempEtapa,
    tempObjetivos, handleToggleObjetivo,
    tempObsInterna, setTempObsInterna,
    tempObsPadres, setTempObsPadres,
    handleConfirmarCambios, handlePase
  };
};