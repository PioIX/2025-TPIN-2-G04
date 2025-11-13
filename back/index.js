// index.js
require("dotenv").config({ path: ".env" });
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();

// 🔹 MIDDLEWARES
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));
app.use(express.json());

// 🔹 RUTAS PRINCIPALES
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/games", require("./routes/gameRoutes"));
app.use("/api/moves", require("./routes/moveRoutes"));

// 🔹 Ruta de prueba
app.get("/", (req, res) => {
  res.json({ 
    message: "🎮 API de Ajedrez funcionando correctamente",
    version: "1.0.0",
    endpoints: {
      users: "/api/users",
      games: "/api/games",
      moves: "/api/moves"
    }
  });
});

// 🔹 Servidor HTTP + WebSocket
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// 🔹 Almacenar salas activas
const activeRooms = new Map();

// 🔹 WebSocket - Escucha de conexiones
io.on("connection", (socket) => {
  console.log(`🟢 Usuario conectado: ${socket.id}`);

  // Unirse a una sala de juego
  socket.on("joinGame", (gameId) => {
    socket.join(gameId);
    
    // Actualizar información de la sala
    if (!activeRooms.has(gameId)) {
      activeRooms.set(gameId, { players: [] });
    }
    
    const room = activeRooms.get(gameId);
    room.players.push(socket.id);
    
    console.log(`♟️ Jugador ${socket.id} se unió a la partida ${gameId}`);
    
    // Notificar a todos en la sala
    io.to(gameId).emit("playerJoined", {
      socketId: socket.id,
      playersCount: room.players.length
    });
  });

  // Movimiento del jugador
  socket.on("move", (data) => {
    console.log(`♟ Movimiento en partida ${data.gameId}: ${data.move}`);
    
    // Enviar el movimiento a todos en la sala EXCEPTO al que lo envió
    socket.to(data.gameId).emit("move", {
      move: data.move,
      player: data.player,
      moveNotation: data.moveNotation,
      timestamp: new Date().toISOString()
    });
  });

  // Mensaje de chat en la partida
  socket.on("chatMessage", (data) => {
    io.to(data.gameId).emit("chatMessage", {
      player: data.player,
      message: data.message,
      timestamp: new Date().toISOString()
    });
  });

  // Abandonar partida
  socket.on("leaveGame", (gameId) => {
    socket.leave(gameId);
    
    // Actualizar información de la sala
    if (activeRooms.has(gameId)) {
      const room = activeRooms.get(gameId);
      room.players = room.players.filter(id => id !== socket.id);
      
      if (room.players.length === 0) {
        activeRooms.delete(gameId);
      }
    }
    
    console.log(`🚪 Jugador ${socket.id} salió de la partida ${gameId}`);
    
    // Notificar a los demás
    io.to(gameId).emit("playerLeft", { socketId: socket.id });
  });

  // Desconexión
  socket.on("disconnect", () => {
    console.log(`🔴 Usuario desconectado: ${socket.id}`);
    
    // Remover de todas las salas
    activeRooms.forEach((room, gameId) => {
      if (room.players.includes(socket.id)) {
        room.players = room.players.filter(id => id !== socket.id);
        io.to(gameId).emit("playerLeft", { socketId: socket.id });
        
        if (room.players.length === 0) {
          activeRooms.delete(gameId);
        }
      }
    });
  });
});

// 🔹 Manejo de errores global
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.stack);
  res.status(500).json({ 
    message: "Error interno del servidor",
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 🔹 Iniciar servidor
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`✅ Servidor backend corriendo en http://localhost:${PORT}`);
  console.log(`🌐 Frontend esperado en: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  console.log(`🔌 WebSockets habilitados`);
});

// 🔹 Cerrar conexiones al cerrar el servidor
process.on('SIGTERM', () => {
  console.log('⚠️ SIGTERM recibido. Cerrando servidor...');
  server.close(() => {
    console.log('✅ Servidor cerrado correctamente');
    process.exit(0);
  });
});