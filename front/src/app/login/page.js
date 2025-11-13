"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { userAPI } from "../../../lib/api";
import styles from "./page.module.css";

export default function LoginPage() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (isRegister) {
        // Registrar
        await userAPI.register(username, email, password);
        setMessage("✨ Cuenta creada con éxito. Ahora iniciá sesión");
        setIsRegister(false);
        // Limpiar campos
        setUsername("");
        setPassword("");
      } else {
        // Login
        const data = await userAPI.login(email, password);
        console.log("Login exitoso:", data);
        router.push("/home");
      }
    } catch (err) {
      console.error("Error:", err);
      setMessage(err.message || "Error de autenticación");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="bg-slate-800/90 backdrop-blur-sm p-10 rounded-2xl shadow-2xl w-full max-w-md border border-slate-700">
        <h1 className="text-4xl font-bold text-center mb-8 text-white">
          {isRegister ? "🧩 Crear Cuenta" : "♟️ Iniciar Sesión"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {isRegister && (
            <input
              className="w-full p-4 rounded-lg bg-slate-700 text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-purple-500 transition"
              type="text"
              placeholder="Nombre de usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
            />
          )}

          <input
            className="w-full p-4 rounded-lg bg-slate-700 text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-purple-500 transition"
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />

          <input
            className="w-full p-4 rounded-lg bg-slate-700 text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-purple-500 transition"
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            minLength={6}
          />

          <button
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 rounded-lg transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            type="submit"
            disabled={loading}
          >
            {loading ? "⏳ Cargando..." : isRegister ? "Registrarse" : "Iniciar sesión"}
          </button>
        </form>

        {message && (
          <p
            className={`text-center mt-5 font-medium ${
              message.includes("éxito") || message.includes("✨")
                ? "text-green-400"
                : "text-red-400"
            }`}
          >
            {message}
          </p>
        )}

        <p
          className="text-center mt-6 text-slate-300 hover:text-white cursor-pointer transition"
          onClick={() => {
            setIsRegister(!isRegister);
            setMessage("");
          }}
        >
          {isRegister
            ? "¿Ya tenés cuenta? Iniciá sesión"
            : "¿No tenés cuenta? Registrate acá"}
        </p>
      </div>
    </div>
  );
}