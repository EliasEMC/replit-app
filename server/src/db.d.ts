import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import * as schema from '../shared/schema';

export declare const db: BetterSQLite3Database<typeof schema>;
export declare function initializeDb(): Promise<void>; 