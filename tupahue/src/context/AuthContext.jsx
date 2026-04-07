import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { FUNCIONES, ROLES } from '../constants/auth';

const AuthContext = createContext();

// Limpieza absoluta de DNI
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
            const cleanDni = sanitizeDni(profileData.dni);
            // Intento de reparación con búsqueda flexible
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
      console.error("Error Fetch Profile:", e.message); 
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
    const cleanDni = sanitizeDni(dni);

    try {
      let scoutRecord = null;
      
      if (roleSolicitado === ROLES.JOVEN) {
        // 1. Diagnóstico: ¿La tabla scouts tiene activado RLS? 
        // Si RLS está activo y no hay una política que permita leer a usuarios anónimos, nomadData siempre será null.
        const { data: nomadData, error: nomadError } = await supabase
          .from('scouts')
          .select('*')
          .ilike('dni', `%${cleanDni}%`)
          .maybeSingle();
        
        if (nomadError) throw nomadError;

        // SEGUNDO INTENTO: Si falló, probamos traer TODOS los scouts para ver si la tabla es legible
        if (!nomadData) {
          const { data: allScouts } = await supabase.from('scouts').select('dni').limit(5);
          console.log("Muestra de tabla scouts (¿es legible?):", allScouts);
          
          throw new Error(`DNI ${cleanDni} no encontrado. Si estás seguro de que existe, verificá las políticas RLS en Supabase.`);
        }
        
        scoutRecord = nomadData;
      }

      // 2. Crear usuario en Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });
      if (authError) throw authError;
      const uid = authData.user.id;

      // 3. Determinar funciones
      let fFinales = [];
      if (roleSolicitado === ROLES.JOVEN && scoutRecord) {
        fFinales.push(`PROTAGONISTA_${scoutRecord.rama.toUpperCase()}`);
      } else if (roleSolicitado === ROLES.FAMILIA || hijosDnis.length > 0) {
        fFinales.push(ROLES.FAMILIA);
      } else {
        fFinales.push(roleSolicitado);
      }

      // 4. Upsert Perfil
      const perfil = {
        id: uid, 
        dni: cleanDni, 
        nombre: nombre || scoutRecord?.nombre || "", 
        apellido: apellido || scoutRecord?.apellido || "",
        role: roleSolicitado,
        funciones: [...new Set(fFinales)]
      };

      await supabase.from('profiles').upsert(perfil);

      // 5. Vincular
      if (roleSolicitado === ROLES.JOVEN && scoutRecord) {
        await supabase.from('scouts').update({ user_id: uid }).eq('dni', scoutRecord.dni);
      }

      if (hijosDnis.length > 0) {
        for (const hDni of hijosDnis) {
          const cHDni = sanitizeDni(hDni);
          const { data: hData } = await supabase.from('scouts').select('dni').ilike('dni', `%${cHDni}%`).maybeSingle();
          if (hData) await supabase.from('scouts').update({ padre_id: uid }).eq('dni', hData.dni);
        }
      }

      await fetchUserProfile(uid);
    } catch (e) { 
      setAuthLoading(false); 
      throw e; 
    }
  };

  const logout = async () => { setAuthLoading(true); await supabase.auth.signOut(); };
  const switchRole = (f) => { setUserFuncion(f); localStorage.setItem('user_tupahue_funcion', f); };

  return (
    <AuthContext.Provider value={{ 
      user, userFuncion, availableFunciones, 
      login, register, logout, switchRole, 
      updateProfile, updateEmail, updatePassword,
      authLoading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);