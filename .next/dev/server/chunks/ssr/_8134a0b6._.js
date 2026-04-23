module.exports = [
"[project]/lib/db.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$better$2d$sqlite3__$5b$external$5d$__$28$better$2d$sqlite3$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$better$2d$sqlite3$29$__ = __turbopack_context__.i("[externals]/better-sqlite3 [external] (better-sqlite3, cjs, [project]/node_modules/better-sqlite3)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
;
;
const dbPath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'inventario.db');
const db = new __TURBOPACK__imported__module__$5b$externals$5d2f$better$2d$sqlite3__$5b$external$5d$__$28$better$2d$sqlite3$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$better$2d$sqlite3$29$__["default"](dbPath);
db.pragma('foreign_keys = ON');
// Migración segura: añade la columna si ya existe la tabla sin ella
const cols = db.pragma('table_info(equipos)');
if (!cols.some((c)=>c.name === 'es_mal_estado')) {
    db.exec(`ALTER TABLE equipos ADD COLUMN es_mal_estado INTEGER DEFAULT 0;`);
}
const __TURBOPACK__default__export__ = db;
}),
"[project]/app/actions.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"4033570142ad6d4f2cf8bf083c120672b36c3944ed":"eliminarArea","405ad1af4134187ddf300da1b32612e2fa00701db6":"actualizarRegistro","405b8cc35980289e8a4f5d1dead8bef0aaecdea786":"crearArea","40c4a3270a80631927d30e45165758778572f90465":"eliminarEquipo","40d99a77d00596ddbae5f346aa2a679340e3137341":"actualizarArea","40e0014770e0ee7b78c49ddc843d905a9b31ab212c":"crearRegistro"},"",""] */ __turbopack_context__.s([
    "actualizarArea",
    ()=>actualizarArea,
    "actualizarRegistro",
    ()=>actualizarRegistro,
    "crearArea",
    ()=>crearArea,
    "crearRegistro",
    ()=>crearRegistro,
    "eliminarArea",
    ()=>eliminarArea,
    "eliminarEquipo",
    ()=>eliminarEquipo
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/db.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
async function crearRegistro(fd) {
    const obs = fd.get('observaciones') || '';
    const checkMalEstado = fd.get('toggle_mal_estado');
    // es_mal_estado = 1 si el checkbox está marcado O si la obs contiene "mal estado"
    const esMalEstado = checkMalEstado === 'on' || obs.toLowerCase().includes('mal estado') ? 1 : 0;
    // Añade "MAL ESTADO" a observaciones si está marcado y no está ya escrito
    let observacionesFinal = obs;
    if (esMalEstado && !obs.toLowerCase().includes('mal estado')) {
        observacionesFinal = obs ? `${obs} - MAL ESTADO` : 'MAL ESTADO';
    }
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].prepare(`
    INSERT INTO equipos 
      (area_id, numeroinventario, nombre_responsable_inventario, marca_modelo,
       almacenamiento, memoria_ram, procesador, monitor, mouse_teclado,
       observaciones, es_mal_estado, fecha)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(fd.get('area_id'), fd.get('numeroinventario'), fd.get('nombre_res'), fd.get('marca'), fd.get('almacenamiento'), fd.get('ram'), fd.get('procesador'), fd.get('monitor'), fd.get('mouse_teclado'), observacionesFinal, esMalEstado, new Date().toISOString());
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/');
}
async function actualizarRegistro(fd) {
    const obs = fd.get('observaciones') || '';
    const checkMalEstado = fd.get('toggle_mal_estado');
    const esMalEstado = checkMalEstado === 'on' || obs.toLowerCase().includes('mal estado') ? 1 : 0;
    let observacionesFinal = obs;
    if (esMalEstado && !obs.toLowerCase().includes('mal estado')) {
        observacionesFinal = obs ? `${obs} - MAL ESTADO` : 'MAL ESTADO';
    } else if (!esMalEstado) {
        observacionesFinal = obs.replace(/ - MAL ESTADO/gi, '').replace(/MAL ESTADO/gi, '').trim();
    }
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].prepare(`
    UPDATE equipos SET
      numeroinventario = ?,
      nombre_responsable_inventario = ?,
      marca_modelo = ?,
      almacenamiento = ?,
      memoria_ram = ?,
      procesador = ?,
      monitor = ?,
      mouse_teclado = ?,
      observaciones = ?,
      es_mal_estado = ?
    WHERE id = ?
  `).run(fd.get('numeroinventario'), fd.get('nombre_res'), fd.get('marca'), fd.get('almacenamiento'), fd.get('ram'), fd.get('procesador'), fd.get('monitor'), fd.get('mouse_teclado'), observacionesFinal, esMalEstado, fd.get('id'));
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/');
}
async function eliminarEquipo(id) {
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].prepare('DELETE FROM equipos WHERE id = ?').run(id);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/');
}
async function crearArea(fd) {
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].prepare('INSERT INTO areas (nombre, coordinador) VALUES (?, ?)').run(fd.get('nombre_area'), fd.get('coordinador'));
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/');
}
async function actualizarArea(fd) {
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].prepare('UPDATE areas SET nombre = ?, coordinador = ? WHERE id = ?').run(fd.get('nombre_area'), fd.get('coordinador'), fd.get('id'));
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/');
}
async function eliminarArea(id) {
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].prepare('DELETE FROM areas WHERE id = ?').run(id);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/');
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    crearRegistro,
    actualizarRegistro,
    eliminarEquipo,
    crearArea,
    actualizarArea,
    eliminarArea
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(crearRegistro, "40e0014770e0ee7b78c49ddc843d905a9b31ab212c", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(actualizarRegistro, "405ad1af4134187ddf300da1b32612e2fa00701db6", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(eliminarEquipo, "40c4a3270a80631927d30e45165758778572f90465", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(crearArea, "405b8cc35980289e8a4f5d1dead8bef0aaecdea786", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(actualizarArea, "40d99a77d00596ddbae5f346aa2a679340e3137341", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(eliminarArea, "4033570142ad6d4f2cf8bf083c120672b36c3944ed", null);
}),
"[project]/.next-internal/server/app/page/actions.js { ACTIONS_MODULE0 => \"[project]/app/actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/actions.ts [app-rsc] (ecmascript)");
;
;
;
;
;
;
}),
"[project]/.next-internal/server/app/page/actions.js { ACTIONS_MODULE0 => \"[project]/app/actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "4033570142ad6d4f2cf8bf083c120672b36c3944ed",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["eliminarArea"],
    "405ad1af4134187ddf300da1b32612e2fa00701db6",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["actualizarRegistro"],
    "405b8cc35980289e8a4f5d1dead8bef0aaecdea786",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["crearArea"],
    "40c4a3270a80631927d30e45165758778572f90465",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["eliminarEquipo"],
    "40d99a77d00596ddbae5f346aa2a679340e3137341",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["actualizarArea"],
    "40e0014770e0ee7b78c49ddc843d905a9b31ab212c",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["crearRegistro"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/page/actions.js { ACTIONS_MODULE0 => "[project]/app/actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/actions.ts [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=_8134a0b6._.js.map