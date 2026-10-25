# Study Track - Student Study Management System

A full-stack study tracking and productivity application built with Spring Boot (Java 23/17), MySQL, React, and Vite.

---

## Prerequisites
- **Java**: JDK 17 or higher (Java 23 verified)
- **Node.js**: v18+ and npm (v22 verified)
- **MySQL Server**: 8.0 or 9.x (running on port 3306)

---

## 1. Database Setup

Ensure your local MySQL service is running.

- **Database Name**: `study_track`
- **Default Port**: `3306`
- **Default Credentials**: `root` / `root` *(configured in `backend/src/main/resources/application.properties`)*

If you ever need to recreate or seed the database:
```powershell
mysql -u root -proot < database/schema.sql
mysql -u root -proot < database/seed.sql
```

---

## 2. Start the Backend (Spring Boot)

Open a terminal in the backend directory:

```powershell
cd "c:\Users\Chinmai\OneDrive\Documents\project\study track\study-track\backend"
.\mvnw.cmd spring-boot:run
```

- Backend runs at: `http://localhost:8080`
- API Base URL: `http://localhost:8080/api`

---

## 3. Start the Frontend (React + Vite)

Open a **separate** terminal in the frontend directory:

```powershell
cd "c:\Users\Chinmai\OneDrive\Documents\project\study track\study-track\frontend"
npm run dev
```

- Frontend runs at: `http://localhost:5173`
- The Vite development server automatically proxies requests starting with `/api` to `http://localhost:8080`.

---

## 4. Access the Application

Open your browser and visit:
👉 **http://localhost:5173**

### Demo Login Credentials:
- **Email**: `alex@studytrack.com`
- **Password**: `password123`

*(You can also click **Register** to create a new student account).*
