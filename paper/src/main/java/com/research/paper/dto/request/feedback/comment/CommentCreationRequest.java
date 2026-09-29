package com.research.paper.dto.request.feedback.comment;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommentCreationRequest {
    @NotBlank
    @Schema(example = "Great topic")
    private String content;
    @NotNull
    private String researchPaperId;
    private String parentCommentId;
}
