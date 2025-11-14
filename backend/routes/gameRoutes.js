// backend/routes/gameRoutes.js
const express = require("express");
const router = express.Router();
const {
  crearPartida,
  unirsePartida,
  listarPartidas,
  obtenerPartida
} = require("../controllers/gameController");

router.post("/create", crearPartida);
router.post("/join", unirsePartida);
router.get("/list", listarPartidas);
router.get("/:id", obtenerPartida);

module.exports = router;