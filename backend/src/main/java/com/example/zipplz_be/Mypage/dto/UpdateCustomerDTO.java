package com.example.zipplz_be.Mypage.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateCustomerDTO {
    // User 정보
    private int userSerial; // 입력X
    private String tel;

    // Customer 정보
    private String nickname;
    private String currentAddress;
}
