// modulos/mysql.js
const mysql = require("mysql2/promise");

/**
 * Configuración de la base de datos
 */
const SQL_CONFIGURATION_DATA = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,
  port: 3306,
  charset: "UTF8MB4_GENERAL_CI",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Pool de conexiones para mejor rendimiento
const pool = mysql.createPool(SQL_CONFIGURATION_DATA);

/**
 * Ejecuta una consulta preparada (SEGURA contra SQL Injection)
 * @param {string} queryString - Query con placeholders ?
 * @param {Array} params - Array de parámetros para la query
 * @returns {Promise<Array>} Resultados de la query
 */
exports.realizarQuery = async function (queryString, params = []) {
  try {
    const [rows] = await pool.execute(queryString, params);
    return rows;
  } catch (err) {
    console.error("❌ ERROR en realizarQuery():", err.message);
    console.error("📜 Query que falló:", queryString);
    console.error("📦 Parámetros:", params);
    throw err;
  }
};

/**
 * Cierra el pool de conexiones (usar solo al cerrar la aplicación)
 */
exports.closePool = async function () {
  try {
    await pool.end();
    console.log("✅ Pool de conexiones cerrado correctamente");
  } catch (err) {
    console.error("❌ Error al cerrar pool:", err.message);
  }
};
