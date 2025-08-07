package com.example.zipplz_be.Global.relation;

import com.example.zipplz_be.File.entity.File;
import com.example.zipplz_be.Schedule.entity.Plan;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@IdClass(PlanFileRelationId.class)
@Getter
@Setter
@NoArgsConstructor
public class PlanFileRelation {
    @Id
    @ManyToOne
    @JoinColumn(name="plan_serial")
    private Plan planSerial;
    @Id
    @ManyToOne
    @JoinColumn(name="file_serial")
    private File fileSerial;

    @Builder
    public PlanFileRelation(Plan planSerial, File fileSerial) {
        this.planSerial = planSerial;
        this.fileSerial = fileSerial;
    }
}
