package com.example.zipplz_be.Schedule.entity;

import com.example.zipplz_be.User.entity.Customer;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Plan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="plan_serial")
    int planSerial;

    @Column(name="plan_name")
    String planName;

    @ManyToOne
    @JoinColumn(name="customer_serial")
    Customer customerSerial;
    @Column(name="address")
    String address;
    @Column(name="shared_contents")
    String sharedContents;

    @Column(name="is_active")
    int isActive;

    @OneToMany(mappedBy = "planSerial", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Work> works = new ArrayList<>();


    @Builder
    public Plan(String planName, Customer customer, String address, String sharedContents) {
        this.planName = planName;
        this.customerSerial = customer;
        this.address = address;
        this.sharedContents = sharedContents;
        this.isActive = 1;
    }
}
