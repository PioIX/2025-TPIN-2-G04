// componentes/BarraLateral.js
"use client";
import styles from "../src/app/home/page.module.css";

export default function BarraLateral({ user }) {
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className={styles.barra}>
      <h2>♟️ Ajedrez Online</h2>
      <p><strong>{user ? user.username : "Invitado"}</strong></p>
      <hr />
      <nav>
        <ul>
          <li><a href="/home">🏠 Home</a></li>
          <li><a href="/perfil">👤 Perfil</a></li>
          <li><a href="#" onClick={handleLogout}>🚪 Cerrar sesión</a></li>
        </ul>
      </nav>
    </div>
  );
}
