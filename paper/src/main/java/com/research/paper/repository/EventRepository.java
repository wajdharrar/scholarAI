package com.research.paper.repository;

import com.research.paper.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface EventRepository extends JpaRepository<Event,String> {
    @Query("SELECT e FROM Event e WHERE e.organizer.id = :userId")
    List<Event> findByOrganizerId(@Param("userId") String userId);
}
