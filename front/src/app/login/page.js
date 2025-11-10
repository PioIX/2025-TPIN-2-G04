"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function LoginPage() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoint = isRegister
      ? "http://localhost:3001/api/users/register"
      : "http://localhost:3001/api/users/login";

    const body = isRegister
      ? { username, email, password }
      : { email, password };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Error de autenticación");
        return;
      }

      if (isRegister) {
        setMessage("Cuenta creada con éxito. Ahora iniciá sesión ✨");
        setIsRegister(false);
      } else {
        localStorage.setItem("user", JSON.stringify(data.user));
        router.push("/home");
      }
    } catch (err) {
      console.error(err);
      setMessage("Error de conexión con el servidor");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>
          {isRegister ? "🧩 Crear Cuenta" : "♟️ Iniciar Sesión"}
        </h1>

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <input
              className={styles.input}
              type="text"
              placeholder="Nombre de usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          )}

          <input
            className={styles.input}
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            className={styles.input}
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className={styles.button} type="submit">
            {isRegister ? "Registrarse" : "Iniciar sesión"}
          </button>
        </form>

        {message && (
          <p
            style={{
              color: message.includes("éxito") ? "limegreen" : "red",
              marginTop: "10px",
            }}
          >
            {message}
          </p>
        )}

        <p
          className={styles.link}
          onClick={() => setIsRegister(!isRegister)}
        >
          {isRegister
            ? "¿Ya tenés cuenta? Iniciá sesión"
            : "¿No tenés cuenta? Registrate acá"}
        </p>
      </div>
    </div>
  );
}
