package com.research.paper.dto.request.feedback.likes;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LikeCreationRequest {
    @NotNull
    private String researchPaperId;
}
