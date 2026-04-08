import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { FUNCIONES, ROLES } from '../constants/auth';

const AuthContext = createContext();

const sanitizeDni = (val) => String(val || '').replace(/\D/g, '').trim();

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
        const cleanDni = sanitizeDni(profileData.dni);

        // --- LÓGICA DE REPARACIÓN Y VÍNCULO (JOVEN O EDUCADOR) ---
        
        // 1. Caso Joven
        if (profileData.role === ROLES.JOVEN) {
          let { data: scoutData } = await supabase
            .from('scouts')
            .select('rama, user_id, dni')
            .eq('user_id', userId)
            .maybeSingle();

          if (!scoutData && cleanDni) {
            const { data: repairData } = await supabase
              .from('scouts')
              .select('rama, user_id, dni')
              .ilike('dni', `%${cleanDni}%`)
              .maybeSingle();
            
            if (repairData) {
              await supabase.from('scouts').update({ user_id: userId }).eq('dni', repairData.dni);
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
        
        // 2. Caso Educador (Reparar vínculo con tabla adultos)
        if (profileData.role === ROLES.EDUCADOR) {
          const { data: adultoNomina } = await supabase
            .from('adultos')
            .select('user_id, funciones')
            .eq('dni', cleanDni)
            .maybeSingle();
          
          if (adultoNomina && !adultoNomina.user_id) {
            await supabase.from('adultos').update({ user_id: userId }).eq('dni', cleanDni);
            if (adultoNomina.funciones?.length > 0) {
              fPermitidas = [...new Set([...fPermitidas, ...adultoNomina.funciones])];
              await supabase.from('profiles').update({ funciones: fPermitidas }).eq('id', userId);
            }
          }
        }

        if (profileData.role === ROLES.FAMILIA && !fPermitidas.includes(ROLES.FAMILIA)) {
          fPermitidas.push(ROLES.FAMILIA);
        }

        if (fPermitidas.includes(FUNCIONES.JEFE_GRUPO)) {
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
      console.error("Error Fetch Profile:", e.message); 
    } finally { 
      setAuthLoading(false); 
    }
  }, []);

  const register = async ({ email, password, dni, roleSolicitado, nombre, apellido, hijosDnis = [] }) => {
    setAuthLoading(true);
    const cleanDni = sanitizeDni(dni);
    try {
      let nominaRecord = null;
      if (roleSolicitado === ROLES.JOVEN) {
        const { data } = await supabase.from('scouts').select('*').ilike('dni', `%${cleanDni}%`).maybeSingle();
        if (!data) throw new Error(`DNI ${cleanDni} no encontrado en la nómina de Jóvenes.`);
        nominaRecord = data;
      } else if (roleSolicitado === ROLES.EDUCADOR) {
        const { data } = await supabase.from('adultos').select('*').ilike('dni', `%${cleanDni}%`).maybeSingle();
        if (!data) throw new Error(`DNI ${cleanDni} no encontrado en la nómina de Adultos.`);
        nominaRecord = data;
      }

      const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });
      if (authError) throw authError;
      const uid = authData.user.id;

      let fFinales = [];
      if (roleSolicitado === ROLES.JOVEN && nominaRecord) {
        fFinales.push(`PROTAGONISTA_${nominaRecord.rama.toUpperCase()}`);
      } else if (roleSolicitado === ROLES.EDUCADOR && nominaRecord) {
        fFinales = nominaRecord.funciones || [ROLES.EDUCADOR];
      } else if (roleSolicitado === ROLES.FAMILIA || hijosDnis.length > 0) {
        fFinales.push(ROLES.FAMILIA);
      } else {
        fFinales.push(roleSolicitado);
      }

      const perfil = { id: uid, dni: cleanDni, nombre: nombre || nominaRecord?.nombre || "", apellido: apellido || nominaRecord?.apellido || "", role: roleSolicitado, funciones: [...new Set(fFinales)] };
      await supabase.from('profiles').upsert(perfil);

      if (roleSolicitado === ROLES.JOVEN) await supabase.from('scouts').update({ user_id: uid }).eq('dni', cleanDni);
      else if (roleSolicitado === ROLES.EDUCADOR) await supabase.from('adultos').update({ user_id: uid }).eq('dni', cleanDni);

      if (hijosDnis.length > 0) {
        for (const hDni of hijosDnis) {
          const cHDni = sanitizeDni(hDni);
          await supabase.from('scouts').update({ padre_id: uid }).eq('dni', cHDni);
        }
      }
      await fetchUserProfile(uid);
    } catch (e) { setAuthLoading(false); throw e; }
  };

  const login = async (email, password) => {
    setAuthLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setAuthLoading(false); throw error; }
    if (data.user) await fetchUserProfile(data.user.id);
  };

  const logout = async () => { setAuthLoading(true); await supabase.auth.signOut(); };
  const switchRole = (f) => { setUserFuncion(f); localStorage.setItem('user_tupahue_funcion', f); };
  
  const updateProfile = async (updates) => {
    const { data, error } = await supabase.from('profiles').update(updates).eq('id', user.id).select().single();
    if (error) throw error;
    setUser(prev => ({ ...prev, ...data }));
    return data;
  };

  // 🎯 MOTOR DE ARRANQUE (Clave para el Refresh)
  useEffect(() => {
    const checkSession = async () => {
      setAuthLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (session) await fetchUserProfile(session.user.id);
      else setAuthLoading(false);
    };
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((ev, sess) => {
      if (sess && ev === 'SIGNED_IN') fetchUserProfile(sess.user.id);
      else if (!sess) {
        setUser(null); setUserFuncion(null); setAvailableFunciones([]); setAuthLoading(false);
        localStorage.removeItem('user_tupahue_funcion');
      }
    });
    return () => subscription.unsubscribe();
  }, [fetchUserProfile]);

  return (
    <AuthContext.Provider value={{ user, userFuncion, availableFunciones, login, register, logout, switchRole, updateProfile, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);