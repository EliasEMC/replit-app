import { Router } from 'express';
import { db } from '../db.js';
import { admins } from '../../../shared/schema.js';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // En producción, usar variable de entorno

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.log('Intento de login para usuario:', username);

  try {
    // Buscar el admin por username
    const admin = await db.select().from(admins).where(eq(admins.username, username));
    console.log('Usuario encontrado:', admin);

    if (!admin || admin.length === 0) {
      console.log('Usuario no encontrado');
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Verificar la contraseña
    const isValid = await bcrypt.compare(password, admin[0].password);
    console.log('Contraseña válida:', isValid);

    if (!isValid) {
      console.log('Contraseña incorrecta');
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Actualizar último login con timestamp Unix en segundos
    await db
      .update(admins)
      .set({ last_login: Math.floor(Date.now() / 1000) })
      .where(eq(admins.id, admin[0].id));

    // Generar token JWT
    const token = jwt.sign(
      { id: admin[0].id, username: admin[0].username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('Login exitoso para usuario:', username);
    res.json({ token });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Middleware para verificar token
export const verifyToken = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido' });
  }
};

export default router; 