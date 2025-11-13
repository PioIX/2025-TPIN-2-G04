// components/Navbar.js
"use client";
import { useRouter } from "next/navigation";
import { userAPI } from "@/lib/api";
import { useState, useEffect } from "react";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    userAPI.logout();
  };

  if (!user) return null;

  return (
    <nav className="bg-slate-800 border-b border-slate-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push("/home")}
              className="text-2xl font-bold text-white hover:text-purple-400 transition"
            >
              ♟️ ChessGame
            </button>
          </div>

          {/* Links de navegación */}
          <div className="hidden md:flex items-center space-x-6">
            <button
              onClick={() => router.push("/home")}
              className="text-slate-300 hover:text-white transition font-medium"
            >
              🏠 Inicio
            </button>
            <button
              onClick={() => router.push("/profile")}
              className="text-slate-300 hover:text-white transition font-medium"
            >
              👤 Perfil
            </button>
          </div>

          {/* Usuario y logout */}
          <div className="flex items-center space-x-4">
            <span className="text-slate-300 hidden sm:block">
              Hola, <span className="text-purple-400 font-semibold">{user.username}</span>
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-semibold text-white transition"
            >
              Salir
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}