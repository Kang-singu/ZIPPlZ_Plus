package com.example.zipplz_be;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.mongodb.config.EnableMongoAuditing;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@EnableJpaRepositories(basePackages = {	// MongoDB 리포지토리 패키지를 제외한 모든 리포지토리 패키지
		"com.example.zipplz_be.Board.repository",
		"com.example.zipplz_be.Chatting.repository",
		"com.example.zipplz_be.File.repository",
		"com.example.zipplz_be.Global.repository",
		"com.example.zipplz_be.Material.repository",
		"com.example.zipplz_be.Mypage.repository",
		"com.example.zipplz_be.Openvidu.repository",
		"com.example.zipplz_be.Portfolio.repository",
		"com.example.zipplz_be.Redis.repository",
		"com.example.zipplz_be.Schedule.repository",
		"com.example.zipplz_be.User.repository"
})
@EnableMongoRepositories(basePackages = "com.example.zipplz_be.Mongodb.repository")
@EnableJpaAuditing
@EnableMongoAuditing
@SpringBootApplication
public class ZipplzBeApplication {
	public static void main(String[] args) {
		SpringApplication.run(ZipplzBeApplication.class, args);
	}

}