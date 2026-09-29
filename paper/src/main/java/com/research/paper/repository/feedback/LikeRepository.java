package com.research.paper.repository.feedback;

import com.research.paper.entity.feedback.Like;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface LikeRepository extends JpaRepository<Like,String> {
    @Query("select l from Like l where l.user.id = %?1")
    List<Like> findByUserId(String userId);
    @Query("select l from Like l where l.paper.id = %?1")
    List<Like> findByPaperId(String paperId);
}
