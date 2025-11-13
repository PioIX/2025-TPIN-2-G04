// models/Move.js
const { realizarQuery } = require("../modulos/mysql");

class Move {
  constructor(id, game_id, player_id, move_notation, move_number, created_at) {
    this.id = id;
    this.game_id = game_id;
    this.player_id = player_id;
    this.move_notation = move_notation;
    this.move_number = move_number;
    this.created_at = created_at;
  }

  // Registrar movimiento
  static async create(game_id, player_id, move_notation, move_number) {
    const query = `
      INSERT INTO moves (game_id, player_id, move_notation, move_number)
      VALUES (?, ?, ?, ?)
    `;
    return await realizarQuery(query, [game_id, player_id, move_notation, move_number]);
  }

  // Obtener todos los movimientos de una partida
  static async getByGame(game_id) {
    const query = `
      SELECT * FROM moves 
      WHERE game_id = ? 
      ORDER BY move_number ASC
    `;
    return await realizarQuery(query, [game_id]);
  }

  // Obtener último movimiento de una partida
  static async getLastMove(game_id) {
    const query = `
      SELECT * FROM moves 
      WHERE game_id = ? 
      ORDER BY move_number DESC 
      LIMIT 1
    `;
    const result = await realizarQuery(query, [game_id]);
    return result[0];
  }

  // Contar movimientos de una partida
  static async countByGame(game_id) {
    const query = `
      SELECT COUNT(*) as total 
      FROM moves 
      WHERE game_id = ?
    `;
    const result = await realizarQuery(query, [game_id]);
    return result[0].total;
  }
}

module.exports = Move;