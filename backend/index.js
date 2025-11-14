// backend/index.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { createServer } = require("http");
const { Server } = require("socket.io");

dotenv.config();

const app = express();

// Middlewares
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:3000" }));
app.use(express.json());

// Rutas
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/games", require("./routes/gameRoutes"));

// Servidor HTTP
const httpServer = createServer(app);

// Servidor WebSocket
const io = new Server(httpServer, {
  cors: { origin: "*" }
});

// Configuración de sockets
require("./socket")(io);

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`✅ Backend escuchando en http://localhost:${PORT}`);
});
