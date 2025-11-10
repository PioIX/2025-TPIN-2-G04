const { realizarQuery } = require("../modulos/mysql");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// 📌 Registrar usuario
exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password)
    return res.status(400).json({ message: "Faltan datos" });

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await realizarQuery(`
      INSERT INTO users (username, email, password_hash)
      VALUES ('${username}', '${email}', '${hashedPassword}')
    `);
    res.status(201).json({ message: "Usuario registrado correctamente" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al registrar usuario" });
  }
};

// 📌 Login
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const users = await realizarQuery(`SELECT * FROM users WHERE email='${email}'`);
    if (users.length === 0) return res.status(404).json({ message: "Usuario no encontrado" });

    const valid = await bcrypt.compare(password, users[0].password_hash);
    if (!valid) return res.status(401).json({ message: "Contraseña incorrecta" });

    const token = jwt.sign({ id: users[0].id }, process.env.JWT_SECRET, { expiresIn: "2h" });
    res.json({ message: "Login exitoso", token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al iniciar sesión" });
  }
};

// 📌 Leer todos los usuarios
exports.getUsers = async (req, res) => {
  const users = await realizarQuery("SELECT id, username, email FROM users");
  res.json(users);
};

// 📌 Actualizar usuario
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, email } = req.body;
  try {
    await realizarQuery(`
      UPDATE users SET username='${username}', email='${email}' WHERE id=${id}
    `);
    res.json({ message: "Usuario actualizado correctamente" });
  } catch (err) {
    res.status(500).json({ message: "Error al actualizar usuario" });
  }
};

// 📌 Eliminar usuario
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await realizarQuery(`DELETE FROM users WHERE id=${id}`);
    res.json({ message: "Usuario eliminado correctamente" });
  } catch (err) {
    res.status(500).json({ message: "Error al eliminar usuario" });
  }
};
