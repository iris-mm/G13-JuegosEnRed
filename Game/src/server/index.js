import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import { createConnectionModule } from './modules/ConnectionModule.js';
import { createConnectionController } from './controllers/ConnectionController.js';
import { createConnectionRoutes } from './routes/Connections.js';

import { createUserModule } from './modules/UserModule.js';
import { createUserController } from './controllers/UserController.js';
import { createUserRoutes } from './routes/Users.js';

// Para obtener __dirname en ES modules
// @ts-ignore
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ==================== CONFIGURACIÓN DE DEPENDENCIAS ====================

// 1. Crear servicios (capa de datos)
const userModule = createUserModule();
const connectionModule = createConnectionModule();

// 2. Crear controladores inyectando servicios (capa de lógica)
const userController = createUserController(userModule);
const connectionController = createConnectionController(connectionModule);

// 3. Crear routers inyectando controladores (capa de rutas)
const userRoutes = createUserRoutes(userController);
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
app.use('/api/connected', connectionRoutes);

// SPA Fallback - Servir index.html para todas las rutas que no sean API
// Esto debe ir DESPUÉS de las rutas de la API y ANTES del error handler
app.use((req, res, next) => {
  // Si la petición es a /api/*, pasar al siguiente middleware (404 para APIs)
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: '# Endpoint no encontrado #' });
  }

  // Para cualquier otra ruta, servir el index.html del juego
  res.sendFile(path.join(__dirname, '../../dist/index.html'));
});

// ==================== ERROR HANDLER ====================

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || '# Error interno del servidor #'
  });
});

// ==================== INICIO DEL SERVIDOR ====================

app.listen(PORT, () => {
  console.log('========================================');
  console.log('  SERVIDOR DE CHAT PARA VIDEOJUEGO');
  console.log('========================================');
  console.log(`  Servidor corriendo en http://localhost:${PORT}`);
  console.log(`  `);
  console.log(`  Juego: http://localhost:${PORT}`);
  console.log('========================================\n');
});
