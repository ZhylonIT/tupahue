import { useState, useEffect, useMemo } from 'react';
import { RAMAS } from '../../../constants/ramas';
import { useLocalStorage } from '../../../hooks/useLocalStorage';

export const useProgresion = (scouts, ramaId, onUpdateEtapa, onPaseDeRama) => {
  const esVistaGlobal = ramaId?.toUpperCase() === 'TODAS';
  const idBusqueda = esVistaGlobal ? 'CAMINANTES' : ramaId.toUpperCase();
  const CONFIG_RAMA = RAMAS[idBusqueda] || RAMAS.CAMINANTES;
  const esRover = idBusqueda === 'ROVERS';

  // Estados de Interfaz
  const [viewMode, setViewMode] = useState('cards');
  const [filterText, setFilterText] = useState("");
  const [scoutSeleccionado, setScoutSeleccionado] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // Estados de Datos
  const [objetivosCumplidos, setObjetivosCumplidos] = useLocalStorage('tupahue_progresion_objetivos', {});
  const [tempEtapa, setTempEtapa] = useState('');
  const [tempObjetivos, setTempObjetivos] = useState({});

  // 1. Lógica de Filtrado y Cálculos Globales
  const { scoutsFiltrados, proximosPases } = useMemo(() => {
    if (esVistaGlobal) {
      const pases = scouts.filter(s => {
        const ramaInfo = RAMAS[s.rama?.toUpperCase()];
        if (!ramaInfo) return false;
        const ultimaEtapa = ramaInfo.etapas[ramaInfo.etapas.length - 1].id;
        return s.etapa === ultimaEtapa;
      });
      return { scoutsFiltrados: scouts, proximosPases: pases };
    }

    const filtrados = scouts.filter(s => {
      const etapaDoc = CONFIG_RAMA.etapas.find(e => e.id === s.etapa) || CONFIG_RAMA.etapas[0];
      const matchNombre = `${s.nombre} ${s.apellido}`.toLowerCase().includes(filterText.toLowerCase());
      const matchEtapa = etapaDoc.nombre.toLowerCase().includes(filterText.toLowerCase());
      return matchNombre || matchEtapa;
    });

    return { scoutsFiltrados: filtrados, proximosPases: [] };
  }, [scouts, esVistaGlobal, filterText, CONFIG_RAMA]);

  // 2. Manejo del Modal
  useEffect(() => {
    if (scoutSeleccionado && !esVistaGlobal) {
      setTempEtapa(scoutSeleccionado.etapa || CONFIG_RAMA.etapas[0].id);
      setTempObjetivos({ ...objetivosCumplidos });
    }
  }, [scoutSeleccionado, CONFIG_RAMA, objetivosCumplidos, esVistaGlobal]);

  const handleToggleObjetivo = (scoutId, objetivo) => {
    const key = `${scoutId}-${objetivo}`;
    setTempObjetivos(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleConfirmarCambios = () => {
    onUpdateEtapa(scoutSeleccionado.id, tempEtapa);
    setObjetivosCumplidos(tempObjetivos);
    setOpenSnackbar(true);
    setScoutSeleccionado(null);
  };

  const handlePase = () => {
    const textoPase = esRover ? "egreso/partida" : "pase de rama";
    if (window.confirm(`¿Confirmar el ${textoPase} de ${scoutSeleccionado.nombre}?`)) {
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
    handleConfirmarCambios, handlePase
  };
};