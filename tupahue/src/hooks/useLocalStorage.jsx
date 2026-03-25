import { useState, useEffect } from 'react';

export const useLocalStorage = (key, initialValue) => {
  // 1. Intentamos obtener los datos guardados al iniciar
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      // Si existe, lo parseamos (JSON); si no, usamos el valor inicial
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error("Error leyendo localStorage:", error);
      return initialValue;
    }
  });

  // 2. Cada vez que el estado cambie, lo guardamos automáticamente
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error("Error guardando en localStorage:", error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
};