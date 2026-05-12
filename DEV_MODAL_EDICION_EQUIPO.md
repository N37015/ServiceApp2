# Modal de edición de equipo (pendiente)

El comportamiento actual de edición para equipos está renderizado **inline** (sustituye la fila por el formulario con clase `inline-edit-grid`).

Si el objetivo es un modal real “adelante de todas”, hay que:
1) Crear un estado `mostrandoEquipoEditarModal`.
2) Al presionar ✎, setear `equipoModalEditItem` con el equipo seleccionado y abrir el modal.
3) Renderizar un bloque `modal-overlay no-print` nuevo con formulario (inputs) y `onSubmit` que llame a `actualizarRegistro`.
4) Cerrar modal reseteando estado.

Esto aún no se ha implementado en el archivo actual; actualmente el ✎ solo activa el modo inline editing.

