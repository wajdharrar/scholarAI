package com.research.paper.dto.request.paper.collection;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.List;
@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CollectionUpdateRequest {
    @Size(min = 10, max = 200, message = "VALIDATION.COLLECTION_UPDATE.NAME.SIZE")
    @Pattern(regexp = "^[a-zA-Z0-9\\s\\-:,;'\"]+$",
            message = "VALIDATION.COLLECTION_UPDATE.NAME.PATTERN")
    @Schema(example = "Machine Learning Models for Disease Detection")
    private String name;
    @Size(min = 50, max = 5000, message = "VALIDATION.COLLECTION_UPDATE.DESCRIPTION.SIZE")
    @Schema(example = "This collection has all the research papers that talk about ML and Early Disease Detection")
    private String description;
    private boolean aiEnabled;
    private List <String> savedPapersId;
}
