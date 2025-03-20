import { Router } from 'express';
import { db } from '../db.js';
import { properties } from '../../../shared/schema.js';
import { eq } from 'drizzle-orm';
import { verifyToken } from './auth.js';

const router = Router();

// Get all properties
router.get('/', async (req, res) => {
  try {
    const allProperties = await db.select().from(properties);
    res.json(allProperties);
  } catch (error) {
    console.error('Error al obtener propiedades:', error);
    res.status(500).json({ message: 'Error al obtener propiedades' });
  }
});

// Get single property
router.get('/:id', async (req, res) => {
  try {
    const property = await db
      .select()
      .from(properties)
      .where(eq(properties.id, parseInt(req.params.id)));

    if (!property.length) {
      return res.status(404).json({ message: 'Propiedad no encontrada' });
    }

    res.json(property[0]);
  } catch (error) {
    console.error('Error al obtener propiedad:', error);
    res.status(500).json({ message: 'Error al obtener la propiedad' });
  }
});

// Create property (protected)
router.post('/', verifyToken, async (req, res) => {
  try {
    const now = Math.floor(Date.now() / 1000);
    const newProperty = {
      ...req.body,
      created_at: now,
      updated_at: now
    };

    const result = await db.insert(properties).values(newProperty);
    res.status(201).json({ 
      message: 'Propiedad creada', 
      id: result.lastInsertRowid,
      property: newProperty
    });
  } catch (error) {
    console.error('Error al crear propiedad:', error);
    res.status(500).json({ 
      message: 'Error al crear la propiedad',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

// Update property (protected)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const propertyId = parseInt(req.params.id);
    const existingProperty = await db
      .select()
      .from(properties)
      .where(eq(properties.id, propertyId));

    if (!existingProperty.length) {
      return res.status(404).json({ message: 'Propiedad no encontrada' });
    }

    const updateData = {
      ...req.body,
      updated_at: Math.floor(Date.now() / 1000)
    };

    await db
      .update(properties)
      .set(updateData)
      .where(eq(properties.id, propertyId));

    res.json({ 
      message: 'Propiedad actualizada',
      property: { ...updateData, id: propertyId }
    });
  } catch (error) {
    console.error('Error al actualizar propiedad:', error);
    res.status(500).json({ 
      message: 'Error al actualizar la propiedad',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

// Delete property (protected)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const propertyId = parseInt(req.params.id);
    const existingProperty = await db
      .select()
      .from(properties)
      .where(eq(properties.id, propertyId));

    if (!existingProperty.length) {
      return res.status(404).json({ message: 'Propiedad no encontrada' });
    }

    await db
      .delete(properties)
      .where(eq(properties.id, propertyId));

    res.json({ 
      message: 'Propiedad eliminada',
      id: propertyId
    });
  } catch (error) {
    console.error('Error al eliminar propiedad:', error);
    res.status(500).json({ 
      message: 'Error al eliminar la propiedad',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

export default router; 