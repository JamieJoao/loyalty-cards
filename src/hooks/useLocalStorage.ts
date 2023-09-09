import { useState, useEffect } from 'react'

export const useLocalStorage = (key: string, initialValue: string) => {
  const [storedValue, setStoredValue] = useState(() => {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  });

  // Función para actualizar el valor en el localStorage y el estado local.
  const setValue = (value: string) => {
    // Actualizamos el estado local.
    setStoredValue(value);
    // Actualizamos el localStorage.
    window.localStorage.setItem(key, JSON.stringify(value));
  };

  useEffect(() => {
    // Función que se ejecuta cuando cambia el evento 'storage' en el localStorage.
    const handleStorageChange = (e: any) => {
      if (e.key === key) {
        // Si la clave coincide con la que estamos escuchando, actualizamos el estado local.
        setStoredValue(JSON.parse(e.newValue));
      }
    };

    // Agregamos un event listener para el evento 'storage'.
    window.addEventListener('storage', handleStorageChange);

    return () => {
      // Removemos el event listener cuando el componente se desmonta.
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key]);

  return [storedValue, setValue];
}