# 🤺 Psimammoliti Challenge

## 1. Instrucciones

1.  **Clonar el repositorio:**
    ```bash
    git clone <URL_DEL_REPOSITORIO>
    cd psimammoliti-challenge
    ```

2.  **Instalar dependencias:**
    Este proyecto usa `npm`. Requiere tener Node instalado.
    ```bash
    npm install
    ```

3.  **Configurar variables de entorno:**
    Crear un archivo `.env` en la raíz del proyecto y agregá estas variables:

    *   `NEXT_PUBLIC_SUPABASE_URL`: La URL de tu instancia de Supabase.
    *   `NEXT_PUBLIC_SUPABASE_ANON_KEY`: La clave anónima de la instancia de Supabase.

4.  **Ejecutá la aplicación en modo desarrollo:**
    ```bash
    npm run dev
    ```

    `http://localhost:3000` para ver la aplicación funcionando.

5.  **Ejecutar scripts SQL (opcional):**
    Usar la herramienta de línea de comandos de Supabase o cualquier cliente SQL para seedear la base de datos.

## 2. Decisiones técnicas y funcionales

* **v0:** No-code tool muy fácil de usar, intuitiva y perfecta para armar prototipos funcionales rápido
* **Supabase:** Fácil integración con v0 y buen dashboard para visualización de datos
* **Vercel:** Fácil integración con el resto del stack, fácil despliegue, buen ecosistema
* **Cursor:** IDE integrado con IA para debuggear y añadir features rápido
* **GitHub:** Versionado de cambios

El prototipo cumple funcionalmente con los requerimientos. Estaría listo para salir a testear con usuarios y empezar a validar diferentes hipótesis.

## 3. Detalle: Lo que se hizo y se asumió

* Se armó un prototipo inicial con las siguientes tecnologías:
  * v0 — no-code tool
  * Supabase — Database provider
  * Vercel — deployent y continuos integration
  * Cursor — editor de código
  * GitHub — versionado de cambios

## 4. Documento funcional

### Flowchart: Qué se puede hacer y cómo
```mermaid
flowchart TD
    A[Usuario accede a la plataforma] --> B[Ver lista de psicólogos]
    
    B --> C{¿Usar filtros?}
    C -->|Sí| D[Aplicar filtros]
    C -->|No| E[Seleccionar psicólogo]
    
    D --> D1[Buscar por nombre]
    D --> D2[Filtrar por especialidad]
    D --> D3[Filtrar por modalidad]
    D1 --> F[Ver resultados filtrados]
    D2 --> F
    D3 --> F
    
    F --> G{¿Resultados OK?}
    G -->|No| H[Limpiar filtros]
    G -->|Sí| E
    H --> B
    
    E --> I[Clic en Ver Disponibilidad]
    I --> J[Modal de reserva se abre]
    J --> K[Ver calendario semanal]
    
    K --> L{¿Cambiar semana?}
    L -->|Sí| M[Navegar semanas]
    L -->|No| N[Seleccionar horario]
    M --> K
    
    N --> O[Elegir modalidad Online/Presencial]
    O --> P[Completar datos del paciente]
    P --> Q[Revisar resumen]
    Q --> R[Confirmar reserva]
    R --> S[Confirmación exitosa]
    
    T[Carga inicial] --> U[Skeleton loader]
    V[Error conexión] --> W[Banner de error]
    X[Horarios disponibles] --> Y[Slots seleccionables]
    X --> Z[Slots ocupados]
    
    classDef primary fill:#e3f2fd,stroke:#1976d2
    classDef process fill:#f3e5f5,stroke:#7b1fa2
    classDef decision fill:#fff3e0,stroke:#f57c00
    classDef success fill:#e8f5e8,stroke:#388e3c
    
    class A,E,I,N,O,R primary
    class B,D1,D2,D3,F,J,K,M,P,Q process
    class C,G,L decision
    class S success
```

### Flujos cubiertos

**Visualización de psicólogos**
- Lista completa de psicólogos disponibles en tarjetas responsivas
- Información detallada: nombre, foto, experiencia, calificación, especialidades, descripción, precio y modalidades
- Indicadores de disponibilidad en cada tarjeta

**Sistema de filtros y búsqueda**
- Búsqueda en tiempo real por nombre o especialidad
- Filtros por especialidad específica (Fobias, Depresión, Ansiedad Social, etc.)
- Filtros por modalidad (Online/Presencial/Todas)
- Badges visuales para filtros activos y contador de resultados

**Sistema de reservas**
- Calendario semanal con navegación entre semanas
- Horarios mostrados en zona horaria local del usuario
- Selección de modalidad (online/presencial) por slot
- Formulario de paciente con validación
- Resumen de cita antes de confirmar

**Gestión de horarios**
- Detección automática de zona horaria del navegador
- Conversión de horarios UTC a hora local
- Ocultación automática de horarios pasados
- Indicadores visuales para diferentes estados de disponibilidad

**Proceso de confirmación**
- Confirmación inmediata de reserva con modal detallado
- Información específica según modalidad elegida
- Instrucciones claras para el día de la sesión

**Características técnicas**
- Diseño completamente responsivo (desktop, tablet, móvil)
- Interfaz en español con formatos localizados
- Navegación por teclado y compatibilidad con lectores de pantalla

**Lo que no se incluye en el MVP**
- No incluye procesamiento de pagos
- No requiere autenticación de usuario
- No mantiene historial de reservas
- No permite cancelaciones o modificaciones
- No envía notificaciones automáticas
- No incluye sistema de videollamadas integrado