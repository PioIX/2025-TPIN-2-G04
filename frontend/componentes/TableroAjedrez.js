// componentes/Tablero/TableroAjedrez.js
// componentes/TableroAjedrez.js
import Pieza from './Pieza';

export default function TableroAjedrez({ tablero, onMovimiento, seleccionado }) {
  const convertirPieza = (letra) => {
    const piezas = {
      'r': { tipo: 'torre', color: 'negro' },
      'n': { tipo: 'caballo', color: 'negro' },
      'b': { tipo: 'alfil', color: 'negro' },
      'q': { tipo: 'reina', color: 'negro' },
      'k': { tipo: 'rey', color: 'negro' },
      'p': { tipo: 'peon', color: 'negro' },
      'R': { tipo: 'torre', color: 'blanco' },
      'N': { tipo: 'caballo', color: 'blanco' },
      'B': { tipo: 'alfil', color: 'blanco' },
      'Q': { tipo: 'reina', color: 'blanco' },
      'K': { tipo: 'rey', color: 'blanco' },
      'P': { tipo: 'peon', color: 'blanco' }
    };
    return piezas[letra] || null;
  };

  // Letras y números para coordenadas
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

  return (
    <div style={{ position: 'relative' }}>
      {/* Coordenadas superiores */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-around', 
        marginBottom: '5px',
        paddingLeft: '10px',
        paddingRight: '10px'
      }}>
        {files.map(file => (
          <span key={file} style={{ 
            width: '70px', 
            textAlign: 'center',
            color: '#cbd5e1',
            fontSize: '0.9rem',
            fontWeight: 'bold'
          }}>
            {file}
          </span>
        ))}
      </div>

      <div style={{ display: 'flex' }}>
        {/* Coordenadas laterales izquierdas */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'space-around',
          marginRight: '5px',
          paddingTop: '10px',
          paddingBottom: '10px'
        }}>
          {ranks.map(rank => (
            <span key={rank} style={{ 
              height: '70px',
              display: 'flex',
              alignItems: 'center',
              color: '#cbd5e1',
              fontSize: '0.9rem',
              fontWeight: 'bold'
            }}>
              {rank}
            </span>
          ))}
        </div>

        {/* Tablero */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(8, 70px)',
            gridTemplateRows: 'repeat(8, 70px)',
            gap: '0',
            background: '#1e293b',
            borderRadius: '1rem',
            padding: '10px',
            boxShadow: '0 0 30px rgba(0, 0, 0, 0.5)',
            border: '3px solid #334155'
          }}
        >
          {tablero.flat().map((celda, idx) => {
            const fila = Math.floor(idx / 8);
            const col = idx % 8;
            const isSeleccionado = seleccionado && 
              seleccionado.fila === fila && 
              seleccionado.col === col;
            
            const pieza = convertirPieza(celda);

            return (
              <div
                key={idx}
                style={{
                  width: '70px',
                  height: '70px',
                  background: isSeleccionado 
                    ? '#fbbf24' 
                    : (fila + col) % 2 === 0 
                      ? '#f0d9b5' 
                      : '#b58863',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: '0.2s',
                  border: isSeleccionado ? '3px solid #f59e0b' : 'none',
                  boxShadow: isSeleccionado ? '0 0 15px rgba(251, 191, 36, 0.6)' : 'none'
                }}
                onClick={() => onMovimiento(idx)}
                onMouseEnter={(e) => {
                  if (!isSeleccionado) {
                    e.target.style.opacity = '0.8';
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.opacity = '1';
                }}
              >
                {pieza && <Pieza tipo={pieza.tipo} color={pieza.color} />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}