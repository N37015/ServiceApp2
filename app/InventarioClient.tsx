"use client";
import { useState } from 'react';
import * as XLSX from 'xlsx';
import { eliminarEquipo, eliminarArea, actualizarRegistro, crearArea, actualizarArea, crearRegistro } from './actions';

export default function InventarioClient({ areas, equiposIniciales }: any) {
  const [busqueda, setBusqueda] = useState("");
  const [idEditandoEquipo, setIdEditandoEquipo] = useState<number | null>(null);
  const [mostrandoEquipoEditarModal, setMostrandoEquipoEditarModal] = useState(false);
  const [equipoModalEditItem, setEquipoModalEditItem] = useState<any>(null);
  const [mostrandoAreaModal, setMostrandoAreaModal] = useState<null | { tipo: 'editar' | 'eliminar', area: any }>(null);

  
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
  const [modalItem, setModalItem] = useState<any>(null);

  // Modal “Añadir equipo” (especificaciones en vertical)
  const [mostrandoEquipoModal, setMostrandoEquipoModal] = useState(false);
  const [equipoModalAreaId, setEquipoModalAreaId] = useState<number | null>(null);

  const [modalAreaError, setModalAreaError] = useState<string | null>(null);


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
    if (!modalBorrar || !modalItem) return;
    modalBorrar.tipo === 'area' ? await eliminarArea(modalBorrar.id) : await eliminarEquipo(modalBorrar.id);
    setModalBorrar(null);
    setModalItem(null);
  };

  const areasFiltradas = (areas || []).filter((a: any) => 
    a.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const handleExportExcel = () => {
    console.log('EXPORT clicked', { verTodas, areaAbierta, equiposCount: equiposIniciales?.length || 0, areasCount: areas?.length || 0 });
    
    let data = [];
    let filename = 'inventario_completo.xlsx';
    let sheetName = 'Inventario Completo';

    if (!verTodas && areaAbierta !== null) {
      // Single area
      const selectedArea = areas.find((a: any) => a.id === areaAbierta);
      const filteredEquipos = equiposIniciales.filter((e: any) => e.area_id === areaAbierta);
      const areaName = selectedArea ? selectedArea.nombre : 'Área Desconocida';
      const coordinador = selectedArea ? selectedArea.coordinador || '' : '';
      
      sheetName = areaName.slice(0, 31);
      filename = `inventario_${areaName.replace(/[^a-zA-Z0-9]/g, '_')}.xlsx`;
      
      data = filteredEquipos.map((e: any) => ({
        'ÁREA': areaName,
        'COORDINADOR ÁREA': coordinador,
        'NI': e.numeroinventario || '',
        'RESPONSABLE/MQ': e.nombre_responsable_inventario || '',
        'MARCA / MODELO': e.marca_modelo || '',
        'DISCO': e.almacenamiento || '',
        'RAM': e.memoria_ram || '',
        'PROCESADOR': e.procesador || '',
        'MONITOR': e.monitor || '',
        'MOUSE / TECLADO': e.mouse_teclado || '',
        'OBSERVACIONES': e.es_mal_estado === 1 ? `🔴 ${e.observaciones || ''}` : (e.observaciones || '')
      }));
    } else {
      // All areas - group by area for separation
      const areasMap = {};
      equiposIniciales.forEach((e: any) => {
        const area = areas.find((a: any) => a.id === e.area_id);
        const areaName = area ? area.nombre : 'Área Desconocida';
        const coordinador = area ? (area.coordinador || '') : '';
        
        if (!areasMap[areaName]) areasMap[areaName] = [];
        areasMap[areaName].push({
          'ÁREA': areaName,
          'COORDINADOR ÁREA': coordinador,
          'NI': e.numeroinventario || '',
          'RESPONSABLE/MQ': e.nombre_responsable_inventario || '',
          'MARCA / MODELO': e.marca_modelo || '',
          'DISCO': e.almacenamiento || '',
          'RAM': e.memoria_ram || '',
          'PROCESADOR': e.procesador || '',
          'MONITOR': e.monitor || '',
          'MOUSE / TECLADO': e.mouse_teclado || '',
          'OBSERVACIONES': e.es_mal_estado === 1 ? `🔴 ${e.observaciones || ''}` : (e.observaciones || '')
        });
      });
      
      // Flatten with blank separator rows between areas
      Object.values(areasMap).forEach((areaEquipos: any[], index: number) => {
        data.push(...areaEquipos);
        if (index < Object.keys(areasMap).length - 1) {
          // Add 2 blank rows between areas for separation
          data.push({}, {});
        }
      });
    }

    // Headers
    const headers = [
      'ÁREA',
      'COORDINADOR ÁREA',
      'NI',
      'RESPONSABLE/MQ',
      'MARCA / MODELO',
      'DISCO',
      'RAM',
      'PROCESADOR',
      'MONITOR',
      'MOUSE / TECLADO',
      'OBSERVACIONES'
    ];

    // Convert objects to array of arrays (aoa_to_sheet requires arrays)
    const aoaData = [headers];
    data.forEach((row: any) => {
      aoaData.push([
        row['ÁREA'] || '',
        row['COORDINADOR ÁREA'] || '',
        row['NI'] || '',
        row['RESPONSABLE/MQ'] || '',
        row['MARCA / MODELO'] || '',
        row['DISCO'] || '',
        row['RAM'] || '',
        row['PROCESADOR'] || '',
        row['MONITOR'] || '',
        row['MOUSE / TECLADO'] || '',
        row['OBSERVACIONES'] || ''
      ]);
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(aoaData);

    // Column widths
    ws['!cols'] = [
      { wch: 20 },
      { wch: 20 },
      { wch: 12 },
      { wch: 20 },
      { wch: 20 },
      { wch: 12 },
      { wch: 10 },
      { wch: 18 },
      { wch: 15 },
      { wch: 18 },
      { wch: 30 }
    ];

    // Header styling
    const range = XLSX.utils.decode_range(ws['!ref']!);
    for (let C = 0; C <= range.e.c; ++C) {
      const cell_address = XLSX.utils.encode_cell({r:0, c:C});
      if (ws[cell_address]) {
        ws[cell_address].s = {
          font: { bold: true, color: { rgb: "FFFFFFFF" } },
          fill: { fgColor: { rgb: "FF2E75B6" } },
          alignment: { horizontal: "center" }
        };
      }
    }

    // Mal estado orange
    for (let R = 1; R <= range.e.r; ++R) {
      for (let C = 0; C <= range.e.c; ++C) {
        const cell_address = XLSX.utils.encode_cell({r:R, c:C});
        if (ws[cell_address] && ws[cell_address].v && ws[cell_address].v.toString().includes('🔴')) {
          ws[cell_address].s = {
            fill: { fgColor: { rgb: "FFFCE4D6" } },
            font: { color: { rgb: "FF833C00" } }
          };
        }
      }
    }

    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    console.log('Generating Excel', { filename, rows: data.length });
    XLSX.writeFile(wb, filename);
    console.log('Download triggered');
  };

  return (
    <div className="app-container">
      {/* MODAL DE CONFIRMACIÓN */}
      {modalAreaError && (
        <div
          className="modal-overlay no-print"
          role="alert"
          aria-live="assertive"
          onClick={() => setModalAreaError(null)}
        >
          <div className="modal-premium modal-confirmation" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon">⚠️</div>
            <h3>AVISO</h3>
            <p className="modal-detail">{modalAreaError}</p>
            <div className="modal-btns-group">
              <button type="button" className="btn-cancel-modal" onClick={() => setModalAreaError(null)}>
                CERRAR
              </button>
            </div>
          </div>
        </div>
      )}

      {mostrandoAreaModal && (

        <div
          className="modal-overlay no-print modal-confirmation"
          role="dialog"
          aria-modal="true"
          onClick={() => setMostrandoAreaModal(null)}
        >
          <div className="modal-premium" onClick={(e) => e.stopPropagation()}>
            {mostrandoAreaModal.tipo === 'eliminar' ? (
              <>
                <div className="modal-icon">⚠️</div>
                <h3>{`¿Eliminar área "${mostrandoAreaModal.area.nombre}"?`}</h3>
                <p className="modal-detail">
                  {`${equiposIniciales.filter((eq: any) => eq.area_id === mostrandoAreaModal.area.id).length} equipos asociados`}
                </p>
                <div className="modal-btns-group">
                  <button
                    onClick={async () => {
                      await eliminarArea(mostrandoAreaModal.area.id);
                      setMostrandoAreaModal(null);
                    }}
                    className="btn-danger-confirm"
                  >
                    ELIMINAR
                  </button>
                  <button
                    onClick={() => setMostrandoAreaModal(null)}
                    className="btn-cancel-modal"
                  >
                    CANCELAR
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="modal-icon">✎</div>
                <h3>EDITAR ÁREA</h3>
                <p className="modal-detail">Actualiza los datos y presiona <b>GUARDAR CAMBIOS</b>.</p>

                <form
                  action={async (fd) => {
                    await actualizarArea(fd);
                    setMostrandoAreaModal(null);
                  }}
                  className="premium-grid-areas"
                  autoComplete="off"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input type="hidden" name="id" value={mostrandoAreaModal.area.id} />
                  <input
                    name="nombre_area"
                    defaultValue={mostrandoAreaModal.area.nombre}
                    required
                    className="inp-table-add"
                    autoComplete="off"
                  />
                  <input
                    name="coordinador"
                    defaultValue={mostrandoAreaModal.area.coordinador}
                    className="inp-table-add"
                    autoComplete="off"
                  />
                  <div style={{ display: 'flex', gap: 10, justifyContent: 'center', width: '100%', marginTop: 10 }}>
                    <button type="button" className="btn-cancel-modal" onClick={() => setMostrandoAreaModal(null)}>
                      CANCELAR
                    </button>
                    <button type="submit" className="btn-premium-blue">
                      GUARDAR CAMBIOS
                    </button>
                  </div>
                </form>
              </>
            )}
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
            <button
              onClick={handleExportExcel}
              className="btn-action"
              style={{fontSize: '12px', padding: '7px 14px'}}
            >
              📊 EXPORTAR EXCEL
            </button>
            <button onClick={() => setMostrandoFormulario(!mostrandoFormulario)} className="btn-premium-add">
              {mostrandoFormulario ? "✕ CERRAR FORMULARIO" : "+ NUEVO REGISTRO / ÁREA"}
            </button>
          </div>
        </div>
      </header>

      {/* FORMULARIO NUEVO ÁREA (modal “de verdad”) */}
      {mostrandoFormulario && (
        <div
          className="modal-overlay no-print"
          role="dialog"
          aria-modal="true"
          onClick={() => setMostrandoFormulario(false)}
        >
          <div
            className="modal-premium modal-area-create"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-icon">➕</div>
            <h3>REGISTRO DE NUEVA ÁREA</h3>
            <p className="modal-detail">Completa los datos y presiona <b>REGISTRAR ÁREA</b>.</p>

            <form
              action={async (fd) => {
                const res: any = await crearArea(fd);
                if (res?.ok === false && res?.reason === 'duplicate') {
                  setModalAreaError(`La área "${res.nombre}" ya está agregada.`);
                  return;
                }
                setModalAreaError(null);
                limpiarNuevoForm();
              }}

              className="premium-grid-areas"

              autoComplete="off"
            >
              <input
                name="nombre_area"
                placeholder="Nombre de la Nueva Área"
                required
                className="inp-table-add"
                autoComplete="off"
              />
              <input
                name="coordinador"
                placeholder="Coordinador"
                className="inp-table-add"
                autoComplete="off"
              />
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center', width: '100%' }}>
                <button type="button" className="btn-cancel-modal" onClick={() => setMostrandoFormulario(false)}>
                  CANCELAR
                </button>
                <button type="submit" className="btn-premium-blue">REGISTRAR ÁREA</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL “AÑADIR EQUIPO” (vertical, encima de todo) */}
      {mostrandoEquipoModal && equipoModalAreaId !== null && (
        <div
          className="modal-overlay no-print"
          role="dialog"
          aria-modal="true"
          onClick={() => setMostrandoEquipoModal(false)}
        >
          <div
            className="modal-premium modal-equipo-create"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="modal-icon">💾</div>
            <h3>AGREGAR EQUIPO</h3>
            <p className="modal-detail">Completa las especificaciones y presiona <b>AÑADIR</b>.</p>

            <form action={crearRegistro} className="equipo-modal-form" autoComplete="off">
              <input type="hidden" name="area_id" value={equipoModalAreaId} />

              <input name="numeroinventario" placeholder="NI" required className="inp-table-add" autoComplete="off" />
              <input name="nombre_res" placeholder="Responsable" className="inp-table-add" autoComplete="off" />
              <input name="marca" placeholder="Marca" className="inp-table-add" autoComplete="off" />
              <input name="almacenamiento" placeholder="Disco" className="inp-table-add" autoComplete="off" />
              <input name="ram" placeholder="RAM" className="inp-table-add" autoComplete="off" />
              <input name="procesador" placeholder="PROCESADOR" className="inp-table-add" autoComplete="off" />
              <input name="monitor" placeholder="Monitor" className="inp-table-add" autoComplete="off" />
              <input name="mouse_teclado" placeholder="Mouse / Teclado" className="inp-table-add" autoComplete="off" />
              <input name="observaciones" placeholder="Observaciones..." className="inp-table-add" autoComplete="off" />

              <label className="mal-estado-check" style={{ justifyContent: 'space-between', marginTop: 2 }}>
                <span>⚠️ Dañado</span>
                <input type="checkbox" name="toggle_mal_estado" />
              </label>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'center', width: '100%', marginTop: 10 }}>
                <button type="button" className="btn-cancel-modal" onClick={() => setMostrandoEquipoModal(false)}>
                  CANCELAR
                </button>
                <button type="submit" className="btn-premium-blue">
                  AÑADIR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EDITAR EQUIPO (adelante de todas) */}
      {mostrandoEquipoEditarModal && equipoModalEditItem && (
        <div
          className="modal-overlay no-print"
          role="dialog"
          aria-modal="true"
          onClick={() => { setMostrandoEquipoEditarModal(false); setEquipoModalEditItem(null); }}
        >
          <div
            className="modal-premium modal-equipo-create"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-icon">✎</div>
            <h3>EDITAR EQUIPO</h3>
            <p className="modal-detail">
              Actualiza los campos y presiona <b>GUARDAR CAMBIOS</b>.
            </p>

            <form
              action={async (fd) => {
                fd.append('id', String(equipoModalEditItem.id));
                // area_id en actualizarRegistro no se usa; se mantiene por compatibilidad
                fd.append('area_id', String(equipoModalEditItem.area_id ?? ''));
                await actualizarRegistro(fd);
                setMostrandoEquipoEditarModal(false);
                setEquipoModalEditItem(null);
              }}
              className="equipo-modal-form"
              autoComplete="off"
            >
              <input name="numeroinventario" defaultValue={equipoModalEditItem.numeroinventario} placeholder="NI" className="inp-table-add" autoComplete="off" />
              <input name="nombre_res" defaultValue={equipoModalEditItem.nombre_responsable_inventario} placeholder="Responsable" className="inp-table-add" autoComplete="off" />
              <input name="marca" defaultValue={equipoModalEditItem.marca_modelo} placeholder="Marca" className="inp-table-add" autoComplete="off" />
              <input name="almacenamiento" defaultValue={equipoModalEditItem.almacenamiento} placeholder="Disco" className="inp-table-add" autoComplete="off" />
              <input name="ram" defaultValue={equipoModalEditItem.memoria_ram} placeholder="RAM" className="inp-table-add" autoComplete="off" />
              <input name="procesador" defaultValue={equipoModalEditItem.procesador} placeholder="PROCESADOR" className="inp-table-add" autoComplete="off" />
              <input name="monitor" defaultValue={equipoModalEditItem.monitor} placeholder="Monitor" className="inp-table-add" autoComplete="off" />
              <input name="mouse_teclado" defaultValue={equipoModalEditItem.mouse_teclado} placeholder="Mouse / Teclado" className="inp-table-add" autoComplete="off" />
              <input name="observaciones" defaultValue={equipoModalEditItem.observaciones} placeholder="Observaciones..." className="inp-table-add" autoComplete="off" />

              <label className="mal-estado-check" style={{ justifyContent: 'space-between', marginTop: 2 }}>
                <span>⚠️ Dañado</span>
                <input
                  type="checkbox"
                  name="toggle_mal_estado"
                  defaultChecked={equipoModalEditItem.es_mal_estado === 1}
                />
              </label>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'center', width: '100%', marginTop: 10 }}>
                <button
                  type="button"
                  className="btn-danger-confirm"
                  onClick={() => {
                    setModalBorrar({ id: equipoModalEditItem.id, tipo: 'equipo' });
                    setModalItem(equipoModalEditItem);
                  }}
                >
                  ELIMINAR
                </button>

                <button type="button" className="btn-cancel-modal" onClick={() => { setMostrandoEquipoEditarModal(false); setEquipoModalEditItem(null); }}>
                  CANCELAR
                </button>

                <button type="submit" className="btn-premium-blue">
                  GUARDAR CAMBIOS
                </button>
              </div>
            </form>
          </div>
        </div>
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
          const esEditandoArea = false;
          const estaAbierta = verTodas || areaAbierta === area.id;

          return (
            <section key={area.id} id={`area-${area.id}`} className="premium-card">
              <header className={`area-card-header ${esEditandoArea ? 'editing' : ''}`} onClick={() => toggleArea(area.id)} style={{cursor: 'pointer'}}>
                {esEditandoArea ? (
                  <div />
                ) : (

                  <div className="header-display" style={{ width: '100%' }}>
                    <div className="area-title-group">
                      <h2>{area.nombre} <span>{estaAbierta ? '▲' : '▼'}</span></h2>
                      <div className="coordinador-badge">RESPONSABLE: {area.coordinador || 'SIN ASIGNAR'}</div>
                    </div>
                    <div className="no-print" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setMostrandoAreaModal({ tipo: 'editar', area })}
                        className="btn-action edit"
                      >
                        EDITAR
                      </button>
                      <button
                        onClick={() => setMostrandoAreaModal({ tipo: 'eliminar', area })}
                        className="btn-action delete"
                        style={{ marginLeft: '8px' }}
                      >
                        ELIMINAR
                      </button>
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
                        const esMalEstado = e.es_mal_estado === 1;

                        return (
                          <tr key={e.id} className={esMalEstado ? "row-error-status" : ""}>
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
                              <button
                                onClick={() => {
                                  setEquipoModalEditItem(e);
                                  setMostrandoEquipoEditarModal(true);
                                }}
                                className="btn-mini"
                              >
                                ✎
                              </button>
                              <button
                                onClick={() => { setModalBorrar({id: e.id, tipo: 'equipo'}); setModalItem(e); }}
                                className="btn-mini delete"
                                style={{marginLeft: '4px'}}
                              >
                                🗑
                              </button>
                            </td>
                          </tr>
                        );
                      })}

                      {/* BOTÓN PARA AÑADIR EQUIPO (abre modal grande) */}
                      <tr className="no-print">
                        <td colSpan={10} style={{ padding: 0 }}>
                          <div style={{ padding: '10px 0', display: 'flex', justifyContent: 'flex-end' }}>
                            <button
                              type="button"
                              className="btn-premium-blue"
                              onClick={() => {
                                setEquipoModalAreaId(area.id);
                                setMostrandoEquipoModal(true);
                              }}
                            >
                              + AÑADIR EQUIPO
                            </button>
                          </div>
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
