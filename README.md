# 🤺 Psimammoliti Challenge

## Instrucciones

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

## Decisiones Técnicas y Funcionales

*   **Framework:** Se utiliza Next.js para el frontend debido a su renderizado del lado del servidor (SSR), enrutamiento fácil y optimización del rendimiento.
*   **Componentes de la interfaz de usuario:** Se utiliza la biblioteca Shadcn/ui para los componentes de la interfaz de usuario, lo que garantiza la coherencia visual y la accesibilidad.
*   **Base de datos:** Se utiliza Supabase como base de datos y backend como servicio (BaaS) debido a su facilidad de uso, escalabilidad y capacidades en tiempo real.
*   **Gestión de estado:** Se utilizan los hooks de React (`useState`, `useEffect`, `useMemo`) para gestionar el estado de la aplicación y optimizar el rendimiento.
*   **Diseño responsivo:** Se utiliza Tailwind CSS para crear un diseño responsivo que se adapte a diferentes tamaños de pantalla, con especial atención a la experiencia móvil.
*   **Manejo de fechas y horas:** Se utiliza la biblioteca `date-fns` para facilitar el manejo de fechas y horas.
*   **Librería de iconos:** Se utiliza `lucide-react` para los iconos.

## Detalle de lo que hiciste y qué asumiste

*   **Componentes de la interfaz de usuario:**
    *   Se crearon componentes reutilizables como `PsychologistCard`, `FilterSection`, `StatusBanner` y `EmptyState` para organizar la interfaz de usuario y mejorar la mantenibilidad.
    *   Se implementó un modal de reserva de citas utilizando el componente `Dialog` de Shadcn/ui.
*   **Lógica de filtrado y búsqueda:**
    *   Se implementó la lógica para filtrar psicólogos por especialidad, modalidad y consulta de búsqueda utilizando el hook `useMemo`.
*   **Gestión de citas:**
    *   Se implementó la lógica para seleccionar franjas horarias disponibles y reservar citas.
    *   Se añadió un modal de confirmación para mostrar los detalles de la cita reservada.
*   **Datos de ejemplo:**
    *   Se incluyeron datos de ejemplo para psicólogos y especialidades en caso de que la base de datos no esté disponible o no esté configurada correctamente.
*   **Asunciones:**
    *   Se asume que la base de datos de Supabase está configurada correctamente y contiene las tablas y datos necesarios.
    *   Se asume que las variables de entorno `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` están configuradas correctamente.
    *   Se asume que los datos de los psicólogos incluyen información sobre sus especialidades y franjas horarias disponibles.
    *   Se asume que la zona horaria del usuario se puede obtener correctamente utilizando la API de `Intl.DateTimeFormat()`.
    *   Se asume que la librería de iconos `lucide-react` está correctamente instalada y configurada.
    *   Se asume que la librería de componentes `shadcn/ui` está correctamente instalada y configurada.
    *   Se asume que la librería de estilos `tailwindcss` está correctamente instalada y configurada.
```