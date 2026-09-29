package com.research.paper.repository.feedback;

import com.research.paper.entity.feedback.Comment;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment,String> {
    // Option A: Using EntityGraph to fetch the user eagerly alongside the comments
    @EntityGraph(attributePaths = {"user"})
    List<Comment> findByPaperId(String paperId);

    // Option B: Alternative approach using a custom JPQL query for explicit control
    @Query("SELECT c FROM Comment c JOIN FETCH c.user WHERE c.paper.id = :paperId AND c.parentComment IS NULL")
    List<Comment> findTopLevelCommentsByPaperId(@Param("paperId") Long paperId);
}
