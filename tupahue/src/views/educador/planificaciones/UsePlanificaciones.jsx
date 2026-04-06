import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { useAuth } from '../../../context/AuthContext';

export const usePlanificaciones = (ramaId) => {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const esVistaGlobal = ramaId?.toUpperCase() === 'TODAS';

  // CARGAR HISTORIAL DESDE SUPABASE
  const cargarHistorial = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    
    try {
      let query = supabase.from('planificaciones').select('*');

      // Si no es vista global, filtramos por la rama actual
      if (!esVistaGlobal) {
        query = query.eq('rama', ramaId.toUpperCase());
      }

      const { data, error } = await query.order('createdAt', { ascending: false });

      if (error) throw error;

      // Mapeamos para mantener compatibilidad con la tabla de la View
      const historialMapeado = data.map(plani => ({
        ...plani,
        ramaOrigen: plani.rama // para que el Chip de la vista global funcione
      }));

      setHistorial(historialMapeado);
    } catch (error) {
      console.error("Error al cargar planificaciones:", error.message);
    } finally {
      setLoading(false);
    }
  }, [ramaId, esVistaGlobal, user]);

  useEffect(() => {
    cargarHistorial();
  }, [cargarHistorial]);

  // GUARDAR EN SUPABASE
  const guardarPlanificacion = async (nuevaPlanificacion) => {
    try {
      const nuevoRegistro = {
        fecha: nuevaPlanificacion.fechaActividad || new Date().toLocaleDateString(),
        nombre: nuevaPlanificacion.nombreActividad || 'Actividad Planificada',
        ciclo: nuevaPlanificacion.cicloPrograma || 'Sin asignar',
        rama: ramaId.toUpperCase(),
        datos: nuevaPlanificacion,
        creadoPor: user.id
      };

      const { error } = await supabase.from('planificaciones').insert([nuevoRegistro]);

      if (error) throw error;

      // Recargamos y saltamos a la pestaña de historial
      await cargarHistorial();
      setTabValue(1);
    } catch (error) {
      alert("Error al guardar planificación: " + error.message);
    }
  };

  // ELIMINAR DE SUPABASE
  const eliminarPlanificacion = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar esta planificación?")) return;

    try {
      const { error } = await supabase.from('planificaciones').delete().eq('id', id);
      
      if (error) throw error;
      
      setHistorial(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      alert("Error al eliminar: " + error.message);
    }
  };

  return {
    tabValue,
    setTabValue,
    historial,
    loading,
    esVistaGlobal,
    guardarPlanificacion,
    eliminarPlanificacion
  };
};