# 2025-TPIN-2-G04

# Ajedrez Online

Esta aplicación permite jugar al ajedrez en línea entre dos jugadores en tiempo real. Está desarrollada utilizando **React** y **Next.js**, con comunicación en tiempo real mediante **WebSockets**. El sistema permite que dos usuarios se conecten a través de un lobby, inicien sesión y jueguen al ajedrez en un tablero compartido.

## Funcionamiento

### 1. **Login**
   - Al ingresar a la página, el usuario será recibido con una pantalla de **login** donde podrá ingresar su nombre de usuario y contraseña.
   - Si no tiene una cuenta, puede crearla. Los datos se validan y almacenan en una base de datos usando MySQL.
   - Una vez autenticado, el usuario será redirigido al **Lobby**.

### 2. **Home / Lobby**
   - El lobby es el lugar donde los jugadores pueden ver a otros usuarios disponibles para jugar. 
   - En esta pantalla, los usuarios pueden elegir un oponente para iniciar una partida de ajedrez. Los jugadores pueden unirse a partidas existentes o crear nuevas.
   - Cada partida se muestra como un "lobby" con un estado de espera hasta que ambos jugadores estén listos.

### 3. **Juego de Ajedrez**
   - Una vez que dos jugadores se han unido a una partida, el juego de ajedrez comienza en el tablero compartido.
   - El juego se maneja en tiempo real mediante WebSockets, lo que permite que los movimientos se sincronicen automáticamente entre las dos computadoras.
   - Los jugadores pueden mover las piezas de acuerdo con las reglas del ajedrez. Los movimientos se validan y se actualiza el tablero para ambos jugadores.
   - El sistema también gestiona el estado del juego, como cuando se termina una partida (jaque mate, empate, etc.).

### 4. **Tecnologías Utilizadas**
   - **Frontend**: React, Next.js.
   - **Backend**: Node.js, WebSockets para comunicación en tiempo real.
   - **Base de Datos**: MySQL (o la base de datos que elijas).
   - **Autenticación**: Utiliza un sistema de login basado en usuarios con autenticación mediante sesiones.

### 5. **Requisitos**
   - Node.js instalado.
   - MySQL o el sistema de base de datos que prefieras.
   - Un servidor de WebSocket configurado para gestionar la comunicación en tiempo real.
