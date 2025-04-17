
FROM eclipse-temurin:17-jdk
WORKDIR /app
COPY . .
RUN ./gradlew build -x test --no-daemon
EXPOSE 8080
CMD ["./gradlew", "bootRun"]
