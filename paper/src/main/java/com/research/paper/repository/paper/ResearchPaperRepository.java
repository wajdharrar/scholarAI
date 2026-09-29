package com.research.paper.repository.paper;

import com.research.paper.entity.paper.ResearchPaper;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ResearchPaperRepository extends JpaRepository<ResearchPaper,String> {
    @Query("SELECT r FROM ResearchPaper r WHERE r.correspondingAuthor.id = :userId OR :userId IN (SELECT u.id FROM r.authors u)")
    List<ResearchPaper> findByUserId(@Param("userId") String userId);}
