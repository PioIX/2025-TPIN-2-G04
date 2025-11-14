// socket.js
import { io } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001";

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5
});

// Eventos de conexión para debugging
socket.on("connect", () => {
  console.log("✅ Conectado al servidor WebSocket");
});

socket.on("disconnect", () => {
  console.log("❌ Desconectado del servidor WebSocket");
});

socket.on("error", (error) => {
  console.error("❌ Error en WebSocket:", error);
});