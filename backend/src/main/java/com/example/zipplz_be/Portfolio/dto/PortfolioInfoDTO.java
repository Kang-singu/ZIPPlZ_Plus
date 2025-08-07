package com.example.zipplz_be.Portfolio.dto;

import com.example.zipplz_be.File.entity.File;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class PortfolioInfoDTO {
    // 어필내용, 경력, A/S 기간, 누적 시공수
    int portfolioSerial;
    String publicRelation;
    double career;
    int asPeriod;
    int workCount;

    //이름, 핸드폰 번호, 이메일, 생년월일
    private PortfolioUserDTO user;

    //소속업체, 소속업체주소, 사업자번호, 뱃지/인증 여부
    private PortfolioWorkerDTO worker;

    //지역 이름 목록
    private List<String> localList;

    //유저 프로필 사진
    private File userProfile;

    //포트폴리오 관련 사진들
    private List<PortfolioFileDTO> imageList;

    @Builder
    PortfolioInfoDTO(int portfolioSerial, String publicRelation,double career, int asPeriod, int workCount,
                     PortfolioUserDTO user, PortfolioWorkerDTO worker, List<String> localList, File userProfile, List<PortfolioFileDTO> imageList) {
        this.portfolioSerial = portfolioSerial;
        this.user = user;
        this.worker = worker;
        this.localList = localList;
        this.userProfile = userProfile;
        this.imageList = imageList;
        this.publicRelation = publicRelation;
        this.career = career;
        this.asPeriod = asPeriod;
        this.workCount = workCount;
    }
}
