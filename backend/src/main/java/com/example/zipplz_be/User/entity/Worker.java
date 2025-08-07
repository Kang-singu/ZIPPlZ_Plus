package com.example.zipplz_be.User.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Worker {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "worker_serial")
    private int workerSerial;
    @OneToOne
    @JoinColumn(name = "user_serial")
    private User userSerial;
    private String company;
    @Column(name = "company_address")
    private String companyAddress;
    @Column(name = "business_number")
    private String businessNumber;
    @Column(name = "has_as_badge")
    private int hasAsBadge;
    @Column(name= "certificated_badge")
    private int certificatedBadge;

    @Builder
    public Worker(User userSerial, String businessNumber, String company, String companyAddress) {
        this.userSerial = userSerial;
        this.businessNumber = businessNumber;
        this.company = company;
        this.companyAddress = companyAddress;
        this.hasAsBadge = 0;
        this.certificatedBadge = 0;
    }
}