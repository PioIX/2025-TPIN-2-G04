// app/layout.js
import './globals.css'

export const metadata = {
  title: 'Chess Game - Juego de Ajedrez Online',
  description: 'Plataforma de ajedrez online con partidas en tiempo real',
  keywords: 'ajedrez, chess, juego online, partidas en vivo',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="antialiased">
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  )
}
