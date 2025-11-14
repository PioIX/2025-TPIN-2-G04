"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "./page.module.css";
import { socket } from "../../../../socket";
import TableroAjedrez from "../../../../componentes/TableroAjedrez";

export default function GamePage({ params }) {
  const { id: partidaId } = params;
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [color, setColor] = useState(null);
  const [tablero, setTablero] = useState([]);
  const [turno, setTurno] = useState("white");
  const [seleccionado, setSeleccionado] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return router.push("/login");
    const u = JSON.parse(storedUser);
    setUser(u);

    // Conectar socket
    socket.connect();

    // Unirse a la partida
    socket.emit("join_game", { partidaId, userId: u.id });

    // Escuchar info del jugador al unirse
    socket.on("joined_game", (data) => {
      setColor(data.color);
      setTablero(data.tablero);
      setTurno(data.turno);
    });

    // Escuchar updates de la partida
    socket.on("game_update", (data) => {
      setTablero(data.tablero);
      setTurno(data.turno);
    });

    socket.on("move", (data) => {
      setTablero(data.tablero);
      setTurno(data.turno);
    });

    socket.on("error", (msg) => alert(msg));

    return () => {
      socket.off("joined_game");
      socket.off("game_update");
      socket.off("move");
      socket.off("error");
    };
  }, [partidaId, router]);

  const handleMovimiento = (idx) => {
    if (!color || turno !== color) return; // solo puede mover su color
    const fila = Math.floor(idx / 8);
    const col = idx % 8;

    if (!seleccionado) {
      // seleccionar pieza propia
      const pieza = tablero[fila][col];
      if (!pieza) return;
      const esBlanca = pieza === pieza.toUpperCase();
      if ((color === "white" && !esBlanca) || (color === "black" && esBlanca))
        return;

      setSeleccionado({ fila, col });
    } else {
      // mover pieza seleccionada
      socket.emit("move", {
        partidaId,
        from: seleccionado,
        to: { fila, col }
      });
      setSeleccionado(null);
    }
  };

  return (
    <div className={styles.homeContainer}>
      <div className={styles.main}>
        <h1>🎯 Partida: {partidaId}</h1>
        <p>Tu color: <strong>{color || "..."}</strong></p>
        <p>Turno actual: <strong>{turno}</strong></p>
        <TableroAjedrez
          tablero={tablero}
          onMovimiento={handleMovimiento}
          seleccionado={seleccionado}
        />
      </div>
    </div>
  );
}
