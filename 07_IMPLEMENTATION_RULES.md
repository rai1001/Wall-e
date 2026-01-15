# 07_IMPLEMENTATION_RULES

## Principios No Negociables

1. **La UI miente, la DB manda**:
   - El frontend nunca calcula prioridades ni estados críticos de negocio. Solo renderiza lo que dice la DB.

2. **Multitenancy Sagrado**:
   - Toda tabla operativa debe tener `organization_id`.
   - RLS (Row Level Security) debe estar activo por defecto y nunca desactivarse.

3. **Operaciones Transaccionales**:
   - Cambios críticos (especialmente aquellos que afectan múltiples tablas) deben usar RPC / PLpgSQL.

4. **Idempotencia**:
   - Toda acción sensible (crear, pagar, sincronizar) debe admitir `idempotency_key` para evitar duplicados por doble click o reintentos de red.

5. **Conservadurismo Tecnológico**:
   - Lógica en Postgres siempre que sea posible.
   - Edge Functions solo para integraciones externas (OAuth, LLMs) o lógica que Postgres no pueda manejar eficientemente.

6. **Defensa del Código (Regla del Usuario)**:
   - Nunca eliminar código existente sin instrucción explícita.
   - Usar `_backup` si es necesario refactorizar agresivamente.
