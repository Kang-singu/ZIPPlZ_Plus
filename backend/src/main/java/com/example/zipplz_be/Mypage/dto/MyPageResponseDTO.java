package com.example.zipplz_be.Mypage.dto;

import com.example.zipplz_be.File.entity.File;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class MyPageResponseDTO {
    private File profileImg;
    private String name;
    private String role;
}
