# gradle 이미지로 빌드만
FROM gradle:8.10-jdk21-alpine AS build

WORKDIR /app

COPY build.gradle settings.gradle ./

RUN gradle dependencies --no-daemon

COPY . /app

# 빌드해서 jar 파일 생성
RUN gradle clean build -x test --no-daemon

# JRE 이미지로 런타임 이미지 생성
FROM openjdk:21-jdk-slim

WORKDIR /app

COPY --from=build /app/build/libs/*.jar /app/ZIPPlZ_Plus.jar

EXPOSE 8081
ENTRYPOINT [ "java" ]
CMD [ "-jar", "ZIPPlZ_Plus.jar" ]