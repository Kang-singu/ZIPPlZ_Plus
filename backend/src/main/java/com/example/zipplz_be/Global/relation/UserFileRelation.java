package com.example.zipplz_be.Global.relation;

import com.example.zipplz_be.File.entity.File;
import com.example.zipplz_be.User.entity.User;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@IdClass(UserFileRelationId.class)
@Getter
@NoArgsConstructor
public class UserFileRelation {
    @Id
    @ManyToOne
    @JoinColumn(name = "user_serial")
    private User userSerial;
    @Id
    @ManyToOne
    @JoinColumn(name = "file_serial")
    private File fileSerial;

    @Builder
    public UserFileRelation(User userSerial, File fileSerial) {
        this.userSerial = userSerial;
        this.fileSerial = fileSerial;
    }
}
