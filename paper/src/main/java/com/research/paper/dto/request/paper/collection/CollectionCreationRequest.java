package com.research.paper.dto.request.paper.collection;



import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;
@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CollectionCreationRequest {
    @NotBlank(message = "VALIDATION.COLLECTION_CREATION.NAME.NOT_BLANK")
    @Size(min = 10, max = 200, message = "VALIDATION.COLLECTION_CREATION.NAME.SIZE")
    @Pattern(regexp = "^[a-zA-Z0-9\\s\\-:,;'\"]+$",
            message = "VALIDATION.COLLECTION_CREATION.NAME.PATTERN")
    @Schema(example = "Machine Learning Models for Early Disease Detection")
    private String name;
    @Size(min = 50, max = 5000, message = "VALIDATION.COLLECTION_CREATION.DESCRIPTION.SIZE")
    @Schema(example = "This collection has all the research papers that talk about ML and Early Disease Detection")
    private String description;
    @NotNull(message = "VALIDATION.COLLECTION_CREATION.AI_ENABLED.NOT_NULL")
    private boolean aiEnabled;
}
