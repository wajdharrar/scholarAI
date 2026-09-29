package com.research.paper.dto.response.llm;


import com.research.paper.enumeration.ChatContext;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatSessionResponse {
    @Enumerated(EnumType.STRING)
    private ChatContext context;
    private String name;
    private boolean isPinned ;
    private List<String> messagesContent = new ArrayList<>();
    private String lastName;
    private String firstName;
    private String institution;
    private String country;
    private String imageUrl;
}
