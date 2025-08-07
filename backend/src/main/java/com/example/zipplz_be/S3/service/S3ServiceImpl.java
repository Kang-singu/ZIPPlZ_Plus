package com.example.zipplz_be.S3.service;

import com.amazonaws.SdkClientException;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.amazonaws.util.IOUtils;
import com.example.zipplz_be.File.entity.File;
import com.example.zipplz_be.File.repository.FileRepository;
import com.example.zipplz_be.Schedule.exception.S3Exception;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;
import java.util.Base64;
import java.util.List;
import java.util.UUID;

// S3에 파일 업로드 하는 Service
@Service
@RequiredArgsConstructor
public class S3ServiceImpl implements S3Service {

    private final AmazonS3 amazonS3;
    private final FileRepository fileRepository;
    @Value("${cloud.aws.s3.bucketName}")
    private String bucketName;

    @Override
    public String uploadImage(MultipartFile image) {
        this.validateImageFileExtension(image.getOriginalFilename());

        try {
            return this.uploadToS3(image);
        }catch(IOException e) {
            throw new S3Exception("이미지 업로드 중 에러 발생했습니다.");
        }
    }

    @Override
    public File uploadBase64File(String base64File, String originalFilename) {
        this.validateImageFileExtension(originalFilename);

        try {
            byte[] bytes = Base64.getDecoder().decode(base64File); // Base64 디코딩
            return this.uploadToS3(bytes, originalFilename);
        } catch (IOException e) {
            throw new S3Exception("Base64 파일 업로드 중 에러 발생했습니다.");
        }
    }

    @Override
    public String uploadToS3(MultipartFile image) throws IOException {
        String originalFilename = image.getOriginalFilename();

        String extention = originalFilename.substring(originalFilename.lastIndexOf("."));

        //파일명
        String s3FileName = UUID.randomUUID().toString().substring(0, 10) + originalFilename;

        InputStream is = image.getInputStream();
        byte[] bytes = IOUtils.toByteArray(is);

        ObjectMetadata metadata = new ObjectMetadata(); //metadata 생성
        metadata.setContentType("image/" + extention);
        metadata.setContentLength(bytes.length);

        //S3에 요청할 때 사용할 byteInputStream 생성
        ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(bytes);
        String url = "";

        try {
            //S3로 putObject 할 때 사용할 요청 객체
            //생성자 : bucket 이름, 파일 명, byteInputStream, metadata
            PutObjectRequest putObjectRequest =
                    new PutObjectRequest(bucketName, s3FileName, byteArrayInputStream, metadata)
                            .withCannedAcl(CannedAccessControlList.PublicRead);

            //실제로 S3에 이미지 데이터를 넣는 부분
            amazonS3.putObject(putObjectRequest);

            url = amazonS3.getUrl(bucketName, s3FileName).toString();

            //file 객체 하나 만들어서 repository로 db에 추가
            File file = new File();
            file.setSaveFile(url);
            file.setFileName(s3FileName);
            file.setOriginalFile(image.getOriginalFilename());

            fileRepository.save(file);
        } catch (Exception e){
            throw new S3Exception("Put Object 도중에 에러 발생");
        }finally {
            byteArrayInputStream.close();
            is.close();
        }

        return url;
    }

    private File uploadToS3(byte[] bytes, String originalFilename) throws IOException {
        String extention = originalFilename.substring(originalFilename.lastIndexOf("."));
        String s3FileName = UUID.randomUUID().toString().substring(0, 10) + originalFilename;

        ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(bytes);
        String url = "";

        try {
            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentType("image/" + extention);
            metadata.setContentLength(bytes.length);

            PutObjectRequest putObjectRequest =
                    new PutObjectRequest(bucketName, s3FileName, byteArrayInputStream, metadata)
                            .withCannedAcl(CannedAccessControlList.PublicRead);

            amazonS3.putObject(putObjectRequest);

            url = amazonS3.getUrl(bucketName, s3FileName).toString();

            File file = new File();
            file.setSaveFile(url);
            file.setFileName(s3FileName);
            file.setOriginalFile(originalFilename);

            fileRepository.save(file);
            return file;
        } catch (Exception e) {
            throw new S3Exception("Put Object 도중에 에러 발생");
        } finally {
            byteArrayInputStream.close();
        }
    }

    private void validateImageFileExtension(String filename) {
        int lastDotIndex = filename.lastIndexOf(".");
        if (lastDotIndex == -1) {
            throw new S3Exception("파일 형식이 존재하지 않습니다.");
        }

        String extention = filename.substring(lastDotIndex + 1).toLowerCase();
        List<String> allowedExtentionList = Arrays.asList("jpg", "jpeg", "png", "gif", "pdf", "txt", "doc", "docx", "hwp", "svg", "wbep");

        if (!allowedExtentionList.contains(extention)) {
            throw new S3Exception("유효하지 않은 파일 형식입니다.");
        }

    }

    @Override
    @Transactional
    public void deleteS3(String fileName) throws IOException {
        try {
            amazonS3.deleteObject(bucketName, fileName);
        } catch(SdkClientException e) {
            throw new IOException("Error Deleting file in S3", e);
        }
    }
}
