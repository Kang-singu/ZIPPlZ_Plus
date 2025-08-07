package com.example.zipplz_be.Schedule.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class WorkListDTO {
    String startDate;
    String endDate;
    String field;


    @Builder
    public WorkListDTO(String startDate, String endDate, String field) {
        this.startDate = startDate;
        this.endDate = endDate;
        this.field = field;
    }
}
