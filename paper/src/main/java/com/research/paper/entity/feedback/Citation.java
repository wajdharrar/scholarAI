package com.research.paper.entity.feedback;

import com.research.paper.common.BaseEntity;
import com.research.paper.entity.paper.ResearchPaper;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Table(name = "CITATION")
@EntityListeners(AuditingEntityListener.class)
public class Citation extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "citing_paper_id", nullable = false)
    private ResearchPaper citingPaper;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cited_paper_id", nullable = false)
    private ResearchPaper citedPaper;
}
