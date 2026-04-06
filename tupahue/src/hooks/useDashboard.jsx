import { useState, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useLocalStorage } from './useLocalStorage';
import { RAMAS } from '../constants/ramas.jsx';
import { FUNCIONES } from '../constants/auth.jsx';

export const useDashboard = (user, datosIniciales = [], eventosIniciales = [], funcionActual) => {

  // --- 1. ESTADOS ---
  const [ramaActiva, setRamaActiva] = useLocalStorage('tupahue_rama_actual', 'TODAS');
  const [vistaActual, setVistaActual] = useLocalStorage('tupahue_vista_actual', 'DASHBOARD');
  const [scouts, setScouts] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [proyectos, setProyectos] = useState([]);
  const [adultos, setAdultos] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [scoutSeleccionado, setScoutSeleccionado] = useState(null);

  const esAdminORamaUniversal = useMemo(() => {
    const funcionesGestion = [
      FUNCIONES.JEFE_GRUPO, FUNCIONES.ASISTENTE_PROG,
      FUNCIONES.ASISTENTE_ADULTOS, FUNCIONES.ASISTENTE_COM, FUNCIONES.ASISTENTE_ADM
    ];
    return funcionesGestion.includes(funcionActual);
  }, [funcionActual]);

  // --- 2. CARGA DE DATOS ---
  const fetchData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      // 🎯 SEGURIDAD: Si es familia, solo traemos sus hijos vinculados
      // Si es educador/admin, trae todos.
      let queryScouts = supabase.from('scouts').select('*');
      
      if (user.role === 'FAMILIA') {
        queryScouts = queryScouts.eq('padre_id', user.id);
      }

      const { data: dScouts } = await queryScouts;
      setScouts(dScouts || []);

      const { data: dEv } = await supabase.from('eventos').select('*').order('fecha', { ascending: true });
      setEventos(dEv || []);

      const { data: dProy } = await supabase.from('proyectos').select('*');
      setProyectos(dProy || []);

      const { data: dAdultos } = await supabase
        .from('profiles')
        .select('nombre, apellido, role')
        .or('role.eq.EDUCADOR,role.eq.ADMIN');
      setAdultos(dAdultos || []);

    } catch (e) { console.error(e); } finally { setLoading(false); }
  }, [user]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // --- 3. HANDLERS ---
  const handlers = {
    handleOpenForm: (scout = null) => { setScoutSeleccionado(scout); setIsFormOpen(true); },
    handleOpenDetail: (scout) => { setScoutSeleccionado(scout); setIsDetailOpen(true); },

    // 🎯 NUEVO: Vincular hijo a un padre en la DB
    handleVincularHijo: async (dni, padreId) => {
      // 1. Buscamos si el scout existe por DNI
      const { data: scoutEncontrado, error: searchError } = await supabase
        .from('scouts')
        .select('id, nombre')
        .eq('dni', dni)
        .single();

      if (searchError || !scoutEncontrado) throw new Error("DNI no encontrado en el sistema.");

      // 2. Le asignamos el padre_id
      const { error: updateError } = await supabase
        .from('scouts')
        .update({ padre_id: padreId })
        .eq('id', scoutEncontrado.id);

      if (updateError) throw updateError;

      // 3. Recargamos la lista para que aparezca en el dashboard del padre
      await fetchData();
      return scoutEncontrado.nombre;
    },

    handleUpdateEtapa: async (scoutId, nuevaEtapa, datosExtra = {}) => {
      const payload = { etapa: nuevaEtapa, ...datosExtra, ultimaModificacion: new Date() };
      const { error } = await supabase.from('scouts').update(payload).eq('id', scoutId);
      if (!error) setScouts(prev => prev.map(s => s.id === scoutId ? { ...s, ...payload } : s));
    },

    handlePaseDeRama: async (scoutId) => {
      const scout = scouts.find(s => s.id === scoutId);
      if (!scout) return;
      const ramaActualKey = scout.rama.toUpperCase();
      const ramaActualInfo = RAMAS[ramaActualKey];
      if (!ramaActualInfo || !ramaActualInfo.proximaRama) return;
      const proximaRamaID = ramaActualInfo.proximaRama.toUpperCase();

      if (proximaRamaID === 'EDUCADORES' || proximaRamaID === 'ADULTOS') {
        const { error } = await supabase.from('scouts').delete().eq('id', scoutId);
        if (!error) setScouts(prev => prev.filter(s => s.id !== scoutId));
      } else {
        const nuevaEtapaInicial = RAMAS[proximaRamaID].etapas[0].id;
        const payload = { rama: proximaRamaID, etapa: nuevaEtapaInicial, ultimaModificacion: new Date() };
        const { error } = await supabase.from('scouts').update(payload).eq('id', scoutId);
        if (!error) setScouts(prev => prev.map(s => s.id === scoutId ? { ...s, ...payload } : s));
      }
    },

    handleToggleAsistencia: async (id) => {
      const scout = scouts.find(s => s.id === id);
      const { error } = await supabase.from('scouts').update({ presente: !scout.presente }).eq('id', id);
      if (!error) setScouts(prev => prev.map(s => s.id === id ? { ...s, presente: !s.presente } : s));
    },

    handleDeleteScout: async (id) => {
      if (window.confirm("¿Eliminar protagonista?")) {
        const { error } = await supabase.from('scouts').delete().eq('id', id);
        if (!error) setScouts(prev => prev.filter(s => s.id !== id));
      }
    },

    handleAddEvento: async (nuevo) => {
      const ev = { ...nuevo, creadoPor: user.id };
      const { data, error } = await supabase.from('eventos').insert([ev]).select();
      if (!error && data) setEventos(prev => [...prev, data[0]]);
    },
    
    handleUpdateEvento: async (id, datos) => {
      const { error } = await supabase.from('eventos').update(datos).eq('id', id);
      if (!error) setEventos(prev => prev.map(e => e.id === id ? { ...e, ...datos } : e));
    },

    handleDeleteEvento: async (id) => {
      const { error } = await supabase.from('eventos').delete().eq('id', id);
      if (!error) setEventos(prev => prev.filter(e => e.id !== id));
    },

    handleReviewProyecto: async (proyectoId, nuevoEstado, comentarios) => {
      const payload = { estado: nuevoEstado, comentariosEducador: comentarios, vistoPorJoven: false, ultimaModificacion: new Date() };
      const { error } = await supabase.from('proyectos').update(payload).eq('id', proyectoId);
      if (!error) setProyectos(prev => prev.map(p => p.id === proyectoId ? { ...p, ...payload } : p));
    }
  };

  const handleSaveScout = async (datosScout) => {
    const { id, ...payload } = datosScout;
    const idAEditar = id || scoutSeleccionado?.id;
    if (idAEditar) {
      await supabase.from('scouts').update(payload).eq('id', idAEditar);
      setScouts(prev => prev.map(s => s.id === idAEditar ? { ...s, ...datosScout } : s));
    } else {
      const r = (datosScout.rama || ramaActiva).toUpperCase();
      const nuevo = { ...payload, rama: r, etapa: RAMAS[r]?.etapas[0]?.id || 'tierra', presente: false };
      const { data } = await supabase.from('scouts').insert([nuevo]).select();
      if (data) setScouts(prev => [...prev, data[0]]);
    }
    setIsFormOpen(false); setScoutSeleccionado(null);
  };

  const handleSaveProyecto = async (datosProyecto) => {
    const { id, ...payload } = datosProyecto;
    if (id) {
      await supabase.from('proyectos').update({ ...payload, ultimaModificacion: new Date() }).eq('id', id);
      setProyectos(prev => prev.map(p => p.id === id ? { ...p, ...payload } : p));
    } else {
      const { data } = await supabase.from('proyectos').insert([{ ...payload, creadoPor: user.id, estado: 'BORRADOR' }]).select();
      if (data) setProyectos(prev => [...prev, data[0]]);
    }
  };

  return {
    ramaActiva, setRamaActiva, vistaActual, setVistaActual,
    scouts, eventos, proyectos, adultos, loading,
    isFormOpen, setIsFormOpen, isDetailOpen, setIsDetailOpen,
    scoutSeleccionado, esAdminORamaUniversal,
    handlers, handleSaveScout, handleSaveProyecto
  };
};