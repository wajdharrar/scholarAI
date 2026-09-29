package com.research.paper.dto.response.paper;

import com.research.paper.enumeration.paper.PaperCategory;
import com.research.paper.enumeration.paper.PaperStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResearchPaperResponse {
    private String id;
    private String title;
    private String abstractText;
    private String thumbnailUrl;
    @Enumerated(EnumType.STRING)
    private PaperCategory category;
    private String document;
    private Set<String> authorIds = new HashSet<>();
    private Set<String> keywords = new HashSet<>();
    private int commentCount;
    private int likesCount;
    private int downloadsCount;
    private int citations;
    private PaperStatus status;
    private LocalDate publicationDate;
}
