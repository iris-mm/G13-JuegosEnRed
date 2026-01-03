import express from 'express';
import path from 'path';
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

wss.on('connection', (ws) => {
  console.log('Cliente WebSocket conectado');

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);

      switch (data.type) {
        case 'joinQueue':
          matchmakingService.joinQueue(ws);
          break;

        case 'leaveQueue':
          matchmakingService.leaveQueue(ws);
          break;

        default:
          console.log('Mensaje desconocido:', data.type);
      }
    } catch (error) {
      console.error('Error procesando mensaje:', error);
    }
  });

  ws.on('close', () => {
    console.log('Cliente WebSocket desconectado');
    matchmakingService.leaveQueue(ws);
    gameRoomService.handleDisconnect(ws);
  });

  ws.on('error', (error) => {
    console.error('Error en WebSocket:', error);
  });
});

// ==================== INICIO DEL SERVIDOR ====================

server.listen(PORT, () => {
  console.log('========================================');
  console.log('  SERVIDOR PARA VIDEOJUEGO');
  console.log('========================================');
  console.log(`  Servidor corriendo en http://localhost:${PORT}`);
  console.log(`  WebSocket disponible en ws://localhost:${PORT}`);
  console.log(`  `);
  console.log(`  🎮 Juego: http://localhost:${PORT}`);
  console.log('========================================\n');
});
