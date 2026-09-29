package com.research.paper.dto.response.feedback;

import lombok.*;
import org.springframework.stereotype.Component;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Component
public class LikeResponse {
    private String researchPaperTitle;
    private String firstName;
    private String lastName;
    private String imageUrl;
    private String country;
    private String institution;
}
