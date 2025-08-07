package com.example.zipplz_be.Portfolio.dto;

import com.example.zipplz_be.Global.entity.Field;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PortfolioListDTO {
    int portfolioSerial;

    //분야
    Field fieldId;

    @Builder
    PortfolioListDTO(int portfolioSerial, Field fieldId) {
        this.portfolioSerial = portfolioSerial;
        this.fieldId =fieldId;
    }
}
