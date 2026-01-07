import express from 'express';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';

// Servicios (factory functions)
import { createUserService } from './services/UserService.js';
import { createMessageService } from './services/MessageService.js';
import { createConnectionService } from './services/ConnectionService.js';
import { createGameRoomService } from './services/GameRoomService.js';
import { createMatchmakingService } from './services/MatchmakingService.js';

// Controladores (factory functions)
import { createUserController } from './controllers/UserController.js';
import { createMessageController } from './controllers/MessageController.js';
import { createConnectionController } from './controllers/ConnectionController.js';

// Rutas (factory functions)
import { createUserRoutes } from './routes/Users.js';
import { createMessageRoutes } from './routes/Messages.js';
import { createConnectionRoutes } from './routes/Connections.js';

// Para obtener __dirname en ES modules

// @ts-ignore
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ==================== CONFIGURACIÓN DE DEPENDENCIAS ====================
// Aquí se construye toda la cadena de dependencias de la aplicación
// Esto facilita el testing al permitir inyectar mocks en cualquier nivel

// 1. Crear servicios (capa de datos)
const userService = createUserService();
const messageService = createMessageService(userService);  // messageService depende de userService
const connectionService = createConnectionService();
const gameRoomService = createGameRoomService();
const matchmakingService = createMatchmakingService(gameRoomService);

// 2. Crear controladores inyectando servicios (capa de lógica)
const userController = createUserController(userService);
const messageController = createMessageController(messageService);
const connectionController = createConnectionController(connectionService);

// 3. Crear routers inyectando controladores (capa de rutas)
const userRoutes = createUserRoutes(userController);
const messageRoutes = createMessageRoutes(messageController);
const connectionRoutes = createConnectionRoutes(connectionController);

// ==================== SERVIDOR ====================

const app = express();
const PORT = 8080;
const HOST = '0.0.0.0';

// ==================== MIDDLEWARE ====================

// Parse JSON bodies
app.use(express.json());

// Log de peticiones (simple logger)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// CORS simple (permitir todas las peticiones)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  // Manejar preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
});

// Servir archivos estáticos del juego (dist/)
app.use(express.static(path.join(__dirname, '../../dist')));

// ==================== RUTAS ====================

app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/connected', connectionRoutes);

// SPA Fallback - Servir index.html para todas las rutas que no sean API
// Esto debe ir DESPUÉS de las rutas de la API y ANTES del error handler
app.use((req, res, next) => {
  // Si la petición es a /api/*, pasar al siguiente middleware (404 para APIs)
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'Endpoint no encontrado' });
  }

  // Para cualquier otra ruta, servir el index.html del juego
  res.sendFile(path.join(__dirname, '../../dist/index.html'));
});

// ==================== ERROR HANDLER ====================

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor'
  });
});


// ==================== WEBSOCKET SERVER ====================

const server = createServer(app);
const wss = new WebSocketServer({ server });

// Manejar conexiones WebSocket
wss.on('connection', (ws) => {
  console.log('Cliente WebSocket conectado');
  // @ts-ignore
  ws.roomId = null;

  ws.on('message', (message) => {
    try {
      const msgString = message.toString();
      const data = JSON.parse(msgString);
      console.log('Mensaje recibido:', data);
      
      // Manejar los diferentes tipos de mensajes ----
      switch (data.type) {
        case 'JOIN_QUEUE':
          matchmakingService.joinQueue(ws, data.userId);
          break;

        case 'LEAVE_QUEUE':
          //----Implementar lógica de salir de la cola-------------- 
          matchmakingService.leaveQueue(ws);
          break;

        case 'PLAYER_READY':
          //----Implementar lógica de jugador listo-------------- 
          gameRoomService.setPlayerReady(ws);
          break;

        case 'PLAYER_ACTION':
          //----Implementar lógica de acción del jugador-------------- 
          gameRoomService.handlePlayerAction(ws, data.action);
          break;

        case 'PLAYER_MOVE':
          //---Implementar lógica de movimiento de un jugador---
          wss.clients.forEach(client => {
            if (client !== ws && client.readyState === 1) {
              client.send(JSON.stringify({
              type: 'PLAYER_MOVED',
              player: data.player,
              x: data.x,
              y: data.y 
              }));
            }
          });
          break;

        case 'POINT':
          //----Implementar lógica de puntuación-------------- 
          //gameRoomService.handlePoint(ws, data.point);
          break;

        default:
          console.log('Mensaje desconocido:', data.type);
      }


    } catch (error) {
      console.error('Error procesando mensaje:', error);
    }
  });

  //Cuando el cliente se desconecta
  ws.on('close', () => {
    console.log('Cliente WebSocket desconectado');
    matchmakingService.leaveQueue(ws);
    gameRoomService.handleDisconnect(ws);
  });

  // Manejar errores en la conexión WebSocket --- Implementar según sea necesario ---
  ws.on('error', (error) => {
    console.error('Error en WebSocket:', error);
  });
});

function getLocalIPs() {
  const interfaces = os.networkInterfaces();
  const ips = [];

  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        ips.push(iface.address);
      }
    }
  }
  return ips;
}

// ==================== INICIO DEL SERVIDOR ====================

server.listen(PORT, HOST, () => {
  const ip = getLocalIPs();

  console.log('========================================');
  console.log('  SERVIDOR PARA VIDEOJUEGO');
  console.log('========================================');
  console.log(`  Servidor corriendo en http://${ip}:${PORT}`);
  console.log(`  WebSocket disponible en ws://${ip}:${PORT}`);
  console.log(`  `);
  console.log(`  🎮 Juego: http://${ip}:${PORT}`);
  console.log('========================================\n');
});
