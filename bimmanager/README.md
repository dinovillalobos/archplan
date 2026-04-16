# ⚙️ ArchPlan API (BIM Manager Backend)

El motor principal de ArchPlan. Una API RESTful robusta y segura construida con **Spring Boot** que expone los endpoints necesarios para gestionar obras, finanzas y control de accesos.

## 📦 Características Principales
* **Seguridad B2B (JWT):** Autenticación sin estado (Stateless) con Spring Security y encriptación de contraseñas mediante `BCrypt`.
* **Cerebro Financiero:** API de gastos y presupuestos utilizando tipos de dato `BigDecimal` para garantizar precisión milimétrica en los cálculos monetarios.
* **Bóveda de Auditoría (Historial):** Sistema de trazabilidad inmutable que registra la marca de tiempo y el estado exacto cada vez que una tarea cambia en el tablero Kanban.
* **File Manager (Planos y Evidencias):** Sistema de subida de archivos multipart (`MultipartFile`) con soporte para imágenes de obra (hasta 10MB) y visor de PDF integrado en el navegador.

## 🚀 Instalación y Ejecución Local

1. Levanta la base de datos PostgreSQL utilizando Docker Compose (ubicado en la raíz del proyecto):
   ```bash
   docker-compose up -d postgres-db pgadmin
2. Abre una terminal en esta carpeta (bimmanager).
3. Ejecuta el servidor usando Maven Wrapper:
    ```bash
    # En Windows
   .\mvnw spring-boot:run
   

