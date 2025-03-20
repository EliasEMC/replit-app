import express from 'express';
import cors from 'cors';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { initializeDatabase } from './src/db.js';
import { initializeDatabase as initializeDefaultData } from './src/init-db.js';
import propertiesRouter from './src/routes/properties.js';
import settingsRouter from './src/routes/settings.js';
import statsRouter from './src/routes/stats.js';
import usersRouter from './src/routes/users.js';
import authRouter from './src/routes/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const PORT = process.env.PORT || 9000;

// Middleware
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Rutas
app.use('/api/auth', authRouter);
app.use('/api/properties', propertiesRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/stats', statsRouter);
app.use('/api/users', usersRouter);

// Manejo de errores
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo salió mal!' });
});

async function startServer() {
  try {
    console.log('Iniciando servidor...');
    
    // Inicializar la base de datos
    console.log('Inicializando base de datos...');
    await initializeDatabase();
    console.log('Base de datos inicializada correctamente');
    
    // Inicializar datos por defecto
    console.log('Inicializando datos por defecto...');
    await initializeDefaultData();
    console.log('Datos por defecto inicializados correctamente');
    
    // Servir archivos estáticos del cliente
    const clientDistPath = path.resolve(__dirname, '..', 'dist', 'public');
    app.use(express.static(clientDistPath));

    // Manejar todas las rutas del cliente
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(clientDistPath, 'index.html'));
    });

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
}

startServer();
