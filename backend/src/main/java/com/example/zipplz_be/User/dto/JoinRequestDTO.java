package com.example.zipplz_be.User.dto;

import com.example.zipplz_be.User.entity.User;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.sql.Date;
import java.text.ParseException;
import java.text.SimpleDateFormat;

@Getter
@Setter
public class JoinRequestDTO {
    private String email;
    private String password;
    private String userName;
    private String birthDate;
    private String tel;

    @Builder
    public User toEntity() {

        // SimpleDateFormat을 사용하여 문자열을 java.util.Date로 변환
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy/MM/dd");
        java.util.Date utilDate;
        try {
            utilDate = formatter.parse(birthDate);
        } catch (ParseException e) {
            throw new IllegalArgumentException("Invalid date format: " + birthDate, e);
        }
        // java.util.Date를 java.sql.Date로 변환
        Date birthDateSql = new Date(utilDate.getTime());

        return User.builder()
                .email(email)
                .password(password)
                .userName(userName)
                .birthDate(birthDateSql)
                .tel(tel).build();
    }
}
