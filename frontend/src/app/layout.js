// app/layout.js
export const metadata = {
  title: 'Ajedrez Online - Juega en tiempo real',
  description: 'Plataforma de ajedrez online con partidas en tiempo real',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  )
}
