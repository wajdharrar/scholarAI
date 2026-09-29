package com.research.paper.dto.response;


import lombok.*;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Component
public class UserResponse {
    private String id;
    private String lastName;
    private String firstName;
    private String institution;
    private String country;
    private String imageUrl;
    private int papersCount;
    private int citationCount;
    private String email;
    private String bio;
    private LocalDateTime createdAt;
}
