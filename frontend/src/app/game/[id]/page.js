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

// Función para verificar si una pieza es blanca
const esBlanca = (pieza) => pieza === pieza.toUpperCase();

// Lógica de validación para cada tipo de pieza
const esMovimientoValido = (pieza, desdeFila, desdeCol, hastaFila, hastaCol, tablero) => {
  const direccion = esBlanca(pieza) ? 1 : -1; // Dirección para las piezas negras o blancas
  
  switch (pieza.toLowerCase()) {
    case "p": {
      // Movimiento de peón
      if (desdeCol === hastaCol && tablero[hastaFila][hastaCol] === "") {
        // Movimiento normal de 1 casilla hacia adelante
        if (Math.abs(hastaFila - desdeFila) === 1) return true;
        // Movimiento inicial del peón (2 casillas)
        if ((esBlanca(pieza) && desdeFila === 6) || (!esBlanca(pieza) && desdeFila === 1)) {
          if (Math.abs(hastaFila - desdeFila) === 2) return true;
        }
      }
      // Captura de peón: una casilla diagonal, pero solo si hay una pieza enemiga
      if (Math.abs(desdeCol - hastaCol) === 1 && Math.abs(hastaFila - desdeFila) === 1) {
        if (tablero[hastaFila][hastaCol] !== "" && esBlanca(pieza) !== esBlanca(tablero[hastaFila][hastaCol])) {
          return true;
        }
      }
      return false;
    }

    case "r": {
      // Movimiento de torre
      if (desdeFila !== hastaFila && desdeCol !== hastaCol) return false; // Solo en línea recta
      // Verificar si el camino está libre
      if (desdeFila === hastaFila) {
        const rango = Math.min(desdeCol, hastaCol) + 1;
        const final = Math.max(desdeCol, hastaCol);
        for (let i = rango; i < final; i++) {
          if (tablero[desdeFila][i] !== "") return false;
        }
      }
      if (desdeCol === hastaCol) {
        const rango = Math.min(desdeFila, hastaFila) + 1;
        const final = Math.max(desdeFila, hastaFila);
        for (let i = rango; i < final; i++) {
          if (tablero[i][desdeCol] !== "") return false;
        }
      }
      return true;
    }

    case "n": {
      // Movimiento de caballo
      const dx = Math.abs(desdeCol - hastaCol);
      const dy = Math.abs(desdeFila - hastaFila);
      return (dx === 2 && dy === 1) || (dx === 1 && dy === 2);
    }

    case "b": {
      // Movimiento de alfil
      if (Math.abs(desdeFila - hastaFila) !== Math.abs(desdeCol - hastaCol)) return false;
      // Verificar si el camino está libre
      const pasoFila = desdeFila < hastaFila ? 1 : -1;
      const pasoCol = desdeCol < hastaCol ? 1 : -1;
      let fila = desdeFila + pasoFila;
      let col = desdeCol + pasoCol;
      while (fila !== hastaFila && col !== hastaCol) {
        if (tablero[fila][col] !== "") return false;
        fila += pasoFila;
        col += pasoCol;
      }
      return true;
    }

    case "q": {
      // Movimiento de reina (combinación de torre y alfil)
      return esMovimientoValido("r", desdeFila, desdeCol, hastaFila, hastaCol, tablero) ||
             esMovimientoValido("b", desdeFila, desdeCol, hastaFila, hastaCol, tablero);
    }

    case "k": {
      // Movimiento de rey
      return Math.abs(desdeFila - hastaFila) <= 1 && Math.abs(desdeCol - hastaCol) <= 1;
    }

    default:
      return false;
  }
};

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

      // Verificar que el turno corresponde
      if (colorPieza !== turno) return;

      setSeleccionado({ fila, col });
    } else {
      // Mover pieza
      const pieza = tablero[seleccionado.fila][seleccionado.col];

      if (!esMovimientoValido(pieza, seleccionado.fila, seleccionado.col, fila, col, tablero)) {
        return; // Si el movimiento no es válido, no se mueve
      }

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