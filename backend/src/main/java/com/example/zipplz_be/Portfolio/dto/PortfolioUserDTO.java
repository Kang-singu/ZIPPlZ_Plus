package com.example.zipplz_be.Portfolio.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.sql.Date;

@Getter
@Setter
public class PortfolioUserDTO {
    private int userSerial;
    private String userName;    // 이름
    private String tel;         // 전화번호
    private String email;       // 이메일
    private Date birthDate;     // 나이
    private Integer fileSerial;     //파일 연번

    @Builder
    public PortfolioUserDTO(int userSerial, String userName, String tel, String email, Date birthDate, int fileSerial) {
        this.userSerial = userSerial;
        this.userName = userName;
        this.tel = tel;
        this.email = email;
        this.birthDate = birthDate;
        this.fileSerial = fileSerial;
    }

}

