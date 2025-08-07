package com.example.zipplz_be.S3.service;

import com.example.zipplz_be.File.entity.File;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface S3Service {

    File uploadBase64File(String base64File, String originalFilename);

    String uploadImage(MultipartFile image);

    String uploadToS3(MultipartFile image) throws IOException;

    void deleteS3(String fileName) throws IOException;
}
