module.exports=[85148,(a,b,c)=>{b.exports=a.x("better-sqlite3-90e2652d1716b047",()=>require("better-sqlite3-90e2652d1716b047"))},97729,a=>{"use strict";var b=a.i(85148);let c=a.i(14747).default.join(process.cwd(),"inventario.db"),d=new b.default(c);d.pragma("foreign_keys = ON"),d.exec(`
  CREATE TABLE IF NOT EXISTS areas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT UNIQUE NOT NULL,
    coordinador TEXT
  );

  CREATE TABLE IF NOT EXISTS equipos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    area_id INTEGER,
    numeroinventario TEXT,
    nombre_responsable_inventario TEXT,
    marca_modelo TEXT,
    almacenamiento TEXT,
    memoria_ram TEXT,
    procesador TEXT,
    monitor TEXT,
    mouse_teclado TEXT,
    observaciones TEXT,
    es_mal_estado INTEGER DEFAULT 0,
    fecha TEXT,
    FOREIGN KEY (area_id) REFERENCES areas (id) ON DELETE CASCADE
  );
`),d.pragma("table_info(equipos)").some(a=>"es_mal_estado"===a.name)||d.exec("ALTER TABLE equipos ADD COLUMN es_mal_estado INTEGER DEFAULT 0;"),a.s(["default",0,d])}];

//# sourceMappingURL=%5Broot-of-the-server%5D__6a4deeb5._.js.map