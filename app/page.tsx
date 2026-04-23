import db from '../lib/db';
import InventarioClient from './InventarioClient';

export default function Page() {
  const areas = db.prepare('SELECT * FROM areas').all();
  const equipos = db.prepare('SELECT * FROM equipos').all();

  return <InventarioClient areas={areas} equiposIniciales={equipos} />;
}
