import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'inventario.db');
const db = new Database(dbPath);

db.pragma('foreign_keys = ON');

// Migración segura: añade la columna si ya existe la tabla sin ella
const cols = db.pragma('table_info(equipos)');
if (!cols.some(c => c.name === 'es_mal_estado')) {
  db.exec(`ALTER TABLE equipos ADD COLUMN es_mal_estado INTEGER DEFAULT 0;`);
}

export default db;