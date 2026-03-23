# 🏗️ ArchPlan - Architecture & BIM Management System

A full-stack, decoupled web application designed for architectural firms to manage construction projects, track statuses, and securely store and visualize blueprints (PDFs). 

## 🚀 Architecture Overview
This project follows a modern decoupled architecture (Polyrepo structure within a Monorepo for portfolio purposes), separating the client-side presentation from the server-side business logic and storage.

* **Frontend:** React 18 + TypeScript + Vite + Tailwind CSS 4.0
* **Backend:** Java 17 + Spring Boot 3 + Spring Data JPA
* **Database:** PostgreSQL (Dockerized)
* **Storage:** Local File System (`/uploads`) for binary files (PDF blueprints).

## 📂 Project Structure
* [`/archplan-ui`](./archplan-ui) - The React/TypeScript frontend application.
* [`/bimmanager`](./bimmanager) - The Spring Boot/Java REST API backend.

## ⚙️ How to Run the Application Locally

You will need two terminals to run the frontend and backend concurrently.

**1. Start the Backend (Terminal 1)**
```bash
cd bimmanager
# Ensure PostgreSQL is running (e.g., via docker-compose up -d)
./mvnw spring-boot:run  