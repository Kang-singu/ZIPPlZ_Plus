package com.example.zipplz_be.Portfolio.entity;

import com.example.zipplz_be.Global.relation.BoardToPortfolio;
import com.example.zipplz_be.Global.relation.PortfolioFileRelation;
import com.example.zipplz_be.Global.entity.Field;
import com.example.zipplz_be.User.entity.Worker;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Portfolio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "portfolio_serial")
    private int portfolioSerial;
    @ManyToOne
    @JoinColumn(name = "worker", referencedColumnName = "worker_serial")
    private Worker worker;
    @Column(name = "public_relation")
    private String publicRelation;
    private double career;

    @Column(name = "temperature")
    private double temperature;

    @ManyToOne
    @JoinColumn(name = "field_id")
    public Field fieldId;
    @Column(name = "as_period")
    public int asPeriod;
    @Column(name = "work_count")
    public int workCount;

    @OneToMany(mappedBy = "portfolioSerial", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    List<CustomerReview> customerReviews = new ArrayList<>();

    @OneToMany(mappedBy = "portfolioSerial", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    List<PortfolioFileRelation> PortfolioFileRelations = new ArrayList<>();

    @OneToMany(mappedBy = "portfolioSerial", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    List<BoardToPortfolio> BoardToPortfolios = new ArrayList<>();


    @Override
    public String toString() {
        return "Portfolio{" +
                "portfolioSerial=" + portfolioSerial +
                ", worker=" + worker +
                ", publicRelation='" + publicRelation + '\'' +
                ", career=" + career +
                ", fieldId=" + fieldId +
                ", asPeriod=" + asPeriod +
                ", workCount=" + workCount +
                ", temperature="+ temperature +
                '}';
    }

    @Builder
    public Portfolio(Worker worker, Field field) {
        this.worker = worker;
        this.fieldId = field;
        this.publicRelation = "";
        this.career = 0L;
        this.asPeriod = 0;
        this.workCount = 0;
        this.temperature = 36.5;
    }
}
