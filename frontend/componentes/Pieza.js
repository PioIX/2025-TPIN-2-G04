// componentes/Pieza.js
export default function Pieza({ tipo, color }) {
  const simbolos = {
    rey: { blanco: '♔', negro: '♚' },
    reina: { blanco: '♕', negro: '♛' },
    torre: { blanco: '♖', negro: '♜' },
    alfil: { blanco: '♗', negro: '♝' },
    caballo: { blanco: '♘', negro: '♞' },
    peon: { blanco: '♙', negro: '♟' }
  };

  return (
    <span 
      style={{ 
        fontSize: '2.5rem',
        userSelect: 'none',
        textShadow: color === 'blanco' 
          ? '1px 1px 3px rgba(0,0,0,0.5)' 
          : '1px 1px 3px rgba(255,255,255,0.3)',
        transition: '0.2s',
        display: 'inline-block'
      }}
      onMouseEnter={(e) => {
        e.target.style.transform = 'scale(1.1)';
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = 'scale(1)';
      }}
    >
      {simbolos[tipo][color]}
    </span>
  );
}