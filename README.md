# 🤺 Psimammoliti Challenge

## 1. Instrucciones

Para ejecutar este proyecto, sigue estos pasos:

1.  **Clona el repositorio:**
    ```bash
    git clone <URL_DEL_REPOSITORIO>
    cd psimammoliti-challenge
    ```

2.  **Instala las dependencias:**
    Este proyecto utiliza `npm`. Asegúrate de tener Node.js instalado.
    ```bash
    npm install
    ```

3.  **Configura las variables de entorno:**
    Crea un archivo `.env` en la raíz del proyecto y añade las siguientes variables:

    *   `NEXT_PUBLIC_SUPABASE_URL`: La URL de tu instancia de Supabase.
    *   `NEXT_PUBLIC_SUPABASE_ANON_KEY`: La clave anónima de tu instancia de Supabase.

    Asegúrate de que Supabase esté configurado correctamente con las tablas y datos necesarios.

4.  **Ejecuta la aplicación en modo desarrollo:**
    ```bash
    npm run dev
    ```

    Esto iniciará el servidor de desarrollo de Next.js. Abre tu navegador y visita `http://localhost:3000` para ver la aplicación en funcionamiento.

5.  **Ejecuta los scripts SQL (opcional):**
    Si necesitas inicializar la base de datos o añadir datos de ejemplo, puedes ejecutar los scripts SQL ubicados en la carpeta `scripts`. Utiliza la herramienta de línea de comandos de Supabase o cualquier cliente SQL para ejecutar estos scripts en tu base de datos.

## 2. Decisiones técnicas y funcionales

*   **Framework:** Se utiliza Next.js para el frontend debido a su renderizado del lado del servidor (SSR), enrutamiento fácil y optimización del rendimiento.
*   **Componentes de la interfaz de usuario:** Se utiliza la biblioteca Shadcn/ui para los componentes de la interfaz de usuario, lo que garantiza la coherencia visual y la accesibilidad.
*   **Base de datos:** Se utiliza Supabase como base de datos y backend como servicio (BaaS) debido a su facilidad de uso, escalabilidad y capacidades en tiempo real.
*   **Gestión de estado:** Se utilizan los hooks de React (`useState`, `useEffect`, `useMemo`) para gestionar el estado de la aplicación y optimizar el rendimiento.
*   **Diseño responsivo:** Se utiliza Tailwind CSS para crear un diseño responsivo que se adapte a diferentes tamaños de pantalla, con especial atención a la experiencia móvil.
*   **Librería de iconos:** Se utiliza `lucide-react` para los iconos.

## 3. Detalle de lo que se hizo y se asumió

* Se armó un prototipo inicial con las siguientes tecnologías:
  * v0 — no-code tool
  * Supabase — Database provider
  * Vercel — deployent y continuos integration
  * Cursor — editor de código
  * GitHub — versionado de cambios

## 4. Documento funcional

1. **Flowchart**
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