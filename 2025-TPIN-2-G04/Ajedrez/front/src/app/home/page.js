"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import io from "socket.io-client";
import styles from "./page.module.css";

let socket;

export default function HomePage() {
  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState("");
  const [connected, setConnected] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const name = localStorage.getItem("username");
    if (!name) router.push("/login");
    setUsername(name);

    socket = io("http://localhost:3001");
    socket.emit("set_username", name);

    socket.on("connect", () => setConnected(true));
    socket.on("room_joined", (room) => {
      router.push(`/game?room=${room}`);
    });
  }, []);

  const createRoom = () => {
    socket.emit("create_room");
  };

  const joinRoom = () => {
    if (roomId.trim()) {
      socket.emit("join_room", roomId);
    }
  };

  const inviteUser = () => {
    const code = prompt("Código de sala a compartir:");
    if (code) navigator.clipboard.writeText(code);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Bienvenido, {username}</h1>
      <h2 className={styles.subtitle}>Lobby de Ajedrez</h2>

      <div className={styles.buttons}>
        <button onClick={createRoom} className={styles.button}>Crear Sala</button>
        <div className={styles.joinSection}>
          <input
            type="text"
            placeholder="Código de sala"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className={styles.input}
          />
          <button onClick={joinRoom} className={styles.button}>Unirse</button>
        </div>
        <button onClick={inviteUser} className={styles.invite}>Invitar Usuario</button>
      </div>
    </div>
  );
}
