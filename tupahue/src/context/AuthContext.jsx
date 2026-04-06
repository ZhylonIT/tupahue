import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { FUNCIONES, ROLES } from '../constants/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userFuncion, setUserFuncion] = useState(null);
  const [availableFunciones, setAvailableFunciones] = useState([]);
  const [authLoading, setAuthLoading] = useState(true);

  // 🎯 Función para cargar el perfil (Memorizada para evitar loops)
  const fetchUserProfile = useCallback(async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle(); 

      if (error) throw error;

      if (data) {
        setUser(data);
        
        let funcionesPermitidas = data.funciones || [];
        
        // 🎯 CORRECCIÓN: El poder absoluto lo da tener la función JEFE_GRUPO
        if (funcionesPermitidas.includes(FUNCIONES.JEFE_GRUPO)) {
          // Le damos acceso a TODAS las funciones que NO sean de protagonistas (jóvenes)
          funcionesPermitidas = Object.values(FUNCIONES).filter(f => !f.startsWith('PROTAGONISTA_'));
        } else if (data.role === ROLES.JOVEN) {
          funcionesPermitidas = funcionesPermitidas.length > 0 ? funcionesPermitidas : ['PROTAGONISTA'];
        }

        setAvailableFunciones(funcionesPermitidas);
        
        // 🎯 MEJORA: Validamos que la función del caché siga estando permitida
        const savedFuncion = localStorage.getItem('user_tupahue_funcion');
        if (savedFuncion && funcionesPermitidas.includes(savedFuncion)) {
          setUserFuncion(savedFuncion);
        } else {
          setUserFuncion(funcionesPermitidas[0]);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error al obtener perfil:", error.message);
      setUser(null);
    } finally {
      setAuthLoading(false);
    }
  }, []);

  // 🎯 Efecto de escucha de sesión
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await fetchUserProfile(session.user.id);
      } else {
        setAuthLoading(false);
      }
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        // Solo disparamos fetch si no estamos en medio de un registro (evita conflictos)
        if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
          fetchUserProfile(session.user.id);
        }
      } else {
        setUser(null);
        setUserFuncion(null);
        setAvailableFunciones([]);
        setAuthLoading(false);
        localStorage.removeItem('user_tupahue_funcion');
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchUserProfile]);

  const login = async (email, password) => {
    setAuthLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (data.user) await fetchUserProfile(data.user.id);
    } catch (error) {
      setAuthLoading(false);
      throw error;
    }
  };

  // 🎯 REGISTRO REFORZADO CON AUTO-LOGIN
  const register = async ({ email, password, dni, roleSolicitado, nombre, apellido, hijosDnis = [] }) => {
    setAuthLoading(true);
    try {
      let recordPreexistente = null;

      // 1. Validaciones de pre-existencia (Joven/Educador)
      if (roleSolicitado === ROLES.JOVEN) {
        const { data } = await supabase.from('scouts').select('*').eq('dni', dni).maybeSingle();
        if (!data) throw new Error("Tu DNI no está en la nómina.");
        if (data.user_id) throw new Error("Este DNI ya está registrado.");
        recordPreexistente = data;
      } else if (roleSolicitado === ROLES.EDUCADOR) {
        const { data } = await supabase.from('profiles').select('*').eq('dni', dni).maybeSingle();
        if (!data) throw new Error("No figurás como educador pre-cargado.");
        if (data.id && data.id.length > 10) throw new Error("Este DNI ya está registrado.");
        recordPreexistente = data;
      }

      // 2. Registro en Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });
      if (authError) throw authError;
      if (!authData.user) throw new Error("Error al crear usuario.");
      
      const uid = authData.user.id;

      // 3. Preparar datos del perfil
      const perfilNuevo = {
        id: uid,
        dni: dni,
        nombre: recordPreexistente?.nombre || nombre || '',
        apellido: recordPreexistente?.apellido || apellido || '',
        role: recordPreexistente?.role || roleSolicitado,
        funciones: (roleSolicitado === ROLES.FAMILIA || hijosDnis.length > 0) 
                   ? [...new Set([...(recordPreexistente?.funciones || []), ROLES.FAMILIA])] 
                   : (recordPreexistente?.funciones || [roleSolicitado])
      };

      // 4. Si era educador, borramos la fila pre-cargada para evitar choques de DNI único
      if (roleSolicitado === ROLES.EDUCADOR) {
        await supabase.from('profiles').delete().eq('dni', dni);
      }

      // 5. Insertar Perfil Real (Usamos UPSERT por seguridad)
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert([perfilNuevo], { onConflict: 'id' });

      if (profileError) throw profileError;

      // 6. Vinculaciones en scouts
      if (roleSolicitado === ROLES.JOVEN) {
        await supabase.from('scouts').update({ user_id: uid }).eq('dni', dni);
      }
      if (hijosDnis.length > 0) {
        await supabase.from('scouts').update({ padre_id: uid }).in('dni', hijosDnis);
      }

      // 🎯 PASO MAESTRO: Actualizamos el estado local MANUALMENTE 
      // Esto evita esperar a la base de datos y corta el "Cargando..."
      setUser(perfilNuevo);
      
      // Aplicamos la misma regla de Admin aquí por si el registrado es un JEFE_GRUPO precargado
      let funcionesNuevas = perfilNuevo.funciones || [];
      if (funcionesNuevas.includes(FUNCIONES.JEFE_GRUPO)) {
        funcionesNuevas = Object.values(FUNCIONES).filter(f => !f.startsWith('PROTAGONISTA_'));
      }
      
      setAvailableFunciones(funcionesNuevas);
      setUserFuncion(funcionesNuevas[0]);
      
      // Forzamos el fin de la carga
      setAuthLoading(false);

    } catch (error) {
      console.error("Error en registro:", error.message);
      setAuthLoading(false); // Siempre apagar el loading si hay error
      throw error;
    }
  };

  const logout = async () => {
    setAuthLoading(true);
    await supabase.auth.signOut();
    localStorage.removeItem('user_tupahue_funcion');
  };

  const switchRole = (nuevaFuncion) => {
    setUserFuncion(nuevaFuncion);
    localStorage.setItem('user_tupahue_funcion', nuevaFuncion);
  };

  return (
    <AuthContext.Provider value={{ 
      user, userFuncion, availableFunciones, 
      login, register, logout, switchRole, authLoading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);