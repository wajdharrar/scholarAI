package com.research.paper.dto.request.llm.chatMessage;


import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageCreation {
    @NotBlank(message = "VALIDATION.CHAT_MESSAGE_CREATION.CONTENT.NOT_BLANK")
    @Size(min = 10, max = 1000, message = "VALIDATION.CHAT_MESSAGE_CREATION.CONTENT.SIZE")
    @Schema(example = "Summarize this article please")
    private String content;
    @NotBlank(message = "VALIDATION.CHAT_MESSAGE_CREATION.SESSION_ID.NOT_BLANK")
    private String sessionId;
}
