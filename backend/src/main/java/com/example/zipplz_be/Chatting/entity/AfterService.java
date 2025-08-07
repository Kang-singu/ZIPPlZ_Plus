package com.example.zipplz_be.Chatting.entity;

import com.example.zipplz_be.Schedule.entity.Work;
import jakarta.persistence.*;
import lombok.*;

import java.sql.Timestamp;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AfterService {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="after_service_serial")
    int afterServiceSerial;

    @ManyToOne
    @JoinColumn(name="work_serial")
    Work workSerial;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name="request_date")
    Timestamp requestDate;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name="resolve_date")
    Timestamp resolveDate;

    @Column(name="request_content")
    String requestContent;

    @Column(name="as_score")
    Integer asScore;
}
