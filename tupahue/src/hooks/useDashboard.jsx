import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useLocalStorage } from './useLocalStorage';
import { RAMAS } from '../constants/ramas.jsx';
import { ROLES } from '../constants/auth.jsx';

export const useDashboard = (user, datosIniciales = [], eventosIniciales = [], funcionActual) => {
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

  const fetchData = useCallback(async () => {
    if (!user?.id) {
        setLoading(false);
        return;
    }
    
    setLoading(true);
    try {
      let qScouts = supabase.from('scouts').select('*');
      let qProy = supabase.from('proyectos').select('*');

      // 🎯 FILTRADO DINÁMICO SEGÚN LA FUNCIÓN ACTIVA
      if (funcionActual === ROLES.FAMILIA) {
        qScouts = qScouts.eq('padre_id', user.id);
      } else if (funcionActual?.startsWith('PROTAGONISTA_')) {
        qScouts = qScouts.eq('user_id', user.id);
        qProy = qProy.eq('creadoPor', user.id);
      }

      const [resScouts, resEv, resProy, resAdultos] = await Promise.all([
        qScouts,
        supabase.from('eventos').select('*').order('fecha', { ascending: true }),
        qProy,
        supabase.from('profiles').select('*').or(`role.eq.${ROLES.EDUCADOR},role.eq.ADMIN`)
      ]);

      setScouts(resScouts.data || []);
      setEventos(resEv.data || []);
      setProyectos(resProy.data || []);
      setAdultos(resAdultos.data || []);
    } catch (e) { 
      console.error("Dashboard Fetch Error:", e); 
    } finally { 
      setLoading(false); 
    }
    // 🎯 RE-EJECUTAR SI CAMBIA LA FUNCIÓN (SWITCH DE ROL)
  }, [user?.id, user?.role, funcionActual]); 

  useEffect(() => { fetchData(); }, [fetchData]);

  const handlers = {
    handleOpenForm: (scout = null) => { setScoutSeleccionado(scout); setIsFormOpen(true); },
    handleOpenDetail: (scout) => { setScoutSeleccionado(scout); setIsDetailOpen(true); },
    handleVincularHijo: async (dni, padreId) => {
      const { data, error } = await supabase.from('scouts').select('id, nombre').eq('dni', dni).single();
      if (error || !data) throw new Error("DNI no encontrado.");
      await supabase.from('scouts').update({ padre_id: padreId }).eq('id', data.id);
      await fetchData();
      return data.nombre;
    },
    handleUpdateEtapa: async (id, nueva, extra = {}) => {
      const payload = { etapa: nueva, ...extra, ultimaModificacion: new Date() };
      const { error } = await supabase.from('scouts').update(payload).eq('id', id);
      if (!error) setScouts(prev => prev.map(s => s.id === id ? { ...s, ...payload } : s));
    },
    handlePaseDeRama: async (id) => {
      const s = scouts.find(x => x.id === id);
      if (!s) return;
      const proxima = RAMAS[s.rama.toUpperCase()]?.proximaRama?.toUpperCase();
      if (proxima === 'EDUCADORES' || proxima === 'ADULTOS') {
        await supabase.from('scouts').delete().eq('id', id);
        setScouts(prev => prev.filter(x => x.id !== id));
      } else {
        const nuevaEtapa = RAMAS[proxima].etapas[0].id;
        const payload = { rama: proxima, etapa: nuevaEtapa, ultimaModificacion: new Date() };
        await supabase.from('scouts').update(payload).eq('id', id);
        setScouts(prev => prev.map(x => x.id === id ? { ...x, ...payload } : x));
      }
    },
    handleToggleAsistencia: async (id) => {
      const s = scouts.find(x => x.id === id);
      await supabase.from('scouts').update({ presente: !s.presente }).eq('id', id);
      setScouts(prev => prev.map(x => x.id === id ? { ...x, presente: !x.presente } : x));
    },
    handleDeleteScout: async (id) => {
      if (window.confirm("¿Eliminar?")) {
        await supabase.from('scouts').delete().eq('id', id);
        setScouts(prev => prev.filter(x => x.id !== id));
      }
    },
    handleAddEvento: async (n) => {
      const { data } = await supabase.from('eventos').insert([{ ...n, creadoPor: user.id }]).select();
      if (data) setEventos(prev => [...prev, data[0]]);
    },
    handleUpdateEvento: async (id, d) => {
      await supabase.from('eventos').update(d).eq('id', id);
      setEventos(prev => prev.map(e => e.id === id ? { ...e, ...d } : e));
    },
    handleDeleteEvento: async (id) => {
      await supabase.from('eventos').delete().eq('id', id);
      setEventos(prev => prev.filter(e => e.id !== id));
    },
    handleReviewProyecto: async (id, est, com) => {
      const p = { estado: est, comentariosEducador: com, vistoPorJoven: false, ultimaModificacion: new Date() };
      await supabase.from('proyectos').update(p).eq('id', id);
      setProyectos(prev => prev.map(x => x.id === id ? { ...x, ...p } : x));
    }
  };

  const handleSaveScout = async (d) => {
    const { id, ...payload } = d;
    if (id) {
      await supabase.from('scouts').update(payload).eq('id', id);
      setScouts(prev => prev.map(s => s.id === id ? { ...s, ...d } : s));
    } else {
      const r = (d.rama || ramaActiva).toUpperCase();
      const n = { ...payload, rama: r, etapa: RAMAS[r]?.etapas[0]?.id || 'tierra', presente: false };
      const { data } = await supabase.from('scouts').insert([n]).select();
      if (data) setScouts(prev => [...prev, data[0]]);
    }
    setIsFormOpen(false); setScoutSeleccionado(null);
  };

  const handleSaveProyecto = async (d) => {
    const { id, ...payload } = d;
    if (id) {
      await supabase.from('proyectos').update({ ...payload, ultimaModificacion: new Date() }).eq('id', id);
      setProyectos(prev => prev.map(p => p.id === id ? { ...p, ...payload } : p));
    } else {
      const { data } = await supabase.from('proyectos').insert([{ ...payload, creadoPor: user.id, estado: 'BORRADOR' }]).select();
      if (data) setProyectos(prev => [...prev, data[0]]);
    }
  };

  return { ramaActiva, setRamaActiva, vistaActual, setVistaActual, scouts, eventos, proyectos, adultos, loading, isFormOpen, setIsFormOpen, isDetailOpen, setIsDetailOpen, scoutSeleccionado, handlers, handleSaveScout, handleSaveProyecto };
};