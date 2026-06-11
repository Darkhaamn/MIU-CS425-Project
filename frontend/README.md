# CarShareX — React Frontend

Premium car rental UI built with React, TypeScript, Vite, and Tailwind CSS.

## Run locally

```bash
# Backend (port 8080)
cd .. && ./mvnw spring-boot:run

# Frontend (port 5173)
npm install
npm run dev
```

Open **http://localhost:5173**

## Stack

- React 19 + TypeScript
- Tailwind CSS v4
- React Router v7
- Session-based auth (cookie credentials)

## Demo accounts

| Role     | Email                 | Password  |
|----------|-----------------------|-----------|
| Admin    | admin@carsharex.com   | admin123  |
| Customer | john@example.com      | pass123   |
| Supplier | citycars@example.com  | pass123   |

## Production build

```bash
npm run build
npm run preview
```
