package com.research.paper.controller.llm;

import com.research.paper.common.Utility;
import com.research.paper.dto.request.llm.chatSession.ChatSessionCreationRequest;


import com.research.paper.dto.response.llm.ChatSessionResponse;

import com.research.paper.impl.llm.ChatSessionServiceImpl;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/chat_session")
@Tag(name = "Chat session",description = "Chat session API")
public class ChatSessionController {
    private final Utility utility;
    private final ChatSessionServiceImpl chatSessionService;
    @PostMapping("/add")
    @ResponseStatus(code = HttpStatus.NO_CONTENT)
    public void addChatSession(
            @RequestBody
            @Valid
            ChatSessionCreationRequest request,
            final Authentication principal){
        this.chatSessionService.addChatSession(request,utility.getUserId(principal));
    }
    @GetMapping("/user")
    public ResponseEntity<List<ChatSessionResponse>> getAllChatSessionByUserId(
            final Authentication principal
    ){
        return ResponseEntity.ok(this.chatSessionService.getAllChatSessionByUserId(utility.getUserId(principal)));
    }
    @GetMapping("/{chat_session_id}")
    public ResponseEntity<ChatSessionResponse> getCollectionById(
            @PathVariable(name = "chat_session_id")
            String chatSessionId
    ){
        return ResponseEntity.ok(this.chatSessionService.getChatSessionById(chatSessionId));
    }
}
