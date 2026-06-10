# CarShareX – Local Setup Guide

## Prerequisites

- Java 17+
- Maven (or use included `./mvnw`)
- MySQL 8.x running locally

## 1. Create the database

MySQL will auto-create the database on first run if you use the URL in `application.properties`.
Alternatively, create it manually:

```sql
CREATE DATABASE carsharex;
```

## 2. Configure database credentials

Edit `src/main/resources/application.properties`:

```properties
spring.datasource.username=YOUR_MYSQL_USERNAME
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

## 3. Build and run

```bash
./mvnw spring-boot:run
```

Or from your IDE, run `CarShareXApplication.java`.

## 4. Open the application

Visit: http://localhost:8080

### Default admin account (seeded on first startup)

- **Email:** admin@carsharex.com
- **Password:** admin123

## 5. Suggested test flow

1. Register a **Supplier** at `/supplier/register`
2. Log in and **add cars** at `/supplier/cars/new`
3. Register a **Customer** at `/customer/register`
4. **Search and book** a car at `/customer/cars`
5. Log in as **Admin** to approve verifications and view reports

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Connection refused | Ensure MySQL is running on port 3306 |
| Access denied | Check username/password in `application.properties` |
| Port 8080 in use | Change `server.port` in `application.properties` |
