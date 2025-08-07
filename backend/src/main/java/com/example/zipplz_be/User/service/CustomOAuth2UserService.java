package com.example.zipplz_be.User.service;

import com.example.zipplz_be.User.dto.CustomOAuth2User;
import com.example.zipplz_be.User.dto.OAuth2UserInfoRecord;
import com.example.zipplz_be.User.entity.User;
import com.example.zipplz_be.User.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Map;

@RequiredArgsConstructor
@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;
    private Boolean isNewUser;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {

        // 1. 유저 정보(attributes) 가져오기
        Map<String, Object> oAuth2UserAttributes = super.loadUser(userRequest).getAttributes();

        // 2. registrationId 가져오기 (third-party id)
        String registrationId = userRequest.getClientRegistration().getRegistrationId();

        // 3. userNameAttributeName 가져오기
        String userNameAttributeName = userRequest.getClientRegistration().getProviderDetails()
                .getUserInfoEndpoint().getUserNameAttributeName();

        // 4. 유저 정보 dto 생성
        OAuth2UserInfoRecord oAuth2UserInfoRecord = OAuth2UserInfoRecord.of(registrationId, oAuth2UserAttributes);

        // 5. 회원가입 및 로그인
        User user = getOrSaveUser(oAuth2UserInfoRecord);

        String principalName = oAuth2UserInfoRecord.email();

        // 6. CustomOAuth2User 반환
        return new CustomOAuth2User(user, isNewUser, oAuth2UserAttributes, principalName);
    }

    private User getOrSaveUser(OAuth2UserInfoRecord oAuth2UserInfoRecord) {
        if (userRepository.existsByEmail(oAuth2UserInfoRecord.email())) {
            isNewUser = false;
            return userRepository.findByEmail(oAuth2UserInfoRecord.email());
        }
        isNewUser = true;
        return userRepository.save(oAuth2UserInfoRecord.toEntity());
    }
}
