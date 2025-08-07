package com.example.zipplz_be.User.dto;

import com.example.zipplz_be.User.entity.User;
import jakarta.security.auth.message.AuthException;
import lombok.Builder;

import java.util.Map;

@Builder
public record OAuth2UserInfoRecord(
        String name,
        String email,
        String profile
) {

    public static OAuth2UserInfoRecord of(String registrationId, Map<String, Object> attributes) {
        return switch (registrationId) { // registration id별로 userInfo 생성
            case "google" -> ofGoogle(attributes);
            case "kakao" -> ofKakao(attributes);
            default -> {
                try {
                    throw new AuthException("잘못된 Registration Id입니다.");
                } catch (AuthException e) {
                    throw new RuntimeException(e);
                }
            }
        };
    }

    private static OAuth2UserInfoRecord ofGoogle(Map<String, Object> attributes) {
        return OAuth2UserInfoRecord.builder()
                .name((String) attributes.get("name"))
                .email((String) attributes.get("email")).build();
//                .profile((String) attributes.get("profile")).build();
    }

    private static OAuth2UserInfoRecord ofKakao(Map<String, Object> attributes) {
        Map accountMap = (Map) attributes.get("kakao_account");
        Map profileMap = (Map) accountMap.get("profile");
        return OAuth2UserInfoRecord.builder()
                .name((String) profileMap.get("nickname"))
                .email((String) accountMap.get("email")).build();
//                .profile((String) profile.get("profile_image_url")).build();
    }

    public User toEntity() {
        return User.builder()
                .email(email)
                .userName(name)
                .build();
    }
}
