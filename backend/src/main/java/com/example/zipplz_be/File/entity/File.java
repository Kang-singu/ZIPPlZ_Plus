package com.example.zipplz_be.File.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class File {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "file_serial")
    private int fileSerial;
    @Column(name = "save_folder")
    private String saveFolder;
    @Column(name = "original_file")
    private String originalFile;
    @Column(name = "save_file")
    private String saveFile;
    @Column(name= "file_name")
    private String fileName;

    @Override
    public String toString() {
        return "File{" +
                "fileSerial=" + fileSerial +
                ", saveFolder='" + saveFolder + '\'' +
                ", originalFile='" + originalFile + '\'' +
                ", saveFile='" + saveFile + '\'' +
                ", fileName='" + fileName + '\'' +
                '}';
    }
}
