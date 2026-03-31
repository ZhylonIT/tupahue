import { useState, useEffect, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { RAMAS } from '../constants/ramas.jsx';
import { FUNCIONES } from '../constants/auth.jsx';

export const useDashboard = (user, datosIniciales = [], eventosIniciales = [], funcionActual) => {
  
  // 1. LÓGICA DE PERMISOS DINÁMICA
  const esAdminORamaUniversal = useMemo(() => {
    const funcionesGestion = [
      FUNCIONES.JEFE_GRUPO,
      FUNCIONES.ASISTENTE_PROG,
      FUNCIONES.ASISTENTE_ADULTOS,
      FUNCIONES.ASISTENTE_COM,
      FUNCIONES.ASISTENTE_ADM
    ];
    return funcionesGestion.includes(funcionActual);
  }, [funcionActual]);

  const deducirRamaDelEducador = (funcion) => {
    if (!funcion) return 'CAMINANTES';
    const funcUpper = funcion.toUpperCase();
    if (funcUpper.includes('LOBATO') || funcUpper.includes('MANADA')) return 'LOBATOS';
    if (funcUpper.includes('SCOUT') || funcUpper.includes('UNIDAD')) return 'SCOUTS';
    if (funcUpper.includes('CAMINANTE')) return 'CAMINANTES';
    if (funcUpper.includes('ROVER') || funcUpper.includes('CLAN')) return 'ROVERS';
    return 'CAMINANTES'; 
  };

  // 2. ESTADOS PERSISTENTES
  const getInitialRama = () => {
    const saved = localStorage.getItem('tupahue_rama_actual');
    if (saved) return JSON.parse(saved);
    return esAdminORamaUniversal ? 'TODAS' : deducirRamaDelEducador(funcionActual);
  };

  const [ramaActiva, setRamaActiva] = useLocalStorage('tupahue_rama_actual', getInitialRama());
  const [vistaActual, setVistaActual] = useLocalStorage('tupahue_vista_actual', 'DASHBOARD');
  const [scouts, setScouts] = useLocalStorage('tupahue_scouts', datosIniciales);
  const [eventos, setEventos] = useLocalStorage('tupahue_eventos', eventosIniciales);

  // 3. ESTADOS DE LA INTERFAZ
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [scoutSeleccionado, setScoutSeleccionado] = useState(null);

  // SINCRONIZACIÓN FORZADA DE RAMA
  useEffect(() => {
    if (!esAdminORamaUniversal && funcionActual) {
      const ramaCorrecta = deducirRamaDelEducador(funcionActual);
      if (ramaActiva !== ramaCorrecta) {
        setRamaActiva(ramaCorrecta);
      }
    }
  }, [esAdminORamaUniversal, funcionActual]); 

  // MIGRACIÓN DE DATOS DE ETAPAS
  useEffect(() => {
    if (scouts && scouts.length > 0) {
      const mapeoEtapas = {
        'busqueda': 'tierra',
        'lobo_leal': 'cazador',
        'sol': 'agua',
        'servicio': 'partida'
      };
      
      let hayCambios = false;
      const scoutsCorregidos = scouts.map(s => {
        if (mapeoEtapas[s.etapa]) {
          hayCambios = true;
          return { ...s, etapa: mapeoEtapas[s.etapa] };
        }
        return s;
      });

      if (hayCambios) {
        setScouts(scoutsCorregidos);
      }
    }
  }, [scouts, setScouts]);

  // 4. HANDLERS DE LÓGICA
  const handlers = {
    handleUpdateEtapa: (scoutId, nuevaEtapa) => {
      setScouts(prev => prev.map(s => s.id === scoutId ? { ...s, etapa: nuevaEtapa } : s));
    },

    handlePaseDeRama: (scoutId) => {
      const scout = scouts.find(s => s.id === scoutId);
      if (!scout) return;

      const ramaActualKey = scout.rama.toUpperCase();
      const ramaActualInfo = RAMAS[ramaActualKey];
      
      if (!ramaActualInfo || !ramaActualInfo.proximaRama) {
        console.error("No se encontró información de la próxima rama para:", scout.rama);
        return;
      }

      const proximaRamaID = ramaActualInfo.proximaRama.toUpperCase();

      if (proximaRamaID === 'EDUCADORES' || proximaRamaID === 'ADULTOS') {
        setScouts(prev => prev.filter(s => s.id !== scoutId));
        alert(`${scout.nombre} ha egresado exitosamente hacia la formación de Adultos.`);
      } else {
        const nuevaEtapaInicial = RAMAS[proximaRamaID].etapas[0].id;
        
        setScouts(prev => prev.map(s => {
          if (s.id === scoutId) {
            return { 
              ...s, 
              rama: proximaRamaID, 
              etapa: nuevaEtapaInicial 
            };
          }
          return s;
        }));

        setRamaActiva(proximaRamaID);
        alert(`${scout.nombre} realizó el Pase a la rama ${RAMAS[proximaRamaID].nombre}`);
      }
    },

    handleToggleAsistencia: (id) => {
      setScouts(prev => prev.map(s => s.id === id ? { ...s, presente: !s.presente } : s));
    },

    handleDeleteScout: (id) => {
      if (window.confirm("¿Estás seguro de que querés eliminar a este protagonista de la nómina?")) {
        setScouts(prev => prev.filter(s => s.id !== id));
      }
    },

    handleOpenForm: (scout = null) => {
      setScoutSeleccionado(scout);
      setIsFormOpen(true);
    },

    handleOpenDetail: (scout) => {
      setScoutSeleccionado(scout);
      setIsDetailOpen(true);
    },

    handleAddEvento: (nuevo) => {
      setEventos(prev => [...prev, { 
        ...nuevo, 
        id: Date.now(),
        color: nuevo.tipo === 'Rama' ? (RAMAS[ramaActiva]?.color || '#333') : (nuevo.color || '#333') 
      }]);
    },

    handleDeleteEvento: (id) => {
      setEventos(prev => prev.filter(e => e.id !== id));
    }
  };

  // 5. GUARDADO (Crear/Editar)
  const handleSaveScout = (datosScout) => {
    // 👈 MAGIA DE CÓDIGO LIMPIO: 
    // Si datosScout trae un ID, es porque estamos editando (desde familia o desde educador).
    // Si no trae, intentamos usar el scoutSeleccionado (modal).
    const idAEditar = datosScout.id || scoutSeleccionado?.id;

    const dniDuplicado = scouts.find(s => 
      s.dni === datosScout.dni && s.id !== idAEditar
    );

    if (dniDuplicado) {
      alert(`ERROR: El DNI ${datosScout.dni} ya está registrado a nombre de ${dniDuplicado.nombre} ${dniDuplicado.apellido} en la rama ${dniDuplicado.rama}.`);
      return; 
    }

    if (idAEditar) {
      // 👈 Es una edición, actualizamos el scout exacto
      setScouts(prev => prev.map(s => s.id === idAEditar ? { ...s, ...datosScout } : s));
    } else {
      // Es una creación nueva
      const nuevaRama = datosScout.rama || ramaActiva;
      const idRamaNormalizado = nuevaRama.toUpperCase();
      
      const nuevoScout = {
        ...datosScout,
        id: Date.now(),
        presente: false,
        rama: idRamaNormalizado,
        etapa: RAMAS[idRamaNormalizado]?.etapas[0]?.id || 'tierra' 
      };
      setScouts(prev => [...prev, nuevoScout]);
    }
    setIsFormOpen(false);
    setScoutSeleccionado(null);
  };

  return {
    ramaActiva, setRamaActiva,
    vistaActual, setVistaActual,
    scouts, eventos,
    isFormOpen, setIsFormOpen,
    isDetailOpen, setIsDetailOpen,
    scoutSeleccionado,
    esAdminORamaUniversal,
    handlers,
    handleSaveScout
  };
};