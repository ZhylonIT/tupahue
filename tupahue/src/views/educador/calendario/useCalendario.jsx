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

  // Mantenemos la configuración visual de la rama para los botones y estilos
  const idBusqueda = ramaId?.toUpperCase();
  const esVistaGlobal = idBusqueda === 'TODAS';
  
  const CONFIG_RAMA = esVistaGlobal 
    ? { nombre: 'Todo el Grupo', color: '#5A189A' } 
    : (RAMAS[idBusqueda] || RAMAS.CAMINANTES);

  useEffect(() => { 
    setViewMode(isMobile ? 'list' : 'grid'); 
  }, [isMobile]);

  // 🎯 FILTRADO GLOBAL: Ahora solo filtramos por FECHA. 
  // Todos ven lo de todos para coordinar mejor.
  const eventosFiltrados = useMemo(() => {
    return (eventos || []).filter(ev => {
      if (!ev.fecha) return false;
      
      const [year, month] = ev.fecha.split('-').map(Number);
      // Solo filtramos que coincida el mes y el año de la vista actual
      return (month - 1) === fechaVista.getMonth() && year === fechaVista.getFullYear();
      
    }).sort((a, b) => a.fecha.localeCompare(b.fecha));
  }, [eventos, fechaVista]);

  const irMesAnterior = () => setFechaVista(new Date(fechaVista.getFullYear(), fechaVista.getMonth() - 1, 1));
  const irMesSiguiente = () => setFechaVista(new Date(fechaVista.getFullYear(), fechaVista.getMonth() + 1, 1));

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
      // 🎯 Al crear, guardamos qué rama lo originó, pero será visible para todos
      const nuevoEvento = {
        ...data,
        rama: esVistaGlobal ? 'TODAS' : idBusqueda
      };
      onAddEvento(nuevoEvento);
    }
    cerrarModal();
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
    onDeleteEvento
  };
};