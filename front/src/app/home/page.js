"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { gameAPI, userAPI } from "../../../lib/api";

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [gameId, setGameId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [availableGames, setAvailableGames] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      loadAvailableGames();
    } else {
      router.push("/login");
    }
  }, []);

  const loadAvailableGames = async () => {
    try {
      const games = await gameAPI.getAvailable();
      setAvailableGames(games);
    } catch (err) {
      console.error("Error al cargar partidas:", err);
    }
  };

  const crearSala = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await gameAPI.create();
      router.push(`/game/${data.game.id}`);
    } catch (err) {
      setError(err.message || "No se pudo crear la sala");
    } finally {
      setLoading(false);
    }
  };

  const unirseSala = async (id) => {
    const selectedGameId = id || gameId;
    
    if (!selectedGameId) {
      setError("Ingrese un ID de sala");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await gameAPI.join(selectedGameId);
      router.push(`/game/${selectedGameId}`);
    } catch (err) {
      setError(err.message || "No se pudo unir a la sala");
    } finally {
      setLoading(false);
    }
  };

  const cerrarSesion = () => {
    userAPI.logout();
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8 flex justify-between items-center">
        <h1 className="text-4xl font-bold">
          🏡 Bienvenido, <span className="text-purple-400">{user.username}</span>
        </h1>
        <button
          onClick={cerrarSesion}
          className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg font-semibold transition"
        >
          Cerrar sesión
        </button>
      </div>

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
        {/* Panel de acciones */}
        <div className="bg-slate-800/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-slate-700">
          <h2 className="text-2xl font-bold mb-6 text-center">🎮 Nueva Partida</h2>

          <div className="space-y-4">
            <button
              onClick={crearSala}
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 py-4 rounded-lg text-lg font-semibold transition transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
            >
              {loading ? "⏳ Creando..." : "➕ Crear sala"}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-slate-800 text-slate-400">o</span>
              </div>
            </div>

            <input
              type="text"
              placeholder="ID de la sala"
              className="w-full p-4 rounded-lg bg-slate-700 text-white text-center outline-none focus:ring-2 focus:ring-blue-500 transition"
              value={gameId}
              onChange={(e) => setGameId(e.target.value)}
              disabled={loading}
            />

            <button
              onClick={() => unirseSala()}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 py-4 rounded-lg text-lg font-semibold transition transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
            >
              {loading ? "⏳ Uniéndose..." : "🚪 Unirse a sala"}
            </button>
          </div>

          {error && (
            <p className="mt-4 text-red-400 text-center font-medium bg-red-900/30 py-2 rounded">
              {error}
            </p>
          )}
        </div>

        {/* Panel de partidas disponibles */}
        <div className="bg-slate-800/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-slate-700">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">🎯 Salas Disponibles</h2>
            <button
              onClick={loadAvailableGames}
              className="text-purple-400 hover:text-purple-300 transition"
            >
              🔄 Actualizar
            </button>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {availableGames.length === 0 ? (
              <p className="text-slate-400 text-center py-8">
                No hay salas disponibles. ¡Crea una nueva!
              </p>
            ) : (
              availableGames.map((game) => (
                <div
                  key={game.id}
                  className="bg-slate-700 p-4 rounded-lg flex justify-between items-center hover:bg-slate-600 transition"
                >
                  <div>
                    <p className="font-semibold">Sala #{game.id}</p>
                    <p className="text-sm text-slate-400">
                      Creada por: Jugador {game.player1_id}
                    </p>
                  </div>
                  <button
                    onClick={() => unirseSala(game.id)}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-semibold transition disabled:opacity-50"
                  >
                    Unirse
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}