// modulos/mysql.js
const mySql = require("mysql2/promise");

/**
 * Configuración de la base de datos
 */
const SQL_CONFIGURATION_DATA = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,
  port: 3306,
  charset: "UTF8_GENERAL_CI"
};

/**
 * Ejecuta una consulta MySQL y devuelve los resultados
 */
exports.realizarQuery = async function (queryString) {
  let connection;
  try {
    connection = await mySql.createConnection(SQL_CONFIGURATION_DATA);

    // 👇 Ejecuta la query
    const [rows] = await connection.execute(queryString);

    // 👇 Devuelve los resultados
    return rows;

  } catch (err) {
    // 👇 Muestra claramente el error en la consola
    console.error("❌ ERROR en realizarQuery():", err.message);
    console.error("📜 Query que falló:", queryString);
    throw err; // 👈 Esto hace que el error se propague al controlador
  } finally {
    // 👇 Cierra la conexión
    if (connection && connection.end) await connection.end();
  }
};
