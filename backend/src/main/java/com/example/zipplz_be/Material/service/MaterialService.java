package com.example.zipplz_be.Material.service;

import com.example.zipplz_be.File.entity.File;
import com.example.zipplz_be.Material.dto.MaterialViewDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface MaterialService {

//    List<MaterialViewDTO> getMaterialList();

    List<MaterialViewDTO> getMaterialList(String category);

    List<MaterialViewDTO> getMaterialListAuthenticated(String category, int userSerial);

    void saveConvertedImage(MultipartFile image, int userSerial);

    List<File> getConvertedImages(int userSerial);

    void setMaterialOnWish(int userSerial, int materialSerial);

    void unsetMaterialOnWish(int userSerial, int materialSerial);

    //void insertMaterialService(Map<String, Object> params);

    //List<ElasticMaterial> searchMaterialService(Map<String, Object> params);
}
