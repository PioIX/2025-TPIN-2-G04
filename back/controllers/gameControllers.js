const { realizarQuery } = require("../modulos/mysql");

// 📌 Crear partida
exports.createGame = async (req, res) => {
  const { player1_id } = req.body;

  try {
    const result = await realizarQuery(`
      INSERT INTO games (player1_id, status)
      VALUES ('${player1_id}', 'waiting')
    `);
    res.status(201).json({ message: "Partida creada", gameId: result.insertId });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error al crear partida" });
  }
};

// 📌 Unirse a una partida
exports.joinGame = async (req, res) => {
  const { gameId, player2_id } = req.body;

  try {
    await realizarQuery(`
      UPDATE games SET player2_id='${player2_id}', status='ongoing'
      WHERE id=${gameId} AND status='waiting'
    `);
    res.json({ message: "Jugador unido a la partida" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error al unirse a la partida" });
  }
};

// 📌 Finalizar partida
exports.finishGame = async (req, res) => {
  const { gameId } = req.params;

  try {
    await realizarQuery(`
      UPDATE games SET status='finished' WHERE id=${gameId}
    `);
    res.json({ message: "Partida finalizada" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error al finalizar partida" });
  }
};

// 📌 Obtener todas las partidas
exports.getAllGames = async (req, res) => {
  const games = await realizarQuery("SELECT * FROM games");
  res.json(games);
};
