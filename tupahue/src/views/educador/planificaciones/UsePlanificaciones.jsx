import { useState, useEffect, useCallback } from 'react';

export const usePlanificaciones = (ramaId) => {
  const [tabValue, setTabValue] = useState(0);
  const [historial, setHistorial] = useState([]);
  const esVistaGlobal = ramaId?.toUpperCase() === 'TODAS';

  // Función para cargar el historial (la sacamos a una función para reusarla)
  const cargarHistorial = useCallback(() => {
    if (esVistaGlobal) {
      const ramasNombres = ['LOBATOS', 'SCOUTS', 'CAMINANTES', 'ROVERS', 'TODAS'];
      let historialCombinado = [];

      ramasNombres.forEach(nombreRama => {
        const storageKey = `tupahue_historial_planificaciones_${nombreRama}`;
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          const planificacionesRama = JSON.parse(saved).map(plani => ({
            ...plani,
            ramaOrigen: nombreRama
          }));
          historialCombinado = [...historialCombinado, ...planificacionesRama];
        }
      });

      historialCombinado.sort((a, b) => b.id - a.id);
      setHistorial(historialCombinado);
      setTabValue(1); 
    } else {
      const storageKey = `tupahue_historial_planificaciones_${ramaId.toUpperCase()}`;
      const saved = localStorage.getItem(storageKey);
      setHistorial(saved ? JSON.parse(saved) : []);
      setTabValue(0);
    }
  }, [ramaId, esVistaGlobal]);

  useEffect(() => {
    cargarHistorial();
  }, [cargarHistorial]);

  const guardarPlanificacion = (nuevaPlanificacion) => {
    const nuevoRegistro = {
      id: Date.now(),
      fecha: nuevaPlanificacion.fechaActividad || new Date().toLocaleDateString(),
      nombre: nuevaPlanificacion.nombreActividad || 'Actividad Planificada',
      ciclo: nuevaPlanificacion.cicloPrograma || 'Sin asignar',
      datos: nuevaPlanificacion
    };

    const storageKey = `tupahue_historial_planificaciones_${ramaId.toUpperCase()}`;
    const saved = localStorage.getItem(storageKey);
    const historialActual = saved ? JSON.parse(saved) : [];
    
    const nuevoHistorial = [nuevoRegistro, ...historialActual];
    localStorage.setItem(storageKey, JSON.stringify(nuevoHistorial));

    // Recargamos todo el estado
    cargarHistorial();
    setTabValue(1);
  };

  const eliminarPlanificacion = (id, ramaOrigen = null) => {
    if (window.confirm("¿Estás seguro de que querés eliminar esta planificación del historial?")) {
      const ramaABorrar = esVistaGlobal ? ramaOrigen : ramaId.toUpperCase();
      const storageKey = `tupahue_historial_planificaciones_${ramaABorrar}`;
      
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const historialRama = JSON.parse(saved).filter(item => item.id !== id);
        localStorage.setItem(storageKey, JSON.stringify(historialRama));
      }
      cargarHistorial();
    }
  };

  return {
    tabValue,
    setTabValue,
    historial,
    esVistaGlobal,
    guardarPlanificacion,
    eliminarPlanificacion
  };
};