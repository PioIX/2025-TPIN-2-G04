class Game {
  constructor(id, player1) {
    this.id = id;
    this.player1 = player1; // usuario real
    this.player2 = null;
    this.estado = "esperando";
    this.turno = "white";
    this.tablero = this.tableroInicial();
  }

  tableroInicial() {
    return [
      ["r","n","b","q","k","b","n","r"],
      ["p","p","p","p","p","p","p","p"],
      ["","","","","","","",""],
      ["","","","","","","",""],
      ["","","","","","","",""],
      ["","","","","","","",""],
      ["P","P","P","P","P","P","P","P"],
      ["R","N","B","Q","K","B","N","R"]
    ];
  }

  unirse(player2) {
    if (!this.player2) {
      this.player2 = player2;
      this.estado = "jugando";
      return true;
    }
    return false;
  }

  cambiarTurno() {
    this.turno = this.turno === "white" ? "black" : "white";
  }

  mover(from, to) {
    const pieza = this.tablero[from.fila][from.col];
    this.tablero[to.fila][to.col] = pieza;
    this.tablero[from.fila][from.col] = "";
    this.cambiarTurno();
  }

  infoPublica() {
    return {
      id: this.id,
      player1: this.player1,
      player2: this.player2,
      estado: this.estado
    };
  }
}

class GameManager {
  constructor() {
    this.games = new Map();
  }

  generarIdPartida() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2,6);
  }

  crearPartida(player1) {
    const id = this.generarIdPartida();
    const game = new Game(id, player1);
    this.games.set(id, game);
    return game;
  }

  obtenerPartida(id) {
    return this.games.get(id);
  }

  obtenerTodasPartidas() {
    return Array.from(this.games.values()).map(g => g.infoPublica());
  }

  limpiarPartidas() {
    this.games.clear();
  }
}

module.exports = new GameManager();