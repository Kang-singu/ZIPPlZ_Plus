package com.example.zipplz_be.Global.entity;


import com.example.zipplz_be.User.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Local {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="local_serial")
    private int localSerial;
    @ManyToOne
    @JoinColumn(name="user_serial")
    private User userSerial;
    @Column(name="sido_code")
    private int sidoCode;
    @Column(name="gugun_code")
    private int gugunCode;
    @Column(name="local_name")
    private String localName;
}
