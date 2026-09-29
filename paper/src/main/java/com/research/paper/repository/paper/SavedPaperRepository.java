package com.research.paper.repository.paper;

import com.research.paper.entity.paper.SavedPaper;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SavedPaperRepository extends JpaRepository<SavedPaper,String> {
}
