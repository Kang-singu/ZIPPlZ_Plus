package com.example.zipplz_be.Material.dto;

import com.example.zipplz_be.File.entity.File;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class MaterialViewDTO implements Comparable<MaterialViewDTO> {
    private int materialSerial;
    private String materialName;
    private int majorCategory;
    private String description;
    private int materialPrice;
    private File img;
    private boolean isWished;

    @Override
    public int compareTo(MaterialViewDTO o) {
        return Boolean.compare(o.isWished, this.isWished);
    }
}