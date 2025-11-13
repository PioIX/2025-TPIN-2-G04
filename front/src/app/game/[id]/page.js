"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  connectSocket,
  joinGame,
  leaveGame,
  sendMove,
  onMove,
  onPlayerJoined,
  onPlayerLeft,
  removeListener
} from "@/lib/websocket";
import { gameAPI, moveAPI } from "@/lib/api";
import ChessBoard from "@/components/ChessBoard";
import PlayerInfo from "@/components/PlayerInfo";

export default function GamePage() {
  const { id } = useParams();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [game, setGame] = useState(null);
  const [moves, setMoves] = useState([]);
  const [playersCount, setPlayersCount] = useState(1);
  const [loading, setLoading] = useState(true);
  const [currentTurn, setCurrentTurn] = useState("white"); // white o black

  useEffect(() => {
    // Verificar usuario
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
      return;
    }
    setUser(JSON.parse(storedUser));

    // Cargar información de la partida
    loadGameData();

    // Conectar WebSocket
    const socket = connectSocket();
    joinGame(id);

    // Escuchar eventos
    onPlayerJoined((data) => {
      console.log("Jugador se unió:", data);
      setPlayersCount(data.playersCount);
    });

    onPlayerLeft((data) => {
      console.log("Jugador se fue:", data);
      setPlayersCount((prev) => Math.max(1, prev - 1));
    });

    onMove((data) => {
      console.log("Movimiento recibido:", data);
      setMoves((prev) => [
        ...prev,
        `${data.player}: ${data.move} (${data.moveNotation || ""})`
      ]);
      // Cambiar turno
      setCurrentTurn(prev => prev === "white" ? "black" : "white");
    });

    // Cleanup
    return () => {
      leaveGame(id);
      removeListener("move");
      removeListener("playerJoined");
      removeListener("playerLeft");
    };
  }, [id]);

  const loadGameData = async () => {
    try {
      // Cargar información de la partida
      const gameData = await gameAPI.getById(id);
      setGame(gameData);

      // Cargar movimientos previos
      const movesData = await moveAPI.getByGame(id);
      const formattedMoves = movesData.map(
        (m) => `Jugador ${m.player_id}: ${m.move_notation}`
      );
      setMoves(formattedMoves);
     
      // Determinar turno según cantidad de movimientos
      setCurrentTurn(movesData.length % 2 === 0 ? "white" : "black");
    } catch (err) {
      console.error("Error al cargar partida:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMove = async (moveNotation, pieceType) => {
    if (!user) return;

    try {
      // Guardar en BD
      const moveNumber = moves.length + 1;
      await moveAPI.add(id, moveNotation, moveNumber);

      // Enviar por WebSocket
      sendMove(id, moveNotation, user.username, moveNotation);

      // Agregar a la lista local
      setMoves((prev) => [...prev, `${user.username}: ${moveNotation}`]);
     
      // Cambiar turno
      setCurrentTurn(prev => prev === "white" ? "black" : "white");
    } catch (err) {
      console.error("Error al enviar movimiento:", err);
      alert(err.message || "Error al enviar movimiento");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="text-center">
          <div className="text-6xl mb-4">♟️</div>
          <p className="text-xl">Cargando partida...</p>
        </div>
      </div>
    );
  }

  const player1 = game ? {
    id: game.player1_id,
    username: `Jugador ${game.player1_id}`
  } : null;
 
  const player2 = game?.player2_id ? {
    id: game.player2_id,
    username: `Jugador ${game.player2_id}`
  } : null;

  const isPlayer1Turn = currentTurn === "white";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">
            ♟️ Partida <span className="text-purple-400">#{id}</span>
          </h1>
          <div className="flex gap-4 items-center">
            <div className="bg-slate-800 px-4 py-2 rounded-lg">
              👥 {playersCount} jugador{playersCount !== 1 ? "es" : ""}
            </div>
            {game && (
              <div className="bg-slate-800 px-4 py-2 rounded-lg">
                {game.status === "waiting" && "⏳ Esperando jugador"}
                {game.status === "ongoing" && "🎮 En curso"}
                {game.status === "finished" && "✅ Finalizada"}
              </div>
            )}
            <button
              onClick={() => router.push("/home")}
              className="bg-slate-700 hover:bg-slate-600 px-6 py-2 rounded-lg font-semibold transition"
            >
              ← Volver
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_600px_1fr] gap-6 items-start">
          {/* Panel izquierdo - Jugador 1 */}
          <div className="space-y-6">
            <PlayerInfo
              player={player1}
              isCurrentTurn={isPlayer1Turn}
              isOnline={true}
              capturedPieces={[]}
              timeRemaining={null}
            />
           
            {/* Info adicional */}
            <div className="bg-slate-800/90 backdrop-blur-sm p-4 rounded-xl border border-slate-700">
              <h3 className="font-bold mb-2">📊 Estadísticas</h3>
              <div className="text-sm text-slate-400 space-y-1">
                <p>Movimientos: {moves.length}</p>
                <p>Turno: {currentTurn === "white" ? "Blancas" : "Negras"}</p>
              </div>
            </div>
          </div>

          {/* Panel central - Tablero */}
          <div className="space-y-4">
            <ChessBoard
              onMove={handleMove}
              disabled={game?.status !== "ongoing"}
            />
           
            {game?.status === "waiting" && (
              <div className="text-center bg-yellow-600/20 border border-yellow-600 rounded-lg p-3">
                <p className="font-semibold">⏳ Esperando a que se una otro jugador...</p>
              </div>
            )}
          </div>

          {/* Panel derecho - Jugador 2 y Movimientos */}
          <div className="space-y-6">
            <PlayerInfo
              player={player2 || { username: "Esperando..." }}
              isCurrentTurn={!isPlayer1Turn}
              isOnline={!!player2}
              capturedPieces={[]}
              timeRemaining={null}
            />

            {/* Historial de movimientos */}
            <div className="bg-slate-800/90 backdrop-blur-sm p-6 rounded-2xl border border-slate-700">
              <h3 className="text-xl font-bold mb-4">📜 Movimientos</h3>
             
              <div className="h-96 overflow-y-auto bg-slate-900/50 p-4 rounded-lg space-y-2">
                {moves.length === 0 ? (
                  <p className="text-slate-400 text-sm text-center py-8">
                    Aún no hay movimientos
                  </p>
                ) : (
                  moves.map((m, i) => (
                    <div
                      key={i}
                      className="bg-slate-700/50 p-3 rounded text-sm hover:bg-slate-700 transition"
                    >
                      <span className="text-purple-400 font-semibold">#{i + 1}</span> {m}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Acciones de la partida */}
            {game?.status === "ongoing" && (
              <div className="space-y-3">
                <button className="w-full bg-yellow-600 hover:bg-yellow-700 py-3 rounded-lg font-semibold transition">
                  ⏸️ Pausar partida
                </button>
                <button className="w-full bg-red-600 hover:bg-red-700 py-3 rounded-lg font-semibold transition">
                  🏳️ Rendirse
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
