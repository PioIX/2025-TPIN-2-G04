const { realizarQuery } = require("../modulos/mysql");
const { enviarCodigo } = require("../modulos/mailer");
const { generarToken } = require("../modulos/token");
const bcrypt = require("bcryptjs");

// REGISTRO
exports.registrar = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Verificar si ya existe username o email
    const existe = await realizarQuery(
      "SELECT * FROM usuarios WHERE email = ? OR username = ?",
      [email, username]
    );

    if (existe.length > 0) {
      return res.status(400).json({ mensaje: "El usuario ya existe" });
    }

    // Encriptar password
    const hashed = await bcrypt.hash(password, 10);

    // Crear usuario
    await realizarQuery(
      "INSERT INTO usuarios (username, email, password_hash) VALUES (?, ?, ?)",
      [username, email, hashed]
    );

    // Generar código
    const codigo = Math.floor(100000 + Math.random() * 900000);

    // Guardarlo en DB
    await realizarQuery(
      "UPDATE usuarios SET codigo = ? WHERE email = ?",
      [codigo, email]
    );

    // Enviar mail
    await enviarCodigo(email, codigo);

    res.json({ mensaje: "Usuario registrado. Código enviado al correo." });

  } catch (err) {
    console.error("❌ Error en registro:", err);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};

// LOGIN
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Buscar usuario por email
    const user = await realizarQuery(
      "SELECT * FROM usuarios WHERE email = ?",
      [email]
    );

    if (user.length === 0) {
      return res.status(400).json({ mensaje: "Usuario no encontrado" });
    }

    const data = user[0];

    // Comparar contraseña
    const valido = await bcrypt.compare(password, data.password_hash);

    if (!valido) {
      return res.status(400).json({ mensaje: "Contraseña incorrecta" });
    }

    // Generar código de verificación
    const codigo = Math.floor(100000 + Math.random() * 900000);

    await realizarQuery(
      "UPDATE usuarios SET codigo = ? WHERE id = ?",
      [codigo, data.id]
    );

    // Enviar mail
    await enviarCodigo(data.email, codigo);

    res.json({
      mensaje: "Código enviado al correo.",
      userId: data.id,
      username: data.username
    });

  } catch (err) {
    console.error("❌ Error en login:", err);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};

// VERIFICAR CÓDIGO
exports.verificarCodigo = async (req, res) => {
  const { email, codigo } = req.body;

  try {
    const user = await realizarQuery(
      "SELECT * FROM usuarios WHERE email = ?",
      [email]
    );

    if (user.length === 0) {
      return res.status(400).json({ mensaje: "Usuario no existe" });
    }

    const data = user[0];

    // Comparar código
    if (data.codigo !== Number(codigo)) {
      return res.status(400).json({ mensaje: "Código incorrecto" });
    }

    // Generar JWT
    const token = generarToken(data.id);

    res.json({
      mensaje: "Acceso permitido",
      token,
      user: {
        id: data.id,
        username: data.username,
        email: data.email
      }
    });

  } catch (err) {
    console.error("❌ Error al verificar código:", err);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};

// ME (datos del usuario autenticado)
exports.me = async (req, res) => {
  try {
    const user = await realizarQuery(
      "SELECT id, username, email FROM usuarios WHERE id = ?",
      [req.userId]
    );

    res.json(user[0]);

  } catch (err) {
    console.error("❌ Error en me():", err);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};
