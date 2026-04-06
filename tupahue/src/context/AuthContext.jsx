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
        
        if (profileData.role === ROLES.FAMILIA && !fPermitidas.includes(ROLES.FAMILIA)) {
          fPermitidas.push(ROLES.FAMILIA);
        }

        if (profileData.role === ROLES.JOVEN) {
          let { data: scoutData } = await supabase
            .from('scouts')
            .select('rama, user_id, dni')
            .eq('user_id', userId)
            .maybeSingle();

          if (!scoutData && profileData.dni) {
            const { data: repairData } = await supabase
              .from('scouts')
              .select('rama, user_id, dni')
              .eq('dni', profileData.dni)
              .maybeSingle();
            
            if (repairData) {
              await supabase.from('scouts').update({ user_id: userId }).eq('dni', profileData.dni);
              scoutData = repairData;
            }
          }

          if (scoutData) {
            const ramaRealFunc = `PROTAGONISTA_${scoutData.rama.toUpperCase()}`;
            if (!fPermitidas.includes(ramaRealFunc)) {
              fPermitidas = [ramaRealFunc];
              await supabase.from('profiles').update({ funciones: fPermitidas }).eq('id', userId);
            }
          }
        } 
        else if (fPermitidas.includes(FUNCIONES.JEFE_GRUPO)) {
          const tieneFamilia = fPermitidas.includes(ROLES.FAMILIA);
          fPermitidas = Object.values(FUNCIONES).filter(f => !f.startsWith('PROTAGONISTA_'));
          if (tieneFamilia && !fPermitidas.includes(ROLES.FAMILIA)) fPermitidas.push(ROLES.FAMILIA);
        }

        setUser({ ...profileData, funciones: fPermitidas });
        setAvailableFunciones(fPermitidas);
        
        const saved = localStorage.getItem('user_tupahue_funcion');
        const funcionFinal = (saved && fPermitidas.includes(saved)) ? saved : fPermitidas[0];
        setUserFuncion(funcionFinal);
      }
    } catch (e) { 
      console.error("Error Auth:", e.message); 
    } finally { 
      setAuthLoading(false); 
    }
  }, []);

  const updateProfile = async (updates) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();
      
      if (error) throw error;
      setUser(prev => ({ ...prev, ...data }));
      return data;
    } catch (e) {
      console.error("Update Profile Error:", e.message);
      throw e;
    }
  };

  // 🎯 GESTIÓN DE SEGURIDAD (EMAIL Y PASSWORD)
  const updateEmail = async (newEmail) => {
    const { data, error } = await supabase.auth.updateUser({ email: newEmail });
    if (error) throw error;
    return data;
  };

  const updatePassword = async (newPassword) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw error;
  };

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
      const { data: existingProfile } = await supabase.from('profiles').select('*').eq('dni', dni).maybeSingle();
      
      if (roleSolicitado === ROLES.JOVEN) {
        const { data } = await supabase.from('scouts').select('*').eq('dni', dni).maybeSingle();
        if (!data) throw new Error("DNI no está en nómina.");
        record = data;
      }

      const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });
      if (authError) throw authError;
      const uid = authData.user.id;

      let fFinales = existingProfile?.funciones || [];
      if (roleSolicitado === ROLES.JOVEN && record) {
        fFinales.push(`PROTAGONISTA_${record.rama.toUpperCase()}`);
      } else if (roleSolicitado === ROLES.FAMILIA || hijosDnis.length > 0) {
        fFinales.push(ROLES.FAMILIA);
      } else {
        fFinales.push(roleSolicitado);
      }

      const perfil = {
        id: uid, 
        dni, 
        nombre: nombre || existingProfile?.nombre || record?.nombre, 
        apellido: apellido || existingProfile?.apellido || record?.apellido,
        role: existingProfile?.role || roleSolicitado,
        funciones: [...new Set(fFinales)]
      };

      if (existingProfile && existingProfile.id !== uid) {
        await supabase.from('profiles').delete().eq('id', existingProfile.id);
      }

      await supabase.from('profiles').upsert([perfil]);
      if (roleSolicitado === ROLES.JOVEN) await supabase.from('scouts').update({ user_id: uid }).eq('dni', dni);
      if (hijosDnis.length > 0) await supabase.from('scouts').update({ padre_id: uid }).in('dni', hijosDnis);

      await fetchUserProfile(uid);
    } catch (e) { setAuthLoading(false); throw e; }
  };

  const logout = async () => { setAuthLoading(true); await supabase.auth.signOut(); };
  const switchRole = (f) => { setUserFuncion(f); localStorage.setItem('user_tupahue_funcion', f); };

  return (
    <AuthContext.Provider value={{ 
      user, userFuncion, availableFunciones, 
      login, register, logout, switchRole, 
      updateProfile, updateEmail, updatePassword, // 🎯 Exportamos todo
      authLoading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);