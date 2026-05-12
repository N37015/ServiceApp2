'use server';
import { revalidatePath } from 'next/cache';
import db from '../lib/db';

// ── CREAR EQUIPO ──────────────────────────────────────────────
export async function crearRegistro(fd: FormData) {
  const obs = (fd.get('observaciones') as string) || '';
  const checkMalEstado = fd.get('toggle_mal_estado');

  // es_mal_estado = 1 si el checkbox está marcado O si la obs contiene "mal estado"
  const esMalEstado = checkMalEstado === 'on' || obs.toLowerCase().includes('mal estado') ? 1 : 0;

  // Añade "MAL ESTADO" a observaciones si está marcado y no está ya escrito
  let observacionesFinal = obs;
  if (esMalEstado && !obs.toLowerCase().includes('mal estado')) {
    observacionesFinal = obs ? `${obs} - MAL ESTADO` : 'MAL ESTADO';
  }

  db.prepare(`
    INSERT INTO equipos 
      (area_id, numeroinventario, nombre_responsable_inventario, marca_modelo,
       almacenamiento, memoria_ram, procesador, monitor, mouse_teclado,
       observaciones, es_mal_estado, fecha)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    fd.get('area_id'),
    fd.get('numeroinventario'),
    fd.get('nombre_res'),
    fd.get('marca'),
    fd.get('almacenamiento'),
    fd.get('ram'),
    fd.get('procesador'),
    fd.get('monitor'),
    fd.get('mouse_teclado'),
    observacionesFinal,
    esMalEstado,
    new Date().toISOString()
  );

  revalidatePath('/');
}

// ── ACTUALIZAR EQUIPO ─────────────────────────────────────────
export async function actualizarRegistro(fd: FormData) {
  const obs = (fd.get('observaciones') as string) || '';
  const checkMalEstado = fd.get('toggle_mal_estado');

  const esMalEstado = checkMalEstado === 'on' || obs.toLowerCase().includes('mal estado') ? 1 : 0;

  let observacionesFinal = obs;
  if (esMalEstado && !obs.toLowerCase().includes('mal estado')) {
    observacionesFinal = obs ? `${obs} - MAL ESTADO` : 'MAL ESTADO';
  } else if (!esMalEstado) {
    observacionesFinal = obs.replace(/ - MAL ESTADO/gi, '').replace(/MAL ESTADO/gi, '').trim();
  }

  db.prepare(`
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
  `).run(
    fd.get('numeroinventario'),
    fd.get('nombre_res'),
    fd.get('marca'),
    fd.get('almacenamiento'),
    fd.get('ram'),
    fd.get('procesador'),
    fd.get('monitor'),
    fd.get('mouse_teclado'),
    observacionesFinal,
    esMalEstado,
    fd.get('id')
  );

  revalidatePath('/');
}

// ── ELIMINAR EQUIPO ───────────────────────────────────────────
export async function eliminarEquipo(id: number) {
  db.prepare('DELETE FROM equipos WHERE id = ?').run(id);
  revalidatePath('/');
}

// ── CREAR ÁREA ────────────────────────────────────────────────
export async function crearArea(fd: FormData) {
  const nombre = String(fd.get('nombre_area') || '').trim();
  const coordinador = String(fd.get('coordinador') || '').trim();

  // Validación: no permitir áreas repetidas por nombre (case-insensitive)
  const nombreLower = nombre.toLowerCase();
  const existe = db.prepare('SELECT id FROM areas WHERE LOWER(nombre) = ?').get(nombreLower);

  if (existe) {
    // No se inserta, solo se revalida para que se refresque la UI.
    revalidatePath('/');
    return { ok: false, reason: 'duplicate', nombre };
  }

  db.prepare('INSERT INTO areas (nombre, coordinador) VALUES (?, ?)').run(
    nombre,
    coordinador
  );
  revalidatePath('/');
  return { ok: true };
}


// ── ACTUALIZAR ÁREA ───────────────────────────────────────────
export async function actualizarArea(fd: FormData) {
  db.prepare('UPDATE areas SET nombre = ?, coordinador = ? WHERE id = ?').run(
    fd.get('nombre_area'),
    fd.get('coordinador'),
    fd.get('id')
  );
  revalidatePath('/');
}

// ── ELIMINAR ÁREA ─────────────────────────────────────────────
export async function eliminarArea(id: number) {
  db.prepare('DELETE FROM areas WHERE id = ?').run(id);
  revalidatePath('/');
}
