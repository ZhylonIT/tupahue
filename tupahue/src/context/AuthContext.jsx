import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { FUNCIONES, ROLES } from '../constants/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userFuncion, setUserFuncion] = useState(null);
  const [availableFunciones, setAvailableFunciones] = useState([]);
  const [authLoading, setAuthLoading] = useState(true);

  const fetchUserProfile = useCallback(async (userId) => {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (profileError) throw profileError;

      if (profileData) {
        let fPermitidas = profileData.funciones || [];
        
        // 🎯 MOTOR DE AUTOREPARACIÓN ULTRA-AGRESIVO (CASO MÁXIMO)
        if (profileData.role === ROLES.JOVEN) {
          // 1. Intentamos buscar por user_id (lo normal)
          let { data: scoutData } = await supabase
            .from('scouts')
            .select('rama, user_id, dni')
            .eq('user_id', userId)
            .maybeSingle();

          // 2. 🚨 SI ES NULL (Caso Máximo), buscamos por DNI para reparar el vínculo
          if (!scoutData && profileData.dni) {
            console.log("Detectado vínculo roto por user_id NULL. Intentando reparar por DNI...");
            const { data: repairData } = await supabase
              .from('scouts')
              .select('rama, user_id, dni')
              .eq('dni', profileData.dni)
              .maybeSingle();
            
            if (repairData) {
              // Encontramos la ficha huérfana, le asignamos el user_id de este usuario
              await supabase.from('scouts').update({ user_id: userId }).eq('dni', profileData.dni);
              scoutData = repairData;
              console.log("¡Vínculo reparado con éxito para el DNI:", profileData.dni);
            }
          }

          if (scoutData) {
            const ramaRealFunc = `PROTAGONISTA_${scoutData.rama.toUpperCase()}`;
            
            // Forzamos la función correcta según su rama real
            if (!fPermitidas.includes(ramaRealFunc)) {
              fPermitidas = [ramaRealFunc];
              await supabase.from('profiles').update({ funciones: fPermitidas }).eq('id', userId);
            }
          }
        } else if (fPermitidas.includes(FUNCIONES.JEFE_GRUPO)) {
          fPermitidas = Object.values(FUNCIONES).filter(f => !f.startsWith('PROTAGONISTA_'));
        }

        setUser({ ...profileData, funciones: fPermitidas });
        setAvailableFunciones(fPermitidas);
        
        const saved = localStorage.getItem('user_tupahue_funcion');
        const funcionFinal = (profileData.role === ROLES.JOVEN) 
          ? fPermitidas[0] 
          : (saved && fPermitidas.includes(saved) ? saved : fPermitidas[0]);

        setUserFuncion(funcionFinal);
      }
    } catch (e) { 
      console.error("Error Auth:", e.message); 
    } finally { 
      setAuthLoading(false); 
    }
  }, []);

  useEffect(() => {
    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) await fetchUserProfile(session.user.id);
      else setAuthLoading(false);
    };
    check();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((ev, sess) => {
      if (sess && (ev === 'SIGNED_IN' || ev === 'USER_UPDATED')) fetchUserProfile(sess.user.id);
      else if (!sess) {
        setUser(null); setUserFuncion(null); setAvailableFunciones([]); setAuthLoading(false);
        localStorage.removeItem('user_tupahue_funcion');
      }
    });
    return () => subscription.unsubscribe();
  }, [fetchUserProfile]);

  const login = async (email, password) => {
    setAuthLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setAuthLoading(false); throw error; }
    if (data.user) await fetchUserProfile(data.user.id);
  };

  const register = async ({ email, password, dni, roleSolicitado, nombre, apellido, hijosDnis = [] }) => {
    setAuthLoading(true);
    try {
      let record = null;
      if (roleSolicitado === ROLES.JOVEN) {
        const { data } = await supabase.from('scouts').select('*').eq('dni', dni).maybeSingle();
        if (!data) throw new Error("DNI no está en nómina.");
        record = data;
      } else if (roleSolicitado === ROLES.EDUCADOR) {
        const { data } = await supabase.from('profiles').select('*').eq('dni', dni).maybeSingle();
        record = data;
      }

      const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });
      if (authError) throw authError;
      const uid = authData.user.id;

      let fIniciales = [roleSolicitado];
      if (roleSolicitado === ROLES.JOVEN && record) fIniciales = [`PROTAGONISTA_${record.rama.toUpperCase()}`];

      const perfil = {
        id: uid, dni, nombre: record?.nombre || nombre, apellido: record?.apellido || apellido,
        role: record?.role || roleSolicitado,
        funciones: (roleSolicitado === ROLES.FAMILIA || hijosDnis.length > 0) ? [...new Set([...(record?.funciones || []), ROLES.FAMILIA])] : fIniciales
      };

      if (roleSolicitado === ROLES.EDUCADOR) await supabase.from('profiles').delete().eq('dni', dni);
      await supabase.from('profiles').upsert([perfil]);
      
      // Intentamos el vínculo inicial
      if (roleSolicitado === ROLES.JOVEN) await supabase.from('scouts').update({ user_id: uid }).eq('dni', dni);
      if (hijosDnis.length > 0) await supabase.from('scouts').update({ padre_id: uid }).in('dni', hijosDnis);

      await fetchUserProfile(uid);
    } catch (e) { setAuthLoading(false); throw e; }
  };

  const logout = async () => { setAuthLoading(true); await supabase.auth.signOut(); };
  const switchRole = (f) => { setUserFuncion(f); localStorage.setItem('user_tupahue_funcion', f); };

  return <AuthContext.Provider value={{ user, userFuncion, availableFunciones, login, register, logout, switchRole, authLoading }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);