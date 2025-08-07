package com.example.zipplz_be.Global.relation;

import com.example.zipplz_be.File.entity.File;
import com.example.zipplz_be.User.entity.User;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@IdClass(UserFileRelation.class)
@Getter
@NoArgsConstructor
public class UserFileRelation {
    @Id
    @ManyToOne
    @JoinColumn(name = "user")
    private User user;
    @Id
    @ManyToOne
    @JoinColumn(name = "file")
    private File file;

    @Builder
    public UserFileRelation(User user, File file) {
        this.user = user;
        this.file = file;
    }
}
