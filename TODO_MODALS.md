# TODO - Cerrar modales al tocar afuera

- [ ] Normalizar overlays de modales para que todos tengan `onClick` que cierre el modal
- [ ] Asegurar que el contenido del modal use `onClick={(e)=>e.stopPropagation()}` para no disparar el cierre
- [ ] Eliminar/evitar eventos que cierren/abrir múltiples overlays a la vez (confirmación vs formularios)
- [ ] Actualizar `app/InventarioClient.tsx`
- [ ] Validar que: formulario de área, añadir equipo, editar equipo y modal de borrado se cierran tocando afuera

