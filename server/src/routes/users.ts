import { Router } from 'express';
import { db } from '../db.js';
import { users } from '../../../shared/schema';
import { eq, and, not } from 'drizzle-orm';
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

// Get all users
router.get('/', validateToken, async (req, res) => {
  try {
    const allUsers = await db.select().from(users).orderBy(users.name);
    res.json(allUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

// Create new user
router.post('/', validateToken, async (req, res) => {
  try {
    const { name, email, phone, role, status } = req.body;
    
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    const [newUser] = await db.insert(users).values({
      name,
      email,
      phone,
      role,
      status,
      createdAt: Math.floor(Date.now() / 1000)
    }).returning();

    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Error al crear usuario' });
  }
});

// Update user
router.put('/:id', validateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, role, status } = req.body;

    const existingUser = await db
      .select()
      .from(users)
      .where(
        and(
          eq(users.email, email),
          not(eq(users.id, parseInt(id, 10)))
        )
      )
      .limit(1);

    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'El email ya está registrado por otro usuario' });
    }

    const [updatedUser] = await db
      .update(users)
      .set({ name, email, phone, role, status })
      .where(eq(users.id, parseInt(id, 10)))
      .returning();

    if (!updatedUser) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
});

// Delete user
router.delete('/:id', validateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const [deletedUser] = await db
      .delete(users)
      .where(eq(users.id, parseInt(id, 10)))
      .returning();

    if (!deletedUser) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
});

export default router; 