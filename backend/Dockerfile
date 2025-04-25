
FROM eclipse-temurin:21-jdk
WORKDIR /app
COPY . .
RUN ./gradlew build -x test --no-daemon --scan
EXPOSE 8080
CMD ["./gradlew", "bootRun"]
