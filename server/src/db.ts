import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from '../../shared/schema';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { sql } from 'drizzle-orm';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = path.resolve(__dirname, '../../../sqlite.db');

console.log('Database path:', dbPath);

// Asegurarse de que el directorio existe
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  console.log('Creating database directory:', dbDir);
  fs.mkdirSync(dbDir, { recursive: true });
}

// Inicializar la base de datos
const sqlite = new Database(dbPath);
export const db = drizzle(sqlite, { schema });

// Función para inicializar la base de datos
export async function initializeDatabase() {
  try {
    console.log('Iniciando configuración de la base de datos...');
    
    // Crear tablas
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS properties (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL,
        listing_type TEXT NOT NULL,
        name TEXT NOT NULL,
        location TEXT NOT NULL,
        property_type TEXT NOT NULL,
        price REAL NOT NULL,
        surface REAL NOT NULL,
        construction REAL,
        description TEXT NOT NULL,
        technical_sheet TEXT,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        status TEXT NOT NULL DEFAULT 'active',
        created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
        updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
      )
    `);

    await db.run(sql`
      CREATE TABLE IF NOT EXISTS property_images (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        property_id INTEGER NOT NULL,
        url TEXT NOT NULL,
        is_main INTEGER NOT NULL DEFAULT 0,
        created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
        updated_at INTEGER,
        FOREIGN KEY (property_id) REFERENCES properties(id)
      )
    `);

    await db.run(sql`
      CREATE TABLE IF NOT EXISTS settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        key TEXT NOT NULL UNIQUE,
        value TEXT NOT NULL,
        category TEXT NOT NULL,
        description TEXT,
        updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
      )
    `);

    await db.run(sql`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        phone TEXT,
        role TEXT NOT NULL DEFAULT 'user',
        status TEXT NOT NULL DEFAULT 'active',
        created_at INTEGER NOT NULL,
        last_login INTEGER
      )
    `);

    await db.run(sql`
      CREATE TABLE IF NOT EXISTS admins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        last_login INTEGER
      )
    `);

    console.log('Base de datos inicializada correctamente');

    // Verificar si la base de datos está conectada
    await db.select().from(schema.properties).limit(1);
    console.log('Base de datos conectada correctamente');
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error);
    throw error;
  }
}

// Exportar una función para verificar el estado de la base de datos
export function checkDatabaseHealth() {
  try {
    // Verificar que el archivo existe
    if (!fs.existsSync(dbPath)) {
      return {
        status: 'error',
        error: 'Database file does not exist'
      };
    }

    // Verificar permisos
    const stats = fs.statSync(dbPath);
    if ((stats.mode & 0o600) !== 0o600) {
      return {
        status: 'error',
        error: 'Insufficient database file permissions'
      };
    }

    // Verificar tablas
    const tables = sqlite.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
    if (!tables.some((t: any) => t.name === 'properties')) {
      return {
        status: 'error',
        error: 'Properties table does not exist'
      };
    }

    // Verificar que podemos hacer una consulta simple
    const testQuery = sqlite.prepare('SELECT 1 as test').get();
    if (!testQuery || (testQuery as any).test !== 1) {
      return {
        status: 'error',
        error: 'Failed to execute test query'
      };
    }

    const propertiesCount = sqlite.prepare("SELECT COUNT(*) as count FROM properties").get();
    return {
      status: 'healthy',
      tables: tables.map((t: any) => t.name),
      propertiesCount
    };
  } catch (error) {
    console.error('Database health check failed:', error);
    return {
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Resto del código de inicialización... 