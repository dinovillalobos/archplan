# 🏗️ ArchPlan - Sistema de Gestión BIM y Arquitectura

ArchPlan es una plataforma Fullstack diseñada para la gestión integral de proyectos arquitectónicos, control de versiones de planos y seguimiento de métricas de construcción en tiempo real. 

Este repositorio utiliza una **Arquitectura Desacoplada (Monorepo)**, separando claramente los dominios del cliente (Frontend) y del servidor (Backend) para garantizar la escalabilidad y el mantenimiento del código.

## 🚀 Arquitectura del Sistema

El proyecto está dividido en dos módulos principales:

* **[ArchPlan UI (Frontend)](./archplan-ui/README.md):** Interfaz de usuario moderna y reactiva con un diseño "Modern Dark". Construida con **React, TypeScript y Tailwind CSS v4**.
* **[BIM Manager API (Backend)](./bimmanager/README.md):** API RESTful robusta encargada de la lógica de negocio, persistencia de datos y gestión del sistema de archivos (PDFs). Construida con **Java, Spring Boot y PostgreSQL**.

## 🛠️ Stack Tecnológico Global
* **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Lucide React.
* **Backend:** Java 17+, Spring Boot 3, Spring Data JPA, Hibernate.
* **Base de Datos:** PostgreSQL.
* **Almacenamiento:** File System Local (para gestión de planos PDF).

## 👨‍💻 Autor
* **Ricardo** - Ingeniero en Computación | Desarrollador Java Fullstack.
