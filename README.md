# 🏗️ ArchPlan - Enterprise Construction & BIM Management System

ArchPlan es una plataforma B2B Fullstack diseñada para la gestión integral de proyectos arquitectónicos, control financiero en tiempo real y supervisión de obras con trazabilidad de nivel auditoría.

Este repositorio utiliza una **Arquitectura Desacoplada (Monorepo)**, separando los dominios del cliente (Frontend) y del servidor (Backend) para garantizar escalabilidad, seguridad y fácil despliegue.

## 🚀 Arquitectura del Sistema

El proyecto está dividido en dos módulos principales:

* **[ArchPlan UI (Frontend)](./archplan-ui/README.md):** Interfaz de usuario "Modern Dark" orientada a la productividad. Construida con **React, TypeScript y Tailwind CSS v4**. Incluye autenticación JWT, tableros Kanban interactivos y generación de reportes PDF en el cliente.
* **[BIM Manager API (Backend)](./bimmanager/README.md):** API RESTful blindada con Spring Security. Encargada de la lógica de negocio, persistencia inmutable de auditorías, cálculos financieros precisos y gestión del sistema de archivos. Construida con **Java, Spring Boot y PostgreSQL**.

## 🛠️ Stack Tecnológico Global
* **Frontend:** React 18, TypeScript, Vite, Tailwind CSS v4, jsPDF, Lucide React.
* **Backend:** Java 17+, Spring Boot 3, Spring Security (JWT), Spring Data JPA, Hibernate.
* **Base de Datos:** PostgreSQL 15 (Dockerizada).
* **Infraestructura:** Docker & Docker Compose (para entornos de base de datos).

## 👨‍💻 Autor
* **Ricardo** - Ingeniero en Computación | Desarrollador Java Fullstack.
