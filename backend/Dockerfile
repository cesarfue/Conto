
FROM eclipse-temurin:21-jdk

WORKDIR /app

COPY gradlew build.gradle settings.gradle ./

COPY gradle ./gradle

RUN chmod +x ./gradlew

RUN ./gradlew --no-daemon dependencies

EXPOSE 8080

CMD ["./gradlew", "bootRun", "--no-daemon"]
