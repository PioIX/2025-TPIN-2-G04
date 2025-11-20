"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [codigo, setCodigo] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (!email || !password) {
      setError("Debes completar todos los campos");
      return;
    }
    setError("");
    setStep("verify");
  };

  const handleVerificarCodigo = () => {
    if (!codigo) {
      setError("Debes ingresar el código");
      return;
    }
    setError("");

    const fakeUser = {
      id: Date.now(),
      username: email.split("@")[0],
      email
    };
    const fakeToken = "token_simulado_" + Date.now();

    localStorage.setItem("user", JSON.stringify(fakeUser));
    localStorage.setItem("token", fakeToken);

    router.push("/home");
  };

  const loginRapido = (usuario) => {
    const users = {
      felipe: { id: 1, username: "Felipe", email: "felipe@test.com" },
      guille: { id: 2, username: "Guille", email: "guille@test.com" }
    };

    const u = users[usuario];
    localStorage.setItem("user", JSON.stringify(u));
    localStorage.setItem("token", "token_" + u.id);
    router.push("/home");
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        {step === "login" ? "Iniciar Sesión" : "Verificar Código"}
      </h1>

      <div className={styles.card}>
        {step === "login" ? (
          <>
            <input
              type="email"
              placeholder="Email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Contraseña"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className={styles.button} onClick={handleLogin}>
              Iniciar Sesión
            </button>
          </>
        ) : (
          <>
            <p className={styles.textInfo}>
              Ingresá cualquier código para continuar
            </p>
            <input
              type="text"
              placeholder="Código de 6 dígitos"
              className={styles.input}
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              maxLength={6}
            />
            <button className={styles.button} onClick={handleVerificarCodigo}>
              Verificar
            </button>
            <button
              className={`${styles.button} ${styles.backButton}`}
              onClick={() => setStep("login")}
            >
              Volver
            </button>
          </>
        )}

        {error && <p className={styles.error}>{error}</p>}

        <hr style={{ margin: "1rem 0", borderColor: "#334155" }} />

        {/* Botones de login rápido */}
        <button
          className={styles.button}
          onClick={() => loginRapido("felipe")}
        >
          Login rápido: Felipe
        </button>
        <button
          className={styles.button}
          onClick={() => loginRapido("guille")}
        >
          Login rápido: Guille
        </button>
      </div>
    </div>
  );
}