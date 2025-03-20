import express from 'express';
import cors from 'cors';
import { initializeDatabase } from './db.js';
import { initializeDatabase as initializeDefaultData } from './init-db.js';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 9000;

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

    // Rutas
    app.get('/', (req, res) => {
      res.json({ message: 'API funcionando correctamente' });
    });

    // Importar y registrar las rutas
    console.log('Registrando rutas...');
    
    const propertiesRoutes = (await import('./routes/properties.js')).default;
    app.use('/api/properties', propertiesRoutes);
    console.log('Rutas de propiedades registradas');
    
    const settingsRoutes = (await import('./routes/settings.js')).default;
    app.use('/api/settings', settingsRoutes);
    console.log('Rutas de configuración registradas');
    
    const statsRoutes = (await import('./routes/stats.js')).default;
    app.use('/api/stats', statsRoutes);
    console.log('Rutas de estadísticas registradas');
    
    const usersRoutes = (await import('./routes/users.js')).default;
    app.use('/api/users', usersRoutes);
    console.log('Rutas de usuarios registradas');

    // Middleware para manejar rutas no encontradas
    app.use((req, res) => {
      console.log('Ruta no encontrada:', req.method, req.url);
      res.status(404).json({ error: 'Ruta no encontrada' });
    });

    // Middleware para manejar errores
    app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
      console.error('Error no manejado:', err);
      res.status(500).json({ 
        error: 'Error interno del servidor',
        details: err.message
      });
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