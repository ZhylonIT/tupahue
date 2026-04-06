import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { ROLES } from '../constants/auth';

export const useAdultos = () => {
  const [adultos, setAdultos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAdultos = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .or(`role.eq.${ROLES.EDUCADOR},role.eq.ADMIN`)
        .order('apellido', { ascending: true });

      if (error) throw error;
      setAdultos(data || []);
    } catch (e) {
      console.error("Error cargando adultos:", e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdultos();
  }, [fetchAdultos]);

  const agregarAdulto = async (nuevo) => {
    try {
      // 🎯 1. Verificamos si ya existe un perfil con ese DNI
      const { data: existente, error: searchError } = await supabase
        .from('profiles')
        .select('id, funciones, role, formacion, planDesempeño')
        .eq('dni', nuevo.dni)
        .maybeSingle(); // Usamos maybeSingle para que no tire error si no hay nada

      if (searchError) throw searchError;

      if (existente) {
        // 🎯 2. LÓGICA DE ROL DUAL: Si existe, actualizamos sin borrar el pasado
        let nuevasFunciones = [...(existente.funciones || [])];
        
        // Si el usuario era Familia, nos aseguramos de que 'FAMILIA' esté en sus funciones
        if (existente.role === ROLES.FAMILIA && !nuevasFunciones.includes(ROLES.FAMILIA)) {
          nuevasFunciones.push(ROLES.FAMILIA);
        }

        // Sumamos las nuevas funciones de educador (sin duplicar)
        nuevasFunciones = Array.from(new Set([...nuevasFunciones, ...(nuevo.funciones || [])]));
        
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            nombre: nuevo.nombre,
            apellido: nuevo.apellido,
            role: ROLES.EDUCADOR, // Sube a nivel gestión
            funciones: nuevasFunciones,
            // Mantenemos su historial si ya lo tenía
            formacion: existente.formacion || [],
            "planDesempeño": existente.planDesempeño || { objetivos: '', acuerdos: '' }
          })
          .eq('id', existente.id);

        if (updateError) throw updateError;
        alert("El usuario ya existía. Ahora tiene acceso dual (Educador + Familia).");
      } else {
        // 🎯 3. Si no existe, registro limpio de cero
        const record = {
          dni: nuevo.dni,
          nombre: nuevo.nombre,
          apellido: nuevo.apellido,
          role: ROLES.EDUCADOR,
          funciones: nuevo.funciones || [],
          formacion: [],
          "planDesempeño": { objetivos: '', acuerdos: '' }
        };

        const { error: insertError } = await supabase.from('profiles').insert([record]);
        if (insertError) throw insertError;
        alert("Educador registrado correctamente.");
      }
      
      await fetchAdultos();
    } catch (e) {
      console.error("Error en alta:", e);
      alert("Error al procesar el alta: " + e.message);
    }
  };

  const actualizarFormacion = async (adultoId, experienciaId) => {
    const adulto = adultos.find(a => a.id === adultoId);
    if (!adulto) return;

    const yaExiste = (adulto.formacion || []).includes(experienciaId);
    const nuevaFormacion = yaExiste 
      ? adulto.formacion.filter(id => id !== experienciaId)
      : [...(adulto.formacion || []), experienciaId];

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ formacion: nuevaFormacion })
        .eq('id', adultoId);
      
      if (error) throw error;
      setAdultos(prev => prev.map(a => a.id === adultoId ? { ...a, formacion: nuevaFormacion } : a));
    } catch (e) {
      console.error("Error actualización formación:", e);
    }
  };

  const actualizarPlanDesempeño = async (adultoId, dataPlan) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ "planDesempeño": dataPlan })
        .eq('id', adultoId);
      
      if (error) throw error;
      setAdultos(prev => prev.map(a => a.id === adultoId ? { ...a, "planDesempeño": dataPlan } : a));
    } catch (e) {
      console.error("Error actualización plan desempeño:", e);
    }
  };

  const eliminarAdulto = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este educador del sistema?")) {
      try {
        const { error } = await supabase.from('profiles').delete().eq('id', id);
        if (error) throw error;
        setAdultos(prev => prev.filter(a => a.id !== id));
      } catch (e) {
        alert("No se pudo eliminar el perfil: " + e.message);
      }
    }
  };

  return { 
    adultos, 
    loading,
    agregarAdulto, 
    actualizarFormacion, 
    actualizarPlanDesempeño, 
    eliminarAdulto 
  };
};