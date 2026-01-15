# 06_ACCEPTANCE_CRITERIA

## Fase 1 (UI)
- [ ] Week/Month/Organizer/Connections/Editor/Now se parecen visualmente a los PNG de referencia.
- [ ] Work vs Casa están claramente separados por color (`terracotta` vs `sage`).
- [ ] Kal-el NO aparece en las vistas normales de calendario.

## Fase 2 (CRUD Interno)
- [ ] Crear, editar y borrar eventos funciona correctamente contra Supabase (RPCs).
- [ ] RLS está activo e impide el acceso a datos de otras organizaciones/usuarios.
- [ ] Los Badges de sync muestran el estado correcto (simulado por ahora).

## Fase 3 (Google Sync)
- [ ] Se pueden conectar al menos 2 cuentas de Google.
- [ ] Los eventos de ambas cuentas se ven combinados en el calendario.
- [ ] Crear un evento en la app lo crea en el calendario de Google correspondiente.
- [ ] Modificar un evento en Google se refleja en la app (Pull).

## Fase 4 (Motor TDAH)
- [ ] La vista `/now` muestra la tarea correcta basada en la lógica de backend.
- [ ] Focus Lock impide distracciones (reglas de negocio en DB).
- [ ] Parking guarda items correctamente en la base de datos.
- [ ] "Stuck Mode" sugiere un micro-paso válido.

## Fase 5+ (Extensiones)
- [ ] Microsoft/Outlook integration funciona igual que Google.
- [ ] Los toggles `is_enabled` permiten ocultar calendarios específicos sin desconectar la cuenta.
