import styles from "../src/app/home/page.module.css";

export default function TarjetaPartida({
  id,
  estado,
  player1,
  player2,
  onUnirse,
  currentUserId
}) {
  const partidaLlena = player1 && player2;

  // No mostrar botón de unirse si ya estoy en la partida
  const puedoUnirme = !partidaLlena && currentUserId !== player1;

  return (
    <div className={styles.tarjeta}>
      <h3>Partida {id}</h3>
      <p>Estado: {estado}</p>
      <p>Jugador 1: {player1}</p>
      <p>Jugador 2: {player2 || "Esperando..."}</p>
      {puedoUnirme && (
        <button className={styles.button} onClick={onUnirse}>
          🚪 Unirse
        </button>
      )}
    </div>
  );
}
