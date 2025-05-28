FROM eclipse-temurin:21-jdk

WORKDIR /app

COPY gradlew build.gradle settings.gradle ./
COPY gradle ./gradle
COPY start-dev.sh ./

RUN chmod +x ./gradlew
RUN chmod +x ./start-dev.sh
RUN ./gradlew --no-daemon dependencies

EXPOSE 8080

CMD ["bash", "./start-dev.sh"]
