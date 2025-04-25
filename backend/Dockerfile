
FROM eclipse-temurin:21-jdk

WORKDIR /app

COPY gradlew build.gradle settings.gradle ./

COPY gradle ./gradle

COPY src ./src

RUN ./gradlew build -x test --no-daemon

CMD ["./gradlew", "bootRun"]
