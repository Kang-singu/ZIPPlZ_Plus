package com.example.zipplz_be.Material.controller;

import com.example.zipplz_be.File.entity.File;
import com.example.zipplz_be.Material.dto.MaterialViewDTO;
//import com.example.zipplz_be.domain.material.entity.ElasticMaterial;
import com.example.zipplz_be.Global.dto.ResponseDTO;
import com.example.zipplz_be.Material.service.MaterialService;
import com.example.zipplz_be.User.dto.CustomUserDetails;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/materials")
public class MaterialController {

    private final MaterialService materialService;

    public MaterialController(MaterialService materialService) {
        this.materialService = materialService;
    }

//    @GetMapping("/list")
//    public ResponseEntity<ResponseDTO<List<MaterialViewDTO>>> getMaterialList(Authentication authentication) {
//        ResponseDTO<List<MaterialViewDTO>> responseDTO;
//        HttpStatus status = HttpStatus.ACCEPTED;
//
//        try {
//            List<MaterialViewDTO> materials = materialService.getMaterialList();
//            if (materials == null) {
//                status = HttpStatus.NOT_FOUND;
//                responseDTO = new ResponseDTO<>(status.value(), "세션 결과 없음");
//            } else {
//                status = HttpStatus.OK;
//                responseDTO = new ResponseDTO<>(status.value(), "조회 성공", materials);
//            }
//        } catch(Exception e) {
//            status = HttpStatus.INTERNAL_SERVER_ERROR;
//            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
//        }
//        return new ResponseEntity<>(responseDTO, status);
//    }

    @GetMapping("")
    public ResponseEntity<ResponseDTO<List<MaterialViewDTO>>> getMaterialList(
            @RequestParam String category,
            Authentication authentication) {

        ResponseDTO<List<MaterialViewDTO>> responseDTO;
        HttpStatus status;

        try {
            List<MaterialViewDTO> materials;

            // 로그인 상태를 확인하고 적절한 서비스 메서드 호출
            if (authentication != null && authentication.isAuthenticated() &&
                    !(authentication instanceof AnonymousAuthenticationToken)) {
                // 로그인된 사용자일 때
                int userSerial = this.getUserSerial(authentication);
                materials = materialService.getMaterialListAuthenticated(category, userSerial);
            } else {
                // 로그인되지 않은 사용자일 때
                materials = materialService.getMaterialList(category);
            }

            // 자재 목록이 null인지 확인
            if (materials == null) {
                status = HttpStatus.NOT_FOUND;
                responseDTO = new ResponseDTO<>(status.value(), "세션 결과 없음");
            } else {
                status = HttpStatus.OK;
                responseDTO = new ResponseDTO<>(status.value(), "조회 성공", materials);
            }
        } catch (Exception e) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            System.out.println(e.getMessage());
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        }

        return new ResponseEntity<>(responseDTO, status);
    }


    // 변환된 이미지 저장
    @PostMapping("")
    public ResponseEntity<ResponseDTO> saveConvertedImage(Authentication authentication, @RequestPart("image") MultipartFile file) {
        ResponseDTO<List<MaterialViewDTO>> responseDTO;
        HttpStatus status;

        try {
            int userSerial = getUserSerial(authentication);
            materialService.saveConvertedImage(file, userSerial);
            status = HttpStatus.OK;
            responseDTO = new ResponseDTO<>(status.value(), "변환 이미지 저장 성공");
        } catch(Exception e) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        }
        return new ResponseEntity<>(responseDTO, status);
    }

    // 변환된 이미지들 가져오기
    @GetMapping("/converted-images")
    public ResponseEntity<ResponseDTO> getConvertedImages(Authentication authentication) {
        ResponseDTO<List<File>> responseDTO;
        HttpStatus status;

        try {
            List<File> images = materialService.getConvertedImages(this.getUserSerial(authentication));
            status = HttpStatus.OK;
            responseDTO = new ResponseDTO<>(status.value(), "변환된 이미지들 조회 성공", images);
        } catch(Exception e) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            System.out.println(e.getMessage());
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        }

        return new ResponseEntity<>(responseDTO, status);
    }

    // 자재 찜하기
    @PostMapping("/wish/{materialSerial}")
    public ResponseEntity<ResponseDTO> setMaterialOnWish(Authentication authentication, @PathVariable int materialSerial) {
        ResponseDTO<List<MaterialViewDTO>> responseDTO;
        HttpStatus status;

        try {
            materialService.setMaterialOnWish(this.getUserSerial(authentication), materialSerial);
            status = HttpStatus.OK;
            responseDTO = new ResponseDTO<>(status.value(), "자재 찜 설정 성공");
        } catch(Exception e) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        }
        return new ResponseEntity<>(responseDTO, status);
    }

    // 자재 찜하기
    @DeleteMapping("/unwish/{materialSerial}")
    public ResponseEntity<ResponseDTO> unsetMaterialOnWish(Authentication authentication, @PathVariable int materialSerial) {
        ResponseDTO<List<MaterialViewDTO>> responseDTO;
        HttpStatus status;

        try {
            materialService.unsetMaterialOnWish(this.getUserSerial(authentication), materialSerial);
            status = HttpStatus.OK;
            responseDTO = new ResponseDTO<>(status.value(), "자재 찜 해제 성공");
        } catch(Exception e) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
        }
        return new ResponseEntity<>(responseDTO, status);
    }

    //자재 삽입하기
    // @PostMapping("/insert")
    // public ResponseEntity<ResponseDTO> insertMaterial(@RequestBody Map<String,Object> params) {
    //     ResponseDTO<?> responseDTO;
    //     HttpStatus status;

    //     try {
    //         materialService.insertMaterialService(params);

    //         status = HttpStatus.OK;
    //         responseDTO = new ResponseDTO<>(status.value(), "자재 삽입 성공!");
    //     } catch(Exception e) {
    //         status = HttpStatus.INTERNAL_SERVER_ERROR;
    //         responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
    //     }
    //     return new ResponseEntity<>(responseDTO, status);

    // }

    //자재 검색하기
    // @PostMapping("/search")
    // public ResponseEntity<ResponseDTO> searchMaterial(@RequestBody Map<String,Object> params) {
    //     ResponseDTO<?> responseDTO;
    //     HttpStatus status;

    //     try {
    //         List<ElasticMaterial> elasticMaterials = materialService.searchMaterialService(params);

    //         status = HttpStatus.OK;
    //         responseDTO = new ResponseDTO<>(status.value(), "검색 성공!", elasticMaterials);
    //     } catch(Exception e) {
    //         status = HttpStatus.INTERNAL_SERVER_ERROR;
    //         responseDTO = new ResponseDTO<>(status.value(), e.getMessage());
    //     }
    //     return new ResponseEntity<>(responseDTO, status);
    // }


        public int getUserSerial(Authentication authentication) {
        CustomUserDetails customUserDetails = (CustomUserDetails) authentication.getPrincipal();
        return customUserDetails.getUserSerial();
    }

    public String getUserRole(Authentication authentication) {
        CustomUserDetails customUserDetails = (CustomUserDetails) authentication.getPrincipal();
        return customUserDetails.getRole();
    }

}
