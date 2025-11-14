// backend/modulos/mysql.js
const mysql = require("mysql2/promise");

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

const pool = mysql.createPool(SQL_CONFIGURATION_DATA);

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

exports.closePool = async function () {
  try {
    await pool.end();
    console.log("✅ Pool de conexiones cerrado correctamente");
  } catch (err) {
    console.error("❌ Error al cerrar pool:", err.message);
  }
};