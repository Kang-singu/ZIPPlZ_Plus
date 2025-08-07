package com.example.zipplz_be.Portfolio.repository;

import com.example.zipplz_be.Portfolio.entity.CustomerReview;
import com.example.zipplz_be.Portfolio.entity.Portfolio;
import com.example.zipplz_be.Schedule.entity.Work;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CustomerReviewRepository extends JpaRepository<CustomerReview, Integer> {
    List<CustomerReview> findAllByPortfolioSerial(Portfolio portfolio);
    CustomerReview findByCustomerReviewSerial(int customerReviewSerial);
    CustomerReview findByWorkSerial(Work work);

}
