package com.example.zipplz_be.Schedule.entity;

import com.example.zipplz_be.Global.entity.Field;
import com.example.zipplz_be.User.entity.Worker;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Timestamp;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Work {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="work_serial")
    int workSerial;

    @ManyToOne
    @JoinColumn(name="worker_serial")
    Worker workerSerial;

    @ManyToOne
    @JoinColumn(name="plan_serial")
    @JsonBackReference
    Plan planSerial;

    @ManyToOne
    @JoinColumn(name="field_code")
    Field fieldCode;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name="start_date")
    private Timestamp startDate;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name="end_date")
    private Timestamp endDate;

    @Column(name="is_completed")
    int isCompleted;

    @Column(name="work_price")
    int workPrice;

    @Column(name="work_content")
    String workContent;

    @Column(name="field_name")
    String fieldName;

    @Column(name= "status")
    String status;

    @Builder
    public Work(String status, Plan plan, Field field, String fieldName, Timestamp startDate, Timestamp endDate, int workPrice) {
        this.planSerial = plan;
        this.fieldCode = field;
        this.fieldName = fieldName;
        isCompleted = 0;
        this.startDate = startDate;
        this.endDate = endDate;
        this.workPrice = workPrice;
        this.status = status;
    }

    @Builder
    public Work(Plan plan, Field field, String fieldName, String status) {
        this.planSerial = plan;
        this.fieldCode = field;
        this.fieldName = fieldName;
        isCompleted = 0;
        this.status = status;
    }
}
