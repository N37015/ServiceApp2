"use client";
import { useState } from 'react';
import { eliminarEquipo, eliminarArea, actualizarRegistro, crearArea, actualizarArea, crearRegistro } from './actions';

export default function InventarioClient({ areas, equiposIniciales }: any) {
  const [busqueda, setBusqueda] = useState("");
  const [idEditandoEquipo, setIdEditandoEquipo] = useState<number | null>(null);
  const [idEditandoArea, setIdEditandoArea] = useState<number | null>(null);
  const [datosEditArea, setDatosEditArea] = useState<any>({});
  
  const [mostrandoFormulario, setMostrandoFormulario] = useState(false);
  const [valoresNuevo, setValoresNuevo] = useState({
    id: '', numeroinventario: '', nombre_res: '', marca: '',
    almacenamiento: '', ram: '', procesador: '', monitor: '', 
    mouse_teclado: '', observaciones: '', area_id: '',
    es_mal_estado: false
  });

  const [areaAbierta, setAreaAbierta] = useState<number | null>(null);
  const [verTodas, setVerTodas] = useState(false);
  const [modalBorrar, setModalBorrar] = useState<{ id: number, tipo: 'area' | 'equipo' } | null>(null);

  const toggleArea = (id: number) => {
    setVerTodas(false); 
    setAreaAbierta(areaAbierta === id ? null : id);
  };

  const seleccionarAreaNav = (id: number) => {
    setVerTodas(false);
    setAreaAbierta(areaAbierta === id ? null : id);
    setTimeout(() => {
      document.getElementById(`area-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const limpiarNuevoForm = () => {
    setValoresNuevo({ id: '', numeroinventario: '', nombre_res: '', marca: '', almacenamiento: '', ram: '', procesador: '', monitor: '', mouse_teclado: '', observaciones: '', area_id: '', es_mal_estado: false });
    setMostrandoFormulario(false);
  };

  const ejecutarBorrado = async () => {
    if (!modalBorrar) return;
    modalBorrar.tipo === 'area' ? await eliminarArea(modalBorrar.id) : await eliminarEquipo(modalBorrar.id);
    setModalBorrar(null);
  };

  const areasFiltradas = (areas || []).filter((a: any) => 
    a.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="app-container">
      {/* MODAL DE CONFIRMACIÓN */}
      {modalBorrar && (
        <div className="modal-overlay no-print">
          <div className="modal-premium">
            <div className="modal-icon">⚠️</div>
            <h3>¿Confirmar eliminación?</h3>
            <div className="modal-btns-group">
              <button onClick={ejecutarBorrado} className="btn-danger-confirm">ELIMINAR</button>
              <button onClick={() => setModalBorrar(null)} className="btn-cancel-modal">CANCELAR</button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <header className="main-header no-print">
        <div className="header-content">
          <h1>REPORT</h1>
          <div style={{display: 'flex', gap: '8px'}}>
            <button onClick={() => {
              const style = document.createElement('style');
              style.innerHTML = '@page { margin: 0.8cm 1cm; size: landscape; }';
              document.head.appendChild(style);
              window.print();
              document.head.removeChild(style);
            }} className="btn-action" style={{fontSize: '12px', padding: '7px 14px'}}>
              🖨 IMPRIMIR
            </button>
            <button onClick={() => setMostrandoFormulario(!mostrandoFormulario)} className="btn-premium-add">
              {mostrandoFormulario ? "✕ CERRAR FORMULARIO" : "+ NUEVO REGISTRO / ÁREA"}
            </button>
          </div>
        </div>
      </header>

      {/* FORMULARIO NUEVO ÁREA */}
      {mostrandoFormulario && (
        <main className="dashboard-content no-print" style={{marginBottom: '2rem'}}>
          <div className="premium-card-form create-mode-area" style={{padding: '1.5rem'}}>
            <h2 className="premium-title">GESTIÓN RÁPIDA</h2>
            <form action={async (fd) => { await crearArea(fd); limpiarNuevoForm(); }} className="premium-grid-areas" autoComplete="off">
              <input name="nombre_area" placeholder="Nombre de la Nueva Área" required className="inp-table-add" autoComplete="off" />
              <input name="coordinador" placeholder="Coordinador" className="inp-table-add" autoComplete="off" />
              <button type="submit" className="btn-premium-blue">REGISTRAR ÁREA</button>
            </form>
          </div>
        </main>
      )}

      {/* BARRA DE NAVEGACIÓN RÁPIDA */}
      <nav className="area-navigation no-print">
        <div className="nav-container">
          <button onClick={() => { setVerTodas(!verTodas); setAreaAbierta(null); }} className={`nav-btn-all ${verTodas ? 'active' : ''}`}>
            {verTodas ? 'CERRAR TODAS' : 'VER TODAS'}
          </button>
          <div className="nav-divider"></div>
          {areasFiltradas.map((a: any) => (
            <button key={a.id} onClick={() => seleccionarAreaNav(a.id)} className={`nav-btn-item ${areaAbierta === a.id ? 'active' : ''}`}>
              <span className="nav-area-name">{a.nombre}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* LISTADO DE ÁREAS Y EQUIPOS */}
      <main className="dashboard-content">
        {(verTodas || areaAbierta === null
          ? areasFiltradas
          : areasFiltradas.filter((a: any) => a.id === areaAbierta)
        ).map((area: any) => {
          const equiposArea = equiposIniciales.filter((e: any) => e.area_id === area.id);
          const esEditandoArea = idEditandoArea === area.id;
          const estaAbierta = verTodas || areaAbierta === area.id;

          return (
            <section key={area.id} id={`area-${area.id}`} className="premium-card">
              <header className={`area-card-header ${esEditandoArea ? 'editing' : ''}`} onClick={() => !esEditandoArea && toggleArea(area.id)} style={{cursor: 'pointer'}}>
                {esEditandoArea ? (
                  <form action={async (fd) => { await actualizarArea(fd); setIdEditandoArea(null); }} className="header-edit-form" onClick={(e) => e.stopPropagation()} autoComplete="off">
                    <input type="hidden" name="id" value={datosEditArea.id} />
                    <input name="nombre_area" value={datosEditArea.nombre_area} onChange={(e) => setDatosEditArea({ ...datosEditArea, nombre_area: e.target.value })} className="input-inline-dark" autoComplete="off" />
                    <input name="coordinador" value={datosEditArea.coordinador} onChange={(e) => setDatosEditArea({ ...datosEditArea, coordinador: e.target.value })} className="input-inline-dark" autoComplete="off" />
                    <button type="submit" className="btn-save-circle">✓</button>
                  </form>
                ) : (
                  <div className="header-display" style={{ width: '100%' }}>
                    <div className="area-title-group">
                      <h2>{area.nombre} <span>{estaAbierta ? '▲' : '▼'}</span></h2>
                      <div className="coordinador-badge">RESPONSABLE: {area.coordinador || 'SIN ASIGNAR'}</div>
                    </div>
                    <div className="no-print" onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => { setIdEditandoArea(area.id); setDatosEditArea({id: area.id, nombre_area: area.nombre, coordinador: area.coordinador}); }} className="btn-action edit">EDITAR</button>
                      <button onClick={() => setModalBorrar({id: area.id, tipo: 'area'})} className="btn-action delete" style={{marginLeft: '8px'}}>ELIMINAR</button>
                    </div>
                  </div>
                )}
              </header>

              {estaAbierta && (
                <div className="table-responsive">
                  <table className="premium-table">
                    <thead>
                      <tr>
                        <th>NI</th>
                        <th>RESPONSABLE</th>
                        <th>MARCA / MODELO</th>
                        <th>DISCO</th>
                        <th>RAM</th>
                        <th>PROCESADOR</th>
                        <th>MONITOR</th>
                        <th>MOUSE / TECLADO</th>
                        <th>OBSERVACIONES</th>
                        <th className="no-print">ACCIÓN</th>
                      </tr>
                    </thead>
                    <tbody>
                      {equiposArea.map((e: any) => {
                        const esEditEq = idEditandoEquipo === e.id;
                        const esMalEstado = e.es_mal_estado === 1;

                        return (
                          <tr key={e.id} className={esMalEstado ? "row-error-status" : ""}>
                            {esEditEq ? (
                              <td colSpan={10} style={{padding: 0}}>
                                <form action={async (fd) => {
                                  let obs = fd.get('observaciones') as string;
                                  const check = fd.get('toggle_mal_estado');
                                  if (check === 'on' && !obs.toLowerCase().includes('mal estado')) {
                                    obs = obs ? `${obs} - MAL ESTADO` : 'MAL ESTADO';
                                  } else if (!check) {
                                    obs = obs.replace(/ - MAL ESTADO/gi, "").replace(/MAL ESTADO/gi, "").trim();
                                  }
                                  fd.set('observaciones', obs);
                                  fd.append('id', e.id.toString());
                                  fd.append('area_id', area.id.toString()); 
                                  await actualizarRegistro(fd);
                                  setIdEditandoEquipo(null);
                                }} className="inline-edit-grid" autoComplete="off">
                                  <input name="numeroinventario" defaultValue={e.numeroinventario} placeholder="NI" className="inp-table-add" autoComplete="off" />
                                  <input name="nombre_res" defaultValue={e.nombre_responsable_inventario} placeholder="Responsable" className="inp-table-add" autoComplete="off" />
                                  <input name="marca" defaultValue={e.marca_modelo} placeholder="Marca" className="inp-table-add" autoComplete="off" />
                                  <input name="almacenamiento" defaultValue={e.almacenamiento} placeholder="Disco" className="inp-table-add" autoComplete="off" />
                                  <input name="ram" defaultValue={e.memoria_ram} placeholder="RAM" className="inp-table-add" autoComplete="off" />
                                  <input name="procesador" defaultValue={e.procesador} placeholder="PROCESADOR" className="inp-table-add" autoComplete="off" />
                                  <input name="monitor" defaultValue={e.monitor} placeholder="Monitor" className="inp-table-add" autoComplete="off" />
                                  <input name="mouse_teclado" defaultValue={e.mouse_teclado} placeholder="Mouse / Teclado" className="inp-table-add" autoComplete="off" />
                                  <input name="observaciones" defaultValue={e.observaciones} placeholder="Observaciones" className="inp-table-add" autoComplete="off" />
                                  
                                  <label className="mal-estado-check">
                                    <input type="checkbox" name="toggle_mal_estado" defaultChecked={esMalEstado} /> ⚠️ Dañado
                                  </label>

                                  <div style={{display: 'flex', gap: '4px'}}>
                                    <button type="submit" className="btn-confirm-add">OK</button>
                                    <button type="button" onClick={() => setIdEditandoEquipo(null)} className="btn-action">X</button>
                                  </div>
                                </form>
                              </td>
                            ) : (
                              <>
                                <td className="ni-cell"><span>{e.numeroinventario}</span></td>
                                <td>{e.nombre_responsable_inventario}</td>
                                <td>{e.marca_modelo}</td>
                                <td>{e.almacenamiento}</td>
                                <td>{e.memoria_ram}</td>
                                <td>{e.procesador}</td>
                                <td>{e.monitor}</td>
                                <td>{e.mouse_teclado}</td>
                                <td style={{fontSize: '0.7rem'}}>{esMalEstado ? `🔴 ${e.observaciones}` : e.observaciones}</td>
                                <td className="no-print">
                                  <button onClick={() => setIdEditandoEquipo(e.id)} className="btn-mini">✎</button>
                                  <button onClick={() => setModalBorrar({id: e.id, tipo: 'equipo'})} className="btn-mini delete" style={{marginLeft: '4px'}}>🗑</button>
                                </td>
                              </>
                            )}
                          </tr>
                        );
                      })}

                      {/* FILA PARA AÑADIR NUEVO EQUIPO */}
                      <tr className="no-print add-row-style">
                        <td colSpan={10} style={{padding: 0}}>
                          <form action={crearRegistro} className="inline-add-grid" autoComplete="off">
                            <input type="hidden" name="area_id" value={area.id} />
                            <input name="numeroinventario" placeholder="NI" required className="inp-table-add" autoComplete="off" />
                            <input name="nombre_res" placeholder="Responsable" className="inp-table-add" autoComplete="off" />
                            <input name="marca" placeholder="Marca" className="inp-table-add" autoComplete="off" />
                            <input name="almacenamiento" placeholder="Disco" className="inp-table-add" autoComplete="off" />
                            <input name="ram" placeholder="RAM" className="inp-table-add" autoComplete="off" />
                            <input name="procesador" placeholder="PROCESADOR" className="inp-table-add" autoComplete="off" />
                            <input name="monitor" placeholder="Monitor" className="inp-table-add" autoComplete="off" />
                            <input name="mouse_teclado" placeholder="Mouse / Teclado" className="inp-table-add" autoComplete="off" />
                            <input name="observaciones" placeholder="Observaciones..." className="inp-table-add" autoComplete="off" />
                            <button type="submit" className="btn-confirm-add">AÑADIR</button>
                          </form>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          );
        })}
      </main>
    </div>
  );
}
