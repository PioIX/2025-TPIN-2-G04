// components/PlayerInfo.js
"use client";
import { useState, useEffect } from "react";

export default function PlayerInfo({ 
  player, 
  isCurrentTurn = false, 
  isOnline = true,
  capturedPieces = [],
  timeRemaining = null 
}) {
  const [timer, setTimer] = useState(timeRemaining);

  useEffect(() => {
    if (timeRemaining && isCurrentTurn) {
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [timeRemaining, isCurrentTurn]);

  const formatTime = (seconds) => {
    if (!seconds && seconds !== 0) return "--:--";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const pieceSymbols = {
    pawn: '♟',
    knight: '♞',
    bishop: '♝',
    rook: '♜',
    queen: '♛',
    king: '♚'
  };

  return (
    <div 
      className={`
        bg-slate-800/90 backdrop-blur-sm p-5 rounded-xl border-2 transition-all
        ${isCurrentTurn 
          ? 'border-green-500 shadow-lg shadow-green-500/50' 
          : 'border-slate-700'
        }
      `}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          {/* Avatar/Status */}
          <div className="relative">
            <div className={`
              w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold
              ${isCurrentTurn ? 'bg-green-600' : 'bg-slate-700'}
            `}>
              {player?.username?.[0]?.toUpperCase() || '?'}
            </div>
            <div 
              className={`
                absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-800
                ${isOnline ? 'bg-green-500' : 'bg-red-500'}
              `}
              title={isOnline ? 'En línea' : 'Desconectado'}
            />
          </div>

          {/* Nombre */}
          <div>
            <h3 className="font-bold text-lg">
              {player?.username || 'Esperando jugador...'}
            </h3>
            <p className="text-xs text-slate-400">
              {isCurrentTurn ? '🎯 Tu turno' : '⏸️ Esperando'}
            </p>
          </div>
        </div>

        {/* Timer (si existe) */}
        {timer !== null && (
          <div 
            className={`
              px-4 py-2 rounded-lg font-mono text-xl font-bold
              ${isCurrentTurn 
                ? timer < 30 
                  ? 'bg-red-600 animate-pulse' 
                  : 'bg-green-600' 
                : 'bg-slate-700'
              }
            `}
          >
            ⏱️ {formatTime(timer)}
          </div>
        )}
      </div>

      {/* Piezas capturadas */}
      {capturedPieces.length > 0 && (
        <div className="mt-3 pt-3 border-t border-slate-700">
          <p className="text-xs text-slate-400 mb-2">Piezas capturadas:</p>
          <div className="flex flex-wrap gap-1">
            {capturedPieces.map((piece, index) => (
              <span 
                key={index}
                className="text-2xl opacity-60"
                title={piece.type}
              >
                {pieceSymbols[piece.type] || piece.symbol}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Indicador de turno */}
      {isCurrentTurn && (
        <div className="mt-3 flex items-center justify-center gap-2 text-green-400 text-sm font-semibold">
          <span className="animate-pulse">●</span>
          Es tu turno de jugar
        </div>
      )}
    </div>
  );
}