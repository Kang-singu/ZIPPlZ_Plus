package com.example.zipplz_be.Portfolio.service;

import com.example.zipplz_be.Portfolio.entity.CustomerReview;
import com.example.zipplz_be.Portfolio.entity.Portfolio;
import com.example.zipplz_be.Portfolio.repository.CustomerReviewRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.OptionalDouble;

@Service
public class CustomerReviewService {

    // customerReviewRepository 의존성 주입
    private final CustomerReviewRepository customerReviewRepository;

    public CustomerReviewService(CustomerReviewRepository customerReviewRepository) {
        this.customerReviewRepository = customerReviewRepository;
    }

    public double calculateAverageStars(Portfolio portfolio) {
        // 포트폴리오 시리얼로 모든 리뷰 가져오기
        List<CustomerReview> reviews = customerReviewRepository.findAllByPortfolioSerial(portfolio);

        // communicationStar 평균 계산
        OptionalDouble averageCommunicationStar = reviews.stream()
                .mapToInt(CustomerReview::getCommunicationStar)
                .average();

        // attitudeStar 평균 계산
        OptionalDouble averageAttitudeStar = reviews.stream()
                .mapToInt(CustomerReview::getAttitudeStar)
                .average();

        // qualityStar 평균 계산
        OptionalDouble averageQualityStar = reviews.stream()
                .mapToInt(CustomerReview::getQualityStar)
                .average();

        // professionalStar 평균 계산
        OptionalDouble averageProfessionalStar = reviews.stream()
                .mapToInt(CustomerReview::getProfessionalStar)
                .average();

        // 결과 출력 (OptionalDouble을 사용하여 값이 존재하는 경우에만 출력)
        System.out.println("Communication Star 평균: " + (averageCommunicationStar.isPresent() ? averageCommunicationStar.getAsDouble() : "평가 없음"));
        System.out.println("Attitude Star 평균: " + (averageAttitudeStar.isPresent() ? averageAttitudeStar.getAsDouble() : "평가 없음"));
        System.out.println("Quality Star 평균: " + (averageQualityStar.isPresent() ? averageQualityStar.getAsDouble() : "평가 없음"));
        System.out.println("Professional Star 평균: " + (averageProfessionalStar.isPresent() ? averageProfessionalStar.getAsDouble() : "평가 없음"));

        // 네 평균의 평균 계산
        double sumOfAverages = 0;
        int countOfAverages = 0;

        if (averageCommunicationStar.isPresent()) {
            sumOfAverages += averageCommunicationStar.getAsDouble();
            countOfAverages++;
        }
        if (averageAttitudeStar.isPresent()) {
            sumOfAverages += averageAttitudeStar.getAsDouble();
            countOfAverages++;
        }
        if (averageQualityStar.isPresent()) {
            sumOfAverages += averageQualityStar.getAsDouble();
            countOfAverages++;
        }
        if (averageProfessionalStar.isPresent()) {
            sumOfAverages += averageProfessionalStar.getAsDouble();
            countOfAverages++;
        }

        // 네 평균의 평균 출력
        if (countOfAverages > 0) {
            double overallAverage = sumOfAverages / countOfAverages;
            System.out.println("전체 평균: " + overallAverage);
            return overallAverage;
        } else {
            System.out.println("평가 없음");
            return 36.5;
        }
    }
}
