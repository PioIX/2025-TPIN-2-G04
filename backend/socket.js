const gameManager = require("./modulos/gameManager");

function configurarSockets(io) {
  io.on("connection", (socket) => {
    console.log("🟢 Usuario conectado:", socket.id);

    socket.emit("partidas_update", gameManager.obtenerTodasPartidas());

    socket.on("crear_partida", ({ user }) => {
      const partida = gameManager.crearPartida(user);
      io.emit("partidas_update", gameManager.obtenerTodasPartidas());
      socket.emit("partida_creada", partida);
    });

    socket.on("join_game", ({ partidaId, user }) => {
      const game = gameManager.obtenerPartida(partidaId);
      if (!game) return socket.emit("error", "La partida no existe.");

      if (game.unirse(user)) {
        socket.join(`game_${partidaId}`);
        io.to(`game_${partidaId}`).emit("game_update", {
          estado: game.estado,
          player1: game.player1,
          player2: game.player2,
          tablero: game.tablero,
          turno: game.turno
        });
        io.emit("partidas_update", gameManager.obtenerTodasPartidas());
      } else {
        socket.emit("error", "La partida ya está llena.");
      }
    });

    socket.on("limpiar_partidas", () => {
      gameManager.limpiarPartidas();
      io.emit("partidas_update", gameManager.obtenerTodasPartidas());
    });

    socket.on("move", ({ partidaId, from, to }) => {
      const game = gameManager.obtenerPartida(partidaId);
      if (!game) return;
      game.mover(from, to);
      io.to(`game_${partidaId}`).emit("move", {
        tablero: game.tablero,
        turno: game.turno,
        from,
        to
      });
    });

    socket.on("disconnect", () => {
      console.log("🔴 Usuario desconectado:", socket.id);
    });
  });
}

module.exports = configurarSockets;