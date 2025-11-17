"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "./page.module.css";
import TableroAjedrez from "../../../../componentes/TableroAjedrez";

// TABLERO INICIAL
const tableroInicial = [
  ["r", "n", "b", "q", "k", "b", "n", "r"],
  ["p", "p", "p", "p", "p", "p", "p", "p"],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["P", "P", "P", "P", "P", "P", "P", "P"],
  ["R", "N", "B", "Q", "K", "B", "N", "R"],
];

// FUNCIONES DE MOVIMIENTO
const esMovimientoValido = (pieza, origen, destino, tablero, turno) => {
  if (!pieza) return false;

  const esBlanca = pieza === pieza.toUpperCase();
  const color = esBlanca ? "white" : "black";

  if (color !== turno) return false;

  const [oF, oC] = origen;
  const [dF, dC] = destino;
  const df = dF - oF;
  const dc = dC - oC;

  const destinoPieza = tablero[dF][dC];
  const destinoEsBlanca =
    destinoPieza && destinoPieza === destinoPieza.toUpperCase();

  if (destinoPieza && destinoEsBlanca === esBlanca) return false;

  const absDf = Math.abs(df);
  const absDc = Math.abs(dc);

  // PEONES BLANCOS
  if (pieza === "P") {
    if (df === -1 && dc === 0 && !destinoPieza) return true;
    if (oF === 6 && df === -2 && dc === 0 && !destinoPieza && !tablero[5][oC])
      return true;
    if (
      df === -1 &&
      absDc === 1 &&
      destinoPieza &&
      destinoPieza === destinoPieza.toLowerCase()
    )
      return true;
    return false;
  }

  // PEONES NEGROS
  if (pieza === "p") {
    if (df === 1 && dc === 0 && !destinoPieza) return true;
    if (oF === 1 && df === 2 && dc === 0 && !destinoPieza && !tablero[2][oC])
      return true;
    if (
      df === 1 &&
      absDc === 1 &&
      destinoPieza &&
      destinoPieza === destinoPieza.toUpperCase()
    )
      return true;
    return false;
  }

  // TORRE
  if (pieza.toLowerCase() === "r") {
    if (df !== 0 && dc !== 0) return false;
    const pasos = Math.max(absDf, absDc);
    for (let i = 1; i < pasos; i++) {
      const f = oF + (df === 0 ? 0 : Math.sign(df) * i);
      const c = oC + (dc === 0 ? 0 : Math.sign(dc) * i);
      if (tablero[f][c]) return false;
    }
    return true;
  }

  // ALFIL
  if (pieza.toLowerCase() === "b") {
    if (absDf !== absDc) return false;
    for (let i = 1; i < absDf; i++) {
      const f = oF + Math.sign(df) * i;
      const c = oC + Math.sign(dc) * i;
      if (tablero[f][c]) return false;
    }
    return true;
  }

  // DAMA
  if (pieza.toLowerCase() === "q") {
    if (df === 0 || dc === 0) {
      const pasos = Math.max(absDf, absDc);
      for (let i = 1; i < pasos; i++) {
        const f = oF + (df === 0 ? 0 : Math.sign(df) * i);
        const c = oC + (dc === 0 ? 0 : Math.sign(dc) * i);
        if (tablero[f][c]) return false;
      }
      return true;
    }
    if (absDf === absDc) {
      for (let i = 1; i < absDf; i++) {
        const f = oF + Math.sign(df) * i;
        const c = oC + Math.sign(dc) * i;
        if (tablero[f][c]) return false;
      }
      return true;
    }
    return false;
  }

  // CABALLO
  if (pieza.toLowerCase() === "n") {
    return (
      (absDf === 2 && absDc === 1) ||
      (absDf === 1 && absDc === 2)
    );
  }

  // REY
  if (pieza.toLowerCase() === "k") {
    return absDf <= 1 && absDc <= 1;
  }

  return false;
};

export default function GamePage({ params }) {
  const router = useRouter();
  const { id: partidaId } = params;

  const [user, setUser] = useState(null);
  const [tablero, setTablero] = useState(tableroInicial);
  const [turno, setTurno] = useState("white");
  const [seleccionado, setSeleccionado] = useState(null);

  // MODAL
  const [modalVisible, setModalVisible] = useState(false);
  const [ganador, setGanador] = useState("");

  // Cargar usuario
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
      return;
    }
    setUser(JSON.parse(storedUser));
  }, [router]);

  // DETECTAR FINAL DE PARTIDA
  useEffect(() => {
    let reyBlanco = false;
    let reyNegro = false;

    for (let f = 0; f < 8; f++) {
      for (let c = 0; c < 8; c++) {
        if (tablero[f][c] === "K") reyBlanco = true;
        if (tablero[f][c] === "k") reyNegro = true;
      }
    }

    if (!reyBlanco || !reyNegro) {
      setGanador(!reyBlanco ? "Negras ⚫" : "Blancas ⚪");
      setModalVisible(true);
    }
  }, [tablero]);

  // Mover piezas
  const handleMovimiento = (idx) => {
    const fila = Math.floor(idx / 8);
    const col = idx % 8;

    if (!seleccionado) {
      const pieza = tablero[fila][col];
      if (!pieza) return;

      const esBlanca = pieza === pieza.toUpperCase();
      const color = esBlanca ? "white" : "black";

      if (color !== turno) return;

      setSeleccionado({ fila, col });
      return;
    }

    const { fila: oF, col: oC } = seleccionado;
    const pieza = tablero[oF][oC];

    if (!esMovimientoValido(pieza, [oF, oC], [fila, col], tablero, turno)) {
      setSeleccionado(null);
      return;
    }

    const nuevo = tablero.map((f) => [...f]);
    nuevo[fila][col] = pieza;
    nuevo[oF][oC] = "";

    setTablero(nuevo);
    setTurno(turno === "white" ? "black" : "white");
    setSeleccionado(null);
  };

  return (
    <div className={styles.homeContainer}>
      <div className={styles.main}>
        <h1 className={styles.titulo} style={{ fontFamily: "Cinzel" }}>
          ♟ Partida: {partidaId}
        </h1>

        <p className={styles.infoTexto} style={{ fontFamily: "Cinzel" }}>
          Jugador: <strong>{user?.nombre}</strong>
        </p>
        <p className={styles.infoTexto} style={{ fontFamily: "Cinzel" }}>
          Turno actual: {turno === "white" ? "Blancas ⚪" : "Negras ⚫"}
        </p>

        <div className={styles.tableroContainer}>
          <TableroAjedrez
            tablero={tablero}
            seleccionado={seleccionado}
            onMovimiento={handleMovimiento}
          />
        </div>
      </div>

      {/* MODAL DE FIN DE PARTIDA */}
      {modalVisible && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox}>
            <h2 className={styles.modalTitle}>¡Partida finalizada!</h2>
            <p className={styles.modalWinner}>Ganador: {ganador}</p>
            <button
              className={styles.modalButton}
              onClick={() => router.push("/home")}
            >
              Volver al Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
}