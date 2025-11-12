// index.js
require("dotenv").config({ path: ".env" });
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
app.use(cors());
app.use(express.json());

// 🔹 RUTAS PRINCIPALES
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/games", require("./routes/gameRoutes"));
app.use("/api/moves", require("./routes/moveRoutes"));

// 🔹 Servidor HTTP + WebSocket
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // front (Next.js)
    methods: ["GET", "POST"]
  }
});

// 🔹 Escucha de conexiones
io.on("connection", (socket) => {
  console.log(`🟢 Usuario conectado: ${socket.id}`);

  // Crear una sala para un juego
  socket.on("joinGame", (gameId) => {
    socket.join(gameId);
    console.log(`Jugador ${socket.id} se unió a la partida ${gameId}`);
  });

  // Movimiento del jugador
  socket.on("move", (data) => {
    // data = { gameId, move, player }
    console.log(`♟️ Movimiento en partida ${data.gameId}: ${data.move}`);

    // Enviar el movimiento al oponente en esa sala
    io.to(data.gameId).emit("move", data);
  });

  // Abandonar partida
  socket.on("leaveGame", (gameId) => {
    socket.leave(gameId);
    console.log(`Jugador ${socket.id} salió de la partida ${gameId}`);
  });

  // Desconexión
  socket.on("disconnect", () => {
    console.log(`🔴 Usuario desconectado: ${socket.id}`);
  });
});

// 🔹 Servidor Express + Socket.IO
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`✅ Servidor backend corriendo en http://localhost:${PORT}`);
});
