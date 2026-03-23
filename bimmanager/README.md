# ⚙️ ArchPlan API (BIM Manager Backend)

Este es el motor principal de ArchPlan. Una API RESTful construida con **Spring Boot** que expone los endpoints necesarios para que el cliente web interactúe con la base de datos y el sistema de archivos.

## 📦 Características Principales
* **Gestión de Proyectos:** Endpoints CRUD para el registro y actualización del estado de las obras.
* **File Manager (Planos):** Sistema de subida de archivos multipart (`MultipartFile`) para almacenar planos arquitectónicos.
* **Visor de PDF Integrado:** Endpoint configurado con `MediaType.parseMediaType` y `HttpHeaders.CONTENT_DISPOSITION` ("inline") para permitir la visualización directa de PDFs en el navegador sin forzar la descarga.
* **CORS Configurado:** Seguridad habilitada para permitir peticiones desde clientes web externos.

## 🚀 Instalación y Ejecución Local

1. Asegúrate de tener **PostgreSQL** corriendo en tu máquina y crea una base de datos (revisa las credenciales en `application.properties`).
2. Abre una terminal en esta carpeta.
3. Ejecuta el servidor usando Maven Wrapper:
   ```bash
   # En Windows
   .\mvnw spring-boot:run
