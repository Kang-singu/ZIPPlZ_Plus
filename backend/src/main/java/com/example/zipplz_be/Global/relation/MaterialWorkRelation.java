package com.example.zipplz_be.Global.relation;

import com.example.zipplz_be.Material.entity.Material;
import com.example.zipplz_be.Schedule.entity.Work;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@IdClass(MaterialWorkRelation.class)
@Getter
@Setter
@NoArgsConstructor
public class MaterialWorkRelation {
    @Id
    @ManyToOne
    @JoinColumn(name="material_serial")
    private Material materialSerial;
    @Id
    @ManyToOne
    @JoinColumn(name="work_serial")
    private Work workSerial;

    @Builder
    public MaterialWorkRelation(Material materialSerial, Work workSerial) {
        this.materialSerial = materialSerial;
        this.workSerial = workSerial;
    }
}
