package com.research.paper.dto.request.feedback.comment;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommentUpdateRequest {
    @Schema(example="AI is overrated")
    private String content;
}
