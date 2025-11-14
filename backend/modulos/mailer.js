// backend/modulos/mailer.js
const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

exports.enviarCodigo = async (email, codigo) => {
  try {
    await transporter.sendMail({
      from: `"Ajedrez Online" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "Tu código de verificación",
      text: `Tu código es: ${codigo}`,
      html: `<h1>Tu código de verificación</h1><p>Tu código es: <strong>${codigo}</strong></p>`
    });
    console.log("✅ Correo enviado a:", email);
  } catch (err) {
    console.error("❌ Error al enviar correo:", err);
    throw err;
  }
};
