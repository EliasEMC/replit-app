import { sqliteTable, text as sqliteText, integer as sqliteInteger, real as sqliteReal } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const users = sqliteTable('users', {
  id: sqliteInteger('id').primaryKey({ autoIncrement: true }),
  name: sqliteText('name').notNull(),
  email: sqliteText('email').notNull().unique(),
  phone: sqliteText('phone'),
  role: sqliteText('role').notNull().default('user'),
  status: sqliteText('status').notNull().default('active'),
  created_at: sqliteInteger('created_at').notNull(),
  last_login: sqliteInteger('last_login')
});

export const settings = sqliteTable('settings', {
  id: sqliteInteger('id').primaryKey({ autoIncrement: true }),
  key: sqliteText('key').notNull().unique(),
  value: sqliteText('value').notNull(),
  category: sqliteText('category').notNull().default(sql`(strftime('%s', 'now'))`),
  description: sqliteText('description'),
  updated_at: sqliteInteger('updated_at').notNull().default(sql`(strftime('%s', 'now'))`)
});

export const admins = sqliteTable('admins', {
  id: sqliteInteger('id').primaryKey({ autoIncrement: true }),
  username: sqliteText('username').notNull().unique(),
  password: sqliteText('password').notNull(),
  created_at: sqliteInteger('created_at').notNull(),
  last_login: sqliteInteger('last_login')
});

export const properties = sqliteTable('properties', {
  id: sqliteInteger('id').primaryKey({ autoIncrement: true }),
  type: sqliteText('type').notNull(), // industrial, commercial, residential
  listing_type: sqliteText('listing_type').notNull(), // sale, rent
  name: sqliteText('name').notNull(),
  location: sqliteText('location').notNull(),
  property_type: sqliteText('property_type').notNull(),
  price: sqliteReal('price').notNull(),
  surface: sqliteReal('surface').notNull(),
  construction: sqliteReal('construction'),
  //local_size: sqliteText('local_size'),
  description: sqliteText('description').notNull(),
  technical_sheet: sqliteText('technical_sheet'),
  latitude: sqliteReal('latitude').notNull(),
  longitude: sqliteReal('longitude').notNull(),
  status: sqliteText('status').notNull().default('active'),
  created_at: sqliteInteger('created_at').notNull().default(sql`(strftime('%s', 'now'))`),
  updated_at: sqliteInteger('updated_at').notNull().default(sql`(strftime('%s', 'now'))`)
});

export const propertyImages = sqliteTable('property_images', {
  id: sqliteInteger('id').primaryKey({ autoIncrement: true }),
  property_id: sqliteInteger('property_id').notNull().references(() => properties.id),
  url: sqliteText('url').notNull(),
  is_main: sqliteInteger('is_main').notNull().default(0),
  created_at: sqliteInteger('created_at').notNull().default(sql`(strftime('%s', 'now'))`),
  updated_at: sqliteInteger('updated_at')
});
