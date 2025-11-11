// models/Game.js
const { realizarQuery } = require("../modulos/mysql");

class Game {
  constructor(id, player1_id, player2_id, status, winner_id, created_at) {
    this.id = id;
    this.player1_id = player1_id;
    this.player2_id = player2_id;
    this.status = status;
    this.winner_id = winner_id;
    this.created_at = created_at;
  }

  // Crear nueva partida
  static async create(player1_id) {
    const query = `
      INSERT INTO games (player1_id, status)
      VALUES (${player1_id}, 'waiting');
    `;
    return await realizarQuery(query);
  }

  // Unirse a una partida
  static async join(game_id, player2_id) {
    const query = `
      UPDATE games
      SET player2_id=${player2_id}, status='ongoing'
      WHERE id=${game_id} AND status='waiting';
    `;
    return await realizarQuery(query);
  }

  // Finalizar partida
  static async finish(game_id, winner_id) {
    const query = `
      UPDATE games
      SET status='finished', winner_id=${winner_id}
      WHERE id=${game_id};
    `;
    return await realizarQuery(query);
  }

  // Obtener partida por ID
  static async findById(id) {
    const query = `SELECT * FROM games WHERE id=${id} LIMIT 1;`;
    const result = await realizarQuery(query);
    return result[0];
  }

  // Obtener todas las partidas disponibles
  static async getAvailable() {
    return await realizarQuery(`SELECT * FROM games WHERE status='waiting';`);
  }
}

module.exports = Game;
