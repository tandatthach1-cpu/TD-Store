# Render Deploy Checklist

## Before you start
- Make sure the backend builds locally:
  - `./mvnw -DskipTests package`
- Prepare a public MySQL database.

## Environment variables on Render
Set these in Render:

```env
SPRING_DATASOURCE_URL=jdbc:mysql://your-host:3306/your_database
SPRING_DATASOURCE_USERNAME=your_username
SPRING_DATASOURCE_PASSWORD=your_password
APP_CORS_ALLOWED_ORIGINS=https://td-phone-store-frontend.vercel.app
PORT=8080
```

## Service settings
- Environment: `Java`
- Build command: `./mvnw clean package -DskipTests`
- Start command: `java -jar target/backend-0.0.1-SNAPSHOT.jar`

## After deploy
- Copy the Render service URL.
- Put it into the frontend env:
  - `VITE_API_BASE_URL=https://your-backend-domain/api`
