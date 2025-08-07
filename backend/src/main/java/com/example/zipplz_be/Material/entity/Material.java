package com.example.zipplz_be.Material.entity;

import com.example.zipplz_be.Global.entity.MajorCategory;
import com.example.zipplz_be.Global.entity.MiddleCategory;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
//import org.springframework.data.elasticsearch.annotations.Document;
//import org.springframework.data.elasticsearch.annotations.Field;

@Entity
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Material {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "material_serial")
    private int materialSerial;

    @Column(name = "material_name")
    private String materialName;


    @ManyToOne
    @JoinColumn(name = "major_category", referencedColumnName = "major_code", insertable = false, updatable = false)
    private MajorCategory majorCategory;
    @ManyToOne
    @JoinColumns({
            @JoinColumn(referencedColumnName = "major_code", insertable = false, updatable = false),
            @JoinColumn(referencedColumnName = "middle_code", insertable = false, updatable = false)
    })
    private MiddleCategory middleCategory;

    private String description;
    @Column(name = "material_price")
    private int materialPrice;

    @Override
    public String toString() {
        return "Material{" +
                "materialSerial=" + materialSerial +
                ", materialName='" + materialName + '\'' +
                ", majorCategory=" + majorCategory +
                ", middleCategory=" + middleCategory +
                ", description='" + description + '\'' +
                ", materialPrice=" + materialPrice +
                '}';
    }
}