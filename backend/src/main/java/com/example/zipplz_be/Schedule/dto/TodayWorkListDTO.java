package com.example.zipplz_be.Schedule.dto;

import com.example.zipplz_be.File.entity.File;
import com.example.zipplz_be.User.entity.Customer;
import com.example.zipplz_be.User.entity.Worker;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class TodayWorkListDTO {
    int workSerial;
    String startDate;
    String endDate;
    String field;
    String address;

    //시공자, 고객 프로필 사진
    File workerProfile;
    File customerProfile;

    //고객
    Customer customer;

    //시공자
    Worker worker;
}
