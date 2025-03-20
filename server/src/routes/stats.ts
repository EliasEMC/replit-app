import { Router } from 'express';
import { db } from '../db.js';
import { properties, users } from '../../../shared/schema';
import { sql } from 'drizzle-orm';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

interface AuthRequest extends Request {
  user?: {
    id: number;
    username: string;
  };
}

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware de autenticación
const validateToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    console.log('Validating token...');
    const token = req.headers.authorization?.split(' ')[1];
    console.log('Token received:', token ? 'Yes' : 'No');
    
    if (!token) {
      console.log('No token provided');
      return res.status(401).json({ error: 'Token no proporcionado' });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; username: string };
    console.log('Token decoded successfully:', decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token validation error:', error);
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: 'Token inválido' });
    }
    console.error('Error en autenticación:', error);
    res.status(500).json({ error: 'Error de autenticación' });
  }
};

// Get general statistics
router.get('/', validateToken, async (req: AuthRequest, res: Response) => {
  try {
    console.log('Getting stats for user:', req.user);
    
    // Datos de prueba para estadísticas
    const mockStats = {
      totalProperties: 156,
      activeProperties: 89,
      soldProperties: 67,
      totalValue: 45678900,
      averagePrice: 292812,
      propertiesByType: [
        { type: 'house', count: 65 },
        { type: 'apartment', count: 48 },
        { type: 'commercial', count: 25 },
        { type: 'land', count: 18 }
      ],
      propertiesByStatus: [
        { status: 'active', count: 89 },
        { status: 'sold', count: 67 },
        { status: 'inactive', count: 12 }
      ],
      recentActivity: [
        {
          date: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutos atrás
          property: "Casa de Lujo en Valle Real",
          action: "Vendida"
        },
        {
          date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 horas atrás
          property: "Departamento Vista al Mar",
          action: "Activada"
        },
        {
          date: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 horas atrás
          property: "Local Comercial Centro",
          action: "Actualizada"
        },
        {
          date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 día atrás
          property: "Terreno Industrial",
          action: "Activada"
        },
        {
          date: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 días atrás
          property: "Casa en Condominio",
          action: "Vendida"
        }
      ],
      // Datos adicionales para gráficos
      monthlyStats: [
        { month: 'Ene', sales: 8, listings: 12 },
        { month: 'Feb', sales: 10, listings: 15 },
        { month: 'Mar', sales: 12, listings: 18 },
        { month: 'Abr', sales: 9, listings: 14 },
        { month: 'May', sales: 11, listings: 16 },
        { month: 'Jun', sales: 15, listings: 20 }
      ],
      priceRanges: [
        { range: '0-100k', count: 25 },
        { range: '100k-200k', count: 45 },
        { range: '200k-300k', count: 35 },
        { range: '300k-500k', count: 30 },
        { range: '500k+', count: 21 }
      ],
      topAreas: [
        { area: 'Centro', count: 35, value: 12500000 },
        { area: 'Norte', count: 42, value: 15800000 },
        { area: 'Sur', count: 28, value: 8900000 },
        { area: 'Este', count: 31, value: 5600000 },
        { area: 'Oeste', count: 20, value: 2878900 }
      ],
      propertyFeatures: [
        { feature: 'Piscina', count: 45 },
        { feature: 'Jardín', count: 78 },
        { feature: 'Garage', count: 92 },
        { feature: 'Seguridad 24/7', count: 65 },
        { feature: 'Amueblado', count: 34 }
      ]
    };

    console.log('Sending stats response');
    res.json(mockStats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
});

export default router; 