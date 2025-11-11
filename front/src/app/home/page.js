"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
//Prueba pull request
export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [gameId, setGameId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
    else router.push("/login");
  }, []);

  const crearSala = async () => {
    const res = await fetch("http://localhost:3001/api/games/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ player1Id: user.id }),
    });
    const data = await res.json();
    if (res.ok) router.push(`/game/${data.game.id}`);
    else setError("No se pudo crear la sala");
  };

  const unirseSala = async () => {
    if (!gameId) return setError("Ingrese un ID de sala");
    const res = await fetch(`http://localhost:3001/api/games/join/${gameId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ player2Id: user.id }),
    });
    const data = await res.json();
    if (res.ok) router.push(`/game/${gameId}`);
    else setError("No se pudo unir a la sala");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white">
      <h1 className="text-4xl font-bold mb-8">🏡 Bienvenido, {user?.username}</h1>

      <div className="bg-slate-800 p-10 rounded-2xl shadow-xl w-96 text-center space-y-6">
        <button
          onClick={crearSala}
          className="w-full bg-emerald-500 hover:bg-emerald-600 py-3 rounded text-lg font-semibold"
        >
          Crear sala
        </button>

        <div>
          <input
            type="text"
            placeholder="ID de la sala"
            className="w-full p-3 rounded bg-slate-700 text-white text-center outline-none"
            value={gameId}
            onChange={(e) => setGameId(e.target.value)}
          />
          <button
            onClick={unirseSala}
            className="w-full mt-3 bg-blue-500 hover:bg-blue-600 py-3 rounded text-lg font-semibold"
          >
            Unirse a sala
          </button>
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}
      </div>
    </div>
  );
}
