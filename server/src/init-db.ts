import { db } from './db.js';
import { properties, settings, admins } from '../../shared/schema.js';
import bcrypt from 'bcrypt';

export async function initializeDatabase() {
  try {
    // Crear admin por defecto
    const existingAdmins = await db.select().from(admins);
    if (existingAdmins.length === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await db.insert(admins).values({
        username: 'admin',
        password: hashedPassword,
        created_at: Math.floor(Date.now() / 1000),
        last_login: null
      });
    }

    // Crear configuraciones por defecto
    const existingSettings = await db.select().from(settings);
    if (existingSettings.length === 0) {
      const now = Math.floor(Date.now() / 1000);
      const defaultSettings = [
        {
          key: 'site_name',
          value: 'Modern Real Estate',
          category: 'general',
          description: 'Nombre del sitio web',
          updated_at: now
        },
        {
          key: 'contact_email',
          value: 'contact@modernestate.com',
          category: 'contact',
          description: 'Email de contacto principal',
          updated_at: now
        },
        {
          key: 'contact_phone',
          value: '+1234567890',
          category: 'contact',
          description: 'Teléfono de contacto principal',
          updated_at: now
        }
      ];
      await db.insert(settings).values(defaultSettings);
    }

    // Crear propiedades de prueba
    const existingProperties = await db.select().from(properties);
    if (existingProperties.length === 0) {
      const now = Math.floor(Date.now() / 1000);
      const testProperties = [
        {
          type: 'industrial',
          listing_type: 'sale',
          name: 'Nave Industrial Moderna',
          location: 'Parque Industrial Norte',
          property_type: 'warehouse',
          price: 2500000,
          surface: 5000,
          construction: 4500,
          description: 'Moderna nave industrial con excelente ubicación',
          technical_sheet: 'Altura: 12m, Andenes: 4, Oficinas: 500m²',
          latitude: 19.4326,
          longitude: -99.1332,
          status: 'active',
          created_at: now,
          updated_at: now
        },
        {
          type: 'commercial',
          listing_type: 'rent',
          name: 'Local Comercial Centro',
          location: 'Av. Principal 123',
          property_type: 'retail',
          price: 25000,
          surface: 150,
          construction: 150,
          description: 'Local comercial en ubicación privilegiada',
          latitude: 19.4326,
          longitude: -99.1332,
          status: 'active',
          created_at: now,
          updated_at: now
        },
        {
          type: 'residential',
          listing_type: 'sale',
          name: 'Casa Moderna Valle Real',
          location: 'Valle Real 456',
          property_type: 'house',
          price: 850000,
          surface: 300,
          construction: 250,
          description: 'Hermosa casa moderna con acabados de lujo',
          latitude: 19.4326,
          longitude: -99.1332,
          status: 'active',
          created_at: now,
          updated_at: now
        }
      ];
      await db.insert(properties).values(testProperties);
    }

    console.log('Datos iniciales creados correctamente');
  } catch (error) {
    console.error('Error al crear datos iniciales:', error);
    throw error;
  }
} 