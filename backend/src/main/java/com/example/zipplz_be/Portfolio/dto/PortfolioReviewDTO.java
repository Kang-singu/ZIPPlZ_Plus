package com.example.zipplz_be.Portfolio.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Builder
public class PortfolioReviewDTO {
    //온도
    double workerTemperature;

    //시공자 이름
    String workerName;

    //각 분야 별점 평균
    double averageCommunicationStar;
    double averageAttitudeStar;
    double averageQualityStar;
    double averageProfessionalStar;

    //리뷰 목록
    List<CustomerReviewDTO> reviewList;

}
