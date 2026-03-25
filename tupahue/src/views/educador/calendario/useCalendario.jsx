import { useState, useMemo, useEffect } from 'react';
import { useTheme, useMediaQuery } from '@mui/material';
import { RAMAS } from '../../../constants/ramas';

export const useCalendario = (eventos, ramaId, onAddEvento, onUpdateEvento, onDeleteEvento) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [viewMode, setViewMode] = useState(isMobile ? 'list' : 'grid');
  const [fechaVista, setFechaVista] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // 1. Detección de Vista Global y Configuración Dinámica
  const idBusqueda = ramaId?.toUpperCase();
  const esVistaGlobal = idBusqueda === 'TODAS';
  
  const CONFIG_RAMA = esVistaGlobal 
    ? { nombre: 'Todo el Grupo', color: '#5A189A' } 
    : (RAMAS[idBusqueda] || RAMAS.CAMINANTES);

  // 2. Efecto para adaptar la vista inicial según la pantalla
  useEffect(() => { 
    setViewMode(isMobile ? 'list' : 'grid'); 
  }, [isMobile]);

  // 3. Filtrado de eventos por el mes y año que estamos viendo
  const eventosFiltrados = useMemo(() => {
    return eventos.filter(ev => {
      if (!ev.fecha) return false;
      const [year, month] = ev.fecha.split('-').map(Number);
      return (month - 1) === fechaVista.getMonth() && year === fechaVista.getFullYear();
    }).sort((a, b) => a.fecha.localeCompare(b.fecha));
  }, [eventos, fechaVista]);

  // 4. Funciones de navegación del calendario
  const irMesAnterior = () => setFechaVista(new Date(fechaVista.getFullYear(), fechaVista.getMonth() - 1, 1));
  const irMesSiguiente = () => setFechaVista(new Date(fechaVista.getFullYear(), fechaVista.getMonth() + 1, 1));

  // 5. Manejadores del Modal
  const abrirModalNuevo = () => {
    setSelectedEvent(null);
    setIsModalOpen(true);
  };

  const abrirModalEdicion = (ev) => {
    setSelectedEvent(ev);
    setIsModalOpen(true);
  };

  const cerrarModal = () => setIsModalOpen(false);

  const guardarEvento = (id, data) => {
    if (id) {
      onUpdateEvento(id, data);
    } else {
      onAddEvento(data);
    }
  };

  return {
    viewMode, setViewMode,
    fechaVista,
    isModalOpen,
    selectedEvent,
    esVistaGlobal,
    CONFIG_RAMA,
    eventosFiltrados,
    irMesAnterior, irMesSiguiente,
    abrirModalNuevo, abrirModalEdicion, cerrarModal,
    guardarEvento,
    onDeleteEvento // Lo pasamos directamente
  };
};