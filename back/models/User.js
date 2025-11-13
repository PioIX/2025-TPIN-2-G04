// models/User.js
const { realizarQuery } = require("../modulos/mysql");

class User {
  constructor(id, username, email, password_hash, created_at) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password_hash = password_hash;
    this.created_at = created_at;
  }

  // Crear usuario nuevo
  static async create(username, email, password_hash) {
    const query = `
      INSERT INTO users (username, email, password_hash)
      VALUES (?, ?, ?)
    `;
    return await realizarQuery(query, [username, email, password_hash]);
  }

  // Buscar usuario por email
  static async findByEmail(email) {
    const query = `SELECT * FROM users WHERE email = ? LIMIT 1`;
    const result = await realizarQuery(query, [email]);
    return result[0];
  }

  // Buscar usuario por ID
  static async findById(id) {
    const query = `SELECT * FROM users WHERE id = ? LIMIT 1`;
    const result = await realizarQuery(query, [id]);
    return result[0];
  }

  // Leer todos los usuarios
  static async getAll() {
    const query = `SELECT id, username, email, created_at FROM users`;
    return await realizarQuery(query);
  }

  // Actualizar usuario
  static async update(id, username, email) {
    const query = `
      UPDATE users
      SET username = ?, email = ?
      WHERE id = ?
    `;
    return await realizarQuery(query, [username, email, id]);
  }

  // Eliminar usuario
  static async delete(id) {
    const query = `DELETE FROM users WHERE id = ?`;
    return await realizarQuery(query, [id]);
  }
}

module.exports = User;