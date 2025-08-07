package com.example.zipplz_be.Portfolio.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PortfolioWorkerDTO {
    private int workerSerial;
    private String company;
    private String companyAddress;
    private String businessNumber;
    private int hasAsBadge;
    private int certificatedBadge;

    @Builder
    public PortfolioWorkerDTO(int workerSerial, String company, String companyAddress, String businessNumber, int hasAsBadge, int certificatedBadge) {
        this.workerSerial = workerSerial;
        this.company = company;
        this.companyAddress = companyAddress;
        this.businessNumber = businessNumber;
        this.hasAsBadge = hasAsBadge;
        this.certificatedBadge = certificatedBadge;
    }
}
