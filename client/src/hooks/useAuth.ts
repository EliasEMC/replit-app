import { useState, useEffect } from 'react';

interface AuthState {
  token: string | null;
  user: {
    id: number;
    username: string;
  } | null;
}

export function useAuth() {
  const [auth, setAuth] = useState<AuthState>({
    token: null,
    user: null
  });

  useEffect(() => {
    // Recuperar el token del localStorage
    const token = localStorage.getItem('token');
    if (token) {
      // Decodificar el token para obtener la información del usuario
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setAuth({
          token,
          user: {
            id: payload.id,
            username: payload.username
          }
        });
      } catch (error) {
        console.error('Error decoding token:', error);
        localStorage.removeItem('token');
      }
    }
  }, []);

  const login = (token: string) => {
    localStorage.setItem('token', token);
    const payload = JSON.parse(atob(token.split('.')[1]));
    setAuth({
      token,
      user: {
        id: payload.id,
        username: payload.username
      }
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuth({
      token: null,
      user: null
    });
  };

  return {
    ...auth,
    login,
    logout
  };
} 