package com.example.zipplz_be.Mypage.repository;

import com.example.zipplz_be.Material.dto.MaterialDTO;
import com.example.zipplz_be.Mypage.entity.Wish;
import com.example.zipplz_be.Portfolio.dto.PortfolioJoinDTO;
import com.example.zipplz_be.User.entity.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface WishRepository extends JpaRepository<Wish, Integer> {
    @Modifying
    @Transactional
    @Query(value = "INSERT INTO Wish(user_serial, wish_type, wish_serial) " +
            "VALUES(:user_serial, :wish_type, :wish_serial)", nativeQuery = true)
    int addWish(@Param("user_serial") int userSerial, @Param("wish_type") int wishType, @Param("wish_serial") int wishSerial);

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM Wish " +
            "WHERE wish_serial = :wishSerial", nativeQuery = true)
    int deleteWish(int wishSerial);

    @Query(value = "SELECT p.portfolio_serial as portfolio_serial, p.user_serial as user_serial, u.user_name as user_name, YEAR(u.birth_date) as birth_date, COALESCE(ROUND((c.communication_star+c.attitude_star+c.quality_star+c.professional_star)/4, 1), 0) as temp, p.career as career, p.field_id as field_id " +
            "FROM ( SELECT * " +
            "FROM Wish " +
            "WHERE user_serial= :user_serial and wish_type = :type ) as w " +
            "LEFT JOIN Portfolio p on p.portfolio_serial = w.wish_serial " +
            "LEFT JOIN USERS u on u.user_serial = w.user_serial " +
            "LEFT JOIN CustomerReview c on c.portfolio_serial = w.wish_serial;", nativeQuery = true)
    public List<PortfolioJoinDTO> getWorkerWishList(@Param("type") int type, @Param("user_serial") int user_serial);

    @Query(value = "SELECT * " +
            "FROM ( SELECT * " +
            "FROM Wish " +
            "WHERE user_serial= :user_serial and wish_type = :wish_type ) as w " +
            "LEFT JOIN Material m on m.material_serial = w.wish_serial;", nativeQuery = true)
    List<MaterialDTO> getMaterialWishList(@Param("wish_type") int wishType, @Param("user_serial") int userSerial);

    List<Wish> findAllByUserSerialAndWishType(User user, int wishType);

    boolean existsByUserSerialAndWishTypeAndWishSerial(User user, int wishType, int wishSerial);

    void deleteByUserSerialAndWishTypeAndWishSerial(User user, int wishType, int wishSerial);

    @Query(value = "SELECT count(*) " +
            "FROM Wish " +
            "WHERE wish_serial = :wishSerial", nativeQuery = true)
    int getWishCnt(@Param("wishSerial") int wishSerial);

    @Query(value = "SELECT count(*) " +
            "FROM Wish " +
            "WHERE user_serial = :userSerial and wish_serial = :wishSerial", nativeQuery = true)
    int searchWish(@Param("userSerial") int userSerial, @Param("wishSerial") int wishSerial);
}
