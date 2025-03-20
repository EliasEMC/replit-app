import { Router } from 'express';
import { db } from '../db.js';
import { settings } from '../../../shared/schema';
import { eq } from 'drizzle-orm';
import jwt from 'jsonwebtoken';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware de autenticación
const validateToken = async (req: any, res: any, next: any) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Token no proporcionado' });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; username: string };
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: 'Token inválido' });
    }
    console.error('Error en autenticación:', error);
    res.status(500).json({ error: 'Error de autenticación' });
  }
};

// Get all settings
router.get('/', validateToken, async (req, res) => {
  try {
    const allSettings = await db.select().from(settings);
    res.json(allSettings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Error al obtener configuraciones' });
  }
});

// Update setting
router.put('/:key', validateToken, async (req, res) => {
  try {
    const { key } = req.params;
    const { value } = req.body;

    const [updatedSetting] = await db
      .update(settings)
      .set({ 
        value,
        updated_at: Math.floor(Date.now() / 1000)
      })
      .where(eq(settings.key, key))
      .returning();

    if (!updatedSetting) {
      return res.status(404).json({ error: 'Configuración no encontrada' });
    }

    res.json(updatedSetting);
  } catch (error) {
    console.error('Error updating setting:', error);
    res.status(500).json({ error: 'Error al actualizar configuración' });
  }
});

export default router; 