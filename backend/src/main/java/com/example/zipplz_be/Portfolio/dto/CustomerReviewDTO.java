package com.example.zipplz_be.Portfolio.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class CustomerReviewDTO {
    int customerReviewSerial;
    String customerNickname;
    String customerReviewContent;
    String customerReviewDate;
    int isVisible;
    double averageStar;
    String reviewComment;
}
