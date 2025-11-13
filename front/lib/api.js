// lib/api.js
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

/**
 * Obtiene el token del localStorage
 */
const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

/**
 * Headers con autenticación
 */
const getAuthHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

/**
 * Manejo centralizado de errores
 */
const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    // Si es 401, redirigir al login
    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    throw new Error(data.message || 'Error en la petición');
  }
  
  return data;
};

// ========== USUARIOS ==========

export const userAPI = {
  // Registrar usuario
  register: async (username, email, password) => {
    const response = await fetch(`${API_URL}/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });
    return handleResponse(response);
  },

  // Login
  login: async (email, password) => {
    const response = await fetch(`${API_URL}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await handleResponse(response);
    
    // Guardar token y usuario
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    
    return data;
  },

  // Obtener perfil
  getProfile: async () => {
    const response = await fetch(`${API_URL}/users/profile`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Obtener todos los usuarios
  getAll: async () => {
    const response = await fetch(`${API_URL}/users`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Actualizar usuario
  update: async (id, username, email) => {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ username, email })
    });
    return handleResponse(response);
  },

  // Eliminar usuario
  delete: async (id) => {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
};

// ========== PARTIDAS ==========

export const gameAPI = {
  // Crear partida
  create: async () => {
    const response = await fetch(`${API_URL}/games/create`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Unirse a partida
  join: async (gameId) => {
    const response = await fetch(`${API_URL}/games/join/${gameId}`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Finalizar partida
  finish: async (gameId, winnerId) => {
    const response = await fetch(`${API_URL}/games/finish`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ game_id: gameId, winner_id: winnerId })
    });
    return handleResponse(response);
  },

  // Obtener partidas disponibles
  getAvailable: async () => {
    const response = await fetch(`${API_URL}/games/available`);
    return handleResponse(response);
  },

  // Obtener partida por ID
  getById: async (id) => {
    const response = await fetch(`${API_URL}/games/${id}`);
    return handleResponse(response);
  },

  // Obtener todas las partidas
  getAll: async () => {
    const response = await fetch(`${API_URL}/games`);
    return handleResponse(response);
  },

  // Obtener partidas del usuario
  getMyGames: async () => {
    const response = await fetch(`${API_URL}/games/user/me`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

// ========== MOVIMIENTOS ==========

export const moveAPI = {
  // Agregar movimiento
  add: async (gameId, moveNotation, moveNumber) => {
    const response = await fetch(`${API_URL}/moves/add`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ 
        game_id: gameId, 
        move_notation: moveNotation, 
        move_number: moveNumber 
      })
    });
    return handleResponse(response);
  },

  // Obtener movimientos de una partida
  getByGame: async (gameId) => {
    const response = await fetch(`${API_URL}/moves/${gameId}`);
    return handleResponse(response);
  },

  // Obtener último movimiento
  getLastMove: async (gameId) => {
    const response = await fetch(`${API_URL}/moves/${gameId}/last`);
    return handleResponse(response);
  }
};

export default { userAPI, gameAPI, moveAPI };