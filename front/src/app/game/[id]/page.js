"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import io from "socket.io-client";

const socket = io("http://localhost:3001");

export default function GamePage() {
  const { id } = useParams();
  const router = useRouter();
  const [moves, setMoves] = useState([]);
  const [moveInput, setMoveInput] = useState("");

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) router.push("/login");

    socket.emit("joinGame", id);

    socket.on("move", (data) => {
      setMoves((prev) => [...prev, `${data.player}: ${data.move}`]);
    });

    return () => {
      socket.emit("leaveGame", id);
      socket.off("move");
    };
  }, [id]);

  const enviarMovimiento = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!moveInput) return;

    const data = { gameId: id, move: moveInput, player: user.username };
    socket.emit("move", data);
    setMoveInput("");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white">
      <h1 className="text-3xl font-bold mb-6">Partida #{id}</h1>

      <div className="bg-slate-800 p-8 rounded-2xl shadow-lg w-96 space-y-4">
        <div className="h-56 overflow-y-auto bg-slate-700 p-4 rounded">
          {moves.length === 0 ? (
            <p className="text-slate-400 text-sm text-center">Aún no hay movimientos</p>
          ) : (
            moves.map((m, i) => (
              <p key={i} className="text-sm">{m}</p>
            ))
          )}
        </div>

        <input
          type="text"
          placeholder="Ej: e2 a e4"
          className="w-full p-3 rounded bg-slate-700 text-white text-center outline-none"
          value={moveInput}
          onChange={(e) => setMoveInput(e.target.value)}
        />

        <button
          onClick={enviarMovimiento}
          className="w-full bg-emerald-500 hover:bg-emerald-600 py-3 rounded font-semibold"
        >
          Enviar movimiento
        </button>
      </div>

      <button
        onClick={() => router.push("/home")}
        className="mt-6 text-slate-400 hover:text-white transition"
      >
        ← Volver al Home
      </button>
    </div>
  );
}
