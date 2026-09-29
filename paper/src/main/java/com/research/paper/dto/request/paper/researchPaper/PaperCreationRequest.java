package com.research.paper.dto.request.paper.researchPaper;

import com.research.paper.enumeration.paper.PaperCategory;

import io.swagger.v3.oas.annotations.media.Schema;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.*;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaperCreationRequest {

    @NotBlank(message = "VALIDATION.PAPER_CREATION.TITLE.NOT_BLANK")
    @Size(min = 10, max = 200, message = "VALIDATION.PAPER_CREATION.TITLE.SIZE")
    @Pattern(regexp = "^[a-zA-Z0-9\\s\\-:,;'\"]+$",
            message = "VALIDATION.PAPER_CREATION.TITLE.PATTERN")
    @Schema(example = "Machine Learning Models for Early Disease Detection in Clinical Settings")
    private String title;

    @NotBlank(message = "VALIDATION.PAPER_CREATION.ABSTRACT_TEXT.NOT_BLANK")
    @Size(min = 50, max = 5000, message = "VALIDATION.PAPER_CREATION.ABSTRACT_TEXT.SIZE")
    @Schema(example = "This study examines...")
    private String abstractText;

    private MultipartFile document;
    private MultipartFile thumbnail;

    @NotNull(message = "VALIDATION.PAPER_CREATION.CATEGORY.NOT_BLANK")
    @Enumerated(EnumType.STRING)
    @Schema(example = "COMPUTER_SCIENCE")
    private PaperCategory category;

    @Schema(example = "Artificial Intelligence")
    @NotBlank(message = "VALIDATION.PAPER_CREATION.DOMAIN.NOT_BLANK")
    private String domainName;

    // Changed Set → List so @ModelAttribute binds repeated fields correctly
    @Size(min = 0, max = 100, message = "VALIDATION.PAPER_CREATION.AUTHORS.SIZE")
    @Schema(description = "List of author IDs (User UUIDs)")
    private List<String> authorIds = new ArrayList<>();

    @Size(min = 0, max = 100, message = "VALIDATION.PAPER_CREATION.GUEST_AUTHORS.SIZE")
    @Schema(description = "List of guest author names")
    private List<String> guestAuthors = new ArrayList<>();

    @Size(max = 20, message = "VALIDATION.PAPER_CREATION.KEYWORDS.SIZE")
    @Schema(example = "[\"Machine Learning\", \"Disease Detection\"]")
    private List<String> keywords = new ArrayList<>();
    private LocalDate publicationDate;
}
