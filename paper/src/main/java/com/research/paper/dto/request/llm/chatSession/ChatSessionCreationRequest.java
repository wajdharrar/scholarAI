package com.research.paper.dto.request.llm.chatSession;

import com.research.paper.enumeration.ChatContext;


import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;


@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatSessionCreationRequest {
    @NotNull(message = "VALIDATION.CHAT_SESSION_CREATION.CONTEXT.NOT_BLANK")
    @Schema(example = "GENERAL", allowableValues = {"GENERAL", "COLLECTION"})
    @Enumerated(EnumType.STRING)
    private ChatContext context;
    @NotBlank(message = "VALIDATION.CHAT_SESSION_CREATION.NAME.NOT_BLANK")
    @Size(min = 10, max = 50, message = "VALIDATION.CHAT_SESSION_CREATION.NAME.SIZE")
    @Pattern(regexp = "^[a-zA-Z0-9\\s\\-:,;'\"]+$",
            message = "VALIDATION.CHAT_SESSION_CREATION.NAME.PATTERN")
    @Schema(example = "ML Disease Detection")
    private String name;
    private boolean isPinned;
}
