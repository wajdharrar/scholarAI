package com.research.paper.dto.response.feedback;

import lombok.*;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Component
public class CommentResponse {
    private String id;
    private String content;
    private int likes;
    private String createAt;
    private String username;
    private String researchPaperTitle;
    private String parentContent;
    private String parentId;
    private String firstName;
    private String lastName;
    private String imageUrl;
    private String country;
    private String institution;
}
