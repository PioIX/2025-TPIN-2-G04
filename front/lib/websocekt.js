// lib/websocket.js
import io from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';

let socket = null;

/**
 * Conectar al servidor WebSocket
 */
export const connectSocket = () => {
  if (!socket || !socket.connected) {
    socket = io(SOCKET_URL, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });

    socket.on('connect', () => {
      console.log('✅ Conectado al servidor WebSocket');
    });

    socket.on('disconnect', () => {
      console.log('❌ Desconectado del servidor WebSocket');
    });

    socket.on('connect_error', (error) => {
      console.error('❌ Error de conexión:', error);
    });
  }

  return socket;
};

/**
 * Obtener instancia del socket
 */
export const getSocket = () => {
  if (!socket) {
    return connectSocket();
  }
  return socket;
};

/**
 * Unirse a una partida
 */
export const joinGame = (gameId) => {
  const socket = getSocket();
  socket.emit('joinGame', gameId);
};

/**
 * Abandonar una partida
 */
export const leaveGame = (gameId) => {
  const socket = getSocket();
  socket.emit('leaveGame', gameId);
};

/**
 * Enviar movimiento
 */
export const sendMove = (gameId, move, player, moveNotation) => {
  const socket = getSocket();
  socket.emit('move', {
    gameId,
    move,
    player,
    moveNotation
  });
};

/**
 * Enviar mensaje de chat
 */
export const sendChatMessage = (gameId, player, message) => {
  const socket = getSocket();
  socket.emit('chatMessage', {
    gameId,
    player,
    message
  });
};

/**
 * Escuchar movimientos
 */
export const onMove = (callback) => {
  const socket = getSocket();
  socket.on('move', callback);
};

/**
 * Escuchar jugador que se une
 */
export const onPlayerJoined = (callback) => {
  const socket = getSocket();
  socket.on('playerJoined', callback);
};

/**
 * Escuchar jugador que se va
 */
export const onPlayerLeft = (callback) => {
  const socket = getSocket();
  socket.on('playerLeft', callback);
};

/**
 * Escuchar mensajes de chat
 */
export const onChatMessage = (callback) => {
  const socket = getSocket();
  socket.on('chatMessage', callback);
};

/**
 * Remover listeners
 */
export const removeListener = (event) => {
  const socket = getSocket();
  socket.off(event);
};

/**
 * Desconectar socket
 */
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export default {
  connectSocket,
  getSocket,
  joinGame,
  leaveGame,
  sendMove,
  sendChatMessage,
  onMove,
  onPlayerJoined,
  onPlayerLeft,
  onChatMessage,
  removeListener,
  disconnectSocket
};