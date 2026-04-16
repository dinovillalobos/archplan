# 🎨 ArchPlan UI (Frontend)

Dashboard ejecutivo para la plataforma ArchPlan. Diseñado con un enfoque profesional, corporativo y oscuro, priorizando la experiencia del usuario (UX) en la gestión de obras complejas.

## ✨ Características de la Interfaz
* **Portal de Acceso Corporativo:** Pantalla de Login y Registro estilo "Split-Screen" adaptada para entornos empresariales con validación de tokens JWT.
* **Executive Dashboard:** Tarjetas de métricas dinámicas que calculan márgenes financieros y distribuciones de estado en tiempo real.
* **Tablero Kanban Interactivo:** Sistema de *Drag & Drop* para el control de tareas, con soporte para subir evidencias fotográficas desde dispositivos móviles y visualizar el historial de auditoría de cada tarjeta.
* **Generador de Reportes PDF:** Motor integrado en el cliente (usando `jsPDF` y `autoTable`) que consolida gastos, progreso y datos del proyecto en un documento ejecutivo listo para imprimir o enviar.
* **Diseño Responsivo:** Estilizado 100% con Tailwind CSS v4, asegurando visibilidad perfecta desde monitores Ultrawide hasta teléfonos en la obra.

## 🚀 Instalación y Ejecución Local

Para correr este cliente, la API de Java (`bimmanager`) debe estar en ejecución en el puerto `8080`.

1. Abre una terminal en la carpeta `archplan-ui`.
2. Instala las dependencias:
   ```bash
   npm install
3. Inicia el servidor de desarrollo:
    ```bash
    npm run dev
