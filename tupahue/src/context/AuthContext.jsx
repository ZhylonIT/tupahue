import { createContext, useContext, useState, useEffect } from 'react';
import { FUNCIONES, ROLES } from '../constants/auth';

const AuthContext = createContext();

// Usuario de desarrollo para que no se te quede en blanco
const USER_DEV = { 
  nombre: "Arturo", 
  apellido: "Admin", 
  role: 'ADMIN', // Al ser ADMIN, el useEffect le dará todas las funciones
  rol: ROLES.EDUCADOR,
  funciones: [FUNCIONES.JEFE_GRUPO, FUNCIONES.ASISTENTE_ADULTOS, FUNCIONES.CAMINANTES] 
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userFuncion, setUserFuncion] = useState(null);
  const [availableFunciones, setAvailableFunciones] = useState([]);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user_tupahue');
    const savedFuncion = localStorage.getItem('user_funcion_activa');

    // Si no hay usuario guardado, cargamos el de desarrollo para no romper la vista
    const userData = savedUser ? JSON.parse(savedUser) : USER_DEV;
    
    setUser(userData);
    
    // Definir funciones permitidas
    const funcionesPermitidas = userData.role === 'ADMIN' 
      ? Object.values(FUNCIONES).filter(f => !f.startsWith('PROTAGONISTA_'))
      : (userData.funciones || [userData.role]);
    
    setAvailableFunciones(funcionesPermitidas);
    
    // Prioridad: 1. Función guardada, 2. Función del objeto, 3. Primera de la lista
    const funcionInicial = savedFuncion || userData.funcion || funcionesPermitidas[0];
    setUserFuncion(funcionInicial);
    
    setAuthLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    const funcionesPermitidas = userData.role === 'ADMIN' 
      ? Object.values(FUNCIONES).filter(f => !f.startsWith('PROTAGONISTA_'))
      : (userData.funciones || [userData.role]);
      
    const funcionInicial = funcionesPermitidas[0];
    setAvailableFunciones(funcionesPermitidas);
    setUserFuncion(funcionInicial);

    localStorage.setItem('user_tupahue', JSON.stringify(userData));
    localStorage.setItem('user_funcion_activa', funcionInicial);
  };

  const switchRole = (nuevaFuncion) => {
    setUserFuncion(nuevaFuncion);
    localStorage.setItem('user_funcion_activa', nuevaFuncion);
  };

  const logout = () => {
    setUser(null);
    setUserFuncion(null);
    setAvailableFunciones([]);
    localStorage.removeItem('user_tupahue');
    localStorage.removeItem('user_funcion_activa');
    // Opcional: limpiar todo para desarrollo
    localStorage.clear(); 
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      userFuncion, 
      availableFunciones, 
      login, 
      logout, 
      switchRole, 
      authLoading 
    }}>
      {!authLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);