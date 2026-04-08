import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { ROLES } from '../constants/auth';

export const useAdultos = () => {
  const [adultos, setAdultos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAdultos = useCallback(async () => {
    setLoading(true);
    try {
      // Ahora consultamos la nómina de adultos
      const { data, error } = await supabase
        .from('adultos')
        .select('*')
        .order('apellido', { ascending: true });

      if (error) throw error;
      setAdultos(data || []);
    } catch (e) {
      console.error("Error cargando nómina de adultos:", e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdultos();
  }, [fetchAdultos]);

  const agregarAdulto = async (nuevo) => {
    try {
      // 1. Verificamos si ya está en la nómina
      const { data: existente } = await supabase
        .from('adultos')
        .select('id, user_id')
        .eq('dni', nuevo.dni)
        .maybeSingle();

      if (existente) {
        alert("Este DNI ya figura en la nómina de adultos.");
        return;
      }

      // 2. Insertamos en la tabla 'adultos' (No requiere ID de Auth)
      const record = {
        dni: nuevo.dni,
        nombre: nuevo.nombre,
        apellido: nuevo.apellido,
        funciones: nuevo.funciones || [],
        formacion: [],
        "planDesempeño": { objetivos: '', acuerdos: '' }
      };

      const { error: insertError } = await supabase.from('adultos').insert([record]);
      
      if (insertError) throw insertError;

      // 3. (Opcional) Si el usuario ya tenía cuenta (ej. es Padre), actualizamos su rol en profiles
      const { data: userProfile } = await supabase.from('profiles').select('id, funciones').eq('dni', nuevo.dni).maybeSingle();
      if (userProfile) {
        const nuevasFunc = [...new Set([...(userProfile.funciones || []), ...record.funciones])];
        await supabase.from('profiles').update({ 
          role: ROLES.EDUCADOR,
          funciones: nuevasFunc
        }).eq('id', userProfile.id);
        
        // Vinculamos la nómina con el perfil existente
        await supabase.from('adultos').update({ user_id: userProfile.id }).eq('dni', nuevo.dni);
      }

      alert("Educador añadido a la nómina correctamente.");
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
      const { error } = await supabase.from('adultos').update({ formacion: nuevaFormacion }).eq('id', adultoId);
      if (error) throw error;
      setAdultos(prev => prev.map(a => a.id === adultoId ? { ...a, formacion: nuevaFormacion } : a));
    } catch (e) {
      console.error("Error formación:", e);
    }
  };

  const actualizarPlanDesempeño = async (adultoId, dataPlan) => {
    try {
      const { error } = await supabase.from('adultos').update({ "planDesempeño": dataPlan }).eq('id', adultoId);
      if (error) throw error;
      setAdultos(prev => prev.map(a => a.id === adultoId ? { ...a, "planDesempeño": dataPlan } : a));
    } catch (e) {
      console.error("Error plan desempeño:", e);
    }
  };

  const eliminarAdulto = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este educador de la nómina?")) {
      try {
        const { error } = await supabase.from('adultos').delete().eq('id', id);
        if (error) throw error;
        setAdultos(prev => prev.filter(a => a.id !== id));
      } catch (e) {
        alert("Error: " + e.message);
      }
    }
  };

  return { adultos, loading, agregarAdulto, actualizarFormacion, actualizarPlanDesempeño, eliminarAdulto };
};