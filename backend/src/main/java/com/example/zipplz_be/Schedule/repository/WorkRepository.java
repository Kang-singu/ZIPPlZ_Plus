package com.example.zipplz_be.Schedule.repository;

import com.example.zipplz_be.Schedule.entity.Plan;
import com.example.zipplz_be.Schedule.entity.Work;
import com.example.zipplz_be.User.entity.Worker;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkRepository extends JpaRepository<Work, Integer> {
    Page<Work> findByPlanSerial(Plan planSerial, Pageable pageable);
    List<Work> findByPlanSerial(Plan planSerial);

    List<Work> findByWorkerSerial(Worker workerSerial);
    Work findByWorkSerial(int workSerial);
    Boolean existsByFieldNameAndPlanSerial(String fieldName, Plan planSerial);

    @Query(value="SELECT sum(work_price) FROM Work WHERE plan_serial = :planSerial", nativeQuery = true)
    Integer sumWorkPrice(@Param("planSerial") int planSerial);

    List<Work> findByPlanSerialAndFieldNameAndStatus(Plan plan, String fieldName, String awaiting);
    Page<Work> findByPlanSerialAndStatusIn(Plan plan, List<String> statuses, Pageable pageable);

    @Query(value="select * from Work where status= 'confirmed' and worker_serial= :workerSerial and now() between start_date and end_date", nativeQuery = true)
    List<Work> getTodayWork(int workerSerial);

    @Query(value="select * from Work where status= 'confirmed' and plan_serial= :planSerial and now() between start_date and end_date", nativeQuery = true)
    List<Work> getTodayWorkByPlan(int planSerial);

    @Query(value="select count(*) from Work where is_completed= 1 and worker_serial = :workerSerial and field_code= :fieldCode", nativeQuery = true)
    int getWorkCount(int workerSerial, int fieldCode);
}
