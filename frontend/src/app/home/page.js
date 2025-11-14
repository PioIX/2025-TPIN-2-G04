"use client";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import { socket } from "../../../socket";
import TarjetaPartida from "../../../componentes/TarjetaPartida";
import BarraLateral from "../../../componentes/BarraLaterarl";

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [partidas, setPartidas] = useState([]);

  useEffect(() => {
    // Tomar usuario de localStorage
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return router.push("/login");

    setUser(JSON.parse(storedUser));

    // Conectar socket
    socket.connect();

    // Recibir lista de partidas
    socket.on("partidas_update", (lista) => setPartidas(lista));

    // Escuchar partida creada
    socket.on("partida_creada", (partida) => {
      router.push(`/game/${partida.id}`);
    });

    // Escuchar errores
    socket.on("error", (msg) => alert(msg));

    return () => {
      socket.off("partidas_update");
      socket.off("partida_creada");
      socket.off("error");
    };
  }, []);

  // Crear partida
  const crearPartida = () => {
    if (!user) return;
    socket.emit("crear_partida", { user });
  };

  // Unirse a partida
  const unirse = (partidaId) => {
    if (!user) return;
    socket.emit("join_game", { partidaId, user });
  };

  // Limpiar todas las partidas
  const limpiarPartidas = () => {
    socket.emit("limpiar_partidas");
  };

  return (
    <div className={styles.homeContainer}>
      <BarraLateral user={user} />

      {user ? (
        <>
          <div className={styles.main}>
            <h1>🏠 Bienvenido, {user.username}</h1>
            <button className={styles.button} onClick={crearPartida}>
              ➕ Crear nueva partida
            </button>
          </div>

          <div className={styles.listaPartidas}>
            {partidas.length === 0 && <p>No hay partidas disponibles.</p>}
            {partidas.map((p) => (
              <TarjetaPartida
                key={p.id}
                id={p.id}
                estado={p.estado}
                player1={p.player1?.username || "Esperando jugador"}
                player2={p.player2?.username || "Esperando jugador"}
                onUnirse={() => unirse(p.id)}
              />
            ))}

            {/* Botón para limpiar todas las partidas */}
            <div style={{ marginTop: "1rem" }}>
              <button className={styles.button} onClick={limpiarPartidas}>
                🧹 Limpiar todas las partidas
              </button>
            </div>
          </div>
        </>
      ) : (
        <p>Cargando usuario...</p>
      )}
    </div>
  );
}