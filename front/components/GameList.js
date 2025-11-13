// components/GameList.js
"use client";
import { useState, useEffect } from "react";
import { gameAPI } from "@/lib/api";

export default function GameList({ onJoinGame, refreshTrigger }) {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadGames();
  }, [refreshTrigger]);

  const loadGames = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await gameAPI.getAvailable();
      setGames(data);
    } catch (err) {
      console.error("Error al cargar partidas:", err);
      setError("No se pudieron cargar las partidas");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      waiting: { text: "Esperando", color: "bg-yellow-500" },
      ongoing: { text: "En curso", color: "bg-green-500" },
      finished: { text: "Finalizada", color: "bg-gray-500" }
    };
    const badge = badges[status] || badges.waiting;
    
    return (
      <span className={`${badge.color} text-white text-xs px-2 py-1 rounded-full font-semibold`}>
        {badge.text}
      </span>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return "Hace un momento";
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffMins < 1440) return `Hace ${Math.floor(diffMins / 60)} hrs`;
    return date.toLocaleDateString('es-AR');
  };

  if (loading) {
    return (
      <div className="bg-slate-800/90 backdrop-blur-sm p-6 rounded-2xl border border-slate-700">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-slate-800/90 backdrop-blur-sm p-6 rounded-2xl border border-slate-700">
        <div className="text-center py-8">
          <p className="text-red-400">❌ {error}</p>
          <button
            onClick={loadGames}
            className="mt-4 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/90 backdrop-blur-sm p-6 rounded-2xl border border-slate-700">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">🎯 Salas Disponibles</h2>
        <button
          onClick={loadGames}
          className="text-purple-400 hover:text-purple-300 transition"
          title="Actualizar lista"
        >
          🔄 Actualizar
        </button>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {games.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎮</div>
            <p className="text-slate-400">No hay salas disponibles</p>
            <p className="text-slate-500 text-sm mt-2">¡Crea una nueva partida!</p>
          </div>
        ) : (
          games.map((game) => (
            <div
              key={game.id}
              className="bg-slate-700/50 p-4 rounded-lg hover:bg-slate-700 transition group"
            >
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-lg font-semibold">
                      Sala #{game.id}
                    </span>
                    {getStatusBadge(game.status)}
                  </div>
                  
                  <div className="text-sm text-slate-400 space-y-1">
                    <p>👤 Creador: Jugador {game.player1_id}</p>
                    <p>🕐 {formatDate(game.created_at)}</p>
                  </div>
                </div>

                <button
                  onClick={() => onJoinGame(game.id)}
                  disabled={game.status !== 'waiting'}
                  className={`
                    px-6 py-3 rounded-lg font-semibold transition transform
                    ${game.status === 'waiting' 
                      ? 'bg-blue-600 hover:bg-blue-700 hover:scale-105 group-hover:shadow-lg' 
                      : 'bg-slate-600 cursor-not-allowed opacity-50'
                    }
                  `}
                >
                  {game.status === 'waiting' ? '🚪 Unirse' : '🔒 No disponible'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {games.length > 0 && (
        <div className="mt-4 text-center text-sm text-slate-400">
          {games.length} sala{games.length !== 1 ? 's' : ''} disponible{games.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}