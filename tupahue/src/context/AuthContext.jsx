import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Al cargar la app, verificamos si ya había una sesión guardada
  useEffect(() => {
    const savedUser = localStorage.getItem('user_tupahue');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setAuthLoading(false);
  }, []);

  // Función para Loguearse
  const login = (userData) => {
    // userData vendrá con: { email: '...', role: 'comunicaciones', name: '...' }
    setUser(userData);
    localStorage.setItem('user_tupahue', JSON.stringify(userData));
  };

  // Función para Cerrar Sesión
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user_tupahue');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto más fácil
export const useAuth = () => useContext(AuthContext);