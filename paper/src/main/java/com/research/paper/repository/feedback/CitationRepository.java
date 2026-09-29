package com.research.paper.repository.feedback;

import com.research.paper.entity.feedback.Citation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CitationRepository extends JpaRepository<Citation,String> {
}
