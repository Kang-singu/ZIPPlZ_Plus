package com.example.zipplz_be.User.dto;

import com.example.zipplz_be.Global.entity.Field;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class InsertWorkerDTO {
    private int userSerial;
    private List<WorkerLocationDTO> locationList;
    private List<Field> fieldList;
    private String businessNumber;
    private String company;
    private String companyAddress;
}
