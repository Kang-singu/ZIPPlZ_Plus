package com.example.zipplz_be.Board.entity;

import com.example.zipplz_be.Global.relation.BoardFileRelation;
import com.example.zipplz_be.Global.relation.BoardToPortfolio;
import com.example.zipplz_be.User.entity.User;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class Board {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="board_serial")
    private int boardSerial;
    @ManyToOne
    @JoinColumn(name="user_serial")
    private User userSerial;
    @Column(name="board_type")
    private String boardType;
    private String title;
    @Column(name="board_content")
    private String boardContent;
    @Column(name="board_date")
    private LocalDateTime boardDate;
    private int hit;

    @OneToMany(mappedBy = "boardSerial", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    List<Comment> comments = new ArrayList<>();

    @OneToMany(mappedBy = "boardSerial", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    List<BoardToPortfolio> boardToPortfolios = new ArrayList<>();

    @OneToMany(mappedBy = "boardSerial", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    List<BoardFileRelation> boardFileRelations = new ArrayList<>();
}
