import { useState, useEffect, useMemo } from 'react';
import { RAMAS } from '../../../constants/ramas';
import { useLocalStorage } from '../../../hooks/useLocalStorage';

export const useProgresion = (scouts, ramaId, onUpdateEtapa, onPaseDeRama) => {
  const esVistaGlobal = ramaId?.toUpperCase() === 'TODAS';
  const idBusqueda = esVistaGlobal ? 'CAMINANTES' : ramaId.toUpperCase();
  const CONFIG_RAMA = RAMAS[idBusqueda] || RAMAS.CAMINANTES;
  const esRover = idBusqueda === 'ROVERS';

  const [viewMode, setViewMode] = useState('cards');
  const [filterText, setFilterText] = useState("");
  const [scoutSeleccionado, setScoutSeleccionado] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // Key de persistencia para los checks de objetivos (se mantiene igual)
  const [objetivosCumplidos, setObjetivosCumplidos] = useLocalStorage('tupahue_progresion_objetivos', {});
  
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

  useEffect(() => {
    if (scoutSeleccionado) {
      setTempEtapa(scoutSeleccionado.etapa || CONFIG_RAMA.etapas[0].id);
      setTempObjetivos({ ...objetivosCumplidos });
      setTempObsInterna(scoutSeleccionado.progresion?.obsInterna || '');
      setTempObsPadres(scoutSeleccionado.progresion?.obsPadres || '');
    }
  }, [scoutSeleccionado, CONFIG_RAMA, objetivosCumplidos]);

  const handleToggleObjetivo = (scoutId, objetivo) => {
    const key = `${scoutId}-${objetivo}`;
    setTempObjetivos(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleConfirmarCambios = () => {
    // 1. Preparamos el array de objetivos logrados para guardar dentro del scout
    const objetivosIds = Object.keys(tempObjetivos)
      .filter(key => key.startsWith(`${scoutSeleccionado.id}-`) && tempObjetivos[key])
      .map(key => key.replace(`${scoutSeleccionado.id}-`, ''));

    // 2. CREAMOS LA DATA DE PROGRESIÓN
    const dataProgresion = {
      ...scoutSeleccionado.progresion,
      objetivos: objetivosIds,
      obsInterna: tempObsInterna,
      obsPadres: tempObsPadres
    };

    // 3. ACTUALIZACIÓN QUIRÚRGICA: 
    // Inyectamos la data en el objeto scout antes de mandarlo al handler global.
    // Esto asegura que aunque onUpdateEtapa solo sepa manejar etapa, 
    // el objeto scout ya lleve las observaciones puestas cuando se guarde en LocalStorage.
    scoutSeleccionado.progresion = dataProgresion;
    
    // Llamamos al handler original del sistema
    onUpdateEtapa(scoutSeleccionado.id, tempEtapa);

    // 4. Persistencia de UI y checks
    setObjetivosCumplidos(tempObjetivos);
    setOpenSnackbar(true);
    setScoutSeleccionado(null);
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
    scoutsFiltrados,
    tempEtapa, setTempEtapa,
    tempObjetivos, handleToggleObjetivo,
    tempObsInterna, setTempObsInterna,
    tempObsPadres, setTempObsPadres,
    handleConfirmarCambios, handlePase
  };
};