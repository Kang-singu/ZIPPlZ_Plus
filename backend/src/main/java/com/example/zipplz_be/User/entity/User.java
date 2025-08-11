package com.example.zipplz_be.User.entity;

import com.example.zipplz_be.File.entity.File;
import jakarta.persistence.*;
import lombok.*;

import java.sql.Date;
import java.text.ParseException;
import java.text.SimpleDateFormat;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name="users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="user_serial")
    private int userSerial;     // 유저 연번

    @OneToOne
    @JoinColumn(name="file_serial")
    private File fileSerial;
    private String email;       // 이메일
    private String password;    // 비밀번호
    @Column(name = "user_name")
    private String userName;    // 이름
    @Column(name = "birth_date")
    private Date birthDate;     // 나이
    private String tel;         // 전화번호
    @Column(name = "del_yn")
    private int delYN;          // 삭제된 유저인지 여부: 0이면 사용 중인 User, 1이면 삭제된 User
    @Column(name = "role")
    private String role;

    @Builder
    public User(String email, String password, String userName, Date birthDate, String tel) {
        this.email = email;
        this.password = password;
        this.userName = userName;
        this.birthDate = birthDate;
        this.tel = tel;
        this.delYN = 0; // 기본값으로 설정 (또는 필요에 따라 설정)
        this.role = "";
        this.fileSerial = null;
    }

    @Builder
    public User(String email, String userName) {
        this.email = email;
        this.userName = userName;
        this.delYN = 0; // 기본값으로 설정 (또는 필요에 따라 설정)
        this.role = "";
        this.fileSerial = null;
    }

    public void setBirthDate(String birthDate) {
        // SimpleDateFormat을 사용하여 문자열을 java.util.Date로 변환
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy/MM/dd");
        java.util.Date utilDate;
        try {
            utilDate = formatter.parse(birthDate);
        } catch (ParseException e) {
            throw new IllegalArgumentException("Invalid date format: " + birthDate, e);
        }
        // java.util.Date를 java.sql.Date로 변환
        Date birthDateSql = new Date(utilDate.getTime());
        this.birthDate = birthDateSql;
    }

    public void setFile(File file) {
        this.fileSerial = file;
    }

    @Override
    public String toString() {
        return "User{" +
                "userSerial=" + userSerial +
                ", email='" + email + '\'' +
                ", role='" + role + '\'' +
                '}';
    }
}