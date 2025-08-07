package com.example.zipplz_be.Chatting.dto;

import com.example.zipplz_be.File.entity.File;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OtherUserInfoDTO {
    private int userSerial;
    private String name;
    private String location;
    private String fieldName;
    private boolean isCertificated;
    private File image;
}
