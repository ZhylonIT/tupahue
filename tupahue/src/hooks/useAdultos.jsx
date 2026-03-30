import { useState, useEffect } from 'react';

export const useAdultos = () => {
  const [adultos, setAdultos] = useState(() => {
    try {
      const saved = localStorage.getItem('tupahue_adultos');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Error cargando adultos:", e);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('tupahue_adultos', JSON.stringify(adultos));
  }, [adultos]);

  // --- 1. AGREGAR ADULTO (Con DNI y soporte multifunción) ---
  const agregarAdulto = (nuevoAdulto) => {
    const adultoConId = {
      id: Date.now(),
      nombre: nuevoAdulto.nombre || '',
      apellido: nuevoAdulto.apellido || '',
      dni: nuevoAdulto.dni || '',
      funciones: nuevoAdulto.funciones || [], // Array de funciones
      ramas: nuevoAdulto.ramas || [],       // Array de ramas
      formacion: [],                       // IDs de experiencias completadas del SNF
      planDesempeño: {
        objetivos: '',
        acuerdos: '',
        fechaRevision: new Date().toISOString()
      }
    };
    setAdultos(prev => [...prev, adultoConId]);
  };

  // --- 2. ACTUALIZAR FORMACIÓN (Toggle de experiencias) ---
  const actualizarFormacion = (adultoId, experienciaId) => {
    setAdultos(prev => prev.map(a => {
      if (a.id === adultoId) {
        const yaExiste = a.formacion.includes(experienciaId);
        const nuevaFormacion = yaExiste 
          ? a.formacion.filter(id => id !== experienciaId)
          : [...a.formacion, experienciaId];
        return { ...a, formacion: nuevaFormacion };
      }
      return a;
    }));
  };

  // --- 3. ACTUALIZAR PLAN DE DESEMPEÑO ---
  const actualizarPlanDesempeño = (adultoId, dataPlan) => {
    setAdultos(prev => prev.map(a => {
      if (a.id === adultoId) {
        return { 
          ...a, 
          planDesempeño: { 
            ...a.planDesempeño, 
            ...dataPlan,
            fechaRevision: new Date().toISOString() 
          } 
        };
      }
      return a;
    }));
  };

  // --- 4. ELIMINAR ADULTO ---
  const eliminarAdulto = (id) => {
    if (window.confirm("¿Estás seguro de eliminar este educador? Se perderá todo su historial de formación.")) {
      setAdultos(prev => prev.filter(a => a.id !== id));
    }
  };

  return { 
    adultos, 
    agregarAdulto, 
    actualizarFormacion, 
    actualizarPlanDesempeño, 
    eliminarAdulto 
  };
};