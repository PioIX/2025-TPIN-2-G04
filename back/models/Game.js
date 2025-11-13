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
      VALUES (?, 'waiting')
    `;
    return await realizarQuery(query, [player1_id]);
  }

  // Unirse a una partida
  static async join(game_id, player2_id) {
    const query = `
      UPDATE games
      SET player2_id = ?, status = 'ongoing'
      WHERE id = ? AND status = 'waiting'
    `;
    return await realizarQuery(query, [player2_id, game_id]);
  }

  // Finalizar partida
  static async finish(game_id, winner_id) {
    const query = `
      UPDATE games
      SET status = 'finished', winner_id = ?
      WHERE id = ?
    `;
    return await realizarQuery(query, [winner_id, game_id]);
  }

  // Obtener partida por ID
  static async findById(id) {
    const query = `SELECT * FROM games WHERE id = ? LIMIT 1`;
    const result = await realizarQuery(query, [id]);
    return result[0];
  }

  // Obtener todas las partidas disponibles
  static async getAvailable() {
    const query = `SELECT * FROM games WHERE status = 'waiting'`;
    return await realizarQuery(query);
  }

  // Obtener todas las partidas
  static async getAll() {
    const query = `SELECT * FROM games ORDER BY created_at DESC`;
    return await realizarQuery(query);
  }

  // Obtener partidas de un usuario
  static async getByUser(userId) {
    const query = `
      SELECT * FROM games 
      WHERE player1_id = ? OR player2_id = ?
      ORDER BY created_at DESC
    `;
    return await realizarQuery(query, [userId, userId]);
  }
}

module.exports = Game;
