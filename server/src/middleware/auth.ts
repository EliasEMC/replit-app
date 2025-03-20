import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../db';
import { users } from '../../../shared/schema';
import { eq } from 'drizzle-orm';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface JwtPayload {
  userId: number;
  role: string;
}

export const validateAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Token no proporcionado' });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, decoded.userId))
      .limit(1);

    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Acceso no autorizado' });
    }

    // Update last login time
    await db
      .update(users)
      .set({ lastLogin: Math.floor(Date.now() / 1000) })
      .where(eq(users.id, decoded.userId));

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: 'Token inválido' });
    }
    console.error('Error in auth middleware:', error);
    res.status(500).json({ error: 'Error de autenticación' });
  }
}; 