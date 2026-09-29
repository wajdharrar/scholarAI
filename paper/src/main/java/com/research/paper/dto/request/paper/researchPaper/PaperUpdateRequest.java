package com.research.paper.dto.request.paper.researchPaper;

import com.research.paper.enumeration.paper.PaperCategory;
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
public class PaperUpdateRequest {

    @NotBlank(message = "VALIDATION.PAPER_UPDATE.TITLE.NOT_BLANK")
    @Size(min = 10, max = 200, message = "VALIDATION.PAPER_UPDATE.TITLE.SIZE")
    @Pattern(regexp = "^[a-zA-Z0-9\\s\\-:,;'\"]+$", message = "VALIDATION.PAPER_UPDATE.TITLE.PATTERN")
    private String title;

    @NotBlank(message = "VALIDATION.PAPER_UPDATE.ABSTRACT_TEXT.NOT_BLANK")
    @Size(min = 50, max = 5000, message = "VALIDATION.PAPER_UPDATE.ABSTRACT_TEXT.SIZE")
    private String abstractText;

    @NotNull(message = "VALIDATION.PAPER_UPDATE.CATEGORY.NOT_NULL")
    @Enumerated(EnumType.STRING)
    private PaperCategory category;

    @NotBlank(message = "VALIDATION.PAPER_UPDATE.DOMAIN.NOT_BLANK")
    private String domainName;

    private LocalDate publicationDate;

    // Optional — only if replacing files
    private MultipartFile document;
    private MultipartFile thumbnail;

    @Size(max = 100)
    private List<String> authorIds = new ArrayList<>();

    @Size(max = 100)
    private List<String> guestAuthors = new ArrayList<>();

    @Size(max = 20)
    private List<String> keywords = new ArrayList<>();
}