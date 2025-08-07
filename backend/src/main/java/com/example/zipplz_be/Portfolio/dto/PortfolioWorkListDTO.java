package com.example.zipplz_be.Portfolio.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PortfolioWorkListDTO {
    int workSerial;
    int workerSerial;

    String fieldName;
    String startDate;
    String endDate;

    @Builder
    public PortfolioWorkListDTO(int workSerial, int workerSerial, String fieldName, String startDate, String endDate) {
        this.workSerial = workSerial;
        this.workerSerial = workerSerial;
        this.fieldName = fieldName;
        this.startDate = startDate;
        this.endDate = endDate;
    }
}
