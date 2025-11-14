// frontend/api.js
const RAW_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

/**
 * Construye URL robusta para evitar //api o faltantes
 * Recibe endpoints como "/users/login" o "users/login"
 */
function buildUrl(endpoint) {
  const base = RAW_BASE.replace(/\/+$/, "");            // quitar slash final
  const ep = endpoint.startsWith("/") ? endpoint : "/" + endpoint;
  // si la base ya incluye /api, no agregar otra vez
  if (base.endsWith("/api")) return `${base}${ep}`;
  return `${base}/api${ep}`;
}

export async function apiPost(endpoint, data, token = null) {
  const url = buildUrl(endpoint);

  // validación extra para debug
  if (!url.startsWith("http")) {
    throw new Error(`URL construida inválida: "${url}"`);
  }

  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  try {
    // Log útil para debug (lo podés comentar después)
    console.log("[apiPost] POST", url, "data:", data);

    const respuesta = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(data)
    });

    // Si el servidor respondió con error HTTP (500, 400, etc.)
    const text = await respuesta.text(); // leemos siempre el body (para debug)
    let json;
    try { json = text ? JSON.parse(text) : null; } catch (e) {
      json = { raw: text };
    }

    if (!respuesta.ok) {
      // lanzamos error con información completa
      const err = new Error(`HTTP ${respuesta.status} ${respuesta.statusText}`);
      err.status = respuesta.status;
      err.body = json;
      console.error("[apiPost] respuesta no ok:", err);
      throw err;
    }

    return json;
  } catch (error) {
    // Distinguimos network/CORS de errores HTTP
    console.error("[apiPost] Error en fetch:", error);
    // Para que el frontend pueda mostrar un mensaje claro
    throw error;
  }
}
