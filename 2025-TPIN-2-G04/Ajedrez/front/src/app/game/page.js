"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import styles from "./page.module.css";

let socket;

export default function GamePage() {
  const params = useSearchParams();
  const room = params.get("room");
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    socket = io("http://localhost:3001");
    socket.emit("join_room", room);

    socket.on("players_update", (playersList) => {
      setPlayers(playersList);
    });
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Sala: {room}</h1>
      <p className={styles.subtitle}>Jugadores conectados:</p>
      <ul className={styles.list}>
        {players.map((p, i) => (
          <li key={i}>{p}</li>
        ))}
      </ul>

      <div className={styles.board}>
        {[...Array(8)].map((_, row) => (
          <div key={row} className={styles.row}>
            {[...Array(8)].map((_, col) => (
              <div
                key={col}
                className={`${styles.cell} ${
                  (row + col) % 2 === 0 ? styles.white : styles.black
                }`}
              ></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
