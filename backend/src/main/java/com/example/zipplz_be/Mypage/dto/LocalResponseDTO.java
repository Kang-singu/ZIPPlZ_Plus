package com.example.zipplz_be.Mypage.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class LocalResponseDTO {
    private int sidoCode;
    private int gugunCode;
    private String localName;
}
