"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "./page.module.css";
import TableroAjedrez from "../../../../componentes/TableroAjedrez";

// Tablero inicial de ajedrez
const tableroInicial = [
  ["r", "n", "b", "q", "k", "b", "n", "r"],
  ["p", "p", "p", "p", "p", "p", "p", "p"],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["P", "P", "P", "P", "P", "P", "P", "P"],
  ["R", "N", "B", "Q", "K", "B", "N", "R"]
];

export default function GamePage({ params }) {
  const { id: partidaId } = params;
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [tablero, setTablero] = useState(tableroInicial);
  const [turno, setTurno] = useState("white");
  const [seleccionado, setSeleccionado] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
      return;
    }
    const u = JSON.parse(storedUser);
    setUser(u);
  }, [router]);

  const handleMovimiento = (idx) => {
    const fila = Math.floor(idx / 8);
    const col = idx % 8;

    if (!seleccionado) {
      // Seleccionar pieza
      const pieza = tablero[fila][col];
      if (!pieza) return;
      
      const esBlanca = pieza === pieza.toUpperCase();
      const colorPieza = esBlanca ? "white" : "black";
      
      if (colorPieza !== turno) return;

      setSeleccionado({ fila, col });
    } else {
      // Mover pieza
      const pieza = tablero[seleccionado.fila][seleccionado.col];
      
      // Crear nuevo tablero
      const nuevoTablero = tablero.map(f => [...f]);
      nuevoTablero[fila][col] = pieza;
      nuevoTablero[seleccionado.fila][seleccionado.col] = "";
      
      setTablero(nuevoTablero);
      setTurno(turno === "white" ? "black" : "white");
      setSeleccionado(null);
    }
  };

  return (
    <div className={styles.homeContainer}>
      <div className={styles.main}>
        <h1 className={styles.titulo}>🎯 Partida: {partidaId}</h1>
        
        <div className={styles.infoContainer}>
          <p className={styles.infoTexto}>
            Jugador: <strong className={styles.destaque}>{user?.nombre || "..."}</strong>
          </p>
          <p className={styles.infoTexto}>
            Turno actual: <strong className={styles.destaque}>
              {turno === "white" ? "Blancas ⚪" : "Negras ⚫"}
            </strong>
          </p>
          {seleccionado && (
            <p className={styles.infoTexto}>
              Pieza seleccionada: <strong className={styles.destaque}>
                Fila {seleccionado.fila}, Col {seleccionado.col}
              </strong>
            </p>
          )}
        </div>

        <div className={styles.tableroContainer}>
          <TableroAjedrez
            tablero={tablero}
            onMovimiento={handleMovimiento}
            seleccionado={seleccionado}
          />
        </div>
      </div>
    </div>
  );
}