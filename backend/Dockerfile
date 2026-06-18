# Build stage
FROM eclipse-temurin:17-jdk-jammy AS build
WORKDIR /app

COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
RUN chmod +x mvnw && ./mvnw dependency:go-offline -B

COPY src ./src
RUN ./mvnw package -DskipTests -B

# Run stage
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

RUN groupadd --system spring && useradd --system --gid spring spring

COPY --from=build /app/target/*.jar app.jar

# Create a writable upload directory owned by the non-root runtime user
RUN mkdir -p /app/uploads/cars && chown -R spring:spring /app

USER spring:spring

EXPOSE 8080

# Credentials are injected at runtime (docker-compose .env or GitHub Secrets).
# SPRING_DATASOURCE_URL, SPRING_DATASOURCE_USERNAME, SPRING_DATASOURCE_PASSWORD
ENTRYPOINT ["java", "-jar", "app.jar"]
