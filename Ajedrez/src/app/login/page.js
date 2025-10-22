"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import io from "socket.io-client";
import styles from "./page.module.css";

let socket;

export default function LoginPage() {
  const [name, setName] = useState("");
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    socket = io("http://localhost:3002"); // tu servidor socket
    socket.emit("login", name);
    localStorage.setItem("username", name);

    router.push("/home");
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>♟️ Ajedrez Online</h1>
      <form onSubmit={handleLogin} className={styles.form}>
        <input
          type="text"
          placeholder="Nombre de usuario"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={styles.input}
        />
        <button type="submit" className={styles.button}>Ingresar</button>
      </form>
    </div>
  );
}
