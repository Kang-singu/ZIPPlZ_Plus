package com.example.zipplz_be.Global.repository;

import com.example.zipplz_be.Global.relation.UserToChatroom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UserToChatroomRepository extends JpaRepository<UserToChatroom, Integer> {
    @Query(value= "SELECT * FROM Usertochatroom WHERE (chatroom_serial = :chatroomSerial) and (user_serial = :userSerial)", nativeQuery = true)
    UserToChatroom findToken(@Param("chatroomSerial") int chatroomSerial, @Param("userSerial") int userSerial);

    @Modifying
    @Query(value = "INSERT INTO Usertochatroom (chatroom_serial,user_serial, token) VALUES (:chatroomSerial, :userSerial, :token)", nativeQuery = true)
    void insertToken(@Param("token") String token, @Param("userSerial")  int userSerial, @Param("chatroomSerial") int chatroomSerial);

    @Modifying
    @Query(value = "UPDATE Usertochatroom set token = :token where (chatroom_serial = :chatroomSerial) and (user_serial = :userSerial)",  nativeQuery = true)
    void updateToken(@Param("token") String token, @Param("userSerial")  int userSerial, @Param("chatroomSerial") int chatroomSerial);

    @Query(value = "select * from Usertochatroom where user_serial = :userSerial and chatroom_serial= :chatroomSerial", nativeQuery = true)
    UserToChatroom findByuserSerialAndChatroomSerial(int userSerial, int chatroomSerial);

    @Modifying
    @Query(value = "delete from Usertochatroom where user_serial= :userSerial and chatroom_serial = :chatroomSerial", nativeQuery = true)
    void deleteToken(int userSerial, int chatroomSerial);
}
