package com.example.zipplz_be.Mypage.entity;

import com.example.zipplz_be.Global.relation.WishId;
import com.example.zipplz_be.User.entity.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@IdClass(WishId.class)
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Wish {
    @Id
    @ManyToOne
    @JoinColumn(name="user_serial")
    private User userSerial;
    @Id
    @Column(name="wish_type")
    private int wishType;
    @Id
    @Column(name="wish_serial")
    private int wishSerial;
}
