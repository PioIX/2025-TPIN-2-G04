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
      VALUES (${game_id}, ${player_id}, '${move_notation}', ${move_number});
    `;
    return await realizarQuery(query);
  }

  // Obtener todos los movimientos de una partida
  static async getByGame(game_id) {
    const query = `
      SELECT * FROM moves WHERE game_id=${game_id} ORDER BY move_number ASC;
    `;
    return await realizarQuery(query);
  }
}

module.exports = Move;
