package com.research.paper.dto.response.llm;


import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageResponse {
    private String content;
    private int tokenCount;
    private String sessionName;
}
