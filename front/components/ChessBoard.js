// components/ChessBoard.js
"use client";
import { useState } from "react";

export default function ChessBoard({ onMove, disabled = false }) {
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [boardState, setBoardState] = useState(initializeBoard());

  // Inicializar tablero con piezas en posición inicial
  function initializeBoard() {
    const board = Array(8).fill(null).map(() => Array(8).fill(null));
    
    // Peones negros
    for (let i = 0; i < 8; i++) {
      board[1][i] = { type: 'pawn', color: 'black', symbol: '♟' };
    }
    
    // Peones blancos
    for (let i = 0; i < 8; i++) {
      board[6][i] = { type: 'pawn', color: 'white', symbol: '♙' };
    }
    
    // Piezas negras
    board[0][0] = { type: 'rook', color: 'black', symbol: '♜' };
    board[0][1] = { type: 'knight', color: 'black', symbol: '♞' };
    board[0][2] = { type: 'bishop', color: 'black', symbol: '♝' };
    board[0][3] = { type: 'queen', color: 'black', symbol: '♛' };
    board[0][4] = { type: 'king', color: 'black', symbol: '♚' };
    board[0][5] = { type: 'bishop', color: 'black', symbol: '♝' };
    board[0][6] = { type: 'knight', color: 'black', symbol: '♞' };
    board[0][7] = { type: 'rook', color: 'black', symbol: '♜' };
    
    // Piezas blancas
    board[7][0] = { type: 'rook', color: 'white', symbol: '♖' };
    board[7][1] = { type: 'knight', color: 'white', symbol: '♘' };
    board[7][2] = { type: 'bishop', color: 'white', symbol: '♗' };
    board[7][3] = { type: 'queen', color: 'white', symbol: '♕' };
    board[7][4] = { type: 'king', color: 'white', symbol: '♔' };
    board[7][5] = { type: 'bishop', color: 'white', symbol: '♗' };
    board[7][6] = { type: 'knight', color: 'white', symbol: '♘' };
    board[7][7] = { type: 'rook', color: 'white', symbol: '♖' };
    
    return board;
  }

  const handleSquareClick = (row, col) => {
    if (disabled) return;

    if (selectedSquare) {
      // Si ya hay una pieza seleccionada, intentar mover
      const [fromRow, fromCol] = selectedSquare;
      const piece = boardState[fromRow][fromCol];
      
      if (piece) {
        // Crear notación del movimiento
        const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        const from = `${files[fromCol]}${8 - fromRow}`;
        const to = `${files[col]}${8 - row}`;
        const moveNotation = `${from}${to}`;
        
        // Actualizar tablero localmente
        const newBoard = boardState.map(r => [...r]);
        newBoard[row][col] = piece;
        newBoard[fromRow][fromCol] = null;
        setBoardState(newBoard);
        
        // Notificar al componente padre
        if (onMove) {
          onMove(moveNotation, piece.type);
        }
      }
      
      setSelectedSquare(null);
    } else {
      // Seleccionar pieza si hay una en esa casilla
      if (boardState[row][col]) {
        setSelectedSquare([row, col]);
      }
    }
  };

  const isSquareSelected = (row, col) => {
    return selectedSquare && selectedSquare[0] === row && selectedSquare[1] === col;
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="grid grid-cols-8 gap-0 border-4 border-slate-600 rounded-lg overflow-hidden shadow-2xl">
        {boardState.map((row, rowIndex) =>
          row.map((square, colIndex) => {
            const isLight = (rowIndex + colIndex) % 2 === 0;
            const isSelected = isSquareSelected(rowIndex, colIndex);
            
            return (
              <button
                key={`${rowIndex}-${colIndex}`}
                onClick={() => handleSquareClick(rowIndex, colIndex)}
                disabled={disabled}
                className={`
                  aspect-square flex items-center justify-center text-5xl
                  transition-all duration-200 transform
                  ${isLight ? 'bg-amber-100' : 'bg-amber-800'}
                  ${isSelected ? 'ring-4 ring-blue-500 ring-inset scale-95' : ''}
                  ${!disabled && square ? 'hover:scale-95 hover:shadow-inner cursor-pointer' : ''}
                  ${disabled ? 'cursor-not-allowed opacity-50' : ''}
                `}
              >
                {square && (
                  <span 
                    className={`${square.color === 'white' ? 'text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]' : 'text-black'}`}
                  >
                    {square.symbol}
                  </span>
                )}
              </button>
            );
          })
        )}
      </div>
      
      {/* Coordenadas del tablero */}
      <div className="flex justify-around mt-2 text-slate-400 text-sm font-mono">
        <span>a</span>
        <span>b</span>
        <span>c</span>
        <span>d</span>
        <span>e</span>
        <span>f</span>
        <span>g</span>
        <span>h</span>
      </div>
    </div>
  );
}