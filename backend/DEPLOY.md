# Deploy Backend

## Prerequisites
- Java 17
- MySQL database with public host

## Environment variables
Create a `.env` file from `.env.example` and set:

```bash
SPRING_DATASOURCE_URL=jdbc:mysql://your-mysql-host:3306/your_database
SPRING_DATASOURCE_USERNAME=your_username
SPRING_DATASOURCE_PASSWORD=your_password
APP_CORS_ALLOWED_ORIGINS=https://your-frontend-domain.vercel.app
PORT=8080
```

## Build and run locally

```bash
cd backend
./mvnw clean package -DskipTests
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

## Render deploy
This repo includes `render.yaml`.

On Render:
- Create a new Web Service
- Connect the `backend` folder or repo root
- Use the build/start commands from `render.yaml`
- Add the environment variables above

## Important
- Spring Boot cannot be hosted on Vercel as a normal backend service.
- Use a Java host like Render, Railway, Fly.io, or a VPS.
